import { Service } from 'typedi'
import { getConnection, Connection } from 'typeorm';
import axios from 'axios'
import slurmcfg from '../../configs/slurm.config'
import dateformat from 'dateformat'
@Service()


class SlurmMetaData {

}

class SlurmRequest extends SlurmMetaData{
    static async httpGet(apiSubpath:string, params?: Object):Promise<any> {
        return axios.get(`http://${slurmcfg.host}:${slurmcfg.port}/api/${slurmcfg.api_version}/${apiSubpath}`, params)
    }

    static async httpPost(apiSubpath:string, data?: any, params?: Object):Promise<any> {
        return axios.post(`http://${slurmcfg.host}:${slurmcfg.port}/api/${slurmcfg.api_version}/${apiSubpath}`, data, params)
    }
}

export class SlurmService extends SlurmRequest{
    
    static async submitjob(script: string): Promise<any>{
        return this.httpPost("submitjob", script)
    }

    
    
}