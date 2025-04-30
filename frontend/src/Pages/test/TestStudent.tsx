import React, { useState } from 'react';
import './Test.css';
import { Button, Table } from 'antd';
import dayjs from 'dayjs';

const initialDataSource = [
  {
    key: 1, // Add unique key for each row
    state: 'Not tested yet',
    points: '-',
    review: 'Not permitted',
  },
];

const TestStudent: React.FC = () => {
  const [dataSource] = useState(initialDataSource);

  const columns = [
    {
      title: 'state',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'คะแนนที่ได้',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
    },
  ];

  return (
    <div className="test">
      <div className="test-head"></div>
      <div className="test-body">
        <h1>รายวิชา</h1>
        <h2>Eng</h2>
      </div>
      <div className="test-body2">
        <h1>แบบทดสอบ</h1>
        <div className="descrip-test">
          <div className="direct-de">
            <h2>
              ปิดการทำแบบทดสอบ :{' '}
              {dayjs('2025-01-16T07:50:59.864692+07:00').format('dddd, D MMMM YYYY, h:mmA')}
            </h2>
            <h3>เวลาทำแบบทดสอบ 20 นาที</h3>
          </div>
        </div>
        <div className="summary-test">
          <h1>summary of your previous attempts</h1>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>
        <div className="button-ready">
          <Button className="direct" type="primary" >
            ทำแบบทดสอบ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestStudent;