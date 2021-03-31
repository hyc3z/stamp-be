import { StampUser } from 'app/entities'
import {
  Get,
  JsonController,
  QueryParam,
  Param,
  Session,
  Ctx,
  Post,
  Body,
  BodyParam,
  HeaderParams,
  UploadedFile,
  Header,
  Req,
  Params,
  UseBefore,
  Res,
  ContentType,
} from 'routing-controllers'
import { SlurmService } from '../services/slurm.service'
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import { UserService } from 'app/services'
import { FileService } from 'app/services'
import bodyParser from 'koa-bodyparser'
import { type } from 'os'
import send from 'koa-send'
import { promisify } from 'util'
import { Response } from 'koa'
import { fileName } from 'typeorm-model-generator/dist/src/NamingStrategy'
import { PassThrough } from 'stream'
@JsonController('/file')
export class FileController {
  constructor() {}

  @Post('/program')
  async postProgram(
    @HeaderParams() param: any,
    @UploadedFile('file') file: any,
    @Ctx() ctx: any,
  ): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      const response = await FileService.saveFile(user, 'program', file)
      ctx.status = response ? 200 : 500
      return ctx.status
    } else {
      ctx.status = 500
      return ctx.status
    }
  }

  @Post('/script')
  async postScript(
    @HeaderParams() param: any,
    @UploadedFile('file') file: any,
    @Ctx() ctx: any,
  ): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      const response = await FileService.saveFile(user, 'scripts', file)
      ctx.status = response ? 200 : 500
      return ctx
    } else {
      ctx.status = 500
      return ctx
    }
  }

  // @UseBefore(bodyParser.urlencoded())
  @Post('/editScript')
  async postEditedScript(
    @HeaderParams() param: any,
    @Body({ type: 'string' }) data: any,
    @Ctx() ctx: any,
  ): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      const filename = param['filename']
      const script = data
      // console.log(script)
      const response = await FileService.saveEditedScript(user, filename, script)
      ctx.status = response ? 200 : 500
      return ctx
    } else {
      ctx.status = 500
      return ctx
    }
  }

  // @ContentType('application/octet-stream')
  // @Post('/download')
  // // Currently, routing-controllers don't support returning streams.
  // async downloadFiles(@HeaderParams() param:any, @QueryParam('path') path: string, @Ctx() ctx:any): Promise<any> {
  //   let user = await UserService.decodejwt(param)
  //   if(user){
  //     try {
  //       const rs = await FileService.downloadFile(user, path)
  //       ctx.set('Content-disposition', `attachment; filename=${path}`)
  //       ctx.set('Content-type', 'application/octet-stream')
  //       ctx.body = rs
  //     } catch (error) {
  //       console.log(error)
  //     }

  //   } else{
  //     ctx.status = 500
  //     return ctx
  //   }
  // }

  @Get('/program')
  async getProgramfiles(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      // const response = await  FileService.getProgramfilesChonky(user);
      const response = await FileService.getProgramfilesDevExtreme(user)
      return response['items']
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/script')
  async getScriptfiles(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      // const response = await FileService.getScriptfilesChonky(user);
      const response = await FileService.getScriptfilesDevExtreme(user)
      return response['items']
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/result')
  async getResultfiles(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      // const response = await FileService.getScriptfilesChonky(user);
      const response = await FileService.getResultfilesDevExtreme(user)
      return response['items'].sort((a: any, b: any) => {
        return b.name.localeCompare(a.name)
      })
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/getScript')
  async getScriptdata(
    @HeaderParams() param: any,
    @QueryParam('path') path: string,
    @Ctx() ctx: any,
  ): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      // const response = await FileService.getScriptfilesChonky(user);
      const response = await FileService.getScriptFileData(user, path)
      return response
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/deleteScript')
  async deleteScript(
    @HeaderParams() param: any,
    @QueryParam('path') path: string,
    @Ctx() ctx: any,
  ): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      // const response = await FileService.getScriptfilesChonky(user);
      const response = await FileService.deleteScriptData(user, path)
      return response
    } else {
      ctx.status = 500
      return ctx
    }
  }

  @Get('/deleteProgram')
  async deleteProgram(
    @HeaderParams() param: any,
    @QueryParam('path') path: string,
    @Ctx() ctx: any,
  ): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user) {
      // const response = await FileService.getScriptfilesChonky(user);
      const response = await FileService.deleteProgramData(user, path)
      return response
    } else {
      ctx.status = 500
      return ctx
    }
  }
}
