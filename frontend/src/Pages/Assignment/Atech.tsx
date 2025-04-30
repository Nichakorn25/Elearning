import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import './Assignment.css';
import { Button, DatePicker, Form, Input, message, Modal, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { GetAssignmentByIDAndCourseID, UpdateAssignment, GetSubmissionAll, GetGradesAll, GetCoursesByID } from '../../services/https/index';
import { AssignmentInterface } from '../../Interface/Assignment';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';
import { CourseInterface } from '../../Interface/ICourse';

const initialDataSource = [
  {
    status: '',
    reviewStatus: '',
    deadline: '',
    timeRemaining: '',
    lastModified: '',
  },
];

const Ateach: React.FC = () => {
  // console.log("courseIDddd:", CourseID);  // Should not be undefined now
  // console.log("assignmentIDdddd:", AssignmentID);  // Should not be undefined now
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { AssignmentID, CourseID } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [assignment,setAssignment] = useState<AssignmentInterface | null>(null);
  const [dataSource, setDataSource] = useState(initialDataSource);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [dataCourse, setDataCourse]  = useState<CourseInterface | null>(null);

  // useEffect(() => {
  //   if (AssignmentID && CourseID) {
  //     fetchData(); // เรียกฟังก์ชัน fetchData เมื่อค่าพารามิเตอร์พร้อมใช้งาน
  //   } else {
  //     message.error("ไม่มีข้อมูล AssignmentID หรือ CourseID");
  //   }
  // }, [AssignmentID, CourseID]);


  const calculateTimeRemaining = (deadline: string) => {
    const now = dayjs(); // เวลาปัจจุบัน
    const deadlineTime = dayjs(deadline); // เวลาที่กำหนด (deadline)
  
    const differenceInMilliseconds = deadlineTime.diff(now); // ความต่างในหน่วยมิลลิวินาที
    const differenceInSeconds = Math.abs(differenceInMilliseconds / 1000); // แปลงเป็นวินาที (ค่าสัมบูรณ์)
    
    const days = Math.floor(differenceInSeconds / (24 * 3600)); // คำนวณจำนวนวัน
    const hours = Math.floor((differenceInSeconds % (24 * 3600)) / 3600); // คำนวณจำนวนชั่วโมง
  
    if (differenceInMilliseconds < 0) {
      // หาก deadline ผ่านไปแล้ว
      return `หมดเวลาส่ง ${days} วัน ${hours} ชั่วโมง`;
    } else {
      // หากยังไม่ถึง deadline
      return `เหลือเวลา ${days} วัน ${hours} ชั่วโมง`;
    }
  };

  const fetchCourse = async () =>{
    try {
      const couresRes = await GetCoursesByID(String(CourseID));
      console.log("cousreeeee",couresRes.data[0])

    if (couresRes.status === 200){
      setDataCourse(couresRes.data[0])
    }

    }catch (error) {
      console.error("Error fetching submission:", error);
            message.open({
              type: "error",
              content: "เกิดข้อผิดพลาดในการดึงข้อมูลการส่งงาน",
          });
    }
    
  }

  const fetchData = async () => {
    try {
      const [assignmentRes, submissionRes, GradeRes] = await Promise.all([
        GetAssignmentByIDAndCourseID(Number(CourseID), Number(AssignmentID)),
        GetSubmissionAll(Number(AssignmentID)),
        GetGradesAll(Number(AssignmentID)),
      ]);
  
      let submissionCount = 0;
      let checkedCount = 0;
      console.log("courseID:",CourseID)
      console.log("assignmentID:",AssignmentID)
      console.log("grade:", GradeRes.data.submissions);
      console.log("assignmentRes:", assignmentRes.data);
      console.log("submissionRes:", submissionRes.data);
      
      // ตรวจสอบผลลัพธ์ของ Assignment
      if (assignmentRes.status === 200) {
        setAssignment(assignmentRes.data.data);
        console.log("assignment:", assignmentRes.data.data);
      } else {
        message.open({
          type: "error",
          content: assignmentRes.data?.error || "Unknown error occurred in assignments.",
        });
      }
  
      // ตรวจสอบผลลัพธ์ของ Submission
      if (submissionRes.status === 200) {
        const submissions = submissionRes.data.submission;
        submissionCount = submissions.length; // คำนวณจำนวน Submission ทั้งหมด
      } else {
        message.open({
          type: "error",
          content: submissionRes.data?.error || "Unknown error occurred in submissions.",
        });
      }
      
      // Set default value if grades are not available
      if (GradeRes.status === 200) {
        const grades = GradeRes.data.submissions;
        checkedCount = grades.length;
        console.log("submission count:", checkedCount);
      } else {
        console.warn("Grades data is not available");
      }
  
      // ตั้งค่า DataSource
      if (assignmentRes.status === 200) {
        setDataSource([
          {
            status: `ส่งเพื่อรับการตรวจแล้ว ${submissionCount}`,
            reviewStatus: `ตรวจแล้ว ${checkedCount}`,
            deadline: dayjs(assignmentRes.data.data.deadline).format('dddd, D MMMM YYYY, h:mmA'),
            timeRemaining: calculateTimeRemaining(assignmentRes.data.data.deadline),
            lastModified: dayjs(assignmentRes.data.data.UpdatedAt).format('dddd, D MMMM YYYY, h:mmA'),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.open({
        type: "error",
        content: "An error occurred while fetching data.",
      });
    }
  };
  

  const onFinish = async (values: AssignmentInterface) => {
    let payload = {
      ...values,
    };
  
    const res = await UpdateAssignment(Number(AssignmentID), payload);
  
    if (res.status == 200) {
      message.open({
        type: "success",
        content: res.data.message,
      });
      fetchData();
    } else {
      message.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchCourse();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
    .validateFields() // ตรวจสอบข้อมูลในฟอร์ม
    .then((values) => {
      // เมื่อข้อมูลถูกต้องแล้ว จะเรียก onFinish
      onFinish(values); // ส่ง values ที่ได้จากฟอร์มไปที่ onFinish
      setIsModalOpen(false); // ปิด Modal
      // setTimeout(() => {
      //   navigate("/assignment_teacher"); // เปลี่ยนหน้าไปยัง "/assignment_teacher" หลังจาก 2 วินาที
      // }, 2000);
    })
    .catch((info) => {
      console.error('Validation Failed:', info);
      message.error("Form submission failed!"); // แสดงข้อความหาก validation ล้มเหลว
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReview = (AssignmentID: number, CourseID: number) => {
    navigate(`/assignment_review/${AssignmentID}/${CourseID}`);
  };

  const columns =  [
    {
      title: 'การส่งงาน',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'สถานะการตรวจ',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'กำหนดส่ง',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'เวลาที่เหลืออยู่',
      dataIndex: 'timeRemaining',
      key: 'timeRemaining',
      render: (text: string) => <Tag color={text.includes('เหลือเวลา') ? 'green' : 'red'}>{text}</Tag>,
    },
    {
      title: 'ปรับปรุงครั้งสุดท้ายเมื่อ',
      dataIndex: 'lastModified',
      key: 'lastModified',
    },
  ];

  return (
    <div className="assign">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="assignment-body">
        <h1>รายวิชา: {dataCourse?.CourseName}</h1>
        <h2>รหัสวิชา: {dataCourse?.CourseCode}</h2>
      </div>
      <div className="assignment-body2">
        <h1>{assignment?.title}</h1>
        <h2>{assignment?.description}</h2>
        <div className="details">
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>
        <div className="set-buttonA">
          <Button className="direct" type="primary" onClick={showModal}>
            แก้ไข
          </Button>
          <Button className="direct" type="primary" onClick={() =>handleReview(Number(AssignmentID), Number(CourseID))}>
            ตรวจงาน
          </Button>
        </div>
        
        <Modal title="แก้ไข" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Form form={form} name="teacher_form" layout="vertical">
            <Form.Item
              label="Title"
              name="title"
              initialValue={assignment?.title}
              rules={[{ required: true, message: 'Please input the title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              initialValue={assignment?.description}
              rules={[{ required: true, message: 'Please input the description!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Deadline"
              name="deadline"
              initialValue={assignment?.deadline ? dayjs(assignment?.deadline) : null}
              rules={[{ required: true, message: 'Please select the deadline!' }]}
            >
              <DatePicker showTime />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Ateach ;