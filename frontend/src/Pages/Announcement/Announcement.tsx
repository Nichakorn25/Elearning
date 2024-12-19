import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import './Announcement.css';

const Announcement: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Announcement 1', content: 'Details of announcement 1' },
    { id: 2, title: 'Announcement 2', content: 'Details of announcement 2' },
  ]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewAnnouncement({ title: '', content: '' }); // Reset fields
  };

  const handleSaveAnnouncement = () => {
    const newEntry = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
    };
    setAnnouncements([...announcements, newEntry]);
    handleCloseModal();
  };

  return (
    <div className="admin-dashboard">
      <Header />
      
      {isSidebarVisible && <Sidebar isVisible={isSidebarVisible} />}

      <div className="announcement-content">
        <h2>Manage Announcements</h2>
        <button  onClick={handleOpenModal}>
          Create New Announcement
        </button>
        <div className="announcement-list">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-item">
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              <Button>Edit</Button>
              <Button danger>Delete</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding Announcement */}
      <Modal
        title="Create New Announcement"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={handleSaveAnnouncement}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="Title"
          value={newAnnouncement.title}
          onChange={(e) =>
            setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
          }
          style={{ marginBottom: '1rem' }}
        />
        <Input.TextArea
          placeholder="Content"
          value={newAnnouncement.content}
          onChange={(e) =>
            setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
          }
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default Announcement;
