import React from 'react';
import { DatePicker, Form, Input, Button, Modal, message } from 'antd';
import { CreateAssignment } from '../../services/https/index';
import { AssignmentInterface } from '../../Interface/Assignment';

interface CreateAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
}

const CreateAssign: React.FC<CreateAssignmentProps> = ({ isOpen, onClose, courseId }) => {
  const [form] = Form.useForm(); // สร้าง instance ของ form

  const onFinishCA = async  (values: AssignmentInterface) => {
    let payload = {
      ...values,
      course_id: courseId, // ใช้ค่า CourseID ที่รับมาจาก props
    };

    const res = await CreateAssignment(payload);

    if (res.status == 200) {
      form.resetFields(); // รีเซ็ตฟอร์มหลังจากสร้างสำเร็จ
      onClose(); // ปิด Modal
      message.open({
        type: "success",
        content: res.data.message,
      });
    } else {
      message.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  return (
    <Modal
      title="Create Assignment"
      open={isOpen}
      onCancel={onClose}
      footer={null} // ไม่ใช้ footer ของ Modal เพื่อใช้ปุ่ม submit ของฟอร์มแทน
      destroyOnClose // รีเซ็ตค่าฟอร์มทุกครั้งที่ Modal ถูกปิด
    >
      <Form
        form={form}
        name="create_assignment_form"
        layout="vertical"
        onFinish={onFinishCA}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input placeholder="Enter the assignment title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea rows={4} placeholder="Enter the assignment description" />
        </Form.Item>
        <Form.Item
          label="Deadline"
          name="deadline"
          rules={[{ required: true, message: 'Please select the deadline!' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
          <Button style={{ marginTop: '10px' }} onClick={onClose} block>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAssign;