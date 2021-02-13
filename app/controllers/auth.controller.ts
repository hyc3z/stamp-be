import { StampUser } from 'app/entities';
import { Get, JsonController, QueryParam, Param, Session, Ctx, HeaderParams} from 'routing-controllers'
import {UserService} from '../services/user.service'
import jsonwebtoken from 'jsonwebtoken'
@JsonController('/user')
export class AuthController {
  constructor() {}

  @Get('/login')
  async login(@HeaderParams() param:any): Promise<any> {
    const username = param['stamp_oauth_username']
    const password = param['stamp_oauth_pwd']
    let loginSucess = await UserService.validate(username, password);
    if(loginSucess === true){
      let body = await UserService.encodejwt(username)
      return body.toString();
    }
    return undefined;
  }

  @Get('/validate')
  async validate(@HeaderParams() param:any): Promise<any> {
    try {
    let loginSucess = await UserService.verifyjwt(param);
    return "true"
    } catch (error) {
      return "unauthorized"
    }
    
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
