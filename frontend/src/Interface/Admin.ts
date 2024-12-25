export interface AnnouncementInterface {
    id?: number; // Optional for creating a new announcement
    title?: string;
    content?: string;
    announce_date?: string | null;  // ใช้ Moment หรือ string หรือ null
    user_id?: number | null;
  }
  