export interface UserInterface {
    ID?: number;
    Username?: string;
    Password?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    DepartmentID?: number;
    Department?: DepartmentInterface; // ใช้ object ของ DepartmentInterface
    MajorID?: number;
    Major?: MajorInterface; // ใช้ object ของ MajorInterface
    Phone?: string;
    RoleID?: number;
    Role?: RoleInterface; // ใช้ object ของ RoleInterface
    Status?: string;
    ProfilePicture?: string;
  }
  
  export interface DepartmentInterface {
    ID?: number;
    DepartmentName?: string;
  }
  
  export interface MajorInterface {
    ID?: number;
    MajorName?: string;
    Department?: DepartmentInterface;
  }
  
  export interface RoleInterface {
    ID?: number;
    RoleName?: string;
  }
  

export interface SignInInterface{
    Username?: string;
    Password?: string;
}