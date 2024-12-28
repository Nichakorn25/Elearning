import axios from "axios";
// import { DepartmentInterface, MajorInterface } from "../../Interface/IUser"; // Import interfaces
// import { message } from "antd"; // Ant Design message for notifications
import { UserInterface,SignInInterface } from "../../Interface/IUser";
import { AnnouncementInterface } from "../../Interface/Admin";


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

// Get all announcements
async function ListAnnouncements() {
  return axios
    .get(`${apiUrl}/announcements`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Get announcement by ID
async function GetAnnouncementById(id: string) {
  return axios
    .get(`${apiUrl}/announcements/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Create a new announcement
async function CreateAnnouncement(data: AnnouncementInterface) {
  return axios
    .post(`${apiUrl}/announcements`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Update an existing announcement
async function UpdateAnnouncementById(id: string, data: AnnouncementInterface) {
  return axios
    .put(`${apiUrl}/announcements/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Delete an announcement
async function DeleteAnnouncementById(id: string) {
  return axios
    .delete(`${apiUrl}/announcements/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันดึง Departments
async function GetDepartments(){
  return await axios
      .get(`${apiUrl}/departments`, requestOptions) // ปรับ URL ให้ตรงกับที่ API ใช้
      .then((res) => res)
      .catch((e) => e.response);
}

// ฟังก์ชันดึง Majors ตาม Department ID
async function GetMajors(departmentId: string){
  return await axios
  .get(`${apiUrl}/majors/${departmentId}`, requestOptions)

  .then((res) => res)

  .catch((e) => e.response);

}

// Get all users
async function ListUsers() {
  return axios
    .get(`${apiUrl}/users`, requestOptions) // Using axios with the authorization header
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsersByFilters(filters: {
  RoleID: number;
  DepartmentID?: string;
  MajorID?: string;
}) {
  const { RoleID, DepartmentID, MajorID } = filters;
  const params = new URLSearchParams();

  if (RoleID) params.append("RoleID", RoleID.toString());
  if (DepartmentID) params.append("DepartmentID", DepartmentID);
  if (MajorID) params.append("MajorID", MajorID);

  const response = await axios
    .get(`${apiUrl}/users`, {
      params, // ส่งค่าพารามิเตอร์ไปใน URL
    })
    .then((res) => res)
    .catch((err) => err.response);

  return response;
}

// ฟังก์ชันดึงข้อมูลอาจารย์ตามเงื่อนไข
async function GetProfessorsByFilters(filters: {
  RoleID: number;
  DepartmentID?: string;
  MajorID?: string;
  SearchQuery?: string;
}) {
  const params = new URLSearchParams();

  // ส่งพารามิเตอร์
  if (filters.RoleID) params.append("RoleID", filters.RoleID.toString());
  if (filters.DepartmentID) params.append("DepartmentID", filters.DepartmentID);
  if (filters.MajorID) params.append("MajorID", filters.MajorID);
  if (filters.SearchQuery) params.append("SearchQuery", filters.SearchQuery);

  try {
    // เรียก API
    const response = await axios.get(`${apiUrl}/professors`, {
      ...requestOptions,
      params,
    });

    return response;
  } catch (error: any) {
    console.error("Error fetching professors:", error.response?.data || error.message);
    return error.response;
  }
}



async function SignIn(data: SignInInterface) {

  return await axios

    .post(`${apiUrl}/signin`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//SignUp
async function CreateUser(data: UserInterface) {

  return await axios

    .post(`${apiUrl}/signup`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function ResetPassword( data: UserInterface) {

  return await axios

    .put(`${apiUrl}/ResetPasswordUser`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetUserById(id: string) {

  return await axios

    .get(`${apiUrl}/users/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
async function DeleteUserByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE"
  };

  let res = await fetch(`${apiUrl}/users/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}
// update user
async function UpdateUserByid(id: string, data: UserInterface) {

  return await axios

    .put(`${apiUrl}/users/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//ไม่ได้ใช้
async function UpdateUser(data: UserInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  
  let res = await fetch(`${apiUrl}/users`, requestOptions)
  .then((res) => {
  if (res.status == 200) {
    return res.json();
  } else {
    return false;
  }
});

return res;
}


export{
  GetDepartments,
  GetMajors,
  ListAnnouncements,
  GetAnnouncementById,
  CreateAnnouncement,
  UpdateAnnouncementById,
  DeleteAnnouncementById,
  ListUsers,
  GetUsersByFilters,
  GetProfessorsByFilters,
  SignIn,
  CreateUser,
  ResetPassword,
  GetUserById,
  DeleteUserByID,
  UpdateUser,
  UpdateUserByid

};
