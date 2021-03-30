import * as entities from 'app/entities'
import * as bootstrap from './bootstrap'
import { print } from './utils'
import { Connection, createConnection, getConnectionOptions, getConnection } from 'typeorm'
import { exec } from 'child_process';
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions';
import { StampUser } from 'app/entities';
import { UserService } from 'app/services';
let connection : Connection;
async function connDB () {
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
  await initDatabase()
  bootstrap.connected()
}

async function startSlurm() {
  const serviceList = ["slurmd", "slurmctld", "slurmdbd", "slurmrestd"]
  serviceList.forEach(service => {
    exec(`systemctl start ${service}`)
  })
}
;(async function () {
  await connDB()
  await startSlurm()
})().catch(async error => {
  console.log(error)
  if(error.errno === 1049) {
    console.log("Trying to create database...")
    const connectionOptions = await getConnectionOptions()
    const { username, password, host, database } = connectionOptions as MysqlConnectionCredentialsOptions
    const createCommand = `mysql -u${username} -p${password} -h ${host} -e "CREATE SCHEMA ${database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
    exec(createCommand)
    await connDB()
  } else {
    console.log("Fatal: Startup failed.")
  }
})
async function initDatabase() {
  print.log('Checking database status...')
  const initAdminUsername = "admin"
  const initAdminPwd = "123456"
  const response =  await UserService.registerAdmin(initAdminUsername, initAdminPwd);
  console.log("Register admin:", response)
  const initUserUsername = "user"
  const initUserPwd = "123456"
  const response2 =  await UserService.registerUser(initUserUsername, initUserPwd);
  console.log("Register user:", response2)
}

export default connection;
