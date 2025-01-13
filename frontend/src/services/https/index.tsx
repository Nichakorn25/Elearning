import axios from "axios";
// import { DepartmentInterface, MajorInterface } from "../../Interface/IUser"; // Import interfaces
// import { message } from "antd"; // Ant Design message for notifications
import { UserInterface,SignInInterface } from "../../Interface/IUser";
import { AnnouncementInterface, ChangeRoleInterface, RoleIDInterface, RoleRequest } from "../../Interface/Admin";
import {TeacherAppointmentInterface , StudentBookingInterface} from "../../Interface/IAppointment";
import { ReviewInterface } from "../../Interface/Review";
import { PurchaseInterface } from "../../Interface/Purchase";
import { PaymentInterface } from "../../Interface/Payment";
import { CartItemInterface } from "../../Interface/CartItem";
import { CartInterface } from "../../Interface/Cart";
import { SellerInterface } from "../../Interface/Seller";


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

async function GetCategories() {
  return await axios
    .get(`${apiUrl}/categories`, requestOptions) // Replace with actual API endpoint for categories
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetSemesters() {
  return await axios
    .get(`${apiUrl}/semesters`, requestOptions) // Replace with actual API endpoint for semesters
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetDayOfWeek() {
  return await axios
    .get(`${apiUrl}/daysofweek`, requestOptions) // Replace with actual API endpoint for day of week
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

// ค้นหาคอร์สจากคำค้นหาและเทอม
async function SearchCourses(semester: string, searchTerm: string) {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };

  const url = `${apiUrl}/searchCourses?semester=${semester}&filter=${encodeURIComponent(
    searchTerm
  )}`;

  console.log("Sending request to:", url); // Debug URL

  return axios
    .get(url, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error during API request:", err.response || err.message);
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

    .put(`${apiUrl}/users/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${Bearer} ${Authorization}`,
      },
    })

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
    return response.data; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error updating sheet:", error);
    return error.response; // ส่งข้อผิดพลาดกลับมา
  }
}

// Delete a Sheet by ID
export async function DeleteSheet(id: string) {
  try {
    const response = await axios.delete(`${apiUrl}/sheets/${id}`, requestOptions);
    return response.data; // ส่งเฉพาะข้อมูลที่ต้องการ
  } catch (error: any) {
    console.error("Error deleting sheet:", error);
    return error.response;
  }
}
async function ListCourses() {
  return axios
    .get(`${apiUrl}/courses`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
};
async function ListCarts(p0: { userId: number; }) {
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


async function UpdateCourse (courseId: number, updatedData: any) {
  return axios
    .put(`${apiUrl}/courses/${courseId}`, updatedData, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
};

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


export{
  GetDepartments,
  GetMajors,
  GetCategories,
  GetSemesters,
  GetDayOfWeek,
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
  GetDay,
  CreateStudentBooking,
  DeleteSellerById,
  UpdateSellerById,
  CreateSeller,
  GetSellerById,
  ListSellers,
  CheckUserExistsInSeller,
  ListBanks,
  GetBanksById,
  ListCourses,
  UpdateCourse,
  GetTransactionLog,
  UpdateTransactionLog,
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
  ListStudentBooking,
  SearchCourses,
  GetMessageById,
};
