import { StampUser } from 'app/entities'
import {
  Get,
  JsonController,
  QueryParam,
  Param,
  Session,
  Ctx,
  HeaderParams,
} from 'routing-controllers'
import { UserService } from '../services/user.service'
import jsonwebtoken from 'jsonwebtoken'
@JsonController('/user')
export class AuthController {
  constructor() {}

  @Get('/login')
  async login(@HeaderParams() param: any): Promise<any> {
    const username = param['stamp_oauth_username']
    const password = param['stamp_oauth_pwd']
    let loginSucess = await UserService.validate(username, password)
    if (loginSucess === true) {
      let body = await UserService.encodejwt(username)
      return body.toString()
    }
    return undefined
  }

  @Get('/validate')
  async validate(@HeaderParams() param: any): Promise<any> {
    try {
      let loginSucess = await UserService.verifyjwt(param)
      return 'true'
    } catch (error) {
      return 'unauthorized'
    }
  }
  @Get('/isAdmin')
  async isAdmin(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    const username = param['stamp_admin_username']
    const response = await UserService.isAdmin(username)
    return response
  }

  @Get('/registerAdmin')
  async registerAdmin(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    const username = param['stamp_admin_username']
    const password = param['stamp_admin_pwd']
    const response = await UserService.registerAdmin(username, password)
    ctx.status = response ? 200 : 500
    return response
  }

  @Get('/registerUser')
  async registerUser(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    const username = param['stamp_user_username']
    const password = param['stamp_user_pwd']
    let user = await UserService.decodejwt(param)
    if (user) {
      const response = await UserService.registerUser(username, password, user)
      ctx.status = response ? 200 : 500
      return ctx.status
    } else {
      ctx.status = 500
      return ctx.status
    }
  }

  // Dangerous: comment in production
  // Todo: delete & reset group when deleting admin
  @Get('/delete')
  async delete(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    const username = param['stamp_user_username']
    const password = param['stamp_user_pwd']
    let user = await UserService.decodejwt(param)
    if (user) {
      const response = await UserService.delete(username, password)
      ctx.status = response ? 200 : 500
      return ctx.status
    } else {
      ctx.status = 500
      return ctx.status
    }
  }
}
