export interface DaysAvailabilityInterface {
    day: string;
    start: string | null;
    end: string | null;
    unavailable: boolean;
  }
  
  export interface TeacherAppointmentInterface {
    appointmentId: number;
    isBooked: boolean | undefined;
    time: string | null;
    date: number | null;
    id?: number;
    title?: string;
    appointment_duration?: number;
    buffer_time?: number;
    max_bookings?: number;
    location?: string;
    description?: string;
    UserID?: number;
    availability_id?: number;
  }

  export interface StudentBookingInterface {
    id?: number; // ID ของการจอง
    UserID: number; // ID ของนักเรียนที่ทำการจอง
    TeacherAppointmentID: number; // ID ของการนัดหมายอาจารย์
    
  }
  
  