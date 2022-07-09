import { Permission } from "./Permission";


export type Role = {
    id: number;
    name: string;
    displayName: string;
    permissions?: Permission[];
}


export type RolePage = {
    content: Role[];
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export const initialRolePageData: RolePage = {
    last: true,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    numberOfElements: 0,
    empty: true,
    content: [{
        "id": 1,
        "name": "",
        "displayName": "",
        "permissions": [
            {
                "id": 1,
                "name": "",
                "displayName": ""
            }
        ]
    }]
}

export type RoleDeleteResponse = {
    msg: string,
    httpStatus: string
}
