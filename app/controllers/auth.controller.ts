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
      console.log("Auth passed.")
      let body= jsonwebtoken.sign({
          data: username,
          //exp in seconds
        }, "jwt-hyc")
      return body.toString();
    }
    return undefined;
  }

  // @Get('/secret')
  // async debug(): Promise<StampUser[]>{
  //   return UserService.getUsers();
  // }

  @Get('/register')
  async register(@QueryParam("username") username: string, @QueryParam('password') password: string): Promise<any> {
      return UserService.register(username, password);
  }
}
