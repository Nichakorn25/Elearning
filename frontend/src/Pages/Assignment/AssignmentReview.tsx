import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Assignment.css';
import { Button, Checkbox, Form, Input, InputNumber, message, Modal, Table, Tag } from 'antd';
import { GetSubmissionAll, GetGrade, CreateGrade, UpdateGrade, GetCoursesByID, GetAssignmentByIDAndCourseID } from '../../services/https';
import dayjs from 'dayjs';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';
import { AssignmentInterface, GradeInterface } from '../../Interface/Assignment';
import { CourseInterface } from '../../Interface/ICourse';

const AssignmentReview: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { AssignmentID, CourseID } = useParams();


  const handleAteach = (AssignmentID: number, CourseID: number) => {
    navigate(`/assignment_teacher/${AssignmentID}/${CourseID}`);
  };

  const renderFileLink = (fileName: string, filePath: string) => (
    <a href={filePath} target="_blank" rel="noopener noreferrer">
      {fileName}
    </a>
  );

  const handleOpenModal = (submission: any) => {
    setCurrentSubmission(submission);
    setIsModalVisible(true);

    // ถ้ากด "แก้ไข" ให้โหลดข้อมูลเดิมมาแสดงในฟอร์ม
    if (submission.status === 'graded') {
      form.setFieldsValue({
        score: submission.score || 0,
        isGraded: true,
        feedback: submission.feedback || '',
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setCurrentSubmission(null);
    form.resetFields();
  };

  const handleCreateGrade = async (values: { score: number; isGraded: boolean; feedback: string }) => {
    try {
      if (!currentSubmission) {
        message.error('ไม่สามารถหาข้อมูล submission ได้');
        return;
      }

      const gradeData: GradeInterface = {
        submission_id: currentSubmission.id,
        score: values.score,
        status: values.isGraded ? 'graded' : 'pending',
        feedback: values.feedback || '',
      };

      const result = await CreateGrade(gradeData);

      if (result.status === 200) {
        message.success(`บันทึกคะแนนสำเร็จสำหรับ submission ID: ${currentSubmission.id}`);
        getSubmissionAll();
        handleCancelModal();
      } else {
        message.error(`ไม่สามารถบันทึกคะแนนได้: ${result.data.error || 'เกิดข้อผิดพลาด'}`);
      }
    } catch (error) {
      console.error('Error creating grade:', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกคะแนน');
    }
  };

  const handleUpdateGrade = async (values: { score: number; isGraded: boolean; feedback: string }) => {
    try {
      if (!currentSubmission) {
        message.error('ไม่สามารถหาข้อมูล submission ได้');
        return;
      }

      const gradeData: GradeInterface = {
        submission_id: currentSubmission.id,
        score: values.score,
        status: values.isGraded ? 'graded' : 'pending',
        feedback: values.feedback || '',
      };

      const result = await UpdateGrade(currentSubmission.id, gradeData);

      if (result.status === 200) {
        message.success(`แก้ไขคะแนนสำเร็จสำหรับ submission ID: ${currentSubmission.id}`);
        getSubmissionAll();
        handleCancelModal();
      } else {
        message.error(`ไม่สามารถแก้ไขคะแนนได้: ${result.data.error || 'เกิดข้อผิดพลาด'}`);
      }
    } catch (error) {
      console.error('Error updating grade:', error);
      message.error('เกิดข้อผิดพลาดในการแก้ไขคะแนน');
    }
  };

  const getSubmissionAll = async () => {
    try {
      const result = await GetSubmissionAll(Number(AssignmentID));
      if (result.status === 200) {
        const submissions = result.data.submission;

        const formattedData = await Promise.all(
          submissions.map(async (submission: any, index: number) => {
            const gradeResult = await GetGrade(submission.ID);
            const grade = gradeResult.status === 200 ? gradeResult.data.grade : { status: 'ยังไม่มีคะแนน' };

            return {
              key: index + 1,
              id: submission.ID,
              studentID: submission.student_id || 'B6516093',
              studentName: submission.student_name || 'สุเมธ สาลีพันธ์',
              file: renderFileLink(submission.file_name, submission.file_path),
              sendDate: dayjs(submission.UpdatedAt).format('dddd, D MMMM YYYY, h:mmA'),
              status: grade.status,
              score: grade.score || 0,
              feedback: grade.feedback || '',
            };
          })
        );

        setDataSource(formattedData);
        setSubmissionCount(submissions.length);
      } else {
        message.error('ไม่สามารถดึงข้อมูลการส่งงานได้');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  };

  const [dataCourse, setDataCourse]  = useState<CourseInterface | null>(null);
  const [dataA, setDataA]  = useState<AssignmentInterface | null>(null);

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

  const fetchA = async () =>{
    try {
      const aRes = await GetAssignmentByIDAndCourseID(Number(CourseID), Number(AssignmentID));
      console.log("cousreeeee",aRes.data)

    if (aRes.status === 200){
      setDataA(aRes.data.data)
    }

    }catch (error) {
      console.error("Error fetching submission:", error);
            message.open({
              type: "error",
              content: "เกิดข้อผิดพลาดในการดึงข้อมูลการส่งงาน",
          });
    }
  }

  useEffect(() => {
    getSubmissionAll();
    fetchCourse();
    fetchA();
  }, []);

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'รหัสนักศึกษา',
      dataIndex: 'studentID',
      key: 'studentID',
    },
    {
      title: 'ชื่อ-สกุล',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'งานที่ส่ง',
      dataIndex: 'file',
      key: 'file',
    },
    {
      title: 'วันที่ส่ง',
      dataIndex: 'sendDate',
      key: 'sendDate',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={text === 'ยังไม่มีคะแนน' ? 'red' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: 'การจัดการ',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => handleOpenModal(record)}
        >
          {record.status === 'graded' ? 'แก้ไข' : 'ตรวจงาน'}
        </Button>
      ),
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
        <h1>{dataA?.title}</h1>
        <h2>จำนวนที่ส่ง {submissionCount}</h2>
        <div className="details">
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>
        <Button className="direct" type="primary" onClick={() => handleAteach(Number(AssignmentID), Number(CourseID) )}>
          ย้อนกลับ
        </Button>
      </div>

      <Modal
        title={currentSubmission?.status === 'graded' ? 'แก้ไขคะแนน' : 'ให้คะแนน'}
        open={isModalVisible}
        onCancel={handleCancelModal}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              if (currentSubmission?.status === 'graded') {
                handleUpdateGrade(values);
              } else {
                handleCreateGrade(values);
              }
            })
            .catch((errorInfo) => {
              console.error('Validation Failed:', errorInfo);
            });
        }}
      >
        <Form form={form} layout="vertical" name="gradeForm">
          <Form.Item label="คะแนน" name="score" rules={[{ required: true, message: 'กรุณากรอกคะแนน' }]}>
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item name="isGraded" valuePropName="checked">
            <Checkbox>เช็คว่าตรวจแล้ว</Checkbox>
          </Form.Item>
          <Form.Item label="ความคิดเห็นเพิ่มเติม (Feedback)" name="feedback">
            <Input.TextArea rows={4} placeholder="กรอกความคิดเห็นเกี่ยวกับการตรวจงาน (ถ้ามี)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssignmentReview;