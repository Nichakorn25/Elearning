import dayjs from 'dayjs';

export interface AnnouncementInterface {
  id?: number; // Optional for creating a new announcement
  title?: string;
  content?: string;
  announce_date?: string | null;  // ใช้ Moment หรือ string หรือ null
  user_id?: number | null;
}

export interface ChangeRoleInterface {
  ID?: number;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  department: string;
  major: string;
  reason: string;
  idCard: File | null;
  status?: string;
  userID?: number;
}


export interface RoleRequest {
  status: string; // e.g., "Pending", "Approved", "Rejected"
}

export interface RoleIDInterface{
  role_id: number; 
}

export interface CourseFormValues {
  CourseName: string;
  CourseCode: string;
  Credit: number;
  Description: string;
  CategoryID: string; // Assuming CategoryID is a string
  SemesterID: string; // Assuming SemesterID is a string
  ExamDate: dayjs.Dayjs ;
  StartTime: dayjs.Dayjs ;
  EndTime: dayjs.Dayjs ;
}