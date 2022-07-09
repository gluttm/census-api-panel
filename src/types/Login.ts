import { Authority } from "./User"

export type Login = {
    username: string,
    password: string
}


export type JwtToken = {
    sub: string,
    authorities: Authority[],
    iat: number,
    exp: number
}