import * as entities from 'app/entities'
import * as bootstrap from './bootstrap'
import { print } from './utils'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'

let connection : Connection;
;(async () => {
  const connectionOptions = await getConnectionOptions()
  connection = await createConnection({
    ...connectionOptions,
    entities: Object.keys(entities).map(name => entities[name]),
  })
  if (connection.isConnected) {
    print.log('database connected.')
  } else {
    print.danger('Database connection failed.')
  }

  bootstrap.connected()
})().catch(error => console.log(error))

export default connection;
