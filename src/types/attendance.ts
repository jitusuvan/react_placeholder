export interface AttendanceRecord {
  id: number;
  user: number;
  check_in: string;
  check_out?: string;
  date: string;
  total_hours?: string;
}

export interface CheckInResponse {
  message: string;
  attendance: AttendanceRecord;
}

export interface CheckOutResponse {
  message: string;
  attendance: AttendanceRecord;
}
