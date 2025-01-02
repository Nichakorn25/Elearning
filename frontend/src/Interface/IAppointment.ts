export interface DaysAvailabilityInterface {
    day: string;
    start: string | null;
    end: string | null;
    unavailable: boolean;
  }
  
  export interface TeacherAppointmentInterface {
    id?: number;
    title: string;
    appointment_duration: number;
    buffer_time: number;
    max_bookings: number;
    location: string;
    description: string;
    user_id: number;
    availability_id: number;
  }
  