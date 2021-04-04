import { Service } from 'typedi'
import { getConnection, Connection, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'
import fs from 'fs'
import dateformat from 'dateformat'
import fsConfig from '../../configs/file.config'
import path from 'path'
import directory_tree from 'directory-tree'
import { StampTask } from 'app/entities'
import {TUserTaxInfo} from '../meta/UserTaxInfo'
import { diffSeconds } from 'app/helpers/common'
import { UserService } from './user.service'
@Service()
export class MetricsService {

    static async processTasks(tasks: StampTask[]): Promise<TUserTaxInfo[]> {
        const userTaxInfo = {} as {[username: string]:TUserTaxInfo}
        await Promise.all(tasks.map(async (task: StampTask) =>{
            const diff = diffSeconds(task.startTime, task.finishTime)
            const coreHours = (task.resourceAmount * diff / 3600)
            const cost = coreHours * 0;
            const userName = await UserService.getUserName(task.userId)
            if(userName in userTaxInfo) {
                userTaxInfo[`${userName}`].total_corehours += coreHours
                // todo: price setting
                userTaxInfo[`${userName}`].total_cost += cost;
                userTaxInfo[`${userName}`].total_tasks += 1;
            } else {
                Object.assign(userTaxInfo, {
                    [`${userName}`]: {
                        user_name: userName,
                        total_corehours: coreHours,
                        total_cost: cost,
                        total_tasks: 1
                    }
                })
            }
        }))
        return Object.values(userTaxInfo)
    }

    static async getTaxes(startDateStamp: number, endDateStamp: number): Promise<any[]>{
        const taskConn = getConnection().getRepository(StampTask);
        const startDate = new Date(startDateStamp*1000);
        const endDate = new Date(endDateStamp*1000);
        const tasks = await taskConn.find({
            startTime: MoreThanOrEqual(startDate) && LessThanOrEqual(endDate)
        })
        try {
            const a = await this.processTasks(tasks)
            return a
        } catch (error) {
            console.log(error)
        }
    }

}
