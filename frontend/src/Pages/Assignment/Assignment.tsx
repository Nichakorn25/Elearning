import React, { useEffect, useState } from 'react';
import './Assignment.css';
import { Button, Descriptions, DescriptionsProps, Empty, Form, Input, Modal, Table, Tag, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CreateSubmission, GetAssignmentByIDAndCourseID, GetSubmission, DeleteSubmission, GetGrade } from '../../services/https';
import dayjs from 'dayjs';
import { AssignmentInterface, SubmissionInterface } from '../../Interface/Assignment';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';

// Define the columns for the table
const columns = [
  {
    title: 'สถานะการส่งงาน',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => <Tag color={text === 'ยังไม่ส่ง' ? 'red' : 'green'}>{text}</Tag>,
  },
  {
    title: 'สถานะการตรวจ',
    dataIndex: 'reviewStatus',
    key: 'reviewStatus',
    render: (text: string) => <Tag color={text === 'ยังไม่ส่งเพื่อตรวจ' ? 'red' : 'green'}>{text}</Tag>,
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
  {
    title: 'ส่งไฟล์งาน',
    dataIndex: 'file',
    key: 'file',
  },
];

// const items: DescriptionsProps['items'] = [
//   {
//     label: 'คะแนนที่ได้',
//     children: '10/10',
//   },
//   {
//     label: 'ความคิดเห็น',
//     children: '-',
//   },
// ]

const Assignment: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any | null>(null);
  const [assignment,setAssignment] = useState<AssignmentInterface | null>(null);
  const [submissionID, setSubmissionID] = useState<any | null>(null);
  const [feedbackItems, setFeedbackItems] = useState<DescriptionsProps['items']>([]); // เก็บข้อมูล items สำหรับ Descriptions
  const useId = localStorage.getItem("id");
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { AssignmentID, CourseID } = useParams();
  console.log("ffffff",CourseID)

    // ฟังก์ชันในการแสดงชื่อไฟล์เป็นลิงก์
    const renderFileLink = (fileName: string, filePath: string) => {
      const BASE_URL = `http://localhost:8080/`; // Replace with your actual server base URL
      const fullPath = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
      return (
        <a href={fullPath} target="_blank" rel="noopener noreferrer">
          {fileName}
        </a>
      );
    };
    

const calculateTimeRemaining = (deadline: string) => {
    const now = dayjs(); // เวลาปัจจุบัน
    const deadlineTime = dayjs(deadline); // เวลาที่กำหนด (deadline)
  
    const differenceInMilliseconds = deadlineTime.diff(now); // ความต่างในหน่วยมิลลิวินาที
    const differenceInSeconds = Math.abs(differenceInMilliseconds / 1000); // แปลงเป็นวินาที (ค่าสัมบูรณ์)
    
    const days = Math.floor(differenceInSeconds / (24 * 3600)); // คำนวณจำนวนวัน
    const hours = Math.floor((differenceInSeconds % (24 * 3600)) / 3600); // คำนวณจำนวนชั่วโมง
  
    if (differenceInMilliseconds < 0) {
      // หาก deadline ผ่านไปแล้ว
      return `งานมอบหมายถูกส่งล่าช้า ${days} วัน ${hours} ชั่วโมง`;
    } else {
      // หากยังไม่ถึง deadline
      return `เหลือเวลา ${days} วัน ${hours} ชั่วโมง`;
    }
  };

  const fetchSubmission = async () => {
    try {
      const res = await GetSubmission(Number(useId), Number(AssignmentID));
  
      if (res.status === 200 ) {
        const gradeResult = await GetGrade(res.data.submission.ID);
        setSubmissionID(res.data.submission.ID);
        console.log("kkkkk",gradeResult.data.grade)

         setFeedbackItems([
           {
             label: 'คะแนนที่ได้',
             children: gradeResult.data.grade.score || '-',
           },
           {
             label: 'ความคิดเห็น',
             children: gradeResult.data.grade.feedback || '-',
           },
         ]);
        return {
          ...res.data, // เก็บข้อมูล submission เดิม
          grade: gradeResult.data?.grade || null, // แนบข้อมูล grade (ถ้าไม่มีให้เป็น null)
        };
      } else {
        // กรณีไม่มีข้อมูลใน backend หรือ error อื่นๆ
        console.log("No submission data found.");
        message.open({
          type: "warning",
          content: "ยังไม่มีข้อมูลการส่งงาน",
        });
        return null; // คืนค่า null ในกรณีไม่มีข้อมูล
      }
    } catch (error) {
      console.error("Error fetching submission:", error);
      message.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลการส่งงาน",
      });
      return null; // คืนค่า null ในกรณีที่เกิดข้อผิดพลาด
    }
  };
  
  const fetchAssignment = async () => {
    try {
      const result = await GetAssignmentByIDAndCourseID(Number(CourseID), Number(AssignmentID));
      if (result.status === 200) {
        console.log("assignment:", result.data.data);
        setAssignment(result.data.data);
        return result.data.data;
      } else {
        message.open({
          type: "error",
          content: result.data?.error || "เกิดข้อผิดพลาดในการดึงข้อมูลการมอบหมาย",
        });
        return null; // คืนค่า null ในกรณีที่เกิดข้อผิดพลาด
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      message.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลการมอบหมาย",
      });
      return null; // คืนค่า null ในกรณีที่เกิดข้อผิดพลาด
    }
  }; 

  

  const getSubmissionByUser = async () => {
    const submission = await fetchSubmission();
    const assignmentData = await fetchAssignment();
  
    if (submission && assignmentData) {
      const gradeAvailable = submission.grade !== null;
      // ถ้ามีการส่งงานแล้ว
      setDataSource([
        {
          key: 0,
          status: 'ส่งเพื่อรับการตรวจแล้ว',
          reviewStatus: gradeAvailable ? 'ตรวจแล้ว' : 'ส่งเพื่อตรวจแล้ว',
          deadline: dayjs(assignmentData.deadline).format('dddd, D MMMM YYYY, h:mmA'),
          timeRemaining: calculateTimeRemaining(assignmentData.deadline),
          lastModified: dayjs(submission.UpdatedAt).format('dddd, D MMMM YYYY, h:mmA'),
          file: renderFileLink(submission.submission.file_name, submission.submission.file_path),
          filename: submission.submission.file_name,
        },
      ]);
    } else if (assignmentData) {
      // ถ้ายังไม่มีการส่งงาน
      setDataSource([
        {
          key: 0,
          status: 'ยังไม่ส่ง',
          reviewStatus: 'ยังไม่ส่งเพื่อตรวจ',
          deadline: dayjs(assignmentData.deadline).format('dddd, D MMMM YYYY, h:mmA'),
          timeRemaining: calculateTimeRemaining(assignmentData.deadline),
          lastModified: '-', // ถ้ายังไม่ส่งงานจะไม่มีการแก้ไข
          file: '-', // ถ้ายังไม่ส่งงานจะแสดงเครื่องหมาย "-"
        },
      ]);
    } else {
      // ถ้าไม่มีข้อมูล Submission หรือ Assignment
      setDataSource([]); // ล้างข้อมูลในตาราง
    }
  };

  // const [MaterialData, setMaterialData] = useState<SubmissionInterface>({
  //   submission_date: undefined,
  //   file_name: "",
  //   file_path: undefined,
  //   user_id: 0,
  //   assignment_id: 0,
  // });

  const createSubmissionProps = async (submissionData: SubmissionInterface) => {
    const formData = new FormData();
    formData.append("file_name", submissionData.file_name || "");
    formData.append("file_path", submissionData.file_path as File);
    formData.append("user_id", String(submissionData.user_id));
    formData.append("assignment_id", String(submissionData.assignment_id));
    formData.append("user_id", submissionData.submission_date || "");
  
    console.log("assi:", submissionData); // Debugging
    const res = await CreateSubmission(formData);
  
    if (res.status === 200) {
      form.resetFields();
      message.success('ส่งงานเรียบร้อยแล้ว');
      getSubmissionByUser(); // Refresh the data
    } else {
      message.error(res.data.error || 'เกิดข้อผิดพลาดในการส่งงาน');
    }
  };

  // const onFinish = async (submissionData: SubmissionInterface) => {
  //   const formData = new FormData();
  //   formData.append("file_name", submissionData.file_name || "");
  //   formData.append("file_path", submissionData.file_path as File);
  //   formData.append("user_id", submissionData.submission_date || "");
  
  //   const res = await UpdateSubmission(submissionID, formData);
  
  //   if (res.status == 200) {
  //     message.open({
  //       type: "success",
  //       content: res.data.message,
  //     });
  //     getSubmissionByUser();
  //   } else {
  //     message.open({
  //       type: "error",
  //       content: res.data.error,
  //     });
  //   }
  // };


  const handleDeleteSubmission = async () => {
    try {
      const res = await DeleteSubmission(submissionID);
      console.log("assignment:", res);
      if (res.status == 200) {
        message.success('ลบงานเรียบร้อยแล้ว');
        setDataSource(null); // รีเซ็ตตารางหลังจากลบ
        setUploadedFile(null); // ลบไฟล์ที่อัปโหลดออก
        form.resetFields(); // รีเซ็ตฟอร์ม
        getSubmissionByUser();
      } else {
        message.error('เกิดข้อผิดพลาดในการลบงาน');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      message.error('เกิดข้อผิดพลาดในการลบงาน');
    }
  };

  useEffect(() => {
    getSubmissionByUser();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const renderButtons = () => {
    const submissionExists = dataSource && dataSource[0]?.status !== 'ยังไม่ส่ง';
  
    if (submissionExists) {
      return (
        <div>
          <Button
            className="direct"
            onClick={handleDeleteSubmission} // ลบงาน
            style={{ marginLeft: '10px' }}
          >
            ลบงาน
          </Button>
        </div>
      );
    }
  
    // แสดงปุ่มส่งงานในกรณียังไม่มีการส่ง
    return (
      <Button className="direct" type="primary" onClick={showModal}>
        ส่งงาน
      </Button>
    );
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // Validate the form
      const submissionData = {
        ...values,
        file_name: values.file_name,
        file_path: uploadedFile.file, // URL of the uploaded file
        user_id: useId,
        assignment_id: AssignmentID,
      };
  
      console.log("Submission Data:", submissionData); // Debugging
      await createSubmissionProps(submissionData); // Pass data directly
      setIsModalOpen(false); // Close Modal
    } catch (info) {
      console.error('Validation Failed:', info);
      message.error('Form submission failed!'); // Show error message
    }
  };
  

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleBeforeUpload = (file: File) => {
    // ตรวจสอบประเภทไฟล์และขนาดไฟล์
    const isAllowedType =
    file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isAllowedType) {
    message.error('คุณสามารถอัปโหลดเฉพาะไฟล์ PDF หรือรูปภาพ (JPG/PNG) เท่านั้น!');
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('ขนาดไฟล์ต้องน้อยกว่า 2MB!');
    return false;
  }

  // อัปเดตฟอร์มด้วยไฟล์ที่เลือก
  form.setFieldsValue({ file });
  setUploadedFile({ file }); // เก็บข้อมูลไฟล์สำหรับการแสดงผล
  message.success(`ไฟล์ "${file.name}" ถูกเลือกเรียบร้อยแล้ว`);
  return false; // หยุดการอัปโหลดอัตโนมัติ
  };
  
  return (
    <div className='assign'>
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="assignment-body">
        <h1>Eng23 3052 COMPUTER AND COMUNICATION</h1>
      </div>
      <div className="assignment-body2">
        <h1>{assignment?.title}</h1>
        <h2>{assignment?.description}</h2>
        <div className="details">
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>
        <div className="set-buttonA">
          {renderButtons()}
        </div>
        <Modal title="ส่งงาน" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} name="teacher_form" layout="vertical">
            <Form.Item
              label="ชื่อไฟล์"
              name="file_name"
              rules={[{ required: true, message: 'Please input the file name!' }]}
            >
              <Input />
            </Form.Item>
          
          <Upload 
            name="file_path" 
            beforeUpload={handleBeforeUpload} 
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>อัปโหลดไฟล์</Button>
          </Upload>
          {uploadedFile ? (
              <div>
                <p>
                  ไฟล์ที่อัปโหลด: 
                  <a href={uploadedFile.file.url} target="_blank" rel="noopener noreferrer">
                    {uploadedFile.file.name}
                  </a>
                </p>
              </div>
            ) : (
              <Empty description="ยังไม่มีไฟล์ที่อัปโหลด" />
            )}

          </Form>
        </Modal>
      </div>
      <div className="AFeedback">
      <Descriptions bordered title="ความคิดเห็น" items={feedbackItems} />
      </div>
    </div>
  );
};

export default Assignment;