export interface User {
    enrollid: number;
    name: string;
    admin: number;
    backupnum: number;
}

export enum UserType {
    FACE = 50,
    CARD = 11,
    UNKNOWN = 0
}