/**
 * You can link multiple databases here.
 * Refer to: https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md
 *
 *
 */
import Environment from 'configs/environments'

module.exports = {
  type: 'mariadb',
  host: '0.0.0.0',
  port: '3306',
  username: 'root',
  password: 'p/q2-q4!',
  database: 'stamp_hyc',
  entities: ['/app/entities/*.ts'],
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
}
