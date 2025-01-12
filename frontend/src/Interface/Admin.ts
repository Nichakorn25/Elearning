export interface AnnouncementInterface {
    id?: number; // Optional for creating a new announcement
    title?: string;
    content?: string;
    announce_date?: string | null;  // ใช้ Moment หรือ string หรือ null
    user_id?: number | null;
  }
  
export interface ChangeRoleInterface {
    id?: number;             // ID ของคำขอ (optional สำหรับการสร้างใหม่)
    
    reason: string;          // เหตุผลในการขอเปลี่ยนสิทธิ์
    idCard: string;          // เส้นทางหรือ URL ของรูป ID Card ที่อัปโหลด
    status: string;
    userId: number
    
  }

  export interface RoleRequest {
    status: string; // e.g., "Pending", "Approved", "Rejected"
  }

  export interface RoleIDInterface{
    role_id: number; 
  }