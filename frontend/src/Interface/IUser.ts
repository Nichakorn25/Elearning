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
    ID?: number;
    DepartmentName?: string;
}

export interface MajorInterface{
    ID?: number;
    MajorName?: string;

    Department?: DepartmentInterface;
}

export interface RoleInterface{
    id?: number;
    rolename?: string;
}