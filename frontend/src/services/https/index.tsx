import axios from "axios";
// import { DepartmentInterface, MajorInterface } from "../../Interface/IUser"; // Import interfaces
// import { message } from "antd"; // Ant Design message for notifications
import { UserInterface,SignInInterface } from "../../Interface/IUser";
import { AnnouncementInterface, RoleIDInterface, RoleRequest } from "../../Interface/Admin";
import { CourseInterface, SemesterInterface, StudyTimeInterface, LessonInterface, CoursePictureInterface} from "../../Interface/ICourse";
import {TeacherAppointmentInterface , StudentBookingInterface} from "../../Interface/IAppointment";
import { SellerInterface } from "../../Interface/Seller";
import { CartItemInterface } from "../../Interface/CartItem";
import { CartInterface } from "../../Interface/Cart";
import { ReviewInterface } from "../../Interface/Review";
import { PaymentMethodInterface } from "../../Interface/PaymentMethod";
import { PaymentInterface } from "../../Interface/Payment";
import { PurchaseInterface } from "../../Interface/Purchase";
import {AssignmentInterface, SubmissionInterface, GradeInterface} from "../../Interface/Assignment"
import { TestInterface } from "../../Interface/Test";

const apiUrl = "https://api.se-elearning.online"; // URL ของ API
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

