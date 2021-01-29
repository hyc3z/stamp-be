import { StampUser } from 'app/entities';
import { Get, JsonController, QueryParam, Param, Session, Ctx, Post, BodyParam} from 'routing-controllers'
import {SlurmService} from '../services/slurm.service'
import jsonwebtoken from 'jsonwebtoken'
@JsonController('/cluster')
export class ClusterController {
  constructor() {}

  @Get('/nodes')
  async getTasks(): Promise<any> {
    // TODO implement tasks
    // let loginSucess = await UserService.validate(username, password);
    return SlurmService.getNodes();
  }
}
