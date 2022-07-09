import { Permission } from "./Permission";
import { Role } from "./Role"

export type User = {
    id: number,
    firstName: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    passwordConfirm?: string,
    gender: string,
    roles?: Role[],
    rolesIds?: number[]
}

export type UserPage = {
    content: User[];
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export type Auth = {
    isLogged: boolean;
    accessToken: string;
    authorities?: string[]
};

export const initialUserDataPage: UserPage = {
    last: true,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    numberOfElements: 0,
    empty: true,
    content: [{
        id: 1,
        firstName: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        roles: [
            {
                id: 1,
                name: "",
                displayName: "",
                permissions: []
            }
        ]
    }]
}

export type UserDeleteResponse = {
    msg: string,
    httpStatus: string
}

export type Login = {
    username: string,
    password: string
}

export type Authority = {
    authority: string
}

type RoleWithAuthorities = {
    id: number,
    name: string,
    displayName: string,
    permissions: Permission[],
    grantedAuthorities: Authority[]
}

type UserRoleWithAuthorities = {
    id: number,
    firstName: string,
    lastname: string,
    username: string,
    email: string,
    gender: string,
    roles: RoleWithAuthorities
}

export type LoginResponse = {
    accessToken: string,
    userData: UserRoleWithAuthorities
}
