import { StampUser } from 'app/entities';
import { Get, JsonController, QueryParam, Param, Session, Ctx, Post, Body, BodyParam, HeaderParams, UploadedFile, Header} from 'routing-controllers'
import {SlurmService} from '../services/slurm.service'
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import { UserService } from 'app/services';
import { FileService } from 'app/services';

@JsonController('/file')
export class FileController {
  constructor() {}

  @Post('/program')
  async postProgram(@HeaderParams() param:any, @UploadedFile('file') file: any, @Ctx() ctx:any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if(user){
        const response = await FileService.saveFile(user, "program", file)
        ctx.status = response ? 200 : 500
        return ctx.status
    } else{
      ctx.status = 500
      return ctx.status
    }
  }

  @Post('/script')
  async postScript(@HeaderParams() param:any, @UploadedFile('file') file: any, @Ctx() ctx:any): Promise<any> {
    let user = await UserService.decodejwt(param)
    console.log(file)
    if(user){
        const response = await FileService.saveFile(user, "script", file)
        ctx.status = response ? 200 : 500
        return ctx
    } else{
      ctx.status = 500
      return ctx
    }
  }

  @Get('/program')
  async getProgramfiles(@HeaderParams() param:any, @Ctx() ctx:any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if(user){
        const response = await  FileService.getProgramfiles(user);
        return response
    } else{
      ctx.status = 500
      return ctx
    }
  }

  @Get('/script')
  async getScriptfiles(@HeaderParams() param:any, @Ctx() ctx:any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if(user){
        const response = await FileService.getScriptfiles(user);
        return response

    } else{
      ctx.status = 500
      return ctx
    }
  }
  
}
