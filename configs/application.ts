import 'reflect-metadata'
import Koa from 'koa'
import cors from '@koa/cors'
import session from 'koa-session'
import jwt from 'koa-jwt'
import { Container } from 'typedi'
import { useDatabase } from './customs'
import { routingConfigs } from './routing.options'
import { useMiddlewares } from './koa.middlewares'
import { useKoaServer, useContainer } from 'routing-controllers'
import decode from 'koa-jwt-decode'
if (useDatabase) {
  require('./connection')
}

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

const createServer = async (): Promise<Koa> => {
  const koa: Koa = new Koa()
  
  useMiddlewares(koa)

  const app: Koa = useKoaServer<Koa>(koa, routingConfigs)
  app.use(cors());

  useContainer(Container)
  app.use(jwt({ secret: 'jwt-hyc' }).unless({ path: [/^\/user\/*/] }));

  return app
}

export default createServer
