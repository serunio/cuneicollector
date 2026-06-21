import { JwtPayload } from 'jwt-decode'

export type Cunei = {
  id: number,
  unicode: string,
  phonetic: string,
  description: string | null,
  chosen: number,
  user_count: number,
  total_count: number
}

export interface JWT extends JwtPayload {
  admin: boolean,
  email: string,
  name: string,
  uid: string
}

export type User = {
  admin: boolean,
  email: string,
  name: string,
  uid: string,
  token: string
}