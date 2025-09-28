export interface Holiday {
  id: number;
  name: string;
  date: string;
  description?: string;
}

export interface CreateHolidayRequest {
  name: string;
  date: string;
  description?: string;
}

export interface UpdateHolidayRequest {
  name: string;
  date: string;
  description?: string;
}
