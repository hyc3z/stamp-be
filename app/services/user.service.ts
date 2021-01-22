import { Service } from 'typedi'
import {StampUser} from "../entities";
import { getConnection, Connection } from 'typeorm';
import dateformat from 'dateformat'
import { EncriptService } from './encript.service';
@Service()
export class UserService {

  // static async getUsers(): Promise<StampUser[]>{
  //   let allUsers = await getConnection().getRepository(StampUser).find()
  //   // let allUsers = await suRepo.find();
  //   return allUsers;
  // }

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

  static async register(username: string, password: string): Promise<boolean>{
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

    return true;
  }
  
}