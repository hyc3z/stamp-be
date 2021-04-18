import { StampUser } from 'app/entities'
import {
  Get,
  JsonController,
  QueryParam,
  Param,
  Session,
  Ctx,
  Post,
  BodyParam,
  HeaderParams,
} from 'routing-controllers'
import { SlurmService } from '../services/slurm.service'
import jsonwebtoken from 'jsonwebtoken'
import { mock_node } from 'app/mock/nodes'
import { UserService } from 'app/services'
@JsonController('/cluster')
export class ClusterController {
  constructor() {}

  @Get('/nodes')
  async getNodes(): Promise<any> {
    // TODO implement tasks
    // let loginSucess = await UserService.validate(username, password);
    return mock_node
    // return SlurmService.getNodes()
  }

  @Get('/partitions')
  async getPartitions(): Promise<any> {
    const par = await SlurmService.getPartitions()
    return par
  }

  @Get('/process')
  async getProcessInfo(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user && UserService.isAdmin(user)) {
      const processInfo = await SlurmService.getProcessInfo()
      ctx.status = processInfo ? 200 : 500
      return processInfo
    } else {
      ctx.status = 500
      return ctx.status
    }
  }

  @Get('/restartProcess')
  async restartProcess(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    let user = await UserService.decodejwt(param)
    if (user && UserService.isAdmin(user)) {
      const processName = param['process-name']
      const processInfo = await SlurmService.restartProcess(processName)
      ctx.status = processInfo ? 200 : 500
      return processInfo
    } else {
      ctx.status = 500
      return ctx.status
    }
  }
}
