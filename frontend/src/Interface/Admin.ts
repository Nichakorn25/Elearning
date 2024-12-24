export interface AnnouncementInterface {
    id?: string; // Optional for creating a new announcement
    title?: string;
    content?: string;
    announce_date: moment.Moment | string | null;  // ใช้ Moment หรือ string หรือ null
    user_id?: string;
  }
  