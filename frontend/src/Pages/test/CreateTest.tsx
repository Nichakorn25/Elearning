import React, { useState } from 'react';
import './CreateTest.css';
import { Button, Checkbox, DatePicker, Form, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { CreateTest } from '../../services/https/index';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Sidebar/Sidebar';

const Createtest: React.FC = () => {
  const [form] = Form.useForm();
  const courseId = 1;
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: [{ text: 'ตัวเลือกที่ 1', isCorrect: false }],
      points: 1,
    },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: [{ text: 'ตัวเลือกที่ 1', isCorrect: false }],
        points: 1,
      },
    ]);
  };
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const addOption = (questionIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[questionIndex].options.push({ text: `ตัวเลือกที่ ${updated[questionIndex].options.length + 1}`, isCorrect: false });
      return updated;
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
      return updated;
    });
  };

  const handleCreateTest = async () => {
    try {
      const values = await form.validateFields();

      const testData = {
        title: values.title,
        description: values.description,
        due_date: dayjs(values.deadline).format('YYYY-MM-DD HH:mm:ss'),
        time_out: dayjs(values.timeout).format('HH:mm:ss'),
        course_id: courseId,
        quiz_questions: questions.map((q, questionIndex) => ({
          question_text: q.questionText,
          point: q.points,
          answer_options: q.options.map((opt) => ({
            option_text: opt.text,
            is_correct: opt.isCorrect,
            question_id: questionIndex + 1,
          })),
        })),
      };

      console.log('Test data:', testData);

      const response = await CreateTest(testData);
      if (response.status === 200) {
        form.resetFields();
        setQuestions([
          {
            questionText: '',
            options: [{ text: 'ตัวเลือกที่ 1', isCorrect: false }],
            points: 0,
          },
        ]);
      } else {
        console.error('Error creating test:', response.data);
      }
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  return (
    <div className="cre-test">
      <Header />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="cre-testbody">
        <h1>สร้างแบบทดสอบ</h1>
        <Form form={form} name="create_test_form" layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input placeholder="Enter the assignment title" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Enter the assignment description" />
          </Form.Item>
          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: 'Please select the deadline!' }]}
          >
            <DatePicker showTime style={{ width: '50%' }} />
          </Form.Item>
          <Form.Item
            label="Time"
            name="timeout"
            rules={[{ required: true, message: 'Please select the Time!' }]}
          >
            <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} style={{ width: '50%' }} />
          </Form.Item>
        </Form>
      </div>

      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="head-cretest2">
          <Input
            value={question.questionText}
            placeholder="คำถาม"
            onChange={(e) => {
              setQuestions((prev) => {
                const updated = [...prev];
                updated[questionIndex].questionText = e.target.value;
                return updated;
              });
            }}
          />
          {/* <Input
            type="number"
            value={question.points}
            placeholder="คะแนนของคำถามนี้"
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              setQuestions((prev) => {
                const updated = [...prev];
                updated[questionIndex].points = value;
                return updated;
              });
            }}
          /> */}
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                checked={option.isCorrect}
                onChange={(e) => {
                  setQuestions((prev) => {
                    const updated = [...prev];
                    updated[questionIndex].options[optionIndex].isCorrect = e.target.checked;
                    return updated;
                  });
                }}
              />
              <Input
                value={option.text}
                placeholder={`ตัวเลือก ${optionIndex + 1}`}
                onChange={(e) => {
                  setQuestions((prev) => {
                    const updated = [...prev];
                    updated[questionIndex].options[optionIndex].text = e.target.value;
                    return updated;
                  });
                }}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                danger
                onClick={() => removeOption(questionIndex, optionIndex)}
              />
            </div>
          ))}
          <Button onClick={() => addOption(questionIndex)} type="text" style={{ marginTop: '8px' }}>
            <PlusOutlined /> ตัวเลือกเพิ่มเติม
          </Button>
        </div>
      ))}

      <Button onClick={addQuestion} type="primary" style={{ marginTop: '20px' }}>
        <PlusOutlined /> เพิ่มคำถามใหม่
      </Button>
      <Button onClick={handleCreateTest} type="primary" style={{ marginTop: '20px' }}>
        ยืนยันการสร้าง
      </Button>
    </div>
  );
};

export default Createtest;