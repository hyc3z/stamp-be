import { StampUser } from 'app/entities';
import { Get, JsonController, QueryParam, Param, Session, Ctx} from 'routing-controllers'
import {UserService} from '../services/user.service'
import jsonwebtoken from 'jsonwebtoken'
@JsonController('/user')
export class AuthController {
  constructor() {}

  @Get('/login')
  async login(@QueryParam('username') username: string, @QueryParam('password') password: string): Promise<any> {
    let loginSucess = await UserService.validate(username, password);
    if(loginSucess === true){
      let body = await UserService.encodejwt(username)
      return body.toString();
    }
    return undefined;
  }

  // 
  // @Get('/secret')
  // async debug(): Promise<StampUser[]>{
  //   return UserService.getUsers();
  // }

  @Get('/register')
  async register(@QueryParam("username") username: string, @QueryParam('password') password: string): Promise<any> {
      return UserService.register(username, password);
  }

  // Dangerous: comment in production
  @Get('/delete')
  async delete(@QueryParam("username") username: string, @QueryParam('password') password: string): Promise<any>{
    return UserService.delete(username, password);
  }
  
}
