import axios from "axios";
import { DepartmentInterface, MajorInterface } from "../../Interface/IUser"; // Import interfaces

const apiUrl = "http://localhost:8000"; // URL ของ API
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

// การตั้งค่า Header สำหรับ Authorization
const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

// ฟังก์ชันดึง Departments
export async function GetDepartments(): Promise<DepartmentInterface[]> {
  return await axios
    .get(`${apiUrl}/departments`, requestOptions)
    .then((res) => res.data as DepartmentInterface[]) // Return ข้อมูลในรูปแบบ DepartmentInterface[]
    .catch((e) => {
      console.error("Error fetching departments:", e);
      return [];
    });
}

// ฟังก์ชันดึง Majors ตาม Department ID
export async function GetMajors(
  departmentId: string
): Promise<MajorInterface[]> {
  return await axios
    .get(`${apiUrl}/majors?departmentId=${departmentId}`, requestOptions)
    .then((res) => res.data as MajorInterface[]) // Return ข้อมูลในรูปแบบ MajorInterface[]
    .catch((e) => {
      console.error("Error fetching majors:", e);
      return [];
    });
}
