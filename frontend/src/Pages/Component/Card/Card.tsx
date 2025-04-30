import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CourseInterface, CoursePictureInterface } from '../../../Interface/ICourse';
import { GetCourseByUserId, UpdateStatusCourse } from '../../../services/https';
import { Button, Grid, TextField } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import fallbackImage from '../../../assets/image1_0.jpg';
import axios from 'axios';
import HideSourceOutlinedIcon from '@mui/icons-material/HideSourceOutlined';
import { message } from 'antd';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: { theme: any; expand: boolean }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',  // เปลี่ยนการใช้ฟังก์ชันมาเป็นการตรวจสอบตรงๆ
}));

export default function RecipeReviewCard() {
  const id = localStorage.getItem("id");
  const [expanded, setExpanded] = React.useState<number | null>(null);  // ใช้ index แทน
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [course, setCourse] = React.useState<CourseInterface[] | null>(null);  // เปลี่ยนเป็น array
  const [courseData, setCourseData] = React.useState<CourseInterface[] | null>(null);
  const navigate = useNavigate();
  const [pictureData, setpictureData] = useState<CoursePictureInterface[]>([]);

  // ฟังก์ชันเปิด/ปิด Edit Dialog

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

  // ดึงข้อมูลทั้งหมดของหลักสูตร
  React.useEffect(() => {
    const GetCourseData = async () => {
      try {
         // หรือจากที่เก็บ token อื่นๆ
        const response = await axios.get(`http://localhost:8000/createcourse/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        console.log(id);
        console.log("AllCourse data fetched:", response);
        setCourseData(response.data)
        return response;
      } catch (error) {
        console.error("Error fetching course data:", error);
        return null; // หรือคืนค่าบางอย่างในกรณีที่เกิดข้อผิดพลาด
      }
    };

    GetCourseData();
  }, [id]);

  // ฟังก์ชันในการดึงข้อมูลของแต่ละหลักสูตร

  const getCoursePicture = (courseId: number) => {
    const picture = pictureData.find(picture => picture.CourseID === courseId);
    return picture?.Picture || fallbackImage; // ถ้าไม่มีรูป ให้ใช้รูป default
  };
  
  const handleExpandClick = (index: number) => {
    setExpanded(prev => (prev === index ? null : index));  // เปิดหรือปิดการขยายเฉพาะการ์ดนั้น
  };

  const handleSearch = () => {
    if (course) {
      const filteredCourses = course.filter(
        (courseItem) =>
          courseItem.CourseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          courseItem.CourseName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCourse(filteredCourses);
    }
  };
  
  const handleCardClick = (id: number | undefined) => {
    if (id !== undefined) {
      navigate(`/ManageCourse/${id}`); // ส่งไปที่หน้า ManageCourse
    } else {
      console.error('Course ID is undefined');
    }
  };
  
  React.useEffect(() => {
    const fetchCourseData = async () => {
      const id = localStorage.getItem('id');
      if (id) {
        try {
          const response = await GetCourseByUserId(id);
          setCourse(response.data);
        } catch (error) {
          console.error('Error fetching course data:', error);
        }
      }
    };
  
    fetchCourseData();
  }, [searchQuery]);

  const handleUpdateStatusCourse = async (CourseID: number, status: string) => {
    if (!CourseID) {
      message.error('ไม่พบข้อมูลของคอร์ส');
      return; // Prevent further execution if the id is not defined
    }

    try {
  
      const response = await UpdateStatusCourse(CourseID.toString(), status); // updateCourse คือฟังก์ชันที่ทำการติดต่อ API ของคุณ
      if (response.status === 200) {
        message.success('แก้ไขสถานะคอร์สเรียบร้อย!');
        // รีเฟรชข้อมูลใหม่หลังการอัพเดต
        handleRefresh();
        
      } else {
        message.error('เกิดข้อผิดพลาดในการอัพเดตข้อมูล');
        console.log("response:", response);
      }
    } catch (error) {
      console.log('Error updating course:', error);
      message.error('ไม่สามารถบันทึกข้อมูลได้');
    }
    console.log("Course data being sent:", courseData);
  };
  
  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload(); // รีเฟรชหน้า
    }, 1000);
  };

  if (!course) {
    return <div>Loading...</div>;  // เพิ่มการแสดงผลเมื่อข้อมูลยังไม่ถูกโหลด
  }

  

  return (
    
    <div>
      <div className='Section'>
            <div className='Section_1'>
                <div className='Seach_bar'  style={{
                    
                    position: 'fixed',   // ใช้ sticky แทน fixed
                    top: 150,            // ติดที่ตำแหน่งด้านบน
                    width: '35%',        // ความกว้าง
                    left: '20%',         // ตำแหน่งเริ่มต้นที่ 50% จากด้านซ้าย
                    transform: 'translateX(-50%)',  // ชดเชยให้มันอยู่กลาง
                    zIndex: 1,
                    backgroundColor: 'white', // ให้มีพื้นหลังเพื่อให้มันไม่ทับส่วนอื่น
                    padding: '10px',           // เพิ่ม padding
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // เงาเบา ๆ
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}>
                    <h3 className='h3_Seach'>ค้นหาชื่อรายวิชา (Search courses)</h3>
                    <div className="line_1" style={{ display: '', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label="Search"
                      id="fullWidth"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      className="Search_button"
                      onClick={handleSearch}
                      sx={{
                        top: '0px',
                        
                        fontSize: '24px',
                        backgroundColor: '#ff6b00',
                        color: 'white',
                        padding: '15px 25px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#f9f9f9',
                        },
                      }}
                    >
                      <SearchOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </Button>
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        const id = localStorage.getItem('id');
                        if (id) {
                          GetCourseByUserId(id).then((response) => {
                            setCourse(response.data);
                          });
                        }
                      }}
                      sx={{
                        top: '0px',
                        padding: '13px 20px',
                        fontSize: '16px',
                        marginLeft: '10px',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                        },
                      }}
                    >
                      รีเซ็ต
                    </Button>
                  </div>


                </div>
            </div>
        </div>
         
        <Grid
          container
          spacing={5}  // ใช้ spacing เพื่อจัดระยะห่างระหว่างคอมโพเนนต์
          sx={{
            paddingTop: '130px',  // เพิ่ม padding เพื่อไม่ให้ทับ header
          }}
        >
          {course.map((courseItem, index) => (
            
            <Grid
              item
              xs={12}
              sm={6}   // ใช้ขนาดครึ่งหนึ่งบนหน้าจอขนาด sm
              md={3}   // ใช้ขนาดหนึ่งในสี่บนหน้าจอขนาด md (แสดง 4 คอลัมน์ในขนาดหน้าจอใหญ่)
              key={index}
              sx={{
                maxWidth: 350,
                minWidth: 250,  // เพิ่มขนาดต่ำสุด
                width: '100%',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                
              }}
            >
              <Card
                sx={{
                  maxWidth: 350,
                  width: '100%',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 4,
                }}
              >
               
                <CardMedia
                  component="img"
                  height="200"
                  image={courseItem.ID ? getCoursePicture(courseItem.ID) : fallbackImage}
                  alt="Course image"
                  sx={{
                    cursor: 'pointer',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 10,
                    },
                  }}
                  onClick={() => handleCardClick(courseItem.ID)}
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'black' }}>
                    {courseItem.CourseName || 'ไม่พบชื่อคอร์ส'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {courseItem.CourseCode || 'ไม่พบรหัสวิชา'}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites" onClick={() => {
                    if (courseItem?.ID && courseItem?.Status) {
                      handleUpdateStatusCourse(courseItem.ID, courseItem.Status);
                    }
                  }}>
                    <HideSourceOutlinedIcon sx={{
                      color: courseItem.Status === 'unavailable' ? 'gray' : 'green',
                  }}/>
                  </IconButton>
                  <ExpandMore
                    expand={expanded === index}
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expanded === index}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography sx={{ marginBottom: 2}}>รายละเอียด:</Typography>
                    <Typography sx={{ marginBottom: 2 }}>
                      รหัสวิชา: {courseItem.CourseCode || 'ไม่พบชื่อคอร์ส'}
                      <br />
                      ชื่อ: {courseItem.CourseName || 'ไม่พบรหัสวิชา'}
                      <br />
                      หน่วยกิต: {courseItem.Credit || 'ไม่พบหน่วยกิต'} หน่วยกิต
                      <br />
                    </Typography>
                    <Typography sx={{ marginBottom: 2 }}>
                      คำอธิบาย:<br />
                      {courseItem.Description || 'ไม่พบคำอธิบาย'}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>

</div>

    
  );
}