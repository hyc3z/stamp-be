import { Service } from 'typedi'
import { getConnection, Connection } from 'typeorm';
import { AxiosRequestConfig}  from 'axios'
import axios from 'axios'
import slurmcfg from '../../configs/slurm.config'
import dateformat from 'dateformat'
import { Method } from 'routing-controllers';
import { FileService } from './file.service';
import { StampTask } from 'app/entities';
import { UserService } from './user.service';



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
    
    
}