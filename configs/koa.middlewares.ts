import Koa from 'koa'
import send from 'koa-send'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import Environment from './environments'
import jwt from 'koa-jwt'
import { FileService, UserService } from 'app/services'
import { Ctx } from 'routing-controllers'

export const useMiddlewares = <T extends Koa>(app: T): T => {
  Environment.identity !== 'test' && app.use(logger())

  app.use(bodyParser({enableTypes: ['json', 'form', 'text']}))

  return app
    
}
