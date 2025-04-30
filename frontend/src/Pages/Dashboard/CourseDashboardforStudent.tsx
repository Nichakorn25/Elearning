import Header from '../Component/Header/Header';
import React, { useState } from 'react';
import './CourseDashboardforStudent.css';
import Divider from '@mui/material/Divider';
import { GetCoursesByID, GetLessonByCourseID, GetCourseContent, GetCourseUrl, GetCourseMaterial, GetAssignmentCourseID} from '../../services/https';
import { useNavigate, useParams } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import FileOpenIcon from '@mui/icons-material/FileOpen';


const ManageCourse: React.FC = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setlessonData] = useState<any>(null);
  const [contentData, setcontentData] = useState<any>(null);
  const [urlData, setUrlData] = useState<any>(null);
  const [materialData, setMaterialData] = useState<any>(null);
  const navigate = useNavigate();
  

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

      if (id) {
          try {
              const response = await GetCourseUrl(id);
              console.log('Response:', response);  // ดูว่า response เป็นอะไร
              if (response && response.data) {
                  console.log('Url data:', response.data);  // ตรวจสอบข้อมูลจริงที่ได้รับ
                  console.log('Url data:', urlData);
                  setUrlData(response.data);  // ตั้งค่า courseData
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

const [assignmetData, setAssignmetData] = useState<any>(null);
  React.useEffect(() => {
    const GetAssignment = async () => {

        if (id) {
            try {
                const response = await GetAssignmentCourseID(Number(id));
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


const handleGotoAssignmet = (AssignmentID: number, id: number) => {
  navigate(`/assignment_student/${AssignmentID}/${id}`);
};
  
  
  if (!courseData) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <header>
      <div className='Header'>
        <Header />
      
          <div className='nametopic'>
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
                onClick={() => handleGotoAssignmet(assignment.ID,Number(id))}
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
      <div style={{ wordBreak: 'break-word', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ wordBreak: 'break-word' }}>{lesson.Title}</h2>
      </div>
      {/* แสดงข้อมูลทั้งหมดในลำดับการสร้าง */}
      {sortedEntities.length > 0 ? (
      sortedEntities.map((entity: any, idx: number) => {
        if (entity.type === 'content') {
          if (entity.status === 'active'){
            return (
              <div key={idx} style={{ wordBreak: 'break-word', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flexGrow: 1 }}>
                  {entity.content_title && (
                    <p style={{ fontSize: '18px', marginLeft: '25px'}}>{entity.content_title}</p>
                  )}
                  {entity.content && (
                    <p style={{  fontSize: '18px' , marginLeft: '25px'}}>{entity.content}</p>
                  )}
                </div>
              </div>
            );
          }
        } else if (entity.type === 'url') {
          if (entity.status === 'active'){
            return (
              <div key={idx} style={{ wordBreak: 'break-word' }}>
                {entity.title && entity.url && (
                  <a style={{ fontSize: '18px'}} href={entity.url} target="_blank" rel="noopener noreferrer"><LinkOutlined style={{ marginRight: '8px' }} /> {entity.title}</a>
                )}
              </div>
            );
          }
          
        } else if (entity.type === 'material') {
          if(entity.status === 'active') {
            return (
              <div key={idx} style={{ wordBreak: 'break-word' }}>
                {entity.material_name && entity.file_path && (
                  <a href={`http://localhost:8000/${entity.file_path}`} target="_blank" rel="noopener noreferrer">
                    <FileOpenIcon style={{ marginRight: '8px', fontSize: '18px'}} color='primary' />{entity.material_name}
                  </a>
                )}
              </div>
            );
          }
        }
        return null;
      })
    ) : (
      <p>ไม่มีข้อมูล</p>
    )}

      
      <Divider sx={{ my: 5, alignSelf: 'stretch', width: '1390px' }} />
    </div>
  );
})
) : (
<p>Loading...</p>
)}



    </div>  
        </div>
      </div>
    </header>
  );
};

export default ManageCourse;