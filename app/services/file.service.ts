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

    static async saveEditedScript(username: string, filename: any, script: any): Promise<any> {
        let result = true;
        const userpath = await this.getDir(username, "scripts", filename)
        fs.writeFile(userpath, script, (err) => { if(err) { console.log(err);result = false}})
        return result 
    }

    static async getScriptFileData(username:string, path: string): Promise<any> {
        const userpath = await this.getDir(username, "scripts", path)
        try {
            const content = fs.readFileSync(userpath, {encoding : 'utf-8'})
            return content
        } catch (error) {
            console.log(error)
            return ""
        }
        
    }

    static async deleteScriptData(username:string, path: string): Promise<any> {
        const userpath = await this.getDir(username, "scripts", path)
        try {
            fs.unlink(userpath, (err) => {
                if (err) {
                    console.log(err)
                    return ""
                }
            })
        } catch (error) {
            console.log(error)
            return ""
        }
        
    }

    static async deleteProgramData(username:string, path: string): Promise<any> {
        const userpath = await this.getDir(username, "program", path)
        try {
            fs.unlink(userpath, (err) => {
                if (err) {
                    console.log(err)
                    return ""
                }
            })
        } catch (error) {
            console.log(error)
            return ""
        }
        
    }

    static async getProgramfilesDevExtreme(username: any): Promise<any> {
        const userpath = await this.getDir(username, "program")
        const dt = directory_tree(userpath)
        const result = this.convertObjectToDevExtreme(dt)
        return result
    }

    static async getScriptfilesDevExtreme(username: any): Promise<any> {
        const userpath = await this.getDir(username, "scripts")
        const dt = directory_tree(userpath)
        const result = this.convertObjectToDevExtreme(dt)
        return result
    }

    static async getProgramfilesChonky(username: any): Promise<any> {
        const userpath = await this.getDir(username, "program")
        const result = directory_tree(userpath)
        const globalList = {"rootFolderId": userpath, "fileMap": {}}
        this.convertObjectToChonky(result, globalList)
        return globalList
    }

    static async getScriptfilesChonky(username: any): Promise<any> {
        const userpath = await this.getDir(username, "scripts")
        const result = directory_tree(userpath)
        const globalList = {"rootFolderId": userpath, "fileMap": {}}
        this.convertObjectToChonky(result, globalList)
        return globalList
    }
    static async convertObjectToChonky(file: directory_tree.DirectoryTree, globalList: any): Promise<any> {
        if(!file) return
        const children = file.children
        const newchildren = []
        if(children){
            children.forEach(async (obj) => {newchildren.push(obj.path)})
        }
        const newFile = {
            id: file.path,
            name: file.name,
            isDir: file.type === "directory",
            openable: true,
            children: newchildren
        }
        globalList.fileMap[newFile.id] = newFile
        if(children){
            children.forEach(async (obj) => {await this.convertObjectToChonky(obj, globalList)})
        }
    }
    
    static async getProgramfilesChonkyWithoutFolders(username: any): Promise<any> {
        const userpath = await this.getDir(username, "program")
        const result = directory_tree(userpath)
        const globalList = []
        this.convertObjectToChonkyWithoutFolders(result, globalList)
        return globalList
    }

    static async getScriptfilesChonkyWithoutFolders(username: any): Promise<any> {
        const userpath = await this.getDir(username, "scripts")
        const result = directory_tree(userpath)
        const globalList = []
        this.convertObjectToChonkyWithoutFolders(result, globalList)
        return globalList
    }
    static async convertObjectToDevExtreme(file: directory_tree.DirectoryTree): Promise<any> {
        if(!file) return
        const children = file.children
        const newchildren = []
        if(children){
            children.forEach(async (obj) => {newchildren.push( await this.convertObjectToDevExtreme(obj))})
        }
        const newFile = {
            name: file.name,
            isDirectory: file.type === "directory",
            size: file.size,
            items: newchildren
        }
        return newFile        
    }

    static async convertObjectToChonkyWithoutFolders(file: directory_tree.DirectoryTree, globalList: any): Promise<any> {
        if(!file) return
        const children = file.children
        const newchildren = []
        if(children){
            children.forEach(async (obj) => {newchildren.push(obj.path)})
        }
        const newFile = {
            id: file.path,
            name: file.name,
            isDir: file.type === "directory",
            openable: true,
            children: newchildren
        }
        // Chonky folder not openable. Ignoring
        if(!newFile.isDir){
            globalList.push(newFile)
        }
        if(children){
            children.forEach(async (obj) => {await this.convertObjectToChonkyWithoutFolders(obj, globalList)})
        }
    }
}