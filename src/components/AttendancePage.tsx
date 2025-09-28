import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIn, checkOut, fetchAttendanceRecords } from '../store/slices/attendanceSlice';
import toast from 'react-hot-toast';

const AttendancePage: React.FC = () => {
  const dispatch = useDispatch();
  const { records: attendance, loading, error } = useSelector((state: any) => state.attendance);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAttendanceRecords() as any);
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCheckIn = async () => {
    try {
      await dispatch(checkIn() as any);
      toast.success('Checked in successfully!');
      dispatch(fetchAttendanceRecords() as any);
    } catch (err) {
      toast.error('Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await dispatch(checkOut() as any);
      toast.success('Checked out successfully!');
      dispatch(fetchAttendanceRecords() as any);
    } catch (err) {
      toast.error('Check-out failed');
    }
  };

  const todayAttendance = attendance.find((record: any) =>
    record.date === new Date().toISOString().split('T')[0]
  );

  const isCheckedIn = todayAttendance && todayAttendance.check_in_time && !todayAttendance.check_out_time;
  const isCheckedOut = todayAttendance && todayAttendance.check_out_time;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-lg text-gray-600 mb-4">
              {currentTime.toLocaleDateString()}
            </div>
            <div className="mb-4">
              {isCheckedOut ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Checked Out
                </span>
              ) : isCheckedIn ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Checked In
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Not Checked In
                </span>
              )}
            </div>
            <div className="space-x-4">
              {!isCheckedIn && !isCheckedOut && (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                >
                  {loading ? 'Checking In...' : 'Check In'}
                </button>
              )}
              {isCheckedIn && (
                <button
                  onClick={handleCheckOut}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                >
                  {loading ? 'Checking Out...' : 'Check Out'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Details</h2>
          {todayAttendance ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in Time:</span>
                <span className="font-medium">
                  {todayAttendance.check_in_time ? new Date(todayAttendance.check_in_time).toLocaleTimeString() : 'Not checked in'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out Time:</span>
                <span className="font-medium">
                  {todayAttendance.check_out_time ? new Date(todayAttendance.check_out_time).toLocaleTimeString() : 'Not checked out'}
                </span>
              </div>
              {todayAttendance.total_hours !== null && todayAttendance.total_hours !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{Number(todayAttendance.total_hours).toFixed(2)} hours</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No attendance record for today</p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Attendance Records</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.slice(0, 10).map((record: any) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.total_hours !== null && record.total_hours !== undefined ? `${Number(record.total_hours).toFixed(2)}h` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
