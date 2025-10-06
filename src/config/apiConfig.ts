export const API_HOST = 'http://localhost:8002'; // Adjust to your backend URL

export const API_ENDPOINTS = {
  // Authentication
  TOKEN: '/api/token/',
  PROFILE: '/api/v1/auth/profile/',

  // Attendance
  CHECK_IN: '/work/api/attendance/check_in/',
  CHECK_OUT: '/work/api/attendance/check_out/',
  ATTENDANCE_LIST: '/work/api/attendance/',

  // Leaves
  APPLY_LEAVE: '/work/api/leaves/',
  LEAVE_LIST: '/work/api/leaves/',

  // Holidays
  HOLIDAYS_LIST: '/work/api/holidays/',
  HOLIDAYS_DETAIL: '/work/api/holidays/:id/',

  // Projects
  PROJECTS_LIST: '/work/api/projects/',
  CREATE_PROJECT: '/work/api/projects/',

  // Work Logs
  ADD_WORKLOG: '/work/api/worklogs/',
  WORKLOGS_LIST: '/work/api/worklogs/',
  DAILY_SUMMARY: '/work/api/worklogs/daily_summary/',
};
