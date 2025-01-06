export interface UserInterface{
    ID?: number;
    Username?: string;
    Password?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    DepartmentID?: number;
    departmentname?: string;
    MajorID?: number;
    majorname?: string;
    Phone?: string;
    RoleID?: number;
    rolename?: string;
    Status?: string;
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
    ID?: number;
    RoleName?: string;
}

export interface SignInInterface{
    Username?: string;
    Password?: string;
}