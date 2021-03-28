import { Service } from 'typedi'
import {StampGroup, StampUser, StampUserEnv} from "../entities";
import { getConnection, Connection } from 'typeorm';
import dateformat from 'dateformat'
import { EncriptService } from './encript.service';
import {FileService} from './file.service';
import jsonwebtoken from 'jsonwebtoken'
import { decode } from 'querystring';
@Service()
export class UserService {

  // static async getUsers(): Promise<StampUser[]>{
  //   let allUsers = await getConnection().getRepository(StampUser).find()
  //   // let allUsers = await suRepo.find();
  //   return allUsers;
  // }

  static async decodejwt(headerParams: any): Promise<any> {
    await UserService.verifyjwt(headerParams);
    let authHeader = headerParams['authorization']
    let authString = authHeader.substring(7)
    return jsonwebtoken.decode(authString)['data']
  }

  static async verifyjwt(headerParams: any): Promise<any> {
    let authHeader = headerParams['authorization']
    let authString = authHeader.substring(7)
    return jsonwebtoken.verify(authString, "jwt-hyc")
  }

  static async encodejwt(username: string): Promise<string> {
    return jsonwebtoken.sign({
      data: username,
      //exp in seconds
    }, "jwt-hyc")
  }

  static async getEnv(username: string): Promise<any> {
    const uId = await UserService.getUid(username)
    const userEnvConnection = await getConnection().getRepository(StampUserEnv)
    const allEnvs = await userEnvConnection.find({where: {userId: uId}})
    return allEnvs
  }

  static async deleteEnv(username: string, envId: number | string): Promise<any> {
    const userEnvConnection = await getConnection().getRepository(StampUserEnv)
    const uid = await UserService.getUid(username)
    if(uid < 0){
      return false
    }
    const existingEnv = await userEnvConnection.find({where: {envId: envId, userId: uid}})
    if(existingEnv.length > 0){
      await userEnvConnection.delete(existingEnv[0])
      return true
    } else {
      console.log("No env found.", envId, uid)
    }
    return false
  }

  static async storeEnv(username: string, envKey: string, envVal: string, envId: number | string) {
    const userEnvConnection = await getConnection().getRepository(StampUserEnv)
    const uid = await UserService.getUid(username)
    if(uid < 0){
      return false
    }
    const existingEnv = await userEnvConnection.find({where: {envId: envId, userId: uid}})
    if(existingEnv.length > 0){
      const editingEnv = existingEnv[0]
      editingEnv.envKey = envKey
      editingEnv.envVal = envVal
      await userEnvConnection.save(editingEnv)
    } else {
      const newEnv = new StampUserEnv()
      newEnv.envKey = envKey
      newEnv.envVal = envVal
      newEnv.userId = uid
      await userEnvConnection.save(newEnv)
    }
    return true
  }

  static async validate(username: string, password: string): Promise<boolean>{
    let allUsers = await getConnection().getRepository(StampUser).find({where: {userName: username, userPwd: await EncriptService.hashed(password)}});
    // let allUsers = await suRepo.find();
    return allUsers.length > 0;
  } 

  static async exists(_username: string): Promise<any>{
    // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
    let allUsers = await getConnection().getRepository(StampUser).find({where: {userName: _username}});
    // let allUsers = await suRepo.find();
    return allUsers.length > 0;
  }

  static async getUid(_username: string): Promise<any>{
    // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
    let allUsers = await getConnection().getRepository(StampUser).find({where: {userName: _username}});
    // let allUsers = await suRepo.find();
    if(allUsers.length > 0){
      return allUsers[0].userId
    }
    return -1
  }

  static async delete(username: string, password: string): Promise<boolean>{
    const validated = await this.validate(username, password)
    if(validated){
      await getConnection().getRepository(StampUser).delete({userName: username})
    }
    return true
  } 

  static async registerAdmin(username: string, password: string): Promise<boolean>{
    const userExist = await this.exists(username);
    if (userExist){
      return false;
    }
    let newUser = new StampUser();
    newUser.userName = username;
    newUser.userPwd = await EncriptService.hashed(password);
    // https://www.npmjs.com/package/dateformat
    newUser.createTime = dateformat(new Date(), "yyyy-mm-dd HH:MM:ss");
    await getConnection().getRepository(StampUser).save(newUser);
    await FileService.mkdir(username);
    let newGroup = new StampGroup();
    newGroup.gadmin = newUser.userId;
    newGroup.gname = newUser.userName;
    await getConnection().getRepository(StampGroup).save(newGroup);
    return true;
  }
  static async isAdmin(username: string) {
    const userExist = await this.exists(username);
    if (!userExist){
      return false;
    }
    const uid = await UserService.getUid(username)
    if ( uid < 0) {
      return false;
    }
    const group = await getConnection().getRepository(StampGroup).findOne({gadmin: uid});
    if (!group) {
      return false;
    }
    // Warning: it's possible that in StampGroup, a group has admin X, 
    // But X's gid does not match group's Gid.
    return true
  }
  static async registerUser(username: string, password: string, groupadmin?: string): Promise<boolean>{
    const userExist = await this.exists(username);
    if (userExist){
      return false;
    }
    let newUser = new StampUser();
    newUser.userName = username;
    newUser.userPwd = await EncriptService.hashed(password);
    // https://www.npmjs.com/package/dateformat
    newUser.createTime = dateformat(new Date(), "yyyy-mm-dd HH:MM:ss");
    await getConnection().getRepository(StampUser).save(newUser);
    await FileService.mkdir(username);
    if(groupadmin) {
      const uid = await UserService.getUid(groupadmin)
      if ( uid < 0) {
        return false;
      }
      const group = await getConnection().getRepository(StampGroup).findOne({gadmin: uid});
      if (!group) {
        return false;
      }
      newUser.gid = group.gid
    }
    return true;
  }
  
}