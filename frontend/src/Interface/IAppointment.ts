import { MajorInterface, UserInterface } from "./IUser";

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
  ID?: number;
  title?: string;
  appointment_duration?: string;
  // buffer_time?: number;
  // max_bookings?: number;
  location?: string;
  description?: string;
  UserID?: number;
  DayofWeekID?: number;
  availability_id?: number;

  DayofWeek?: DayInterface;
  User?: UserInterface;
  Major?: MajorInterface;
}

export interface StudentBookingInterface {
  ID?: number; // ID ของการจอง
  UserID: number; // ID ของนักเรียนที่ทำการจอง
  TeacherAppointmentID: number; // ID ของการนัดหมายอาจารย์
  TeacherAppointment?: TeacherAppointmentInterface;
  User?: UserInterface;
  DayofWeekID?: number;

  DayofWeek?: DayInterface;
}

export interface DayInterface {
  ID?: number; // ID ของการจอง
  DayName?: string;
}
