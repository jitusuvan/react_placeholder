export interface WorkLog {
  id: number;
  project: number;
  date: string;
  work_description: string;
  hours_spent: number;
}

export interface CreateWorkLogRequest {
  project: number;
  date: string;
  work_description: string;
  hours_spent: number;
}

export interface CreateWorkLogResponse {
  message: string;
  worklog: WorkLog;
}

export interface DailySummary {
  date: string;
  total_hours: number;
  worklogs: WorkLog[];
}
