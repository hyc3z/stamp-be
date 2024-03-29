import { Service } from 'typedi'
import { getConnection, Connection } from 'typeorm'
import { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import slurmcfg from '../../configs/slurm.config'
import dateformat from 'dateformat'
import { Method } from 'routing-controllers'
import { FileService } from './file.service'
import { StampResourceTypes, StampTask, StampTaskStates } from 'app/entities'
import { UserService } from './user.service'
import { SlurmJobBrief, SlurmJobBriefKeys, SlurmJobInfo } from '../meta/SlurmJobMeta'
import { keys } from 'ts-transformer-keys'
import { environment, STATE_WHEN_NOT_EXIST } from '../const/common'
import { concateEnvs } from '../helpers/common'
import { exec as cpexec } from 'child_process'
import {promisify} from 'util'
const exec = promisify(cpexec)
const headerss = {
  'X-SLURM-USER-NAME': slurmcfg.jwt_user,
  'X-SLURM-USER-TOKEN': slurmcfg.jwt_token,
  Accept: '*/*',
  Connection: 'keep-alive',
}

class SlurmRequest {
  static async httpGet(apiSubpath: string, params?: Object): Promise<any> {
    const response = await axios({
      method: 'GET',
      responseType: 'json',
      url: `http://${slurmcfg.host}:${slurmcfg.port}/slurm/${slurmcfg.api_version}/${apiSubpath}`,
      headers: headerss,
    })
    return response.data
  }

  static async httpDelete(apiSubpath: string, params?: Object): Promise<any> {
    const response = await axios({
      method: 'DELETE',
      responseType: 'json',
      url: `http://${slurmcfg.host}:${slurmcfg.port}/slurm/${slurmcfg.api_version}/${apiSubpath}`,
      headers: headerss,
    })
    return response.data
  }

  static async httpPost(
    apiSubpath: string,
    postdata?: any,
    params?: Object,
  ): Promise<any> {
    const response = await axios({
      method: 'POST',
      responseType: 'json',
      url: `http://${slurmcfg.host}:${slurmcfg.port}/slurm/${slurmcfg.api_version}/${apiSubpath}`,
      data: postdata,
      headers: {
        ...headerss,
        'Content-Type': 'application/json',
      },
    })
    // console.log(response)
    return response.data
  }
}
@Service()
export class SlurmService extends SlurmRequest {
  static async restartProcess(processName: any): Promise<any>{
    const {stdout, stderr} = await exec(`systemctl restart ${processName}`)
    if(!stderr) {
      return true
    }else {
      return false
    }

  }
  static async getProcessInfo(): Promise<any>{
    const serviceList = ['slurmd', 'slurmctld', 'slurmdbd', 'slurmrestd']
    const response = [];
    await Promise.all(serviceList.map(async service => {
      try {
        const statusReg = /.*?Active: (.*?) \(/g
          const pidReg = /.*?Main PID: (.*?) \(/g
          const {stdout, stderr} = await exec(`systemctl status ${service}`).catch(err => {
            return {
              stdout: err.stdout,
              stderr: err.stderr
            }
          })
          const pstatus = statusReg.exec(stdout)
          const pid = pidReg.exec(stdout)
          response.push({
            name: service,
            status: pstatus[1], 
            pid: pid[1]
          })
      } catch (error) {
        console.log(error)
      }
        
      })
    )
    return response
  }
  static async submitjob(
    username: string,
    taskname: string,
    scriptPath: string,
    resourceType: string,
    resourceAmount: number,
    taskNumber: number,
    partition: string,
  ): Promise<any> {
    const scriptData = await FileService.getScriptFileData(username, scriptPath)
    if (!scriptData) {
      throw Error('ERROR: Read script failure.')
    }
    const userEnvs = await UserService.getEnv(username)
    let response = await this.httpPost('job/submit', {
      job: {
        account: 'root',
        name: taskname,
        environment: concateEnvs(userEnvs, environment),
        current_working_directory: `/mnt/slurm/${username}/output`,
        cpus_per_task: resourceAmount,
        tasks: taskNumber,
        partition: partition,
      },
      script: scriptData,
    }).catch(err => {
      console.log('ERR', err)
    })
    const slurmErrors = response['errors']
    if (slurmErrors instanceof Array && slurmErrors.length === 0) {
      const jobid = response['job_id']
      let newJob = new StampTask()
      newJob.taskId = jobid
      newJob.userId = await UserService.getUid(username)
      newJob.taskName = taskname
      newJob.resourceType = await this.createAndGetResourceId(resourceType)
      newJob.resourceAmount = resourceAmount * taskNumber
      newJob.partitionName = partition
      // console.log("Submit job into db,",newJob)
      if (newJob.userId < 0) {
        return new Error('ERROR: User not found.')
      }
      await getConnection().getRepository(StampTask).save(newJob)
    } else {
      response = slurmErrors
    }
    return response
  }

  static async getNodes(): Promise<any> {
    const res = await this.httpGet('nodes')
    return res['nodes'] || []
  }

  static async getPartitions(): Promise<any> {
    const res = await this.httpGet('partitions')
    return res['partitions'] || []
  }

  static async createAndGetResourceId(resourceName: string): Promise<number> {
    const processedResourceName = resourceName.toLowerCase().trim()
    const rId = await getConnection()
      .getRepository(StampResourceTypes)
      .find({ where: { typeDescription: processedResourceName } })
    if (rId.length == 0) {
      let newType = new StampResourceTypes()
      const maxId = await getConnection()
        .getRepository(StampResourceTypes)
        .createQueryBuilder('st')
        .select('MAX(st.type_id)', 'max')
        .getRawOne()
      if (!maxId) {
        newType.typeId = 0
      } else {
        newType.typeId = maxId.max + 1
      }
      newType.typeDescription = processedResourceName
      await getConnection().getRepository(StampResourceTypes).save(newType)
      return newType.typeId
    } else {
      return rId[0].typeId
    }
  }
  static async getStateIdCreateIfNotExist(
    stateDescription: string,
  ): Promise<StampTaskStates> {
    let stateId = -1
    let matchedState = await getConnection()
      .getRepository(StampTaskStates)
      .findOne({ stateDescription: stateDescription })
    if (!matchedState) {
      let newState = new StampTaskStates()
      let currentMaxStateId = await getConnection()
        .getRepository(StampTaskStates)
        .createQueryBuilder('st')
        .select('MAX(st.state_id)', 'max')
        .getRawOne()
      if (!currentMaxStateId) {
        newState.stateId = 0
      } else {
        newState.stateId = currentMaxStateId.max + 1
      }
      newState.stateDescription = stateDescription
      await getConnection().getRepository(StampTaskStates).save(newState)
      stateId = newState.stateId
      return newState
    } else {
      stateId = matchedState.stateId
      return matchedState
    }
  }
  static async deleteJob(username: string, taskId: number): Promise<any> {
    const isAdmin = await UserService.isAdmin(username)
    const userId = await UserService.getUid(username)
    const userHasJob = await getConnection()
      .getRepository(StampTask)
      .findOne({ taskId: taskId, userId: userId })
    if (userHasJob || isAdmin) {
      try {
        await this.httpDelete(`job/${taskId}`)
      } catch (error) {
        const jobInfo = await this.httpGet(`job/${taskId}`).catch(async error => {
          const errors = error?.response?.data?.errors
          if (errors) {
            await Promise.all(errors.map(async element => {
              const error = element.error
              if (error && error.startsWith('_handle_job_get: unknown job')) {
                console.log(error)
                const state = await this.getStateIdCreateIfNotExist(STATE_WHEN_NOT_EXIST)
                // We need to tax users, so do not purge from db.
                // await getConnection().getRepository(StampTask).delete({taskId: taskId});
                userHasJob.state = state
                await getConnection().getRepository(StampTask).save(userHasJob)
              }
            }))
          }
        })
      }
    } else {
      return false
    }
  }

  static async getJobs(username?: string): Promise<any> {
    const response = await this.httpGet('jobs')
    const parsedJobs = await this.parseJobInfo(response.jobs)
    if (username) {
      const uId = await UserService.getUid(username)
      if (uId < 0) {
        return []
      } else {
        const is_admin = await UserService.isAdmin(username)
        let jobs = []
        if (!is_admin) {
          const userJobs = await getConnection()
            .getRepository(StampTask)
            .createQueryBuilder('st')
            .leftJoinAndMapOne(
              'st.state',
              'stamp_task_states',
              'sts',
              'sts.state_id=st.state_id',
            )
            .leftJoinAndMapOne(
              'st.resource',
              'stamp_resource_types',
              'stt',
              'stt.type_id=st.resource_type',
            )
            .where({ userId: uId })
            .orderBy('st.taskId', 'DESC')
            .getMany()
          jobs = userJobs
        } else {
          const allJobs = await getConnection()
            .getRepository(StampTask)
            .createQueryBuilder('st')
            .leftJoinAndMapOne(
              'st.state',
              'stamp_task_states',
              'sts',
              'sts.state_id=st.state_id',
            )
            .leftJoinAndMapOne(
              'st.resource',
              'stamp_resource_types',
              'stt',
              'stt.type_id=st.resource_type',
            )
            .orderBy('st.taskId', 'DESC')
            .getMany()
          // console.log("ALL JOBS:", allJobs)
          jobs = allJobs
        }
        await Promise.all(jobs.map(async (job: StampTask) => {
          if (!parsedJobs.includes(job.taskId)) {
            const state = await this.getStateIdCreateIfNotExist(STATE_WHEN_NOT_EXIST)
            // We need to tax users, so do not purge from db.
            // await getConnection().getRepository(StampTask).delete({taskId: taskId});
            job.state = state
            console.log(job)
            await getConnection().getRepository(StampTask).save(job)
          }
        }))
        return jobs
      }
    } else {
      // const allJobs = await getConnection().getRepository(StampTask)
      // .createQueryBuilder("st").leftJoinAndMapOne("st.state", "stamp_task_states", "sts", "sts.state_id=st.state_id").orderBy("st.taskId", "DESC").getMany()
      // // console.log("ALL JOBS:", allJobs)
      // return allJobs
      return []
    }
  }

  static async parseJobInfo(respJobList: Array<SlurmJobInfo>): Promise<number[]> {
    const typedJobList = [] as Array<any>
    const transformJobToBrief = (sjb: SlurmJobBrief, proto: SlurmJobInfo) => {
      SlurmJobBriefKeys.forEach(key => {
        if (['start_time', 'end_time'].includes(key)) {
          sjb[key] = dateformat(proto[key] * 1000, 'yyyy-mm-dd HH:MM:ss')
        } else {
          sjb[key] = proto[key]
        }
      })
    }
    for (const element of respJobList) {
      let sinfo = {} as SlurmJobBrief
      transformJobToBrief(sinfo, element)
      typedJobList.push(sinfo.job_id)
      let matchedTask = await getConnection()
        .getRepository(StampTask)
        .findOne({ taskId: sinfo.job_id })
      // let allUsers = await suRepo.find();
      let state = await this.getStateIdCreateIfNotExist(sinfo.job_state)
      if (matchedTask) {
        matchedTask.state = state
        matchedTask.startTime = sinfo.start_time
        matchedTask.finishTime = sinfo.end_time
      } else {
        matchedTask = new StampTask()
        matchedTask.taskName = sinfo.name
        matchedTask.state = state
        matchedTask.startTime = sinfo.start_time
        matchedTask.finishTime = sinfo.end_time
        matchedTask.taskId = sinfo.job_id
        matchedTask.resourceType = await this.createAndGetResourceId('CPU')
        matchedTask.resourceAmount = sinfo.cpus
        matchedTask.partitionName = sinfo.partition
        console.log(matchedTask)
      }
      try {
        await getConnection().getRepository(StampTask).save(matchedTask)
      } catch (error) {
        console.log(error)
      }
    }
    return typedJobList
  }
}
