import { API_HOST, API_ENDPOINTS } from '../config/apiConfig';
import { WorkLog, CreateWorkLogRequest, CreateWorkLogResponse, DailySummary } from '../types/worklog';

class WorklogService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async addWorklog(worklogData: CreateWorkLogRequest): Promise<CreateWorkLogResponse> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.ADD_WORKLOG}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(worklogData)
    });

    if (!response.ok) throw new Error('Failed to add worklog');
    return response.json();
  }

  async getWorklogs(): Promise<{ count: number; next: string | null; previous: string | null; results: WorkLog[] }> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.WORKLOGS_LIST}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch worklogs');
    return response.json();
  }

  async getDailySummary(date: string): Promise<DailySummary> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.DAILY_SUMMARY}?date=${date}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch daily summary');
    return response.json();
  }
}

export const worklogService = new WorklogService();
