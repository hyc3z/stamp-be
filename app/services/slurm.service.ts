import { Service } from 'typedi'
import { getConnection, Connection } from 'typeorm';
import { AxiosRequestConfig}  from 'axios'
import axios from 'axios'
import slurmcfg from '../../configs/slurm.config'
import dateformat from 'dateformat'
import { Method } from 'routing-controllers';
import { FileService } from './file.service';
import { StampTask, StampTaskStates } from 'app/entities';
import { UserService } from './user.service';
import { SlurmJobBrief, SlurmJobBriefKeys, SlurmJobInfo } from '../meta/SlurmJobMeta'
import { keys } from 'ts-transformer-keys'

const headerss = {
    'X-SLURM-USER-NAME': slurmcfg.jwt_user,
    'X-SLURM-USER-TOKEN': slurmcfg.jwt_token,
    'Accept': '*/*',
    'Connection': 'keep-alive',
}



class SlurmRequest{
    static async httpGet(apiSubpath:string, params?: Object):Promise<any> {
    const response = await axios({
        method: 'GET',
        responseType: 'json',
        url: `http://${slurmcfg.host}:${slurmcfg.port}/slurm/${slurmcfg.api_version}/${apiSubpath}`, 
        headers: headerss
    })
        return response.data
    }
    
    static async httpPost(apiSubpath:string, postdata?: any, params?: Object):Promise<any> {
        const response = await axios({
            method: 'POST',
            responseType: 'json',
            url: `http://${slurmcfg.host}:${slurmcfg.port}/slurm/${slurmcfg.api_version}/${apiSubpath}`, 
            data: postdata,
            headers: {
                ...headerss,
                "Content-Type": "application/json",
            }
        })
        // console.log(response)
        return response.data
    }
}
@Service()
export class SlurmService extends SlurmRequest{
    
    static async submitjob(username: string, taskname: string, scriptPath: string): Promise<any>{
        const scriptData = await FileService.getScriptFileData(username, scriptPath)
        if(!scriptData){
            return new Error("ERROR: Read script failure.");
        }
        const response = await this.httpPost("job/submit", {
            "job" : {
                "account" : "root",
                "name": taskname,
                "environment" : {
                    "PATH" : "/bin:/usr/bin:/usr/local/bin",
                    "LD_LIBRARY_PATH" : "/lib/:/lib64/:/usr/local/lib"
                },
                "current_working_directory" : `/mnt/slurm/${username}/output`
            },
            "script" : scriptData
        })
        const slurmErrors = response["errors"]
        if(slurmErrors instanceof Array && slurmErrors.length === 0){
            const jobid = response["job_id"]
            let newJob = new StampTask(); 
            newJob.taskId = jobid;
            newJob.userId = await UserService.getUid(username);
            newJob.resourceType = 0;
            newJob.resourceAmount = 0;
            if(newJob.userId < 0){
                return new Error("ERROR: User not found.")
            }
            await getConnection().getRepository(StampTask).save(newJob);
        }
        return response
    }

    static async getNodes(): Promise<any> {
        return this.httpGet("nodes")
    }
    
    static async getUnfinishedJobs(username?: string): Promise<any> {
        const response = await this.httpGet("jobs")
        return this.parseJobInfo(response.jobs)
    }
    
    static async parseJobInfo(respJobList: Array<SlurmJobInfo>): Promise<any> {
        const typedJobList = [] as Array<any>
        const transformJobToBrief = (sjb: SlurmJobBrief, proto: SlurmJobInfo) => {
            SlurmJobBriefKeys.forEach(key => {
                if(["start_time","end_time"].indexOf(key) > -1){
                    sjb[key] = dateformat(proto[key] * 1000, "yyyy-mm-dd HH:MM:ss");
                } else{
                    sjb[key] = proto[key]
                }
            })
        }
        respJobList.forEach(async element => {
            let sinfo = {} as SlurmJobBrief
            transformJobToBrief(sinfo, element)
            typedJobList.push(sinfo)
            let matchedTask = await getConnection().getRepository(StampTask).findOne({taskId: sinfo.job_id});
            // let allUsers = await suRepo.find();
            if(matchedTask){
                let stateId = -1;
                let matchedState =  await getConnection().getRepository(StampTaskStates).findOne({stateDescription: sinfo.job_state});
                if(!matchedState) {
                    let newState = new StampTaskStates()
                    let currentMaxStateId = await getConnection().getRepository(StampTask).createQueryBuilder("st").select("MAX(st.state_id)", "max").getOne()
                    if(!currentMaxStateId){
                        newState.stateId = 0
                    } else {
                        newState.stateId = currentMaxStateId.stateId + 1
                    }
                    newState.stateDescription = sinfo.job_state
                    await getConnection().getRepository(StampTaskStates).save(newState)
                    stateId = newState.stateId
                } else {
                    stateId = matchedState.stateId
                }
                matchedTask.stateId = stateId
                matchedTask.startTime = sinfo.start_time
                matchedTask.finishTime = sinfo.end_time
                await getConnection().getRepository(StampTask).save(matchedTask)
            }
        });
        return typedJobList
    }
}