import { Get, JsonController, QueryParam, Param, Session, Ctx, HeaderParams} from 'routing-controllers'
@JsonController('/metrics')
export class MetricsController {
  
  @Get('/cluster')
  async clusterMetrics(@HeaderParams() param:any): Promise<any> {
    
    return undefined;
  }

  
}
