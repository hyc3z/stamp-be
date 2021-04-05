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
} from 'routing-controllers'
import { SlurmService } from '../services/slurm.service'
import jsonwebtoken from 'jsonwebtoken'
import { mock_node } from 'app/mock/nodes'
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
}
