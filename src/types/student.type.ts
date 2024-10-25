import { TMeta } from "./global.type";

export type TStudent = {

}

export type TStudentsResponse = {
    data: TStudent[];
    meta: TMeta;
}

export type TSingleStudent = TStudent & {
    
}