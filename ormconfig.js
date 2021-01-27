/**
 * You can link multiple databases here.
 * Refer to: https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md
 *
 *
 */
import Environment from 'configs/environments'

module.exports = {
  type: 'mariadb',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: 'p/q2-q4!',
  database: 'stamp-hyc',
  entities: [
    "/app/entities/*.ts"
  ],
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
}
