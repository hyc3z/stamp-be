import { Service } from 'typedi'
import { getConnection, Connection } from 'typeorm'
import crypto from 'crypto'
import dateformat from 'dateformat'
import jwt_decode from 'jwt-decode'

@Service()
export class EncriptService {
  static async hashed(password: string): Promise<string> {
    //    https://nodejs.org/api/crypto.html#crypto_class_hash
    const hash = crypto.createHash('sha256')
    hash.update(password)
    //  string length = 64
    return hash.digest('hex')
  }
}
