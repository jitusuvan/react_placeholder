import { API_HOST, API_ENDPOINTS } from '../config/apiConfig';
import { LeaveRequest, LeaveRecord, ApplyLeaveResponse } from '../types/leave';

class LeaveService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async applyLeave(leaveData: LeaveRequest): Promise<ApplyLeaveResponse> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.APPLY_LEAVE}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(leaveData)
    });

    if (!response.ok) throw new Error('Failed to apply leave');
    return response.json();
  }

  async getLeaveRecords(): Promise<{ count: number; next: string | null; previous: string | null; results: LeaveRecord[] }> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.LEAVE_LIST}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch leave records');
    return response.json();
  }
}

export const leaveService = new LeaveService();
