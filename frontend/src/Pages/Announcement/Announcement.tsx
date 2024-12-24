import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, DatePicker } from 'antd';
import moment, { Moment } from 'moment';  // นำเข้า moment
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import {
  ListAnnouncements,
  CreateAnnouncement,
  UpdateAnnouncementById,
  DeleteAnnouncementById,
  GetAnnouncementById
} from '../../services/https'; // Import API functions
import './Announcement.css';
import { AnnouncementInterface } from '../../Interface/Admin';

const Announcement: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<{
    title: string;
    content: string;
    date: moment.Moment | null;  // รองรับค่า null
  }>({ title: '', content: '', date: null });
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [announcements, setAnnouncements] = useState([]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchAnnouncements = async () => {
    const response = await ListAnnouncements();
    console.log('Fetched announcements:', response);
    if (response.status === 200) {
      console.log('Announcements fetched:', response.data);
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
        date: announcement.announce_date ? moment(announcement.announce_date) : null,  // ใช้ moment แปลงวันที่
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
    const data = {
    title: newAnnouncement.title,
    content: newAnnouncement.content,
    announce_date: newAnnouncement.date ? newAnnouncement.date.format('YYYY-MM-DD HH:mm:ss+00:00') : null,
  };

    console.log('Data to save:', data);  // ตรวจสอบว่า data ถูกต้องหรือไม่

    if (editingAnnouncement) {
      // อัปเดตประกาศ
      const response = await UpdateAnnouncementById(editingAnnouncement.id, data);
      if (response.status === 200) {
        message.success('Announcement updated successfully');
        fetchAnnouncements();
        handleCloseModal();
      } else {
        message.error('Failed to update announcement');
      }
    } else {
      // สร้างประกาศใหม่
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
    const response = await DeleteAnnouncementById(id);
    if (response.status === 200) {
      message.success('Announcement deleted successfully');
      fetchAnnouncements();
    } else {
      message.error('Failed to delete announcement');
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />

      {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} />}

      <div className="announcement-content">
        <h2>Manage Announcements</h2>
        <Button type="primary" onClick={() => handleOpenModal(null)}>
          Create New Announcement
        </Button>
        <div className="announcement-list">
          {announcements.map((announcement: any) => (
            <div key={announcement.ID} className="announcement-item">
              <h3>{announcement.Title}</h3>
              <p>{announcement.Content}</p>
              <p>
                <strong>Publish Date:</strong>
                {announcement.AnnounceDate && announcement.AnnounceDate !== '0001-01-01T00:00:00Z'
                  ? new Date(announcement.AnnounceDate).toLocaleDateString()
                  : new Date(announcement.CreatedAt).toLocaleDateString()}
              </p>
              <Button onClick={() => handleOpenModal(announcement)}>Edit</Button>
              <Button danger onClick={() => handleDeleteAnnouncement(announcement.ID)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding/Editing Announcement */}
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
          value={newAnnouncement.date ? newAnnouncement.date : null}
          onChange={(date) => setNewAnnouncement({ ...newAnnouncement, date })}
          style={{ marginTop: '1rem', width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default Announcement;
