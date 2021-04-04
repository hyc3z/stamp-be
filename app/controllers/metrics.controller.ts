import { UserService, MetricsService, SlurmService } from 'app/services'
import {
  Get,
  JsonController,
  QueryParam,
  Param,
  Session,
  Ctx,
  HeaderParams,
} from 'routing-controllers'
@JsonController('/metrics')
export class MetricsController {
  @Get('/cluster')
  async clusterMetrics(@HeaderParams() param: any): Promise<any> {
    const cpuUsageMetrics = await SlurmService.getNodes();
    const metrics =  {
      cpuUsage: cpuUsageMetrics
    }
    return metrics
  }

  @Get('/tax')
  async getTax(@HeaderParams() param: any, @Ctx() ctx: any): Promise<any> {
    const startDate = param["stamp_report_start_date"]
    const endDate = param["stamp_report_end_date"]
    let user = await UserService.decodejwt(param)
    if (user && UserService.isAdmin(user)) {
      const taxes = await MetricsService.getTaxes(startDate, endDate)
      ctx.status = taxes ? 200 : 500
      return taxes
    } else {
      ctx.status = 500
      return ctx.status
    }
  }
}