// Get all users
async function ListUsers() {
  return axios
    .get(`${apiUrl}/users`, requestOptions) // Using axios with the authorization header
    .then((res) => res)
    .catch((e) => e.response);
}
//ไม่ใช้
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
async function UpdateUserByid(id: string, data: FormData) {
  const requestOptions = {
    headers: {
      "Content-Type": "multipart/form-data", // เปลี่ยน Content-Type เป็น multipart/form-data
      Authorization: `${Bearer} ${Authorization}`,
    },
  };

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

async function GetCourseByUserId(id: string) {

  return await axios

    .get(`${apiUrl}/createcourse/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetCategoryById(id: string) {

  return await axios

    .get(`${apiUrl}/createcourse/category/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetCategoryss() {

  return await axios

    .get(`${apiUrl}/category`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetCategory() {

  return await axios

    .get(`${apiUrl}/createcourse/category`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateSemester(data: SemesterInterface) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios
    .post(`${apiUrl}/createcourse/semester`, data, requestOptions) // ส่ง data เป็น body ของคำขอ
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetSemesterID() {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };
  return await axios
    .get(`${apiUrl}/createcourse/GetSemesterID`, requestOptions) 
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetCourseByDESC() {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };
  return await axios
    .get(`${apiUrl}/createcourse/getcoures`, requestOptions) 
    .then((res) => res)
    .catch((e) => e.response);
}


async function CreateCourse(data: CourseInterface) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios
    .post(`${apiUrl}/createcourse/course`, data, requestOptions) // ส่ง data เป็น body ของคำขอ
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateStudyTime(data: StudyTimeInterface) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios
    .post(`${apiUrl}/createcourse/studytime`, data, requestOptions) // ส่ง data เป็น body ของคำขอ
    
    .then((res) => res)
    .catch((e) => e.response);
}


async function  GetCoursesByID(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateLesson(data: LessonInterface) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios
    .post(`${apiUrl}/managecourse/lesson`, data, requestOptions) // ส่ง data เป็น body ของคำขอ
    
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateContent(data: LessonInterface) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios
    .post(`${apiUrl}/managecourse/content`, data, requestOptions) // ส่ง data เป็น body ของคำขอ
    
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateVideo(data: LessonInterface) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios
    .post(`${apiUrl}/managecourse/video`, data, requestOptions) // ส่ง data เป็น body ของคำขอ
    
    .then((res) => res)
    .catch((e) => e.response);
}

async function  GetLessonByCourseID(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/lesson/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateMaterial(data: FormData) {
  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  };

  try {
    const res = await axios.post(`${apiUrl}/managecourse/material`, data, requestOptions);
    return res; // ส่งคืนข้อมูลที่ได้จากการตอบกลับ
  } catch (e: unknown) {
    // ตรวจสอบว่า e เป็น AxiosError หรือไม่
    if (axios.isAxiosError(e)) {
      console.error('Error creating material:', e.response?.data || e.message);
      return e.response;
    } else {
      // ถ้าไม่ใช่ AxiosError
      console.error('Unexpected error:', e);
      return { error: 'Unexpected error occurred' };
    }
  }
}




async function  GetCourseContent(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/content/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function UploadPicture(data: CoursePictureInterface) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios
    .post(`${apiUrl}/createcourse/picture`, data, requestOptions) // ส่ง data เป็น body ของคำขอ
    
    .then((res) => res)
    .catch((e) => e.response);
}

async function  GetPicture() {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/createcourse/picture`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  GetAllCourse() {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/course`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function  DeleteAllaboutCoures(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .delete(`${apiUrl}/managecourse/delete/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function UpdateCourse(id: string, courseData: object) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(courseData),
  };

  return await fetch(`${apiUrl}/managecourse/edit/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

async function UpdateCourseExam(id: string, courseData: object) {
  return axios
    .put(`${apiUrl}/managecourse/editexam/${id}`, courseData, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


async function  GetCourseUrl(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/url/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  GetCourseMaterial(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/material/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  DeleteCouresContent(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .delete(`${apiUrl}/managecourse/delete/content/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  DeleteCouresVideo(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .delete(`${apiUrl}/managecourse/delete/url/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  DeleteCouresMaterial(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .delete(`${apiUrl}/managecourse/delete/material/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function  DeleteLesson(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .delete(`${apiUrl}/managecourse/delete/lesson/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  GetCourseStudyTime(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/studytime/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function UpdateStatusContent(id: string, status: string) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({status}),
  };

  return await fetch(`${apiUrl}/managecourse/updateStatus/content/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

async function UpdateStatusMaterial(id: string, status: string) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({status}),
  };

  return await fetch(`${apiUrl}/managecourse/updateStatus/material/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

async function UpdateStatusUrl(id: string, status: string) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({status}),
  };

  return await fetch(`${apiUrl}/managecourse/updateStatus/url/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

async function UpdateStatusCourse(id: string, status: string) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({status}),
  };

  return await fetch(`${apiUrl}/createcourse/updateStatus/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

//----------------------------------------Appointment----------------------------------------
//ดึงstudentbookingใส่notification ไม่ได้ใช้
async function ListStudentBooking(userID: string) {
  return axios
    .get(`${apiUrl}/student/bookings?userID=${userID}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// get message by id ใช้อันนี้
async function GetMessageById(id: string) {

  return await axios

    .get(`${apiUrl}/message/${id}`, requestOptions)

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

async function GetSemesters() {
  return await axios
    .get(`${apiUrl}/createcourse/GetSemester`, requestOptions) // Replace with actual API endpoint for semesters
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetDayOfWeek() {
  return await axios
    .get(`${apiUrl}/createcourse/dayofweek`, requestOptions) // Replace with actual API endpoint for day of week
    .then((res) => res)
    .catch((e) => e.response);
}

//ดึงอาจารย์ตามคณะและสาขา
async function ListUsersFilters(departmentId: string, majorId: string, roleId: string) {
  return await axios
    .get(`${apiUrl}/users/filter?departmentId=${departmentId}&majorId=${majorId}&roleId=${roleId}`, requestOptions)///filter?departmentId=4&majorId=16&roleId=2
    .then((res) => res)
    .catch((e) => {
      console.error("Error fetching users:", e.response?.data || e.message);
      throw e;
    });
}

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

async function SaveAppointment(data: TeacherAppointmentInterface) {
  return axios
    .post(`${apiUrl}/appointments`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//ไม่ได้ใช้
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

// ดึงข้อมูล Appointment ตาม UserID ของอาจารย์
async function GetTeacherAppointments(userId: string) {
  return axios
    .get<TeacherAppointmentInterface[]>(
      `${apiUrl}/teacher/appointments/${userId}`,
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

// ดึงวัน ในแต่ละสัปดาห์
async function GetDay() {

  return await axios

    .get(`${apiUrl}/day`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//จองนัดหมาย
async function CreateStudentBooking(data: StudentBookingInterface) {
  return axios
    .post(`${apiUrl}/CreateStudentBooking`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteTeacherAppointmentByID(id: number) {
  return axios
    .delete(`${apiUrl}/teacher-appointments/${id}`, requestOptions)
    .then((response) => response)
    .catch((error) => {
      console.error("Error deleting appointment:", error.response?.data || error.message);
      throw error;
    });
}

async function GetStudentBookingsByID(studentId: string) {
  try {
    const response = await axios.get(`${apiUrl}/bookings/student/${studentId}`, requestOptions);
    return response.data; // คืนค่าเฉพาะ data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching student bookings:", error.response?.data || error.message);
      throw error; // ส่งต่อข้อผิดพลาดให้ผู้เรียกใช้จัดการ
    }
    throw error;
  }
}

async function DeleteStudentBookingByID(bookingId: number) {
  return axios
    .delete(`${apiUrl}/student/bookings/${bookingId}`  , requestOptions)
    .then((res) => res)
    .catch((e) => {
      console.error("Error deleting booking:", e.response?.data || e.message);
      throw e;
    });
}

async function CreateTask(task: { 
  userID: number;
  title: string;
  date: string;
  time: string;
  description: string;
}) {
  return axios
    .post(`${apiUrl}/tasks`, task, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function GetTasksByUserID(userId: number) {
  return axios
    .get(`${apiUrl}/tasks/${userId}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function DeleteTaskByID(taskId: number) {
  return axios
    .delete(`${apiUrl}/tasks/${taskId}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}


async function CreateRoleChangeRequests(data: FormData) {
  const requestOptions = {
    headers: {
      "Content-Type": "multipart/form-data", // เปลี่ยน Content-Type เป็น multipart/form-data
      Authorization: `${Bearer} ${Authorization}`,
    },
  };

  return await axios

    .post(`${apiUrl}/requestchangeroles`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


//---------------------------------Class Schedule------------------------------------------
// ค้นหาคอร์สจากคำค้นหาและเทอม
// async function SearchCourses(semester: string, searchTerm: string) {
//   const Authorization = localStorage.getItem("token");
//   const Bearer = localStorage.getItem("token_type");

//   const requestOptions = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `${Bearer} ${Authorization}`,
//     },
//   };

//   const url = `${apiUrl}/searchCourses?semester=${semester}&filter=${encodeURIComponent(
//     searchTerm
//   )}`;

//   console.log("Sending request to:", url); // Debug URL

//   return axios
//     .get(url, requestOptions)
//     .then((res) => res.data)
//     .catch((err) => {
//       console.error("Error during API request:", err.response || err.message);
//       throw err;
//     });
// }

async function SearchCourses(termId: string, searchTerm: string) {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };

  // ปรับ URL ให้เรียกตาม termId (เช่น /courses/search/:id)
  const url = `${apiUrl}/courses/search/${termId}?filter=${encodeURIComponent(
    searchTerm
  )}`;

  console.log("Sending request to:", url); // Debug URL

  return axios
    .get(url, requestOptions)
    .then((res) => {
      console.log("Received data:", res.data); // Debug response
      return res.data; // Return response data
    })
    .catch((err) => {
      console.error("Error during API request:", err.response || err.message);
      throw err;
    });
}


// ดึง StudyTime ตาม CourseID
async function GetStudyTimeByCourseId(courseId: number) {
  return axios
    .get(`${apiUrl}/courses/${courseId}/studytime`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// ดึง ExamSchedule ตาม CourseID
async function GetExamScheduleByCourseId(courseId: number) {
  return axios
    .get(`${apiUrl}/courses/${courseId}/examschedule`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// เพิ่มคอร์สไปยังตารางเรียน
async function AddCourseToSchedule(data: { courseId: number; userId: number }) {
  return axios
    .post(`${apiUrl}/classschedule`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// ลบคอร์สออกจากตารางเรียน
async function RemoveCourseFromSchedule(scheduleId: number) {
  return axios
    .delete(`${apiUrl}/classschedule/${scheduleId}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// ค้นหา Courses พร้อม StudyTime และ ExamSchedule
async function SearchCoursesWithDetails(semester: string, searchTerm: string) {
  const url = `${apiUrl}/searchCoursesWithDetails?semester=${semester}&filter=${encodeURIComponent(searchTerm)}`;
  return axios
    .get(url, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error during API request:", err.response || err.message);
      throw err;
    });
}

//test
// ดึงข้อมูล ClassSchedule พร้อมความสัมพันธ์ (เช่น DayOfWeek, Course, StudyTime, ExamSchedule)
async function GetClassScheduleById(userId: any) {
  const url = `${apiUrl}/classschedule/${userId}`;
  return axios
    .get(url, requestOptions)
    .then((res) => res.data) // รับข้อมูลสำเร็จจาก API
    .catch((err) => {
      console.error("Error during API request:", err.response || err.message);
      throw err; 
    });
}

async function AddClassSchedule(classScheduleData: any) {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };

  const url = `${apiUrl}/classschedule`;
  return axios
    .post(url, classScheduleData, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error during API request:", err.response || err.message);
      throw err;
    });
}

// ฟังก์ชันลบข้อมูลใน ClassSchedule โดยใช้ CourseID
async function RemoveClassScheduleByCourseID(courseID: any) {
  const url = `${apiUrl}/classschedule/course/${courseID}`;
  return axios
    .delete(url, requestOptions)
    .then((res) => res.data) // รับข้อมูลสำเร็จจาก API
    .catch((err) => {
      console.error("Error during API request (Remove):", err.response || err.message);
      throw err; // ขว้างข้อผิดพลาดออกไปให้จัดการต่อในที่เรียกใช้งาน
    });
}

//test


async function GetRoleChangeRequests() {
  return axios
    .get(`${apiUrl}/requestchangeroles`, requestOptions) // Using axios with the authorization header
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateRoleChangeRequestsById(id: string, data: RoleRequest) {
  return axios
    .patch(`${apiUrl}/requestchangeroles/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateUserRoleByID(userID: number, data: RoleIDInterface) {
  return axios
    .patch(`${apiUrl}/users/role/${userID}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTransactionLog() {
  return axios
    .get(`${apiUrl}/transactionlogs`, requestOptions)
    .then((res) => res) 
    .catch((e) => e.response);
}

async function UpdateTransactionLog(id: string, statusID: number) {
  return axios
    .patch(`${apiUrl}/transactionlogs/${id}`, { StatusID: statusID }, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}
async function ListSellers() {
  return axios
    .get(`${apiUrl}/sellers`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Get seller by ID
async function GetSellerById(id: string) {
  return axios
    .get(`${apiUrl}/sellers/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Create a new seller
async function CreateSeller(data: SellerInterface) {
  return axios
    .post(`${apiUrl}/sellers`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response); 
}

// Update an existing seller
async function UpdateSellerById(id: string, data: SellerInterface) {
  return axios
    .put(`${apiUrl}/sellers/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Delete a seller
async function DeleteSellerById(id: string) {
  return axios
    .delete(`${apiUrl}/sellers/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CheckUserExistsInSeller(userId: string) {
  try {
    const response = await axios.get(`${apiUrl}/sellers/user/${userId}/exists`, requestOptions);

    // ตรวจสอบผลลัพธ์จาก API
    if (response.data.status === "success") {
      return {
        exists: true,
        message: response.data.message,
        sellerId: response.data.sellerId, // ดึง sellerId จาก API
      };
    } else if (response.data.status === "fail") {
      return { exists: false, message: response.data.message };
    } else {
      return { exists: false, message: "Unexpected response from server" };
    }
  } catch (error: any) {
    // กรณีเกิดข้อผิดพลาด
    return { exists: false, message: "Error connecting to server" };
  }
}

async function ListBanks() {
  return axios
    .get(`${apiUrl}/banks`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetBanksById(id: string) {
  return axios
    .get(`${apiUrl}/banks/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
// Get all Sheets
export async function ListSheets() {
  try {
    const response = await axios.get(`${apiUrl}/sheets`, requestOptions);
    return response.data; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error fetching sheets:", error);
    return error.response;
  }
}
export async function ListSheetsBySellerId(sellerID: number) {
  try {
    const response = await axios.get(
      `${apiUrl}/sheets/seller/${sellerID}`,
      requestOptions
    );
    return response.data; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error fetching sheets by sellerID:", error);
    return error.response;
  }
}
// Get Sheet by ID
export async function GetSheetByID(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/sheets/${id}`, requestOptions);
    return response.data; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error fetching sheet by ID:", error);
    return error.response;
  }
} 
export async function CreateSheet(data: FormData) {
  try {
    const response = await axios.post(`${apiUrl}/sheets`, data, {
      headers: {
        'Content-Type': 'multipart/form-data', // ไม่จำเป็นต้องเพิ่ม แต่เพิ่มได้เพื่อความชัดเจน
        Authorization: `Bearer ${localStorage.getItem('token')}`, // เพิ่ม Token หากจำเป็น
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาด');
    }
    console.error('Unexpected Error:', error);
    throw new Error('เกิดข้อผิดพลาดที่ไม่คาดคิด');
  }
}
// Update an existing Sheet by ID
export async function UpdateSheet(id: string, data: FormData) {
  try {
    const response = await axios.put(`${apiUrl}/sheets/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data', // ระบุ Content-Type
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response;
  } catch (error: any) {
    console.error("Error updating sheet:", error);
    return error.response; // ส่งข้อผิดพลาดกลับมา
  }
}

// Delete a Sheet by ID
export async function DeleteSheet(id: string) {
  try {
    const response = await axios.delete(`${apiUrl}/sheets/${id}`, requestOptions);
    return response; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error deleting sheet:", error);
    return error.response;
  }
}

async function ListCarts(_p0: { userId: number; }) {
  return axios
    .get(`${apiUrl}/carts`, requestOptions)
    .then((res) => res.data) // Return response data only
    .catch((e) => e.response);
}

// Get cart by ID
async function GetCartById(id: string) {
  return axios
    .get(`${apiUrl}/carts/${id}`, requestOptions)
    .then((res) => res.data) // Return response data only
    .catch((e) => e.response);
}

// Create a new cart
async function CreateCart(data: CartInterface) {
  return axios
    .post(`${apiUrl}/carts`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Update an existing cart by ID
async function UpdateCartById(id: string, data: CartInterface) {
  return axios
    .put(`${apiUrl}/carts/${id}`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Delete a cart by ID
async function DeleteCartById(id: string) {
  return axios
    .delete(`${apiUrl}/carts/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Add an item to the cart
async function AddCartItem(data: CartItemInterface) {
  return axios
    .post(`${apiUrl}/cart-items`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Get all items in a cart
async function ListCartItems(id: string) {
  return axios
    .get(`${apiUrl}/cart-items/cart/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}
// Update a cart item by ID
async function UpdateCartItemById(id: string, data: CartItemInterface) {
  return axios
    .put(`${apiUrl}/cart-items/${id}`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}
// Delete a cart item by ID
async function DeleteCartItemById(id: number) {
  return axios
    .delete(`${apiUrl}/cart-items/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Checkout a cart
async function CheckoutCart(data: PaymentInterface): Promise<PurchaseInterface | undefined> {
  return axios
    .post(`${apiUrl}/carts/${data.PurchaseID}/checkout`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error during checkout:", e.response || e);
      return undefined;
    });
}
// Get cart by User ID
async function GetCartByUser(id: string) {
  return axios
    .get(`${apiUrl}/carts/user/${id}`, requestOptions)
    .then((res) => res.data) 
    .catch((e) => e.response);
}
// Create a new review
async function CreateReview(data: ReviewInterface) {
  return axios
    .post(`${apiUrl}/reviews`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Get all reviews
async function ListReviews() {
  return axios
    .get(`${apiUrl}/reviews`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Get a review by ID
async function GetReviewById(id: number) {
  return axios
    .get(`${apiUrl}/reviews/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Update an existing review by ID
async function UpdateReviewById(id: number, data: ReviewInterface) {
  return axios
    .put(`${apiUrl}/reviews/${id}`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Delete a review by ID
async function DeleteReviewById(id: number) {
  return axios
    .delete(`${apiUrl}/reviews/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function GetReviewsBySheetID(sheetId: number) {
  return axios
    .get(`${apiUrl}/reviews/sheet/${sheetId}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Get all payment methods

async function  GetPurchasedFiles(userID: number) {
  return axios
    .get(`${apiUrl}/purchased-files/${userID}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}
async function getIncomeHistoryBySellerID (sellerID: number){
  return axios
    .get(`${apiUrl}/income-history/${sellerID}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
};
async function GetTerm() {
  return axios
    .get(`${apiUrl}/terms`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}
export async function ListCourses() {
  try {
    const response = await axios.get(`${apiUrl}/courses`, requestOptions);
    return response.data.data; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
// Create a new payment method
async function CreatePaymentMethod(data: PaymentMethodInterface) {
  return axios
    .post(`${apiUrl}/payment-methods/`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Update a payment method by ID
async function UpdatePaymentMethodById(id: number, data: PaymentMethodInterface) {
  return axios
    .put(`${apiUrl}/payment-methods/${id}`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// Delete a payment method by ID
async function DeletePaymentMethodById(id: number) {
  return axios
    .delete(`${apiUrl}/payment-methods/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}
const checkSlip = async (formData: FormData) => {
  try {
    const apiKey = "SLIPOKMLVPGG4"; // ใส่ API Key

    const response = await fetch(
      `https://api.slipok.com/api/line/apikey/37121`,
      {
        method: "POST",
        headers: {
          "x-authorization": apiKey,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || "Failed to check slip");
    }

    const data = await response.json();
    console.log("SlipOK Response:", data);
    return data;
  } catch (error) {
    console.error("Error during checkSlip request:", error);
    throw error;
  }
};
async function GetAllPaymentMethods() {
  return axios
    .get(`${apiUrl}/payment-methods/`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function  GetCourseEnrollUserDepartmentSemester(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/dashboard/info/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  GetAllUser() {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/dashboard/user`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function  CreateEnroll(data: object) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .post(`${apiUrl}/dashboard/enroll`,data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetCourseByDepartment(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };
  return await axios
    .get(`${apiUrl}/dashboard/departmentCourse/${id}`, requestOptions) 
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUserInfo(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };
  return await axios
    .get(`${apiUrl}/dashboard/user/${id}`, requestOptions) 
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetEnrollUserID(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };
  return await axios
    .get(`${apiUrl}/dashboard/enrollUser/${id}`, requestOptions) 
    .then((res) => res)
    .catch((e) => e.response);
}



async function  Unenroll(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .delete(`${apiUrl}/dashboard/delete/enroll/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function UpdateContent(id: string, contentData: object) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(contentData),
  };

  return await fetch(`${apiUrl}/managecourse/edit/content/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

async function UpdateUrl(id: string, urlData: object) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(urlData),
  };

  return await fetch(`${apiUrl}/managecourse/edit/url/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

async function UpdateLesson(id: string, urlData: object) {
  // ฟังก์ชันนี้จะใช้ id และ courseData
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(urlData),
  };

  return await fetch(`${apiUrl}/managecourse/edit/lesson/${id}`, requestOptions)
  .then((res) => res)

  .catch((e) => e.response);
}

async function  GetstudyByID(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/studytime/add/${id}`, requestOptions)


    .then((res) => res)

    .catch((e) => e.response);

}

async function GetAssignmentCourseID(courseID: number): Promise<AssignmentInterface[] | any> {
  return axios
    .get(`${apiUrl}/courses/${courseID}/assignments`, requestOptions)
    .then((res) => res) // ส่งกลับเป็น AssignmentInterface[]
    .catch((e) => e.response);
}

async function GetAssignmentByIDAndCourseID(courseID: number, assignmentID: number): Promise<AssignmentInterface | any> {
  return axios
      .get(`${apiUrl}/courses/${courseID}/assignments/${assignmentID}`, requestOptions)
      .then((res) => res) // Assumes response has `data.data`
      .catch((e) => e.response); // Returns the entire response object on error
}

async function CreateAssignment(data: AssignmentInterface) {
  return axios
  .post(`${apiUrl}/assignments`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function UpdateAssignment(id: number, data: AssignmentInterface) {
  return axios
  .put(`${apiUrl}/assignments/${id}`, data, requestOptions) 
  .then((res) => res) 
  .catch((e) => e.response);  
}

async function DeleteAssignment(id: number) {
  return axios
  .delete(`${apiUrl}/assignments/${id}`, requestOptions)  
  .then((res) => res)  
  .catch((e) => e.response);  
}

async function GetSubmission(userID: number, assignmentID: number): Promise<SubmissionInterface | any> {
  return axios
    .get(`${apiUrl}/submissions/${userID}/${assignmentID}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetSubmissionAll(assignmentID: number) {
  return axios
    .get(`${apiUrl}/submissions/assignments/${assignmentID}`, requestOptions)
    .then((res) => res) 
    .catch((e) => e.response);
}

async function CreateSubmission(data: FormData) {
  const requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    };

  return axios
      .post(`${apiUrl}/submissions`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }

async function UpdateSubmission(id: number, data: SubmissionInterface) {
  return axios
  .put(`${apiUrl}/submissions/${id}`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function DeleteSubmission(id: number) {
  return axios
  .delete(`${apiUrl}/submissions/${id}`, requestOptions)
  .then((res: any) => res)
  .catch((e) => e.response);

}

async function GetGradesAll(assignmentID: number) {
  return axios
  .get(`${apiUrl}/grades/assignments/${assignmentID}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetGrade(submissionID: number) {
  return axios
  .get(`${apiUrl}/grades/${submissionID}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function CreateGrade(data: GradeInterface) {
  return axios
  .post(`${apiUrl}/grades`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function UpdateGrade(id: number,data: GradeInterface) {
  return axios
  .put(`${apiUrl}/grades/${id}`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

export async function DeleteFileMateriral(id: string) {
  try {
    const response = await axios.delete(`${apiUrl}/managecourse/delete/file/${id}`, requestOptions);
    return response; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error deleting File:", error);
    return error.response;
  }
}

async function  GetAssignmentByID(id: string) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ถ้าคุณใช้ token
    }
  };

  return await axios

    .get(`${apiUrl}/managecourse/assignment/${id}`, requestOptions)


    .then((res) => res)

    .catch((e) => e.response);

}

async function GetTest(testID: number) {
  return axios
  .get(`${apiUrl}/courses/${testID}/tests`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function CreateTest(data: TestInterface) {
  return axios
  .post(`${apiUrl}/tests`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function UpdateTest(id: number,data: TestInterface) {
  return axios
  .put(`${apiUrl}/tests/${id}`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function DeleteTest(id: number) {
  return axios
  .delete(`${apiUrl}/tests/${id}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetStudentAnswersWithScore(userID: number,testID: number) {
  return axios
  .get(`${apiUrl}/answerstudents/${userID}/${testID}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function CreateAnswerStudent(data: any) {
  return axios
  .post(`${apiUrl}/answerstudents`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}


export{
  ListAnnouncements,
  GetAnnouncementById,
  CreateAnnouncement,
  UpdateAnnouncementById,
  DeleteAnnouncementById,
  ListUsers,
  CreateRoleChangeRequests,
  GetRoleChangeRequests,
  UpdateRoleChangeRequestsById,
  UpdateUserRoleByID,
  GetTransactionLog,
  UpdateTransactionLog,
  GetUsersByFilters,
  SignIn,
  CreateUser,
  ResetPassword,
  GetUserById,
  DeleteUserByID,
  UpdateUser,
  UpdateUserByid,
  GetCoursesByID,
  CreateLesson,
  CreateContent,
  CreateVideo,
  GetLessonByCourseID,
  CreateMaterial,
  GetCourseContent,
  UploadPicture,
  GetPicture,
  GetAllCourse,
  DeleteAllaboutCoures,
  UpdateCourse,
  GetCourseUrl,
  GetCourseMaterial,
  DeleteCouresContent,
  DeleteCouresVideo,
  DeleteCouresMaterial,
  DeleteLesson,
  GetCourseStudyTime,
  UpdateStatusMaterial,
  UpdateStatusContent,
  UpdateStatusUrl,
  UpdateStatusCourse,
  GetCourseByUserId,
  GetCategoryById,
  GetCategoryss,
  GetCategory,
  CreateSemester,
  CreateCourse,
  GetSemesterID,
  CreateStudyTime,
  GetCourseByDESC,
  GetCourseEnrollUserDepartmentSemester,
  GetAllUser,
  CreateEnroll,
  GetCourseByDepartment,
  GetUserInfo,
  UpdateCourseExam,
  GetEnrollUserID,
  Unenroll,
  UpdateContent,
  UpdateUrl,
  UpdateLesson,
  GetstudyByID,
  GetAssignmentByID,

   //Appointment
   ListStudentBooking,
   SearchCourses,
   GetMessageById,
   GetDepartments,
   GetMajors,
   GetSemesters,
   GetDayOfWeek,
   ListUsersFilters,
   SearchProfessors,
   SaveAppointment,
   SaveAvailability,
   GetTeacherAppointments,
   BookAppointment,
   GetDay,
   CreateStudentBooking,
   DeleteTeacherAppointmentByID,
   GetStudentBookingsByID,
   DeleteStudentBookingByID,
   CreateTask,
   GetTasksByUserID,
   DeleteTaskByID,

  //ClassSchedule
  GetStudyTimeByCourseId,
  GetExamScheduleByCourseId,
  AddCourseToSchedule,
  RemoveCourseFromSchedule,
  SearchCoursesWithDetails,
  GetClassScheduleById,
  AddClassSchedule,
  RemoveClassScheduleByCourseID,
  
  //sheet
  DeleteSellerById,
  UpdateSellerById,
  CreateSeller,
  GetSellerById,
  ListSellers,
  CheckUserExistsInSeller,
  ListBanks,
  GetBanksById,
  ListCarts,
  GetCartById,
  CreateCart,
  UpdateCartById,
  DeleteCartById,
  AddCartItem,
  ListCartItems,
  UpdateCartItemById,
  DeleteCartItemById,
  CheckoutCart,
  GetCartByUser,
  DeleteReviewById,
  UpdateReviewById,
  GetReviewById,
  ListReviews,
  CreateReview,
  GetReviewsBySheetID,
  GetPurchasedFiles,
  getIncomeHistoryBySellerID,
  GetTerm,
  //payment
  checkSlip,  
  GetAllPaymentMethods,
  CreatePaymentMethod,
  UpdatePaymentMethodById,
  DeletePaymentMethodById,

  //Assignment
  GetAssignmentCourseID,
  GetAssignmentByIDAndCourseID, 
  CreateAssignment, 
  UpdateAssignment, 
  DeleteAssignment,
  GetSubmission,
  GetSubmissionAll,
  CreateSubmission,
  UpdateSubmission,
  DeleteSubmission,
  GetGradesAll,
  GetGrade,
  CreateGrade,
  UpdateGrade,
  GetTest,
  CreateTest,
  UpdateTest,
  DeleteTest,
  GetStudentAnswersWithScore,
  CreateAnswerStudent
};