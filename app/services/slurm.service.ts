import { Service } from 'typedi'
import { getConnection, Connection } from 'typeorm';
import { AxiosRequestConfig}  from 'axios'
import axios from 'axios'
import slurmcfg from '../../configs/slurm.config'
import dateformat from 'dateformat'
import { Method } from 'routing-controllers';



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
            headers: headerss
        })
        return response.data
    }
}
@Service()
export class SlurmService extends SlurmRequest{
    
    static async submitjob(script: string): Promise<any>{
        return this.httpPost("submitjob", script)
    }

    static async getNodes(): Promise<any> {
        return this.httpGet("nodes")
    }
    
    
}