import {JwtPayload} from 'jwt-decode'

export type Cunei = {
  id: number,
  unicode: string,
  phonetic: string,
  description: string | null
}

export interface JWT extends JwtPayload {
  admin: number,
  email: string,
  name: string,
  uid: string
}

export type User = {
  admin: boolean,
  email: string,
  name: string,
  uid: string
}