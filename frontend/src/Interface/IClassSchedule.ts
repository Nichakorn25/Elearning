import { UserInterface } from "./IUser";
import { DayInterface } from "./IAppointment";

// Interface สำหรับข้อมูลตารางสอบ (ExamSchedule)
export interface ExamScheduleInterface {
  ID: number;
  ExamDate: string; // วันที่สอบ เช่น "2025-01-20"
  StartTime: string; // เวลาที่เริ่มสอบ เช่น "13:00"
  EndTime: string; // เวลาที่สิ้นสุดการสอบ เช่น "15:00"
  Location: string; // สถานที่สอบ เช่น "ห้อง B1201"
  CourseID: number;
}

// Interface สำหรับข้อมูลวิชา (Course)
export interface CourseInterface {
  StudyTimes: StudyTimeInterface[];
  ID: number;
  CourseName: string;
  Credit: number;
  Description: string;
  CourseDate: string; // เช่น "2025-01-01"
  CategoryID: number; // ID ของหมวดหมู่
  UserID: number; // ID ของผู้สอน
  SemesterID: number; // ID ของภาคการศึกษา
  DayofWeekID: number; // ID ของวันในสัปดาห์

  // เพิ่มฟิลด์ที่เกี่ยวข้องกับเวลาเรียน
  Day: string;
  StartTime: string;
  EndTime: string;

  // ความสัมพันธ์กับข้อมูลอื่น
  Category?: CategoryInterface;
  User?: UserInterface;
  Semester?: SemesterInterface;
  DayofWeek?: DayInterface;
  ExamSchedules?: ExamScheduleInterface[]; // ตารางสอบของวิชา
}

// Interface สำหรับข้อมูลเวลาเรียน (StudyTime)
export interface StudyTimeInterface {
  ID: number;
  StudyDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";  // วันที่เรียน เช่น "จันทร์", "อังคาร"
  StudyTimeStart: string; // เวลาที่เริ่มเรียน เช่น "08:00"
  StudyTimeEnd: string; // เวลาที่สิ้นสุดการเรียน เช่น "10:00"
  CourseID: number;
}

// Interface สำหรับข้อมูลเวลาสอบ (ExamSchedule)
export interface ExamScheduleInterface {
  ID: number;
  ExamDate: string; // วันที่สอบ เช่น "2025-01-20"
  StartTime: string; // เวลาที่เริ่มสอบ เช่น "13:00"
  EndTime: string; // เวลาที่สิ้นสุดการสอบ เช่น "15:00"
  CourseID: number;
}

// Interface สำหรับข้อมูลหมวดหมู่ของวิชา
export interface CategoryInterface {
  ID: number;
  CategoryName: string;
}

// Interface สำหรับข้อมูลภาคการศึกษา
export interface SemesterInterface {
  ID: number;
  SemesterName: string; // เช่น "ภาคการศึกษาที่ 1"
  AcademicYear: number; // เช่น "2567"
}

// Interface สำหรับข้อมูลวันในหนึ่งสัปดาห์
//   export interface DayInterface {
//     ID: number;
//     DayName: string; // เช่น "จันทร์", "อังคาร"
//   }

// Interface สำหรับข้อมูลผู้ใช้งาน (ผู้สอน)
//   export interface UserInterface {
//     ID: number;
//     Username: string;
//     FirstName: string;
//     LastName: string;
//     Phone?: string;
//     Email: string;
//   }
