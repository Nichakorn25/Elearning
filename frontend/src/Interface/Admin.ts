export interface AnnouncementInterface {
    id?: number; // Optional for creating a new announcement
    title?: string;
    content?: string;
    announce_date?: string | null;  // ใช้ Moment หรือ string หรือ null
    user_id?: number | null;
  }
  
export interface ChangeRoleInterface {
    id?: number;             // ID ของคำขอ (optional สำหรับการสร้างใหม่)
    username: string;        // ชื่อผู้ใช้
    fullname: string;        // ชื่อเต็มของผู้ใช้
    email: string;           // อีเมล
    phone: string;           // เบอร์โทรศัพท์
    department: string;      // ภาควิชา
    major: string;           // สาขาวิชา
    reason: string;          // เหตุผลในการขอเปลี่ยนสิทธิ์
    idCard: string;          // เส้นทางหรือ URL ของรูป ID Card ที่อัปโหลด
    
  }