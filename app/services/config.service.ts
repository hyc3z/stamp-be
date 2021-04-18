import { Service } from 'typedi'
import { StampGroup, StampUser, StampUserEnv } from '../entities'
import { getConnection, Connection } from 'typeorm'
import dateformat from 'dateformat'
import { EncriptService } from './encript.service'
import { FileService } from './file.service'
import jsonwebtoken from 'jsonwebtoken'
import { decode } from 'querystring'
import { StampClusterEnv } from 'app/entities/StampClusterEnv'
import defaultClusterConfig, { backTranslateConfig, translateConfig } from '../../configs/cluster'
import { execSync } from 'node:child_process'
@Service()
export class ConfigService {
    static async getConfig(translate?: boolean): Promise<any>{
        let configs = await getConnection().getRepository(StampClusterEnv).find()
        if(defaultClusterConfig) {
            const result = await Promise.all(Object.keys(defaultClusterConfig).map(async (key: string) => {
                
                const newConfig = new StampClusterEnv;
                newConfig.envKey = key;
                newConfig.envVal = defaultClusterConfig?.[key]
                let exists = await getConnection().getRepository(StampClusterEnv).findOne({envKey: key})
                if(!exists) {
                    exists = await getConnection().getRepository(StampClusterEnv).save(newConfig)
                }
                return exists
            }))
            if(translate){
                return result.map((config: StampClusterEnv) => {
                    return {
                        [translateConfig[`${config.envKey}`]]: config.envVal
                    }
                })
            }else{
                return result
            }
            
        }
        
    }

    static async setConfig(body: any): Promise<any> {
        let repo = await getConnection().getRepository(StampClusterEnv)
        const bd = Object.entries(body.values)
        await Promise.all(bd.map(async (config: Object) => {
            try {
                const envKey = backTranslateConfig[config[0]]
                if(envKey) {
                const existingEnv = await repo.findOne({envKey: envKey})
                if(existingEnv) {
                    existingEnv.envVal = config[1]
                    await repo.save(existingEnv)
                } else {
                    const newConfig = new StampClusterEnv;
                    newConfig.envKey = envKey;
                    newConfig.envVal = config[0]
                    await repo.save(newConfig)
                }
            }
            } catch (error) {
                console.log(error)
            }
            
        }))
        return true;

    }
}
