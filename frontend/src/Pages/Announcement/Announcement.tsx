import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, DatePicker, Table } from 'antd';
import dayjs from 'dayjs'; // No extra plugins
import utc from 'dayjs/plugin/utc';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import {
  ListAnnouncements,
  CreateAnnouncement,
  UpdateAnnouncementById,
  DeleteAnnouncementById,
} from '../../services/https';
import './Announcement.css';
import { AnnouncementInterface } from '../../Interface/Admin';
dayjs.extend(utc);

const Announcement: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<{
    title: string;
    content: string;
    date: any | null;
  }>({ title: '', content: '', date: null });
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const closeSidebar = () => {
    setSidebarVisible(false); // Function to close the sidebar
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await ListAnnouncements();
      if (response.status === 200) {
        setAnnouncements(response.data);
      } else {
        message.error('Failed to fetch announcements');
      }
    } catch (error) {
      message.error('An error occurred while fetching announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenModal = (announcement: AnnouncementInterface | null) => {
    if (announcement) {
      setNewAnnouncement({
        title: announcement.title || '',
        content: announcement.content || '',
        date: announcement.announce_date ? dayjs(announcement.announce_date) : null,
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
    const { title, content, date } = newAnnouncement;
  
    if (!date || !title || !content) {
      message.error('All fields are required.');
      return;
    }
  
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Keep only the date part
    const data: AnnouncementInterface = {
      title,
      content,
      announce_date: `${formattedDate}T00:00:00.000Z`,
      user_id: Number(localStorage.getItem('id')),
    };
  
    try {
      if (editingAnnouncement) {
        const response = await UpdateAnnouncementById(editingAnnouncement.ID, data);
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
    } catch (error) {
      message.error('An error occurred while saving the announcement');
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
        try {
          const response = await DeleteAnnouncementById(id);
          if (response.status === 200) {
            message.success('Announcement deleted successfully');
            fetchAnnouncements();
          } else {
            message.error('Failed to delete announcement');
          }
        } catch (error) {
          message.error('An error occurred while deleting the announcement');
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
      render: (text: string) => dayjs(text).local().format('DD MMM YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: string, record: any) => (
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

      {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar}/>}

      <div className="announcement-content">
        <h2>Manage Announcements</h2>
        <Button
          type="primary"
          onClick={() => handleOpenModal(null)}
          style={{ marginBottom: '16px' }}
        >
          Create New Announcement
        </Button>
        <Table dataSource={announcements} columns={columns} rowKey="ID" />
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
          value={newAnnouncement.date ? dayjs(newAnnouncement.date) : null}
          onChange={(date) => setNewAnnouncement({ ...newAnnouncement, date })}
          style={{ marginTop: '1rem', width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default Announcement;