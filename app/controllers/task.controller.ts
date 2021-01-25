import { StampUser } from 'app/entities';
import { Get, JsonController, QueryParam, Param, Session, Ctx} from 'routing-controllers'
import {UserService} from '../services/user.service'
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
  
}
