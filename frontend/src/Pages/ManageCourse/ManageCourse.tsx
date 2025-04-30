import Header from '../Component/Header/Header';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './ManageCourse.css';
import { CustomizedMenus }  from '../Component/Menu/antMenu';
import { CustomizedMenusCreateAssignment}   from '../Component/Menu/antMenuAssignment';
import Button from "@mui/material/Button";
import Modal from '@mui/joy/Modal';
import { DialogContent, DialogTitle, FormControl, FormLabel, Input, Menu, MenuItem, ModalDialog, Typography } from '@mui/joy';
import Box from '@mui/material/Box';
import {TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { GetCoursesByID, CreateLesson, GetLessonByCourseID, GetCourseContent, DeleteAllaboutCoures, UpdateCourse, GetCourseUrl, GetCourseMaterial, DeleteCouresContent, DeleteCouresVideo, DeleteCouresMaterial, DeleteLesson, UpdateStatusMaterial, UpdateStatusContent, UpdateStatusUrl, UpdateContent, UpdateUrl, UpdateLesson,GetstudyByID, DeleteFileMateriral, GetAssignmentCourseID} from '../../services/https';
import { useParams } from 'react-router-dom';
import { LessonInterface } from '../../Interface/ICourse';
import {  Dialog, DialogActions } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import HideSourceIcon from '@mui/icons-material/HideSource';
import SchoolIcon from '@mui/icons-material/School';
import TimePick from "../Component/TimePicker/TimePick"

interface Content {
  content_id: string;
  content_title: string;
  content: string;

}


interface UrlData {
  url_id: string;
  title: string;
  url: string;
}

interface Lesson {
  ID: number;
  Title: string;
  Status: string;
  content_id: string;
}

interface Material {
  material_id: number;
  material_name: string;
  file_path: string;
  status: string;
}

const ManageCourse: React.FC = () => {
  const { id } = useParams();
  const courseID = id ? Number(id) : undefined;
  const [openEditDialog, setOpenEditDialog] = useState(false); // สถานะของ dialog สำหรับ Edit
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setlessonData] = useState<Lesson[]>([]);
  const [contentData, setcontentData] = useState<Content[]>([]);
  const [urlData, setUrlData] = useState<UrlData[]>([]);  
  const [materialData, setMaterialData] = useState<Material[]>([]);
  const [, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState<boolean>(false);
    

    const [LessonData, setLessonData] = useState<LessonInterface>({
        Title: "",
        Sequence: 1,
        CourseID: courseID,
    });
  
    const menuOpen: boolean = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // หากคลิกที่ปุ่มอีกครั้งจะเปิดหรือปิดเมนู
      setAnchorEl(prev => (prev ? null : event.currentTarget));
    };
    const handleClose = () => {
      setAnchorEl(null); // ล้างค่า anchorEl เพื่อปิดเมนู
    };
  

  const handleAllDeleteClick = async (event: React.MouseEvent<HTMLButtonElement>,
    courseID: number) => {
    event.preventDefault(); // ป้องกันการกระทำเริ่มต้นของเหตุการณ์
    
    if (courseID) {
      try {
        // เรียกใช้ฟังก์ชัน DeleteAllaboutCoures ที่เป็นบริการลบคอร์ส
        const response = await DeleteAllaboutCoures(courseID.toString());
        const contentType = response.headers.get("Content-Type");
        let data;
        
        // ตรวจสอบว่า response สำเร็จหรือไม่
        if (response.status === 200 && response.data) {
          // หาก response เป็น JSON
          if (contentType && contentType.includes("application/json")) {
            data = await response.json(); // ถ้าเป็น JSON ใช้ .json()
          } else {
            data = await response.text(); // ถ้าไม่ใช่ JSON ใช้ .text()
          }
  
          console.log('Response Data:', data); // ตรวจสอบข้อมูลที่ได้รับ
  
          if (response.status === 200 && response.data) {
            message.success('ลบคอร์สสำเร็จ!');
            
            setTimeout(() => {
              navigate('/CreateCourse');
            }, 3000);
            // อาจจะต้องโหลดข้อมูลใหม่ หรือทำการ redirect
          } else {
            alert(`เกิดข้อผิดพลาด: ${data.message || data}`);
          }
        } else {
          // แสดงสถานะและข้อความเพิ่มเติมเมื่อเกิดข้อผิดพลาด
          const errorText = await response.text();
          alert(`เกิดข้อผิดพลาด: สถานะ ${response.status} - ${errorText}`);
        }
      } catch (err) {
        message.success('ลบคอร์สสำเร็จ!');
        setTimeout(() => {
         
        }, 3000);
        navigate('/CreateCourse');
        console.log('Error:', err);
      }
    } else {
      alert('ไม่มี ID คอร์สให้ลบ');
    }
  };

  const handleDeleteContent = async (contentID: number) => {
     // ป้องกันการกระทำเริ่มต้นของเหตุการณ์
  
    if (contentID) {
      try {
        // เรียกใช้บริการลบข้อมูลเนื้อหาคอร์ส
        const response = await DeleteCouresContent(contentID.toString());
  
        if (response.status === 200) {
          setcontentData((prevContents) =>
            prevContents.filter((entity) => Number(entity.content_id) !== contentID)
          );
          message.success('ลบเนื้อหาคอร์สสำเร็จ!');
          
        } else {
          message.error(`เกิดข้อผิดพลาด: ${response.data?.message || 'ไม่สามารถลบเนื้อหาคอร์สได้'}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          message.error(`เกิดข้อผิดพลาด: ${error.message}`);
        } else {
          message.error('เกิดข้อผิดพลาดที่ไม่รู้จัก');
        }
      }
    } else {
      message.warning('กรุณาเลือกคอร์สที่ถูกต้องก่อนดำเนินการลบ');
    }
  };

  const handleDeleteVideo = async (urlID: number) => {
    // ป้องกันการกระทำเริ่มต้นของเหตุการณ์
 
   if (urlID) {
     try {
       // เรียกใช้บริการลบข้อมูลเนื้อหาคอร์ส
       const response = await DeleteCouresVideo(urlID.toString());
 
       if (response.status === 200) {
        setUrlData((prevData) =>
          prevData.filter((entity) => Number(entity.url_id) !== urlID) // ลบวิดีโอที่มี url_id ตรงกัน
        );
         message.success('ลบลิ้งค์สำเร็จ!');
         

       } else {
         message.error(`เกิดข้อผิดพลาด: ${response.data?.message || 'ไม่สามารถลบเนื้อหาคอร์สได้'}`);
       }
     } catch (error) {
       if (error instanceof Error) {
         message.error(`เกิดข้อผิดพลาด: ${error.message}`);
       } else {
         message.error('เกิดข้อผิดพลาดที่ไม่รู้จัก');
       }
     }
   } else {
     message.warning('กรุณาเลือกลิ้งค์ที่ถูกต้องก่อนดำเนินการลบ');
     console.log(urlID);
   }
 };

 const handleDeleteMaterialAll = async (MaterialID: number) => {
    handleDeleteFile(MaterialID);
    handleDeleteMaterial(MaterialID);
   
 }  

 const handleDeleteMaterial = async (MaterialID: number) => {
  // ป้องกันการกระทำเริ่มต้นของเหตุการณ์

 if (MaterialID) {
   try {
     // เรียกใช้บริการลบข้อมูลเนื้อหาคอร์ส
     const response = await DeleteCouresMaterial(MaterialID.toString());
     if (response.status === 200 ) {
      setMaterialData((prevMaterials) =>
        prevMaterials.filter((material) => material.material_id !== MaterialID)
      );
     } else {
       message.error(`เกิดข้อผิดพลาด: ${response.data?.message || 'ไม่สามารถลบเนื้อหาคอร์สได้'}`);
     }
   } catch (error) {
     if (error instanceof Error) {
       message.error(`เกิดข้อผิดพลาด: ${error.message}`);
     } else {
       message.error('เกิดข้อผิดพลาดที่ไม่รู้จัก');
     }
   }
 } else {
   message.warning('กรุณาเลือกไฟล์ที่ถูกต้องก่อนดำเนินการลบ');
 }
};

const handleDeleteFile = async (MaterialID: number) => {
  // ป้องกันการกระทำเริ่มต้นของเหตุการณ์

 if (MaterialID) {
   try {
     // เรียกใช้บริการลบข้อมูลเนื้อหาคอร์ส

     const response = await DeleteFileMateriral(MaterialID.toString());   
     if (response.status === 200) {
       message.success('ลบไฟล์สำเร็จ!');
       navigate(`/ManageCourse/${id}`);

     } else {
       message.error(`เกิดข้อผิดพลาด: ${response.data?.message || 'ไม่สามารถลบเนื้อหาคอร์สได้'}`);
     }
   } catch (error) {
     if (error instanceof Error) {
       message.error(`เกิดข้อผิดพลาด: ${error.message}`);
     } else {
       message.error('เกิดข้อผิดพลาดที่ไม่รู้จัก');
     }
   }
 } else {
   message.warning('กรุณาเลือกไฟล์ที่ถูกต้องก่อนดำเนินการลบ');
 }
};
  
const handleDeleteLesson = async (LessonID: number) => {
  if (LessonID) {
    try {
      // เรียกใช้บริการลบข้อมูลเนื้อหาคอร์ส
      const response = await DeleteLesson(LessonID.toString());

      if (response.status === 200) {
        message.success('ลบบทเรียนสำเร็จ!');

        // อัปเดต state หลังจากลบสำเร็จ
        setlessonData((prevLessons) => prevLessons.filter((lesson) => lesson.ID !== LessonID));
      } else {
        message.error(`เกิดข้อผิดพลาด: ${response.data?.message || 'ไม่สามารถลบบทเรียนได้'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(`เกิดข้อผิดพลาด: ${error.message}`);
      } else {
        message.error('เกิดข้อผิดพลาดที่ไม่รู้จัก');
      }
    }
  } else {
    message.warning('กรุณาเลือกบทเรียนที่ถูกต้องก่อนดำเนินการลบ');
  }
};
    
  
  
const [openAddStudyTime, setAddStudyTime] = useState(false);
const handleAddClick =  () => {
  handleClose(); 
  setAddStudyTime(true);
};

const handleCloseAddClick = () => {
  setAddStudyTime(false);
}; 


  const handleEditClick =  () => {
    handleClose(); 
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // ฟังก์ชันเปิด/ปิด Delete Dialog
  const handleDeleteClick = () => {
    handleClose(); 
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleSubmitLesson = async () => {
    try {
      
      const response = await CreateLesson(LessonData);
      if (!LessonData.Title?.trim()) {
        message.warning('กรุณากรอกชื่อบทเรียน');  // แจ้งเตือนหากไม่ได้กรอกชื่อบทเรียน
        return;
      }
      if (response.status === 200 && response.data) {
        console.log('Response data:', response.data); // เช็คข้อมูลจาก API
        
        message.success('สร้างบทเรียนสำเร็จ!');
        handleRefresh();
        setOpen(false); 

        
      } else {
        setError('เกิดข้อผิดพลาดในการสร้างบทเรียน');
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


  const [assignmetData, setAssignmetData] = useState<any>(null);
  React.useEffect(() => {
    const GetAssignment = async () => {

        if (id) {
            try {
                const response = await GetAssignmentCourseID(Number(id));
                console.log('Assignment data:', response.data.data);
                console.log("fofofofofo",courseID)
                  // ดูว่า response เป็นอะไร
                if (response && response.data) {
                    console.log('Assignment data:', response.data);  // ตรวจสอบข้อมูลจริงที่ได้รับ
                    setAssignmetData(response.data);  // ตั้งค่า courseData
                } else {
                    console.error('No course data found.');
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        } else {
            console.error('No ID found');
        }
    };

    GetAssignment();
}, []);


  React.useEffect(() => {
    const GetCourse = async () => {

        if (id) {
            try {
                const response = await GetCoursesByID(id);
                console.log('Response:', response);  // ดูว่า response เป็นอะไร
                if (response && response.data) {
                    console.log('Course data:', response.data);  // ตรวจสอบข้อมูลจริงที่ได้รับ
                    setCourseData(response.data);  // ตั้งค่า courseData
                } else {
                    console.error('No course data found.');
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        } else {
            console.error('No ID found');
        }
    };

    GetCourse();
}, []);

React.useEffect(() => {
    const GetLesson = async () => {

        if (id) {
            try {
                const response = await GetLessonByCourseID(id);
                console.log('Response:', response);  // ดูว่า response เป็นอะไร
                if (response && response.data) {
                    console.log('Course data:', response.data);  // ตรวจสอบข้อมูลจริงที่ได้รับ
                    setlessonData(response.data);  // ตั้งค่า courseData
                } else {
                    console.error('No course data found.');
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        } else {
            console.error('No ID found');
        }
    };

    GetLesson();
}, [id]);

const [studyData, setStudyData] = useState<[]>([]); 
React.useEffect(() => {
  const Getstudytime = async () => {

      if (id) {
          try {
              const response = await GetstudyByID(id);
              console.log('Response:', response);  // ดูว่า response เป็นอะไร
              if (response && response.data) {
                  console.log('study data:', studyData);  // ตรวจสอบข้อมูลจริงที่ได้รับ
                  setStudyData(response.data);  // ตั้งค่า courseData
              } else {
                  console.error('No course data found.');
              }
          } catch (error) {
              console.error('Error fetching course data:', error);
          }
      } else {
          console.error('No ID found');
      }
  };

  Getstudytime();
}, []);

React.useEffect(() => {
    const GetContent = async () => {

        if (id) {
            try {
                const response = await GetCourseContent(id);
                console.log('Response:', response);  // ดูว่า response เป็นอะไร
                if (response && response.data) {
                    console.log('Content data:', response.data);  // ตรวจสอบข้อมูลจริงที่ได้รับ
                    setcontentData(response.data);  // ตั้งค่า courseData
                } else {
                    console.error('No course data found.');
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        } else {
            console.error('No ID found');
        }
    };

    GetContent();
}, [id]);


React.useEffect(() => {
  const GetUrl = async () => {
    if (!id) {
      console.error('No ID found');
      return;
    }

    try {
      const response = await GetCourseUrl(id);
      if (response && response.data) {
        console.log('Fetched URL data:', response.data);
        setUrlData(response.data);
      } else {
        console.error('No URL data found.');
      }
    } catch (error) {
      console.error('Error fetching URL data:', error);
    }
  };

  GetUrl();
}, [id]);


React.useEffect(() => {
  const GetMaterial = async () => {

      if (id) {
          try {
              const response = await GetCourseMaterial(id);
              console.log('Response:', response);  // ดูว่า response เป็นอะไร
              if (response && response.data) {
                  console.log('material data:', response.data);  // ตรวจสอบข้อมูลจริงที่ได้รับ
                  console.log('material data:', materialData);
                  setMaterialData(response.data);  // ตั้งค่า courseData
              } else {
                  console.error('No material data found.');
              }
          } catch (error) {
              console.error('Error fetching course data:', error);
          }
      } else {
          console.error('No ID found');
      }
  };

  GetMaterial();
}, [id]);

  // ตรวจสอบว่า courseData ถูกโหลดมาแล้วหรือยัง
  console.log(courseData)
  
  const [courseName, setCourseName] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [credit, setCredit] = React.useState<number>(0);
  const [description, setDescription] = React.useState('');
  useEffect(() => {
    if (courseData && courseData[0]) {
      setCourseName(courseData?.[0].CourseName);
      setCourseCode(courseData?.[0].CourseCode);
      setCredit(courseData?.[0].Credit);
      setDescription(courseData?.[0].Description);
    }
  }, [courseData]);
  const handleSaveEdit = async () => {
    if (!id) {
      message.error('ไม่พบข้อมูลของคอร์ส');
      return; // Prevent further execution if the id is not defined
    }

    try {
      const updatedCourse = {
        CourseName: courseName,
        CourseCode: courseCode,
        Credit: credit,
        Description: description,
      };
  
      const response = await UpdateCourse(id, updatedCourse); // updateCourse คือฟังก์ชันที่ทำการติดต่อ API ของคุณ
      if (response.status === 200) {
        message.success('แก้ไขข้อมูลคอร์สเรียบร้อย!');
       
        handleCloseEditDialog(); // ปิด Dialog เมื่อบันทึกเสร็จ
        // รีเฟรชข้อมูลใหม่หลังการอัพเดต

        
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

  const handleUpdateStatusMaterial = async (MaterialID: number, status: string) => {
    if (!MaterialID) {
      message.error('ไม่พบข้อมูลของคอร์ส');
      return; // Prevent further execution if the id is not defined
    }

    try {
  
      const response = await UpdateStatusMaterial(MaterialID.toString(), status); // updateCourse คือฟังก์ชันที่ทำการติดต่อ API ของคุณ
      if (response.status === 200) {
        
        message.success('แก้ไขสถานะเเรียบร้อย!');
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

  const handleUpdateStatusContent = async (ContentID: number, status: string) => {
    if (!ContentID) {
      message.error('ไม่พบข้อมูลของคอร์ส');
      return; // Prevent further execution if the id is not defined
    }
  
    try {
      // เรียก API ที่จะอัปเดตสถานะ
      const response = await UpdateStatusContent(ContentID.toString(), status);
  
      if (response.status === 200) {
        // เรียก API เพื่อดึงข้อมูลคอร์สใหม่หลังการอัปเดต
        const updatedContent = await GetCourseContent(ContentID.toString());
  
        if (updatedContent) {
          // อัปเดตข้อมูลใน state
          handleRefresh();
          message.success('แก้ไขสถานะเรียบร้อย!');
        } else {
          message.error('ไม่สามารถดึงข้อมูลอัปเดตได้');
        }
      } else {
        message.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }
    } catch (error) {
      console.log('Error updating course:', error);
      message.error('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleUpdateStatusUrl = async (UrlID: number, status: string) => {
    if (!UrlID) {
      message.error('ไม่พบข้อมูลของคอร์ส');
      return; // Prevent further execution if the id is not defined
    }

    try {
  
      const response = await UpdateStatusUrl(UrlID.toString(), status); // updateCourse คือฟังก์ชันที่ทำการติดต่อ API ของคุณ
      if (response.status === 200) {
        
        message.success('แก้ไขสถานะเเรียบร้อย!');
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
  
  const [openEditContent, setOpenEditContent] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const handleEditContent = (title: string, content: string, contentId: string) => {
    setcontentTitle(title);
    setcontent(content);
    setOpenEditContent(true);
    setCurrentContentId(contentId);  // เก็บ content_id เพื่อใช้ในฟังก์ชันบันทึก
  };

  const handleCloseEditContent = () => {
    setOpenEditContent(false);
    
  };

 
  const [contentTitle, setcontentTitle] = React.useState('');
  const [content, setcontent] = React.useState('');
  const handleSaveEditContent = async () => {
    if (!currentContentId) {
      message.error('ไม่พบข้อมูลของเนื้อหา');
      return;
    }
  
    try {
      const updatedContent = {
        ID: currentContentId,
        Title: contentTitle,
        Content: content,
      };
  
      const response = await UpdateContent(currentContentId, updatedContent);
      if (response.status === 200) {
        message.success('แก้ไขข้อมูลเนื้อหาเรียบร้อย!');
        
        // อัปเดต contentData โดยตรงเพื่อให้ข้อมูลแสดงผลทันที
        setcontentData(prevContentData => 
          prevContentData.map(item => 
            item.content_id === currentContentId
              ? { ...item, content_title: contentTitle, content }
              : item
          )
        );
        
        handleCloseEditContent(); // ปิด Dialog เมื่อบันทึกเสร็จ
      } else {
        message.error('เกิดข้อผิดพลาดในการอัพเดตข้อมูล');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const [openEditUrl, setOpenEditUrl] = useState(false);
  const [currentUrlId, setCurrentUrlId] = useState<string | null>(null);
  const handleEditUrl = (title: string, url: string, urlId: string) => {
    console.log('Editing URL:', { title, url, urlId });
    seturlTitle(title);
    seturl(url);
    setOpenEditUrl(true);
    setCurrentUrlId(urlId);
  };


  const handleCloseEditUrl = () => {
    setOpenEditUrl(false);
  };

 
  const [urlTitle, seturlTitle] = React.useState('');
  const [url, seturl] = React.useState('');
  const handleSaveEditUrl = async () => {
    if (!currentUrlId) {
      message.error('ไม่พบข้อมูลของเนื้อหา');
      return;
    }
  
    try {
      const updatedUrl = {
        ID: currentUrlId,
        Title: urlTitle,
        Url: url,
      };
  
      const response = await UpdateUrl(currentUrlId, updatedUrl);
      if (response.status === 200) {
        message.success('แก้ไขข้อมูล URL เรียบร้อย!');
        
        // อัปเดต urlData โดยตรงเพื่อให้ข้อมูลแสดงผลทันที
        setUrlData((prevUrlData: UrlData[]) => 
          prevUrlData.map((item) => 
            item.url_id === currentUrlId  // ใช้ url_id แทน content_id
              ? { ...item, title: urlTitle, url: url }  // อัปเดตข้อมูล URL
              : item
          )
        );
        console.log(updatedUrl)
        handleCloseEditUrl(); // ปิด Dialog เมื่อบันทึกเสร็จ
      } else {
        message.error('เกิดข้อผิดพลาดในการอัพเดตข้อมูล');
      }
    } catch (error) {
      console.error('Error updating URL:', error);
      message.error('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleGotoAssignmet = (AssignmentID: number, CourseID: number) => {
    navigate(`/assignment_teacher/${AssignmentID}/${CourseID}`);
  };
  

  const [openEditLesson, setOpenEditLesson] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const handleEditLesson = (title: string, LessonId: string) => {
    console.log('Lesson URL:', { title, LessonId });
    setLessonTitle(title);
    setOpenEditLesson(true);
    setCurrentLessonId(LessonId);
    console.log('Open:', openEditLesson );
  };


  const handleCloseEditLesson = () => {
    setOpenEditLesson(false);
  };

 
  const [LessonTitle, setLessonTitle] = React.useState('');
  const handleSaveEditLesson = async () => {
    if (!currentLessonId) {
      message.error('ไม่พบข้อมูลของเนื้อหา');
      console.log('Lesson: ', { currentLessonId });
      return;
    }
  
    try {
      const updatedlesson = {
        ID: currentLessonId,
        Title: LessonTitle,


      };
  
      const response = await UpdateLesson(currentLessonId, updatedlesson);
      if (response.status === 200) {
        message.success('แก้ไขข้อมูลบทเรียนเรียบร้อย!');
        setlessonData((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson.ID === Number(currentLessonId) ? { ...lesson, Title: LessonTitle } : lesson
          )
        );
        console.log(updatedlesson)
        handleCloseEditLesson(); // ปิด Dialog เมื่อบันทึกเสร็จ
      } else {
        message.error('เกิดข้อผิดพลาดในการอัพเดตข้อมูล');
        console.log('Lesson: ', { updatedlesson });
      }
    } catch (error) {
      console.error('Error updating URL:', error);
      message.error('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  if (!courseData) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <header>
      <div className='Header'>
        <Header />
      
          <div className='nametopic'>
              <div className="courseTitleContainer" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button
                      id="basic-button"
                      aria-controls={menuOpen ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={menuOpen ? 'true' : undefined}
                      onClick={handleClick}
                      sx={{
                        '&:hover': {
                          borderRadius: '50%',  // ให้ปุ่มมีรูปทรงวงกลมเมื่อ hover
                          backgroundColor: 'rgba(0, 0, 0, 0.08)', // เปลี่ยนสีพื้นหลังเล็กน้อย
                        },
                        minWidth: '30px', // กำหนดขนาดปุ่ม
                        padding: '10px', // ปรับขนาดของปุ่ม
                      }}
                    >
                      <SettingsOutlinedIcon color="action" />
                    </Button>
                  </div>
              
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleClose}
                  >
                  <MenuItem onClick={handleEditClick}><EditIcon color="action"/>Edit Course</MenuItem>
                  <MenuItem onClick={handleAddClick}><SchoolIcon color="action"/>Add studytime</MenuItem>
                  <MenuItem onClick={handleDeleteClick} 
                    sx={{ color: 'red', 
                      '&:hover': {
                       backgroundColor: 'rgba(255, 0, 0, 0.08) !important' , // เปลี่ยนสีพื้นหลังเล็กน้อย
                          }, }}><DeleteIcon sx={{ color: 'red' }}/>Delete </MenuItem>
                    
                  </Menu>
                

                <Dialog
                  open={openEditDialog} 
                  onClose={handleCloseEditDialog}
                  BackdropProps={{
                    style: {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)', // ปรับให้พื้นหลังโปร่งใสแต่มีความมืดเล็กน้อย
                    },
                  }} 
                  sx={{
                    '& .MuiDialog-paper': {
                      borderRadius: '8px', // ปรับขอบให้มน
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 1)', // เอาเงาออก
                      border: '1px solid rgba(16, 16, 16, 0.3)', // ขอบบางๆ โปร่งใส
                      margin: "auto",
                      padding: '2.5%'
                    },
                  }}>
                  <DialogTitle sx={{ color: 'green', fontWeight: 'bold' , fontSize: "30px",}}>แก้ไขข้อมูลคอร์ส</DialogTitle>
                  <DialogContent>
                    {/* ใส่เนื้อหาของ Edit Form ที่นี่ */}
                    <Typography gutterBottom>
                    ชื่อ: 
                    <TextField 
                      value={courseName} 
                      onChange={(e) => setCourseName(e.target.value)} 
                      fullWidth
                    />
                      
                    </Typography>
                    <Typography  gutterBottom>
                    รหัสวิชา: 
                      <TextField 
                        value={courseCode} 
                        onChange={(e) => setCourseCode(e.target.value)} 
                        fullWidth
                      />
                    </Typography>
                    <Typography gutterBottom>
                        จำนวนหน่วยกิต: 
                        <TextField 
                          value={credit}
                          onChange={(e) => {
                            const value = e.target.value;
                            // แปลงค่า value จาก string เป็น number
                            const numericValue = parseFloat(value);  // ใช้ parseFloat เพื่อแปลงเป็น number
                            if (!isNaN(numericValue)) {
                              setCredit(numericValue);  // ตั้งค่าด้วยตัวเลข
                            }
                          }} 
                          fullWidth
                          type="number"  // กำหนด type เป็น number
                        />
                      </Typography>


                    <Typography gutterBottom>
                        รายละเอียด: 
                        <TextField 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          fullWidth
                          multiline
                          minRows={4} // กำหนดจำนวนบรรทัดเริ่มต้น
                          maxRows={6}
                        />
                      </Typography>
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">ยกเลิก</Button>
                    <Button onClick={handleSaveEdit} color="success">บันทึก</Button>
                  </DialogActions>
                </Dialog>

                <Dialog 
                  open={openDeleteDialog} 
                  onClose={handleCloseDeleteDialog}
                  BackdropProps={{
                    style: {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)', // ปรับให้พื้นหลังโปร่งใสแต่มีความมืดเล็กน้อย
                    },
                  }} 
                  sx={{
                    '& .MuiDialog-paper': {
                      borderRadius: '8px', // ปรับขอบให้มน
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 1)', // เอาเงาออก
                      border: '1px solid rgba(16, 16, 16, 0.3)', // ขอบบางๆ โปร่งใส
                      margin: "auto",
                      padding: '2.5%'
                    },
                  }}>
                  <DialogTitle sx={{ color: 'red', fontWeight: 'bold' , fontSize: "30px",}}>ลบคอร์สเรียน!!</DialogTitle>
                  <DialogContent sx={{ backgroundColor: 'transparent',  }}>
                    <Typography>คุณต้องการลบจริงหรือไม่?</Typography>
                    <Typography sx={{ color: 'red', fontWeight: 'bold' }}>การลบคอร์สเรียนจะเป็นการลบข้อมูลทั้งหมด!!</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">ยกเลิก</Button>
                    <Button onClick={(event) => handleAllDeleteClick(event, courseID!)} 
                      color="success">ลบ</Button>
                  </DialogActions>
                </Dialog>
                  
                <Dialog 
                  open={openAddStudyTime} 
                  onClose={handleCloseAddClick}
                  BackdropProps={{
                    style: {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)', // ปรับให้พื้นหลังโปร่งใสแต่มีความมืดเล็กน้อย
                    },
                  }} 
                  sx={{
                    '& .MuiDialog-paper': {
                      borderRadius: '8px', // ปรับขอบให้มน
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 1)', // เอาเงาออก
                      border: '1px solid rgba(16, 16, 16, 0.3)', // ขอบบางๆ โปร่งใส
                      padding: '2.5%',
                      width: '800px',
                      maxWidth: '758px',  // กำหนดขนาดสูงสุด
                      height: 'auto',  // ปรับขนาดความสูงของ Dialog ให้เหมาะสมกับเนื้อหา
                    },
                  }}>
                  <DialogTitle sx={{ color: 'green', fontWeight: 'bold' , fontSize: "30px",}}>เพิ่มเวลาเรียน!!</DialogTitle>
                  <DialogContent sx={{ backgroundColor: 'transparent',  }}>
                    <TimePick />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseAddClick} color="primary">ยกเลิก</Button>
                    
                  </DialogActions>
                </Dialog>


              <h1 className='h1' style={{ wordBreak: 'break-word' }}>รายวิชา: {courseData?.[0].CourseName}</h1>
              <div className='infoCourse' style={{ wordBreak: 'break-word' }}>
                {/* แสดงข้อมูลโดยการเข้าถึงค่าจาก courseData */}
                <h3 className='h3_Seach'>รหัสวิชา: {courseData?.[0].CourseCode || 'ไม่มีข้อมูล'}</h3>
                <h3 className='h3_Seach'>หน่วยกิต: {courseData?.[0].Credit || 'ไม่มีข้อมูล'}</h3>
                <h5 className='h3_Seach'>คำอธิบาย: {courseData?.[0].Description || 'ไม่มีข้อมูล'}</h5>
              </div>
                
            </div>
          </div>
          
          
          
          <div className='MainCss'>
        <div className='topic'>
      <div>
        <h1 className='h1'>Overview</h1>
        <h2 className='h1'>Assignment</h2>
        <div style={{ marginLeft: '30px', }}>
        {assignmetData && assignmetData.data && Array.isArray(assignmetData.data) ? (
          <ul>
            {assignmetData.data.map((assignment: any) => (
              <li
                key={assignment.ID}
                onClick={() => handleGotoAssignmet(assignment.ID, Number(courseID))}
                style={{ cursor: 'pointer', color: 'blue' }} // ทำให้คลิกได้ง่ายขึ้น
              >
                {assignment.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่มีแบบฝึก</p>
        )}

          
          
        </div>
        <CustomizedMenusCreateAssignment LessonID = {Number(courseID)} />
        <Divider sx={{ my: 5, alignSelf: 'stretch', width: '1390px' }} />

        {lessonData && lessonData.length > 0 ? (
    lessonData.map((lesson: any, index: number) => {

    // คัดกรองข้อมูลที่เกี่ยวข้องกับ lesson จากแต่ละประเภท
    const relatedContent = contentData
      ? contentData.filter((content: any) => content.lesson_id === lesson.ID)
      : [];
    const relatedUrl = urlData
      ? urlData.filter((url: any) => url.lesson_id === lesson.ID)
      : [];
    const relatedMaterial = materialData
      ? materialData.filter((material: any) => material.lesson_id === lesson.ID)
      : [];

    // Sort ข้อมูลตาม created_at จากใหม่ไปเก่า
    const allEntities = [
      ...relatedContent.map((content: any) => ({ ...content, type: 'content' })),
      ...relatedUrl.map((url: any) => ({ ...url, type: 'url' })),
      ...relatedMaterial.map((material: any) => ({ ...material, type: 'material' }))
    ];

    // รวมข้อมูลทั้งหมดเพื่อแสดงตามเวลาที่ถูกสร้าง
    const sortedEntities = allEntities.sort((a, b) => {
      // ตรวจสอบว่า field 'created_at' หรือฟิลด์ที่บันทึกเวลาใช้งานได้
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    return (
      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%' }}>
      <div style={{ wordBreak: 'break-word', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <h2 style={{ wordBreak: 'break-word' }}>{lesson.Title}</h2>
        <Button variant="outlined" color="error" onClick={() => handleDeleteLesson(lesson.ID)} sx={{ '&:hover': {  backgroundColor: 'rgba(0, 0, 0, 0.08)' }, minWidth: '20px', padding: '7px', marginLeft: '8px' }}>
            <DeleteIcon />
        </Button>
        <Button variant="outlined"  onClick={() => handleEditLesson( lesson.Title, lesson.ID)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
              <EditIcon color="primary"/>
          </Button>
      </div>
      {/* แสดงข้อมูลทั้งหมดในลำดับการสร้าง */}
      {sortedEntities.length > 0 ? (
      sortedEntities.map((entity: any, idx: number) => {
        if (entity.type === 'content') {
          if (entity.status === 'hide'){
            return (
              <div key={idx} style={{ wordBreak: 'break-word', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ flexGrow: 1 }}>
                  {entity.content_title && (
                    <p style={{ margin: 0, fontSize: '18px', color: '#c4c2c2', marginLeft: '25px'}}>{entity.content_title}</p>
                  )}
                  {entity.content && (
                    <p style={{ margin: '4px 0', fontSize: '18px', color: '#c4c2c2' , marginLeft: '25px'}}>{entity.content}</p>
                  )}
                </div>
                <Button variant="outlined" color="error" onClick={() => handleDeleteContent(entity.content_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(0, 0, 0, 0.08)' }, minWidth: '20px', padding: '7px', marginLeft: '8px' }}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined"  onClick={() => handleEditContent( entity.content_title, entity.content, entity.content_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <EditIcon color="primary"/>
                </Button>
                <Button variant="outlined"  onClick={() => handleUpdateStatusContent(entity.content_id, entity.status)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <HideSourceIcon color="disabled"/>
                </Button>
                

              
                <Dialog open={openEditContent} onClose={handleCloseEditContent} BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                  }} sx={{
                    '& .MuiDialog-paper': {
                      borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 1)', border: '1px solid rgba(16, 16, 16, 0.3)', margin: "auto", padding: '2.5%',
                    },
                  }}>
                    <DialogTitle sx={{ color: 'green', fontWeight: 'bold', fontSize: "30px" }}>แก้ไขข้อมูลเนื้อหา</DialogTitle>
                    <DialogContent>
                      <Typography gutterBottom>
                        ชื่อ:
                        <TextField
                          value={contentTitle}
                          onChange={(e) => setcontentTitle(e.target.value)}
                          fullWidth
                        />
                      </Typography>
                      <Typography gutterBottom>
                        รายละเอียด:
                        <TextField
                          value={content}
                          onChange={(e) => setcontent(e.target.value)}
                          fullWidth
                        />
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseEditContent} color="primary">ยกเลิก</Button>
                      <Button onClick={handleSaveEditContent} color="success">บันทึก</Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog open={openEditUrl} onClose={handleCloseEditUrl} BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                  }} sx={{
                    '& .MuiDialog-paper': {
                      borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 1)', border: '1px solid rgba(16, 16, 16, 0.3)', margin: "auto", padding: '2.5%',
                    },
                  }}>
                    <DialogTitle sx={{ color: 'green', fontWeight: 'bold', fontSize: "30px" }}>แก้ไขข้อมูลลิ้งค์</DialogTitle>
                    <DialogContent>
                      <Typography gutterBottom>
                        ชื่อ:
                        <TextField
                          value={urlTitle}
                          onChange={(e) => seturlTitle(e.target.value)}
                          fullWidth
                        />
                      </Typography>
                      <Typography gutterBottom>
                        URL:
                        <TextField
                          value={url}
                          onChange={(e) => seturl(e.target.value)}
                          fullWidth
                        />
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseEditUrl} color="primary">ยกเลิก</Button>
                      <Button onClick={handleSaveEditUrl} color="success">บันทึก</Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog open={openEditLesson} onClose={handleCloseEditLesson} BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                  }} sx={{
                    '& .MuiDialog-paper': {
                      borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 1)', border: '1px solid rgba(16, 16, 16, 0.3)', margin: "auto", padding: '2.5%',
                    },
                  }}>
                    <DialogTitle sx={{ color: 'green', fontWeight: 'bold', fontSize: "30px" }}>แก้ไขข้อมูลบทเรียน</DialogTitle>
                    <DialogContent>
                      <Typography gutterBottom>
                        ชื่อ:
                        <TextField
                          value={LessonTitle}
                          onChange={(e) => setLessonTitle(e.target.value)}
                          fullWidth
                        />
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseEditLesson} color="primary">ยกเลิก</Button>
                      <Button onClick={handleSaveEditLesson} color="success">บันทึก</Button>
                    </DialogActions>
                  </Dialog>

                     

              </div>
            );
          }else {
            return (
              <div key={idx} style={{ wordBreak: 'break-word', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ flexGrow: 1 }}>
                  {entity.content_title && (
                    <p style={{ margin: 0, fontSize: '18px', marginLeft: '25px'}}>{entity.content_title}</p>
                  )}
                  {entity.content && (
                    <p style={{ margin: '4px 0', fontSize: '18px', marginLeft: '25px' }}>{entity.content}</p>
                  )}
                </div>
                <Button variant="outlined" color="error" onClick={() => handleDeleteContent(entity.content_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(0, 0, 0, 0.08)' }, minWidth: '20px', padding: '7px', marginLeft: '8px' }}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined"  onClick={() => handleEditContent( entity.content_title, entity.content, entity.content_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <EditIcon color="primary"/>
                </Button>
                <Button variant="outlined"  onClick={() => handleUpdateStatusContent(entity.content_id, entity.status)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <HideSourceIcon color="success"/>
                </Button>
                
              </div>
            );
          }
          
        } else if (entity.type === 'url') {
          if (entity.status === 'hide'){
            return (
              <div key={idx} style={{ wordBreak: 'break-word', marginBottom: '14px' }}>
                {entity.title && entity.url && (
                  <a style={{ margin: '4px 0', fontSize: '18px', color: '#c4c2c2' }} href={entity.url} target="_blank" rel="noopener noreferrer"><LinkOutlined style={{ marginRight: '8px' }} /> {entity.title}</a>
                )}
                <Button variant="outlined" color="error" onClick={() => handleDeleteVideo(entity.url_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(0, 0, 0, 0.08)' }, minWidth: '20px', padding: '7px', marginLeft: '8px'}}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined"  onClick={() => handleEditUrl( entity.title, entity.url, entity.url_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <EditIcon color="primary"/>
                </Button>
                <Button variant="outlined"  onClick={() => handleUpdateStatusUrl(entity.url_id, entity.status)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <HideSourceIcon color="disabled"/>
                </Button>
              </div>
            );
          }else {
            return (
              <div key={idx} style={{ wordBreak: 'break-word', marginBottom: '14px' }}>
                {entity.title && entity.url && (
                  <a style={{ margin: '4px 0', fontSize: '18px'}} href={entity.url} target="_blank" rel="noopener noreferrer"><LinkOutlined style={{ marginRight: '8px' }} /> {entity.title}</a>
                )}
                <Button variant="outlined" color="error" onClick={() => handleDeleteVideo(entity.url_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(0, 0, 0, 0.08)' }, minWidth: '20px', padding: '7px', marginLeft: '8px'}}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined"  onClick={() => handleEditUrl( entity.title, entity.url, entity.url_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <EditIcon color="primary"/>
                </Button>
                <Button variant="outlined"  onClick={() => handleUpdateStatusUrl(entity.url_id, entity.status)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <HideSourceIcon color="success"/>
                </Button>
              </div>
            );
          }
          
        } else if (entity.type === 'material') {
          if(entity.status === 'hide') {
            const filePath = entity.file_path.replace(/\\/g,'/')
            return (
              <div key={idx} style={{ wordBreak: 'break-word', marginBottom: '14px' }}>
                {entity.material_name && entity.file_path && (
                  <a href={`https://api.se-elearning.online/${filePath}`} target="_blank" rel="noopener noreferrer">
                    <FileOpenIcon style={{ marginRight: '8px', fontSize: '18px', color: '#c4c2c2'  }} color='primary' />{entity.material_name}
                  </a>
                )}
                <Button variant="outlined" color="error" onClick={() => handleDeleteMaterialAll(entity.material_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(0, 0, 0, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px'}}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined"  onClick={() => handleUpdateStatusMaterial(entity.material_id, entity.status)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <HideSourceIcon color="disabled"/>
                </Button>
              </div>
            );
          }else {
            const filePath = entity.file_path.replace(/\\/g,'/')
            return (
              
              <div key={idx} style={{ wordBreak: 'break-word', marginBottom: '14px' }}>
                {entity.material_name && entity.file_path && (
                  <a href={`https://api.se-elearning.online/${filePath}`} target="_blank" rel="noopener noreferrer">
                    <FileOpenIcon style={{ marginRight: '8px', fontSize: '18px' }} color='primary' />{entity.material_name}
                  </a>
                )}
                <Button variant="outlined" color="error" onClick={() => handleDeleteMaterialAll(entity.material_id)} sx={{ '&:hover': {  backgroundColor: 'rgba(0, 0, 0, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px'}}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined"  onClick={() => handleUpdateStatusMaterial(entity.material_id, entity.status)} sx={{ '&:hover': {  backgroundColor: 'rgba(170, 167, 167, 0.08)' }, minWidth: '10px', padding: '7px', marginLeft: '8px' }}>
                  <HideSourceIcon color="success"/>
                </Button>
              </div>
            );
          }
          
        }
        return null;
      })
    ) : (
      <p>ไม่มีข้อมูล</p>
    )}

      <CustomizedMenus LessonID={lesson.ID} />
      <Divider sx={{ my: 5, alignSelf: 'stretch', width: '960px' }} />
    </div>
  );
})
) : (
<p>Loading...</p>
)}



    </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <React.Fragment>
              <Box sx={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10 }}>
                <Button
                  className="CreateLesson"
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    fontSize: '15px',
                    fontFamily: 'Prompt, sans-serif',
                    backgroundColor: '#ff6b00',
                    color: 'white',
                    padding: '8px 15px',
                    borderRadius: '12px',
                    transition: 'background-color 0.3s ease',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#f9f9f9',
                      color: '#333',
                    },
                  }}
                  onClick={() => setOpen(true)}
                >
                 + เพิ่มบทเรียน
                </Button>
              </Box>

              <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog sx={{ width: '710px', height: 'auto', margin: 'auto' }}>
                  <h2>สร้างบทเรียน</h2>
                  <FormControl>
                    <FormLabel className="LessonName">บทที่</FormLabel>
                    <Input
                      value={LessonData.Sequence}
                      onChange={(e) => setLessonData({ ...LessonData, Sequence: Number(e.target.value) })}
                      type="number"
                    />
                  </FormControl>
                  <FormControl required>
                    <FormLabel className="LessonName">ชื่อบทเรียน</FormLabel>
                    <Input
                      required
                      autoFocus
                      value={LessonData.Title}
                      onChange={(e) => setLessonData({ ...LessonData, Title: e.target.value })}
                      placeholder="eg. บทที่ 1"
                    />
                  </FormControl>

                  <div className="ButtonLayer">
                    <Button
                      className="submitButton"
                      type="submit"
                      sx={{ marginLeft: 'auto', border: '2px solid green' }}
                      color="success"
                      onClick={handleSubmitLesson}
                    >
                      เสร็จสิ้น
                    </Button>
                  </div>
                </ModalDialog>
              </Modal>
            </React.Fragment>
          </div>

        </div>
      </div>
    </header>
  );
};

export default ManageCourse;