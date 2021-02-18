import { StampUser } from 'app/entities';
import { Get, JsonController, QueryParam, Param, Session, Ctx, Post, BodyParam, HeaderParams} from 'routing-controllers'
import {SlurmService} from '../services/slurm.service'
import jsonwebtoken from 'jsonwebtoken'
import { UserService } from 'app/services/user.service';
@JsonController('/task')
export class TaskController {
  constructor() {}

  @Get('/tasks')
  async getTasks(@HeaderParams() param:any,@Ctx() ctx:any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if(user){
      const filename = param["filename"]
      const taskname = param["taskname"]
      const submitResult = await SlurmService.getJobs(user);
      // console.log(script)
      ctx.status = submitResult ? 200 : 500
      return ctx
    } else{
      ctx.status = 500
      return ctx
    }
  }
  
  @Get('/create')
  async createTask(@HeaderParams() param:any,@Ctx() ctx:any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if(user){
        const filename = param["filename"]
        const taskname = param["taskname"]
        const submitResult = await SlurmService.submitjob(user, taskname, filename );
        // console.log(script)
        ctx.status = submitResult ? 200 : 500
        return ctx
    } else{
      ctx.status = 500
      return ctx
    }
  }
}
