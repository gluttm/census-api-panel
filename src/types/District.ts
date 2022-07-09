import { Census } from "./Census";

export type District = {
    id?: number;
    name: string;
    censuses?: Census[]
}

export type DistrictDeleteResponse = {
    msg: string,
    httpStatus: string
}
