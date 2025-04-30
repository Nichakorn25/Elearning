import React, { useState, useEffect } from "react";
//import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import Sidebar from "../Component/Sidebar/Sidebar";
//import Slider from "react-slick"; // ใช้ react-slick
import Header from "../Component/Header/Header"; // เรียกใช้ Header ที่แยกไว้
import { ListAnnouncements, GetAllCourse, GetCourseEnrollUserDepartmentSemester, GetAllUser, CreateEnroll, GetCourseByDepartment, GetUserInfo, GetEnrollUserID, Unenroll  } from "../../services/https";
import { CourseInterface } from "../../Interface/ICourse";
import { DepartmentInterface, UserInterface } from "../../Interface/IUser";
import { SearchOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material";
import fallbackImage from '../../assets/image1_0.jpg';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axios from "axios";
import { message ,Carousel, Card as AntdCard} from "antd";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";



const Dashboard: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [announcement, setAnnouncement] = useState<
    { title: string; content: string }[]
  >([]);

  // ฟังก์ชันดึงข้อมูล Announcement โดย ID
  const fetchAnnouncement = async () => {
    try {
      const response = await ListAnnouncements();
      console.log("ListAnnouncements response:", response);
  
      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          const today = new Date(); // วันที่ปัจจุบัน
  
          const announcementData = data
            .filter((item: any) => new Date(item.announce_date) <= today) // กรองตาม announce_date
            .map((item: any) => ({
              title: item.title,
              content: item.content,
            }));
  
          setAnnouncement(announcementData);
        } else {
          console.warn("No announcements available");
          setAnnouncement([]);
        }
      } else {
        console.error("Failed to fetch announcements:", response);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
  
  

  // โหลดข้อมูลเมื่อ Component ถูกสร้าง
  useEffect(() => {
    fetchAnnouncement(); // เรียกฟังก์ชันพร้อม ID (เปลี่ยน ID ตามความเหมาะสม)
    console.log("Ufetch announcement",announcement);
  }, []);

  const [course, setCourse] = React.useState<CourseInterface[]>([]); // ตั้งให้เป็น array ว่างตั้งแต่ต้น
  


  const [filteredCourse, setFilteredCourse] = React.useState<CourseInterface[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  interface CourseContent {
    course_id: number;
    course_name: string;
    course_code: string;
    user_id: number;
    first_name: string;
    last_name: string;
    department_id: number;
    department_name: string;
    semester_id: number;
    year: number;
    term: number;
    picture_id: number;
    picture: string;
    status: string;
  }
  React.useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await GetAllCourse();
        if (Array.isArray(response.data?.data)) { // ตรวจสอบว่ามี property data และมันเป็น array
          setCourse(response.data.data); // ใช้ data จาก response
        } else {
          console.error('Invalid response format, expected an array in response.data.data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
  
    fetchCourseData();
  }, [searchQuery]); // รันเมื่อ searchQuery เปลี่ยนแปลง
 
  // useEffect เพื่อตรวจสอบค่า course หลังจากที่มันได้รับการอัปเดตแล้ว
  React.useEffect(() => {
    console.log("course data: ", course);
  }, [course]); // รันเมื่อ course ถูกอัปเดต
  

  const id = localStorage.getItem("id") ;

  
  const [filteredCourseJoin, setFilteredCourseJoin] = React.useState<CourseContent[] | null>(null);
  const [courseJoin, setCourseJoin] = React.useState<[] | null>(null);
  React.useEffect(() => {
  const fetchCourseData = async () => {
    if (!id) {
      console.error('No id found in localStorage');
      return;
    }

    try {
      const response = await GetCourseEnrollUserDepartmentSemester(id); // id is now guaranteed to be a string
      setCourseJoin(response.data);
      console.log("Enroll data: ", response.data); // Log the response data instead of course (which might not be updated yet)
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  fetchCourseData();
}, [id]); // Update effect if 'id' changes

const [enrollData, setEnrollData] = React.useState<[] | null>(null);
React.useEffect(() => {
  const fetchCourseData = async () => {
    if (!id) {
      console.error('No id found in localStorage');
      return;
    }

    try {
      const response = await GetEnrollUserID(id); // id is now guaranteed to be a string
      setEnrollData(response.data);
      console.log("Enroll data User: ", response.data); // Log the response data instead of course (which might not be updated yet)
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  fetchCourseData();
}, [id]);

React.useEffect(() => {
  if (courseJoin) {
    setFilteredCourseJoin(courseJoin); // กำหนดค่า filteredCourseJoin ให้เท่ากับ courseJoin
  }
}, [courseJoin]);

const [userData, setuserData] = React.useState<UserInterface[] | null>(null);
React.useEffect(() => {
  const fetchCourseData = async () => {
    if (!id) {
      console.error('No id found in localStorage');
      return;
    }

    try {
      const response = await GetAllUser(); // id is now guaranteed to be a string
      setuserData(response.data);
      console.log("User data: ", response.data); // Log the response data instead of course (which might not be updated yet)
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  fetchCourseData();
}, [id]);


const [filteredCourseDepartment, setFilteredCourseDepartment] = React.useState<CourseInterface[] | null>(null);
const [departData, setdepartData] = React.useState<CourseInterface[] | null>(null);

// UseEffect to set filtered course
React.useEffect(() => {
  if (departData) {
    setFilteredCourseDepartment(departData); // กำหนดค่า filteredCourseDepartment ให้เท่ากับ departData
  }
}, [departData]);

// UseEffect to fetch course data
React.useEffect(() => {
  const CourseData = async () => {
    const id = localStorage.getItem("id"); // ตรวจสอบ id ก่อน
    const dapartmentID = 1; // ตัวอย่างกำหนด dapartmentID แบบชั่วคราว

    if (!id) {
      console.error('No id found in localStorage');
      return;
    }

    if (dapartmentID === undefined) {
      console.error('No department ID found');
      return;
    }

    try {
      const response = await GetCourseByDepartment(dapartmentID.toString()); // Convert dapartmentID to string
      setdepartData(response.data);
      console.log("Course data: ", response.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  CourseData();
}, [id]); // ค่าตัวแปรเริ่มต้นจะเป็น [] ตอนเริ่มต้น
 // Add dapartmentID to the dependency array


const [, setUserData] = React.useState<DepartmentInterface[] | null>(null);
React.useEffect(() => {
  const fetchCourseData = async () => {
    if (!id) {
      console.error('No id found in localStorage');
      return;
    }
    try {
      const response = await GetUserInfo(id); // id is now guaranteed to be a string
      setUserData(response.data);
      console.log("User data: ", response.data); // Log the response data instead of course (which might not be updated yet)
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  fetchCourseData();
}, [id]);

React.useEffect(() => {
  const GetPicture = async () => {
    try {
       // หรือจากที่เก็บ token อื่นๆ
      const response = await axios.get("http://localhost:8000/createcourse/picture", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      console.log("Picture data fetched:", response);
      setpictureData(response.data)
      return response;
    } catch (error) {
      console.error("Error fetching course data:", error);
      return null; // หรือคืนค่าบางอย่างในกรณีที่เกิดข้อผิดพลาด
    }
  };

  GetPicture();
}, []);

const [pictureData, setpictureData] = useState<{ CourseID: number, Picture: string }[]>([]); 

const getCoursePicture = (courseId: number) => {
  const picture = pictureData.find((picture) => picture.CourseID === courseId); // `find` works on arrays
  return picture?.Picture || fallbackImage; // Use fallback image if not found
};

const handleSearch = () => {
  if (Array.isArray(course)) {
    const filteredCourses = course.filter(
      (courseItem) =>
        courseItem.CourseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courseItem.CourseName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourse(filteredCourses);
  } else {
    console.error("course is not an array:", course);
  }
};

  


const handleSubmitEnroll = async (semesterID: number, courseID: number) => {
  const id = localStorage.getItem("id");

  // ตรวจสอบว่า id เป็น string หรือไม่
  if (!id) {
      message.error('ไม่พบข้อมูล ID ในระบบ');
      return;
  }

  const EnrollData = {
      UserID: parseInt(id), // id เป็น string ที่แน่นอน
      SemesterID: semesterID,
      CourseID: courseID,
  };

  try {
      console.log("Create Data: ", EnrollData);
      if (enrollData) {
          const alreadyEnrolled = enrollData.some((enroll: any) => {
              console.log("Checking enroll:", enroll);
              return (
                  enroll.SemesterID  === semesterID &&
                  enroll.CourseID  === courseID &&
                  enroll.UserID === parseInt(id)
              );
          });

          if (alreadyEnrolled) {
              message.warning('คุณได้ลงทะเบียนในคอร์สนี้แล้ว');
              setOpenModalCourse(false);
              setOpenModalDepartment(false);
              return;
          }
      }

      // เรียก API เพื่อสร้างข้อมูล
      const response = await CreateEnroll(EnrollData);
      if (response.status === 200 && response.data) {
          message.success('เข้าร่วมสำเร็จ!');
          setOpenModalCourse(false);
          setOpenModalDepartment(false);
          console.log('Response data:', response.data);
          handleRefresh();
      }
  } catch (error) {
      console.error('Error creating lesson:', error);
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
};

const handleUnenroll = async (ID: string) => {

  // ตรวจสอบว่า id เป็น string หรือไม่
  if (!id) {
      message.error('ไม่พบข้อมูล ID ในระบบ');
      return;
  }

  try {
      
      // เรียก API เพื่อสร้างข้อมูล
      const response = await Unenroll(ID);
      console.log(ID)
      if (response.status === 200 && response.data) {
          message.success('ลบสำเร็จ!');
          handleRefresh();
      }
  } catch (error) {
      console.error('Error creating lesson:', error);
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
};


  

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload(); // รีเฟรชหน้า
    }, 1000);
  };


 
  const [openModalCourse, setOpenModalCourse] = useState<boolean>(false);
const [openModalDepartment, setOpenModalDepartment] = useState<boolean>(false);

const [selectedCourse, setSelectedCourse] = useState<CourseInterface | null>(null);
const [selectedCourseDepartment, setSelectedCourseDepartment] = useState<CourseInterface | null>(null);

// ฟังก์ชันเปิด/ปิดโมดอลคอร์ส
const handleOpenModalCourse = (course: CourseInterface) => {
  setSelectedCourse(course); // เก็บข้อมูลคอร์สที่ถูกเลือก
  setOpenModalCourse(true); // เปิด modal คอร์ส
};

const handleCloseModalCourse = () => {
  setOpenModalCourse(false); // ปิด modal คอร์ส
  setSelectedCourse(null); // เคลียร์ข้อมูลคอร์สที่เลือก
};

// ฟังก์ชันเปิด/ปิดโมดอลแผนกคอร์ส
const handleOpenModalDepartment = (departData: CourseInterface) => {
  setSelectedCourseDepartment(departData); // เก็บข้อมูลคอร์สแผนกที่ถูกเลือก
  setOpenModalDepartment(true); // เปิด modal คอร์สแผนก
};

const handleCloseModalDepartment = () => {
  setOpenModalDepartment(false); // ปิด modal คอร์สแผนก
  setSelectedCourseDepartment(null); // เคลียร์ข้อมูลคอร์สแผนกที่เลือก
};


const navigate = useNavigate();
  const handleClickpicture = (id: number) => {
    if (id !== undefined) {
      navigate(`/DashboardforStudent/${id}`); // ส่งไปที่หน้า ManageCourse
    } else {
      console.error('Course ID is undefined');
    }
  }

  return (
    <div className="stddashboard">
      {/* Header Section */}
      <Header />

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />


      {/* Announcement Section */}
      <div className="announcement-section">
  <h2>Announcement</h2>
  {announcement.length > 0 ? (
    <Carousel
      autoplay
      dots
      style={{
        backgroundColor: "#e8e5e3ce", // พื้นหลังของ Carousel
        padding: "25px",
        borderRadius: "8px",
      }}
    >
      {announcement.map((announcement, index) => (
        <div key={index}>
          <AntdCard
            title={announcement.title}
            bordered={false}
            style={{
              width: "80%",
              margin: "0 auto",
              textAlign: "center",
              backgroundColor: "#ffffff", // พื้นหลังสีขาวของ Card
              color: "#333", // สีข้อความ
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้ Card ดูมีมิติ
            }}
          >
            <p style={{ color: "#666" }}>{announcement.content}</p> {/* สีข้อความ */}
          </AntdCard>
        </div>
      ))}
    </Carousel>
  ) : (
    <AntdCard
      style={{
        padding: "20px",
        marginTop: "20px",
        backgroundColor: "#fffbe6", // สีพื้นหลังกรณีไม่มีประกาศ
        color: "#333", // สีข้อความ
      }}
    >
      <Typography>No announcements available</Typography>
    </AntdCard>
  )}
</div>


      {/* Search Bar */}
      <div className="stddashboard-search-bar" >
        <input type="text"
          placeholder="ค้นหารายวิชา (Search courses)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}   />
        <button className="stddashboard-search-button" onClick={handleSearch}><SearchOutlined /></button>
      </div>

      <div>
        <h2>คอร์สที่ค้นหา</h2>
        <Grid container spacing={3}>
    {filteredCourse?.length ? (
    filteredCourse.map((course) => {
    // Find the user associated with this course
    const user = userData?.find(user => user.ID === course.UserID); // Match UserID from course with ID in userData

    return (
            <Grid item xs={12} sm={6} md={4} key={course.ID}>
                    <Card>
                      <CardContent>
                        {course.ID ? (
                          <img
                            src={getCoursePicture(course.ID)}
                            alt="Course"
                            style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '10px', cursor: 'pointer' }}
                            onClick={() => handleOpenModalCourse(course)}
                          />
                        ) : (
                          <Typography>No image available</Typography>
                        )}
                        <Typography variant="h6" component="div">
                          {course.CourseName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.CourseCode}
                        </Typography>
                        {/* Display user name if user is found */}
                        {user ? (
                          <Typography variant="body2" color="text.secondary">
                            By {user.FirstName} {user.FirstName}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            User not found
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Typography>ไม่พบคอร์สที่ค้นหา</Typography>
            )}
        </Grid>

        
        <Dialog open={openModalCourse} onClose={handleOpenModalCourse} maxWidth="md">
          <DialogTitle>
            <Typography variant="h5" color="#FF5733">Enroll Course</Typography>
            <Typography variant="h6">คอร์ส: {selectedCourse?.CourseName}</Typography>
            <Typography variant="h6">รหัสวิชา: {selectedCourse?.CourseCode}</Typography>
          </DialogTitle>
          <DialogContent>
            {selectedCourse ? (
              selectedCourse.Status === "available" ? (
                <Typography variant="h6" color="green">
                  สถานะ: "สามารถเข้าร่วมได้"
                </Typography>
              ) : selectedCourse.Status === "unavailable" ? (
                <Typography variant="h6" color="red">
                  สถานะ: "ไม่สามารถเข้าร่วมได้ โปรดแจ้งอาจารย์ผู้สอน!"
                </Typography>
              ) : (
                <Typography variant="h6" color="textSecondary">
                  สถานะ: ไม่ทราบสถานะ
                </Typography>
              )
            ) : null}
          </DialogContent>
          <DialogActions>
            {selectedCourse?.Status === 'available' && (
              <button
                onClick={() => handleSubmitEnroll(selectedCourse?.SemesterID as number, selectedCourse?.ID as number)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FF5733',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Enroll Now
              </button>
            )}
            <button
              onClick={handleCloseModalCourse}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ddd',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            >
              Close
            </button>
          </DialogActions>
        </Dialog>



          <Divider sx={{ my: 5, alignSelf: 'stretch', width: '100%' }} />
        
      </div>


      {/* Your Courses Section */}
      <div className="stddashboard-your-courses">
        <h2>คอร์สเรียนของคุณ</h2>
        <Grid container spacing={3}>
          {filteredCourseJoin && filteredCourseJoin.length > 0 ? (
            filteredCourseJoin.map((courseJoin) => {
              
              const user = userData?.find((user) => user.ID === courseJoin.user_id);

              return (
                <Grid item xs={12} sm={6} md={4} key={courseJoin.course_id}>
                  <Card>
                    <CardContent>
                      <img
                        src={courseJoin.picture || fallbackImage}
                        alt="Course"
                        onClick={() => handleClickpicture(courseJoin.course_id)}
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          cursor: 'pointer',
                        }}
                      />
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        {courseJoin.course_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        รหัสคอร์ส: {courseJoin.course_code}
                      </Typography>
                      {user ? (
                        <Typography variant="body2" color="text.secondary">
                          ปี {courseJoin.year} เทอม {courseJoin.term}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          ข้อมูลผู้ใช้งานไม่พบ
                        </Typography>
                      )}

                      <IconButton onClick={() => handleUnenroll(courseJoin.course_id.toString())}><DeleteIcon color="disabled"/></IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography>ไม่พบคอร์สที่ค้นหา</Typography>
          )}
        </Grid>


      </div>

      {/* Recommend Section */}
      <div className="stddashboard-recommend">
        <h2>แนะนำสำหรับคุณ</h2>
        {filteredCourseDepartment?.length && filteredCourseDepartment.length > 0 ? (
          <Grid container spacing={2}> {/* ใช้ Grid container เป็น parent */}
            {filteredCourseDepartment.map((departData) => {
              // Find the user associated with this course
              const user = userData?.find((user) => user.ID === departData.UserID); // Match user_id from course with ID in userData

              return (
                <Grid item xs={12} sm={6} md={4} key={departData.ID}> {/* ใช้ breakpoints xs, sm, md */}
                  <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}> {/* Ensure Card takes up full height */}
                    <CardContent style={{ flexGrow: 1 }}>
                      {departData.ID ? (
                        <img
                          src={getCoursePicture(departData.ID)}
                          alt="Course"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            marginTop: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenModalDepartment(departData)}
                        />
                      ) : (
                        <Typography>No image available</Typography>
                      )}
                      <Typography variant="h6" component="div" style={{ marginTop: "10px" }}>
                        {departData.CourseName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {departData.CourseCode}
                      </Typography>
                      {/* Display user name if user is found */}
                      {user ? (
                        <Typography variant="body2" color="text.secondary">
                          By {user.FirstName} {user.LastName}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          User not found
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography>ไม่พบคอร์สที่ค้นหา</Typography>
        )}

        {/* Modal for Enroll Course */}
        <Dialog open={openModalDepartment} onClose={handleCloseModalDepartment} maxWidth="md">
          <DialogTitle>
            <Typography variant="h5" color="#FF5733">Enroll Course</Typography>
            <Typography variant="h6">คอร์ส: {selectedCourseDepartment?.CourseName}</Typography>
            <Typography variant="h6">รหัสวิชา: {selectedCourseDepartment?.CourseCode}</Typography>
          </DialogTitle>
                  <DialogContent>
          {selectedCourseDepartment && (
            <>
              {selectedCourseDepartment.Status === "available" ? (
                <Typography variant="h6" color="green">
                  สถานะ: "สามารถเข้าร่วมได้"
                </Typography>
              ) : selectedCourseDepartment.Status === "unavailable" ? (
                <Typography variant="h6" color="red">
                  สถานะ: "ไม่สามารถเข้าร่วมได้ โปรดแจ้งอาจารย์ผู้สอน!"
                </Typography>
              ) : (
                <Typography variant="h6" color="textSecondary">
                  สถานะ: ไม่ทราบสถานะ
                </Typography>
              )}
            </>
          )}
        </DialogContent>

<DialogActions>
  {selectedCourseDepartment?.Status === "available" &&
    selectedCourseDepartment?.ID !== undefined && (
      <button
        onClick={() => {
          if (
            typeof selectedCourseDepartment.SemesterID === "number" &&
            selectedCourseDepartment.ID
          ) {
            handleSubmitEnroll(
              selectedCourseDepartment.SemesterID,
              selectedCourseDepartment.ID
            );
          } else {
            console.error("Invalid SemesterID or Course ID");
          }
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#FF5733",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Enroll Now
      </button>
    )}
  <button
    onClick={handleCloseModalDepartment}
    style={{
      padding: "10px 20px",
      backgroundColor: "#ddd",
      color: "#000",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "10px",
    }}
  >
    Close
  </button>
</DialogActions>

        </Dialog>


        <Divider sx={{ my: 5, alignSelf: "stretch", width: "100%" }} />
      </div>

    </div>

  );

  
  

  
};

export default Dashboard;