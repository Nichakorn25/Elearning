import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Layout, Input, List, Form, message, Rate } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Component/Sidebar/Sidebar';
import Header from '../Component/Header/Header';
import { GetSheetByID, AddCartItem, GetCartByUser, ListCartItems, CreateReview, GetReviewsBySheetID } from '../../services/https';
import './SelectSheet.css';
import { Document, Page, pdfjs } from 'react-pdf';

// ตั้งค่า Worker ให้ตรงกับเวอร์ชัน PDF
pdfjs.GlobalWorkerOptions.workerSrc = 'https://api.se-elearning.online/worker/pdf.worker.min.mjs';

const { Content } = Layout;
const { TextArea } = Input;

const SelectSheet: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [sheetDetails, setSheetDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = localStorage.getItem("id");
  if (!userId) {
    console.error("User ID not found in localStorage.");
    message.error("กรุณาเข้าสู่ระบบ");
    navigate("/");
    return;
  }

  useEffect(() => {
    const fetchSheetDetails = async () => {
      try {
       
        setLoading(true);
        const response = await GetSheetByID(id as string);
        setSheetDetails(response.data);
        
      
      } catch (error) {
        message.error('ไม่สามารถดึงข้อมูลชีทได้');
      } finally {
         
        setLoading(false); 
      }
    };

    const fetchComments = async () => {
        try {
          const response = await GetReviewsBySheetID(parseInt(id as string));
          console.log("Response from GetReviewsBySheetID:", response);
          if (response?.reviews) {
            setComments(response.reviews);
          } else {
            message.warning("ไม่มีคอมเมนต์สำหรับชีทนี้");
            setComments([]);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
          message.error("ไม่สามารถดึงข้อมูลคอมเมนต์ได้");
        }
      };
      

    if (id) {
      fetchSheetDetails();
      fetchComments();   
    }
  }, [id]);
  useEffect(() => {
    if (sheetDetails && sheetDetails.FilePath) {
      console.log(`https://api.se-elearning.online${sheetDetails.FilePath}`);
    }
  }, [sheetDetails]); // จะทำงานเมื่อ `sheetDetails` เปลี่ยนแปลง
  // ฟังก์ชันเพิ่มชีทลงในตะกร้า
  const handleAddToCart = async () => {
    try {

      const cartResponse = await GetCartByUser(userId);
      const cartId = cartResponse?.data?.ID || null;

      if (!cartId) {
        message.error('ไม่พบตะกร้าสำหรับผู้ใช้นี้');
        return;
      }

      const cartItemsResponse = await ListCartItems(cartId);
      const cartItems = cartItemsResponse?.data || [];

      const isDuplicate = cartItems.some((item: { SheetID: number }) => item.SheetID === parseInt(id as string));
      if (isDuplicate) {
        message.warning('ชีทนี้อยู่ในตะกร้าแล้ว');
        return;
      }

      const dataToSend = {
        cartId: cartId,
        sheetId: parseInt(id as string),
      };

      await AddCartItem(dataToSend);
      message.success('เพิ่มชีทลงในตะกร้าสำเร็จ');
      navigate("/Buysheet")
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('ไม่สามารถเพิ่มชีทลงในตะกร้าได้');
    }
  };

  // ฟังก์ชันเพิ่มคอมเมนต์พร้อมคะแนน
  const handleAddComment = async () => {
    
    if (!commentInput.trim() || rating === 0) {
      message.warning('กรุณาใส่คอมเมนต์และคะแนนที่ถูกต้อง');
      return;
    }

    try {
      const newComment = {
        comment: commentInput.trim(),
        rating: rating,
        userId: parseInt(userId),
        sheetId: parseInt(id as string),
      };

      const response = await CreateReview(newComment);
      window.location.reload();
      message.success('เพิ่มคอมเมนต์พร้อมคะแนนสำเร็จ');

      // อัปเดตคอมเมนต์ใหม่ในหน้าจอ
      setComments([...comments, response.data]);
      setCommentInput('');
      setRating(0);
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('ไม่สามารถเพิ่มคอมเมนต์ได้');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleNextPage = () => {
    if (currentPage < (numPages || 0)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
        <div className="fullscreen-loading">
          <div className="loader-circle"></div>
          <h2>กำลังโหลด...</h2>
        </div>
      ) 
  }

  if (!sheetDetails) {
    return (
      <Layout className="sheet">
        <Header />
        <Content className="sheet-content">
          <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <p style={{ fontSize: '18px', color: 'gray' }}>ไม่พบข้อมูลชีท</p>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
<Layout className="selectsheet">
  <Header />
  <Sidebar isVisible={false} onClose={() => {}} />
  <Content className="selectsheet-content">
    {/* ส่วนแสดง PDF */}
    <Card className="selectsheet-card">
      {sheetDetails.FilePath ? (
        <div className="pdf-preview-container">
          <Document
            file={`https://api.se-elearning.online${sheetDetails.FilePath}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={currentPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={300}
            />
          </Document>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'gray' }}>ไม่พบไฟล์ PDF</p>
      )}
      <button
        className="nav-button left"
        onClick={handlePreviousPage}
        disabled={currentPage <= 1}
      >
        &lt;
      </button>
      <button
        className="nav-button right"
        onClick={handleNextPage}
        disabled={currentPage >= (numPages || 0)}
      >
        &gt;
      </button>
    </Card>

    {/* รายละเอียดชีท */}
    <Card className="selectsheet-details">
  <h3 className="selectsheet-details-title">รายละเอียดชีท</h3>
  <p>
    <strong>ชื่อชีท:</strong> {sheetDetails.Title}
  </p>
  <p>
    <strong>รหัสวิชา:</strong> {sheetDetails.Course.CourseDate}
  </p>
  <p>
    <strong>วิชา:</strong> {sheetDetails.Course.CourseName}
  </p>
  <p>
    <strong>ราคา:</strong> {sheetDetails.Price} THB
  </p>
  <p>
    <strong>รายละเอียด:</strong> {sheetDetails.Description}
  </p>
  <div className="button-container">
    <Button className="selectsheet-Button" onClick={handleAddToCart}>
      ซื้อชีทนี้
    </Button>
  </div>
</Card>



    {/* คอมเมนต์และคะแนน */}
    <Card title="คอมเมนต์และคะแนน" className="comments-card">
      <Form layout="vertical" onFinish={handleAddComment}>
      <Form.Item label="ให้คะแนน" style={{ textAlign: 'left' }}>
        <Rate value={rating} onChange={(value) => setRating(value)} />
      </Form.Item>
        <Form.Item label="เขียนคอมเมนต์">
          <TextArea
            rows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="แสดงความคิดเห็นของคุณ..."
          />
        </Form.Item>
        <Form.Item>
        <div className="comment-Button-container">
          <Button className="comment-Button" htmlType="submit">
            เพิ่มคอมเมนต์พร้อมคะแนน
          </Button>
        </div>

        </Form.Item>
      </Form>
      <List
        className="comment-list"
        bordered
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item key={comment.id} className="comment-item">
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col span={24} className="comment-user">
                <strong>{`${comment.User.FirstName} ${comment.User.LastName}`}</strong>
              </Col>
              <Col span={24} className="comment-content">
                <p>{comment.Comment}</p>
              </Col>
              <Col span={24} className="comment-rating" style={{ textAlign: 'right' }}>
                <Rate disabled value={comment.Rating} />
              </Col>
            </Row>
          </List.Item>
        )}
        locale={{ emptyText: 'ยังไม่มีคอมเมนต์' }}
      />
    </Card>
  </Content>
</Layout>

  );
};

export default SelectSheet;