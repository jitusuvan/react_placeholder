import { API_HOST, API_ENDPOINTS } from '../config/apiConfig';
import { Holiday, CreateHolidayRequest, UpdateHolidayRequest } from '../types/holiday';

class HolidayService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async getHolidays(): Promise<{ count: number; next: string | null; previous: string | null; results: Holiday[] }> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.HOLIDAYS_LIST}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch holidays');
    return response.json();
  }

  async createHoliday(holidayData: CreateHolidayRequest): Promise<Holiday> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.HOLIDAYS_LIST}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(holidayData)
    });

    if (!response.ok) throw new Error('Failed to create holiday');
    return response.json();
  }

  async updateHoliday(id: number, holidayData: UpdateHolidayRequest): Promise<Holiday> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.HOLIDAYS_DETAIL.replace(':id', id.toString())}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(holidayData)
    });

    if (!response.ok) throw new Error('Failed to update holiday');
    return response.json();
  }

  async deleteHoliday(id: number): Promise<void> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.HOLIDAYS_DETAIL.replace(':id', id.toString())}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete holiday');
  }
}

export const holidayService = new HolidayService();
