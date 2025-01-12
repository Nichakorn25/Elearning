import React, { useState, useEffect } from 'react';
import { Table, Button, Tabs, message, Popconfirm, Modal, Form, Input, Select } from 'antd';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';
import { ListCourses, UpdateCourse, GetCategories, GetSemesters, GetDayOfWeek } from '../../services/https'; // Assuming GetCategories, GetSemesters, GetDayOfWeek are available
import './AdminFillDetails.css';

const AdminFillDetails: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);  // State to store categories
  const [semesters, setSemesters] = useState<any[]>([]);    // State to store semesters
  const [daysOfWeek, setDaysOfWeek] = useState<any[]>([]);  // State to store days of the week
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ListCourses();
        console.log('response data', response.data);
        if (response && response.data) {
          setCourses(response.data);
        } else {
          setError('No course data available');
        }
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    // Fetch categories, semesters, and days of the week
    const fetchCategories = async () => {
      const response = await GetCategories();
      setCategories(response.data || []);
    };

    const fetchSemesters = async () => {
      const response = await GetSemesters();
      setSemesters(response.data || []);
    };

    const fetchDaysOfWeek = async () => {
      const response = await GetDayOfWeek();
      setDaysOfWeek(response.data || []);
    };

    fetchCategories();
    fetchSemesters();
    fetchDaysOfWeek();
  }, []);

  const handleEdit = (courseId: number) => {
    const courseToEdit = courses.find((course) => course.ID === courseId);
    setEditingCourse(courseToEdit);
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      // Update the course on the backend
      await UpdateCourse(editingCourse.ID, values);
      message.success('Course details updated successfully!');
      
      // Update the course in the local state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.ID === editingCourse.ID ? { ...course, ...values } : course
        )
      );

      // Close the modal after updating
      setIsModalVisible(false);
    } catch (err) {
      message.error('Failed to update course details');
    }
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'CourseName',
      key: 'courseName',
    },
    {
      title: 'Credit',
      dataIndex: 'Credit',
      key: 'credit',
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'category',
      render: (category: any) => category?.CategoryName || 'Unknown',
    },
    {
      title: 'Semester',
      dataIndex: 'Semester',
      key: 'semester',
      render: (semester: any) => `${semester?.Term || 'N/A'} - ${semester?.Year || 'N/A'}`,
    },
    {
      title: 'Day of the Week',
      dataIndex: 'DayofWeek',
      key: 'dayOfWeek',
      render: (day: any) => day?.DayName || 'Unknown',
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'description',
      render: (description: string) => description || 'No description available',
    },
    {
      title: 'Actions',
      key: 'actions',
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
                  dataSource={courses}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
            {
              key: '2',
              label: 'Active',
              children: (
                <Table
                  dataSource={courses.filter((course) => course.Status === 'Active')}
                  columns={columns}
                  rowKey="ID"
                  loading={loading}
                  bordered
                />
              ),
            },
            {
              key: '3',
              label: 'Archived',
              children: (
                <Table
                  dataSource={courses.filter((course) => course.Status === 'Archived')}
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

      {/* Edit Modal */}
      {editingCourse && (
        <Modal
          title="Edit Course"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            initialValues={{
              CourseName: editingCourse.CourseName,
              Credit: editingCourse.Credit,
              CategoryID: editingCourse.Category.ID,
              SemesterID: editingCourse.Semester.ID,
              DayofWeekID: editingCourse.DayofWeek.ID,
              Description: editingCourse.Description,
            }}
            onFinish={handleSave}
          >
            <Form.Item label="Course Name" name="CourseName">
              <Input />
            </Form.Item>
            <Form.Item label="Credit" name="Credit">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Category" name="CategoryID">
              <Select value={editingCourse?.Category?.ID}>
                {categories.map((category) => (
                  <Select.Option key={category.ID} value={category.ID}>
                    {category.CategoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Semester" name="SemesterID">
              <Select value={editingCourse?.Semester?.ID}>
                {semesters.map((semester) => (
                  <Select.Option key={semester.ID} value={semester.ID}>
                    {`${semester.Term} - ${semester.Year}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Day of the Week" name="DayofWeekID">
              <Select value={editingCourse?.DayofWeek?.ID}>
                {daysOfWeek.map((day) => (
                  <Select.Option key={day.ID} value={day.ID}>
                    {day.DayName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Description" name="Description">
              <Input.TextArea />
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
