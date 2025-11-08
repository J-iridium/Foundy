import type { Role } from "$types/db";

export interface SessionUser {
    userId : string,
    userName : string,
    companyId : string,
    role : Role
};