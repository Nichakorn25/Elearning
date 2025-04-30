import React, { useState, useEffect } from 'react';
import { Table, Button, Tabs, message, Popconfirm, Modal, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { GetAllCourse, UpdateCourseExam, GetCategoryss, GetSemesters, GetCoursesByID } from '../../services/https';
import './AdminFillDetails.css';
import { CourseFormValues } from '../../Interface/Admin';

const { Search } = Input;

const AdminFillDetails: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm(); // Create form instance
  dayjs.extend(utc);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetAllCourse();
      if (response && response.data && Array.isArray(response.data.data)) {
        setCourses(response.data.data);  // Extracting courses from the data field
        setFilteredCourses(response.data.data); // Set the initial filtered courses
      } else {
        setError('No course data available');
      }
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await GetCategoryss();
      setCategories(response.data || []);
    };

    const fetchSemesters = async () => {
      const response = await GetSemesters();
      setSemesters(response.data || []);
    };

    fetchCourses();
    fetchCategories();
    fetchSemesters();
  }, []);

  // ฟังก์ชันค้นหา
  const handleSearch = (value: string) => {
    if (value) {
      const filtered = courses.filter((course) =>
        `${course.CourseName} ${course.CourseCode} ${course.Description} ${course.Category?.CategoryName} ${course.Semester?.Term} ${course.Semester?.Year}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses); // หากไม่มีคำค้นหาคืนค่าข้อมูลทั้งหมด
    }
  };

  const handleEdit = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetCoursesByID(courseId.toString());
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const course = response.data[0]; // Set the first item from the array
        setEditingCourse(course); // Set the editing course data
        setIsModalVisible(true);
  
        // ตรวจสอบค่าก่อนตั้งค่าในฟอร์ม
        const examSchedule = course.ExamSchedule[0] || {};
        
        form.setFieldsValue({
          CourseName: course.CourseName,
          CourseCode: course.CourseCode,
          Credit: course.Credit,
          Description: course.Description,
          CategoryID: course.CategoryID,
          SemesterID: course.SemesterID,
          ExamDate: examSchedule.ExamDate ? dayjs.utc(examSchedule.ExamDate) : null, // หากไม่มีค่าให้ใช้วันที่ปัจจุบัน
          StartTime: examSchedule.StartTime ? dayjs.utc(examSchedule.StartTime) : null, // หากไม่มีเวลาให้เป็น null
          EndTime: examSchedule.EndTime ? dayjs.utc(examSchedule.EndTime) : null, // หากไม่มีเวลาให้เป็น null
        });
      } else {
        message.error('Failed to load course details');
      }
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };
  


  const handleSave = async (values: CourseFormValues) => {
    const examDate = values.ExamDate.format('YYYY-MM-DD'); // Only date part (YYYY-MM-DD)
    const startTime = values.StartTime.format('HH:mm:ss'); // Time in HH:mm:ss
    const endTime = values.EndTime.format('HH:mm:ss'); // Time in HH:mm:ss

    const payload = {
      ID: editingCourse.ID,
      CourseName: values.CourseName,
      CourseCode: values.CourseCode,
      Credit: values.Credit,
      Description: values.Description,
      Stage: 2,
      CategoryID: values.CategoryID,
      SemesterID: values.SemesterID,
      UserID: editingCourse.UserID,
      ExamSchedule: [
        {
          ExamDate: `${examDate}T00:00:00.000Z`, // Correct format
          StartTime: `${examDate}T${startTime}.000Z`, // Correct time format
          EndTime: `${examDate}T${endTime}.000Z`, // Correct time format
        },
      ],
    };

    try {
      await UpdateCourseExam(payload.ID, payload);
      message.success('Course details updated successfully!');
      setIsModalVisible(false);
      fetchCourses(); // Fetch updated courses
    } catch (err) {
      message.error('Failed to update course details');
    }
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'CourseName',
      key: 'CourseName',
    },
    {
      title: 'Course Code',
      dataIndex: 'CourseCode',
      key: 'CourseCode',
    },
    {
      title: 'Credit',
      dataIndex: 'Credit',
      key: 'Credit',
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'Category',
      render: (category: any) => category?.CategoryName || 'Unknown',
    },
    {
      title: 'Semester',
      dataIndex: 'Semester',
      key: 'Semester',
      render: (semester: any) => `${semester?.Term || 'N/A'} - ${semester?.Year || 'N/A'}`,
    },
    {
      title: 'Stage',
      dataIndex: 'Stage',
      key: 'Stage',
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
      render: (description: string) => description || 'No description available',
    },
    {
      title: 'Actions',
      key: 'Actions',
      render: (record: any) => (
        <Popconfirm
          title="Are you sure to edit this course?"
          onConfirm={() => handleEdit(record.ID)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Edit</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="admin-fill-details-container">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />

      <div className="courses-table">
        <h2>Course Details</h2>

        {/* แถบค้นหา */}
        <Search
          placeholder="Search by course name, code, description, category, or semester"
          enterButton
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}  // เรียกฟังก์ชันการค้นหาตามคำค้น
          style={{ marginBottom: '1rem', width: '400px' }}
        />

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'All',
              children: (
                <Table
                  dataSource={filteredCourses}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
            {
              key: '2',
              label: 'Incomplete',
              children: (
                <Table
                  dataSource={filteredCourses.filter((course) => course.Stage === 1)}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
            {
              key: '3',
              label: 'Complete',
              children: (
                <Table
                  dataSource={filteredCourses.filter((course) => course.Stage === 2)}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
          ]}
        />
      </div>

      {editingCourse && categories.length > 0 && semesters.length > 0 && (
        <Modal
          title="Edit Course"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form} // Add form here
            onFinish={handleSave}
          >
            <Form.Item
              label="Course Name"
              name="CourseName"
              rules={[{ required: true, message: 'Please enter the course name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Course Code"
              name="CourseCode"
              rules={[{ required: true, message: 'Please enter the course code' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Credit"
              name="Credit"
              rules={[{ required: true, message: 'Please enter the course credit' }]}
            >
              <InputNumber min={1} max={6} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Category"
              name="CategoryID"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select>
                {categories.map((category) => (
                  <Select.Option key={category.ID} value={category.ID}>
                    {category.CategoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Semester"
              name="SemesterID"
              rules={[{ required: true, message: 'Please select a semester' }]}
            >
              <Select>
                {semesters.map((semester) => (
                  <Select.Option key={semester.ID} value={semester.ID}>
                    {`${semester.Term} - ${semester.Year}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Description"
              name="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Exam Date"
              name="ExamDate"
              rules={[{ required: true, message: 'Please select the exam date' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Start Time"
              name="StartTime"
              rules={[{ required: true, message: 'Please select the start time' }]}
            >
              <DatePicker.TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="End Time"
              name="EndTime"
              rules={[{ required: true, message: 'Please select the end time' }]}
            >
              <DatePicker.TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AdminFillDetails;