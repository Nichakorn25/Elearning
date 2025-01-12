import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, DatePicker, Table } from 'antd';
import moment, { Moment } from 'moment';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import {
  ListAnnouncements,
  CreateAnnouncement,
  UpdateAnnouncementById,
  DeleteAnnouncementById
} from '../../services/https';
import './Announcement.css';
import { AnnouncementInterface } from '../../Interface/Admin';

const Announcement: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<{
    title: string;
    content: string;
    date: string | null;
  }>({ title: '', content: '', date: null });
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchAnnouncements = async () => {
    const response = await ListAnnouncements();
    if (response.status === 200) {
      setAnnouncements(response.data);
    } else {
      message.error('Failed to fetch announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenModal = async (announcement: AnnouncementInterface | null) => {
    if (announcement) {
      setNewAnnouncement({
        title: announcement.title || '',
        content: announcement.content || '',
        date: announcement.announce_date ? moment(announcement.announce_date) : null,
      });
      setEditingAnnouncement(announcement);
    } else {
      setNewAnnouncement({ title: '', content: '', date: null });
      setEditingAnnouncement(null);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewAnnouncement({ title: '', content: '', date: null });
    setEditingAnnouncement(null);
  };

  const handleSaveAnnouncement = async () => {
    if (!newAnnouncement.date || !newAnnouncement.title || !newAnnouncement.content) {
      message.error('Please fill in all fields.');
      return;
    }

    const date = new Date(newAnnouncement.date);
    date.setHours(date.getHours() + 7);
    const formattedDate = date.toISOString();

    const data: AnnouncementInterface = {
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      announce_date: formattedDate,
      user_id: Number(localStorage.getItem('id')),
    };

    if (editingAnnouncement) {
      const response = await UpdateAnnouncementById(editingAnnouncement.id, data);
      if (response.status === 200) {
        message.success('Announcement updated successfully');
        fetchAnnouncements();
        handleCloseModal();
      } else {
        message.error('Failed to update announcement');
      }
    } else {
      const response = await CreateAnnouncement(data);
      if (response.status === 201) {
        message.success('Announcement created successfully');
        fetchAnnouncements();
        handleCloseModal();
      } else {
        message.error('Failed to create announcement');
      }
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this announcement?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        const response = await DeleteAnnouncementById(id);
        if (response.status === 200) {
          message.success('Announcement deleted successfully');
          fetchAnnouncements();
        } else {
          message.error('Failed to delete announcement');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Publish Date',
      dataIndex: 'announce_date',
      key: 'announce_date',
      render: (text: string) => moment(text).format('DD MMM YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: any) => (
        <>
          <Button onClick={() => handleOpenModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleDeleteAnnouncement(record.ID)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="announcement-container">
      <Header />

      {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} />}

      <div className="announcement-content">
        <h2>Manage Announcements</h2>
        <Button type="primary" onClick={() => handleOpenModal(null)} style={{ marginBottom: '16px' }}>
          Create New Announcement
        </Button>
        <Table
          dataSource={announcements}
          columns={columns}
          rowKey="ID"
        />
      </div>

      <Modal
        title={editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={handleSaveAnnouncement}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="Title"
          value={newAnnouncement.title}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
          style={{ marginBottom: '1rem' }}
        />
        <Input.TextArea
          placeholder="Content"
          value={newAnnouncement.content}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
          rows={4}
        />
        <DatePicker
          value={newAnnouncement.date ? moment(newAnnouncement.date) : null}
          onChange={(date) => {
            setNewAnnouncement({ ...newAnnouncement, date: date ? date.toISOString() : null });
          }}
          style={{ marginTop: '1rem', width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default Announcement;
