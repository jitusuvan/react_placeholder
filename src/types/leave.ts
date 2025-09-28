export interface LeaveRequest {
  start_date: string;
  end_date: string;
  leave_type: 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity';
  reason: string;
}

export interface LeaveRecord {
  id: number;
  user: number;
  start_date: string;
  end_date: string;
  leave_type: 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ApplyLeaveResponse {
  message: string;
  leave: LeaveRecord;
}
