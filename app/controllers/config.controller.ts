import { UserService } from 'app/services'
import { ConfigService } from 'app/services/config.service';
import {
  Get,
  JsonController,
  QueryParam,
  Param,
  Session,
  Ctx,
  HeaderParams,
  Post,
  Body,
} from 'routing-controllers';
@JsonController('/config')
export class ConfigController {
  @Get('/env')
  async envConfig(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      const userEnv = await UserService.getEnv(user)
      // console.log(script)
      ctx.status = userEnv ? 200 : 500
      return userEnv
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/storeEnv')
  async storeEnv(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    const env_key = param['stamp_user_env_key']
    const env_val = param['stamp_user_env_val']
    const env_id = param['stamp_user_env_id']
    console.log(env_key, env_val, env_id)
    if (user) {
      const userEnv = await UserService.storeEnv(user, env_key, env_val, env_id)
      // console.log(script)
      ctx.status = userEnv ? 200 : 500
      return userEnv
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/deleteEnv')
  async deleteEnv(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    const env_id = param['stamp_user_env_id']
    if (user) {
      const userEnv = await UserService.deleteEnv(user, env_id)
      // console.log(script)
      ctx.status = userEnv ? 200 : 500
      return userEnv
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/get')
  async getClusterConfig(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user && UserService.isAdmin(user)) {
      try {
        const userEnv = await ConfigService.getConfig(true)
        ctx.status = userEnv ? 200 : 500
        return userEnv
      } catch (error) {
        console.log(error)
      }
      // console.log(script)
      
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Post('/set')
  async setClusterConfig(@Body() body:any,@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    
    if (user && UserService.isAdmin(user)) {
      try {
        const userEnv = await ConfigService.setConfig(body)
        ctx.status = userEnv ? 200 : 500
        return userEnv
      } catch (error) {
        console.log(error)
      }
      // console.log(script)
      
    } else {
      ctx.status = 500
      return ctx
    }
  }

}
