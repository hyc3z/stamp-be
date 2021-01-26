import { StampUser } from 'app/entities';
import { Get, JsonController, QueryParam, Param, Session, Ctx, Post, BodyParam} from 'routing-controllers'
import {SlurmService} from '../services/slurm.service'
import jsonwebtoken from 'jsonwebtoken'
@JsonController('/task')
export class TaskController {
  constructor() {}

  @Get('/tasks')
  static async getTasks(): Promise<any> {
    // TODO implement tasks
    // let loginSucess = await UserService.validate(username, password);
    return undefined;
  }
  
  @Post('/submit')
  static async submitTask(@BodyParam("script") script:string): Promise<any> {
    const submitResult = await SlurmService.submitjob(script);
    
  }
}
