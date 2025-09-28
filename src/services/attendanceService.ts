import { API_HOST, API_ENDPOINTS } from '../config/apiConfig';
import { AttendanceRecord, CheckInResponse, CheckOutResponse } from '../types/attendance';

class AttendanceService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async checkIn(): Promise<CheckInResponse> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.CHECK_IN}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Check-in failed');
    return response.json();
  }

  async checkOut(): Promise<CheckOutResponse> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.CHECK_OUT}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Check-out failed');
    return response.json();
  }

  async getAttendanceRecords(): Promise<{ count: number; next: string | null; previous: string | null; results: AttendanceRecord[] }> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.ATTENDANCE_LIST}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch attendance records');
    return response.json();
  }
}

export const attendanceService = new AttendanceService();
