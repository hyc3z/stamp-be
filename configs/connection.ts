import * as entities from 'app/entities'
import * as bootstrap from './bootstrap'
import { print } from './utils'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { exec } from 'child_process';
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions';
let connection : Connection;
async function conn () {
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
}

;(async function () {
  await conn()
})().catch(async error => {
  console.log(error)
  if(error.errno === 1049) {
    console.log("Trying to create database...")
    const connectionOptions = await getConnectionOptions()
    const { username, password, host, database } = connectionOptions as MysqlConnectionCredentialsOptions
    const createCommand = `mysql -u${username} -p${password} -h ${host} -e "CREATE SCHEMA ${database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
    exec(createCommand)
    await conn()
  }
})
function initDatabase(connection: Connection) {
  print.log('Checking database status...')
  connection.query("select * from ")
}

export default connection;
