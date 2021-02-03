import { Service } from 'typedi'
import { getConnection, Connection } from 'typeorm';
import fs from 'fs'
import dateformat from 'dateformat'
import fsConfig from '../../configs/file.config'
import path from 'path';
import directory_tree from 'directory-tree';
@Service()
export class FileService {
    
    static async mkdir(username: string): Promise<boolean>{
        let result = true;
        fsConfig.subPaths.forEach(subPath => {
            fs.mkdir(path.join(fsConfig.mountPath, username, subPath), {recursive: true},(err) => { if(err) {result = false}})
        });
        return result
    }

    static async getDir(username: string, subpath?: string, filename? : string): Promise<string>{
        return path.join(fsConfig.mountPath, username, subpath ?? "", filename ?? "")
    }

    static async saveFile(username: string, subpath: string, file: any): Promise<any> {
        let result = true;
        const userpath = await this.getDir(username, subpath, file.originalname)
        fs.writeFile(userpath, file.buffer, (err) => { if(err) { console.log(err);result = false}})
        return result 
    }

    static async getProgramfiles(username: any): Promise<any> {
        const userpath = await this.getDir(username, "program")
        const result = directory_tree(userpath)
        return result
    }

    static async getScriptfiles(username: any): Promise<any> {
        const userpath = await this.getDir(username, "script")
        const result = directory_tree(userpath)
        return result
    }
}