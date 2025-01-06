import axios from "axios";
// import { DepartmentInterface, MajorInterface } from "../../Interface/IUser"; // Import interfaces
// import { message } from "antd"; // Ant Design message for notifications
import { UserInterface,SignInInterface } from "../../Interface/IUser";
import { AnnouncementInterface, ChangeRoleInterface } from "../../Interface/Admin";
import {TeacherAppointmentInterface , StudentBookingInterface} from "../../Interface/IAppointment";


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

//ไม่ใช้
// async function GetUsersByFilters(filters: {
//   RoleID: number;
//   DepartmentID?: string;
//   MajorID?: string;
// }) {
//   const { RoleID, DepartmentID, MajorID } = filters;
//   const params = new URLSearchParams();

//   if (RoleID) params.append("RoleID", RoleID.toString());
//   if (DepartmentID) params.append("DepartmentID", DepartmentID);
//   if (MajorID) params.append("MajorID", MajorID);

//   const response = await axios
//     .get(`${apiUrl}/users`, {
//       params, // ส่งค่าพารามิเตอร์ไปใน URL
//     })
//     .then((res) => res)
//     .catch((err) => err.response);

//   return response;
// }
// ค้นหาอาจารย์จากคำค้นหา
async function SearchProfessors(searchQuery: string) {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };

  return axios
    .get(`${apiUrl}/searchProfessors?filter=${searchQuery}`, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error searching professors:", err);
      throw err;
    });
}

//Filters
async function ListUsersFilters(departmentId: string, majorId: string, roleId: string) {
  return await axios
    .get(`${apiUrl}/users/filter?departmentId=${departmentId}&majorId=${majorId}&roleId=${roleId}`, requestOptions)///filter?departmentId=4&majorId=16&roleId=2
    .then((res) => res)
    .catch((e) => {
      console.error("Error fetching users:", e.response?.data || e.message);
      throw e;
    });
}
async function SaveAvailability(data: {
  day: string;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
}) {
  return axios
    .post(`${apiUrl}/availabilities`, data, requestOptions)
    .then((res) => res)
    .catch((e) => {
      console.error("Error saving availability:", e.response?.data || e.message);
      throw e;
    });
}

async function SaveAppointment(data: TeacherAppointmentInterface) {
  return axios
    .post(`${apiUrl}/appointments`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงข้อมูล Appointment ตาม UserID ของอาจารย์
async function GetTeacherAppointments(teacherId: string) {
  return axios
    .get<TeacherAppointmentInterface[]>(
      `${apiUrl}/teacher/appointments/${teacherId}`,
      requestOptions
    )
    .then((res) => res)
    .catch((e) => e.response);
}

async function BookAppointment(data: StudentBookingInterface) {
  return axios
    .post(`${apiUrl}/appointments/book`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


// Save Appointment
// async function SaveAppointment(
//   title: string,
//   duration: string,
//   buffer_time: number,
//   max_bookings: number,
//   location: string,
//   description: string,
//   days_availability: Array<{ day: string; start: string | null; end: string | null; unavailable: boolean }>,
//   user_id: number,
//   data: any = {} // Default value
// ) {
//   const appointmentData = {
//     title,
//     duration,
//     buffer_time,
//     max_bookings,
//     location,
//     description,
//     days_availability,
//     user_id,
//     ...data // Merge additional data if provided
//   };

//   return await axios
//     .post(`${apiUrl}/appointments`, appointmentData, requestOptions)
//     .then((res) => res.data)
//     .catch((e) => {
//       console.error("Error saving appointment:", e.response?.data || e.message);
//       throw e;
//     });
// }



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

async function DeleteUserByID(id: string | undefined) {
  if (!id) return false; // Handle case when ID is undefined

  return axios
    .delete(`${apiUrl}/users/${id}`, requestOptions)
    .then((res) => res.status === 200)
    .catch((e) => {
      console.error("Error deleting user:", e.response?.data || e.message);
      return false;
    });
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

async function CreateRoleChangeRequests(data: ChangeRoleInterface) {

  return await axios

    .post(`${apiUrl}/requestchangeroles`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetRoleChangeRequests() {
  return axios
    .get(`${apiUrl}/requestchangeroles`, requestOptions) // Using axios with the authorization header
    .then((res) => res)
    .catch((e) => e.response);
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
  CreateRoleChangeRequests,
  GetRoleChangeRequests,
  // GetUsersByFilters,
  SignIn,
  CreateUser,
  ResetPassword,
  GetUserById,
  DeleteUserByID,
  UpdateUser,
  UpdateUserByid,
  ListUsersFilters,
  SearchProfessors,
  SaveAppointment,
  SaveAvailability,
  GetTeacherAppointments,
  BookAppointment,
};
