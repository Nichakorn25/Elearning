export interface UserInterface{
    id?: number;
    username?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    DepartmentID?: string;
    departmentname?: string;
    MajorID?: string;
    majorname?: string;
    phone?: string;
    RoleID?: string;
    rolename?: string;
}

export interface DepartmentInterface{
    id?: number;
    departmentname?: string;
}

export interface MajorInterface{
    id?: number;
    majorname?: string;
}

export interface RoleInterface{
    id?: number;
    rolename?: string;
}