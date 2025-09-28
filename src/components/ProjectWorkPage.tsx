import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject } from '../store/slices/projectSlice';
import { addWorkLog, fetchWorkLogs, fetchDailySummary } from '../store/slices/worklogSlice';
import { CreateWorkLogRequest } from '../types/worklog';
import { CreateProjectRequest } from '../types/project';
import toast from 'react-hot-toast';

const ProjectWorkPage: React.FC = () => {
  const dispatch = useDispatch();
  const { projects, loading: projectsLoading } = useSelector((state: any) => state.project);
  const { worklogs, loading: worklogsLoading } = useSelector((state: any) => state.worklog);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workLogForm, setWorkLogForm] = useState<CreateWorkLogRequest>({
    project: 0,
    date: selectedDate,
    work_description: '',
    hours_spent: 0
  });
  const [projectForm, setProjectForm] = useState<CreateProjectRequest>({
    name: '',
    description: ''
  });
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects() as any);
    dispatch(fetchWorkLogs() as any);
  }, [dispatch]);

  useEffect(() => {
    setWorkLogForm((prev: any) => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  const handleWorkLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addWorkLog(workLogForm) as any);
      toast.success('Work log added successfully!');
      setWorkLogForm({
        project: 0,
        date: selectedDate,
        work_description: '',
        hours_spent: 0
      });
      dispatch(fetchWorkLogs() as any);
      dispatch(fetchDailySummary(selectedDate) as any);
    } catch (err) {
      toast.error('Failed to add work log');
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createProject(projectForm) as any);
      toast.success('Project created successfully!');
      setProjectForm({ name: '', description: '' });
      setShowProjectForm(false);
      dispatch(fetchProjects() as any);
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleWorkLogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkLogForm((prev: any) => ({
      ...prev,
      [name]: name === 'hours_spent' || name === 'project' ? Number(value) : value
    }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectForm((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const todaysWorkLogs = worklogs.filter((log: any) => log.date === selectedDate);
  const totalHoursToday = todaysWorkLogs.reduce((total: number, log: any) => total + Number(log.hours_spent), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Work & Time Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Work Log Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Log Work</h2>
            <form onSubmit={handleWorkLogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={workLogForm.date}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  name="project"
                  value={workLogForm.project}
                  onChange={handleWorkLogChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={0}>Select a project</option>
                  {projects.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Description</label>
                <textarea
                  name="work_description"
                  value={workLogForm.work_description}
                  onChange={handleWorkLogChange}
                  rows={3}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the work done..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hours Spent</label>
                <input
                  type="number"
                  name="hours_spent"
                  value={workLogForm.hours_spent}
                  onChange={handleWorkLogChange}
                  min="0.1"
                  step="0.1"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={worklogsLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {worklogsLoading ? 'Adding...' : 'Add Work Log'}
              </button>
            </form>
          </div>

          {/* Today's Work Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Work Summary ({selectedDate})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{todaysWorkLogs.length}</div>
                <div className="text-sm text-blue-700">Tasks Completed</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{totalHoursToday.toFixed(1)}</div>
                <div className="text-sm text-green-700">Total Hours</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{projects.length}</div>
                <div className="text-sm text-purple-700">Active Projects</div>
              </div>
            </div>
            <div className="space-y-2">
              {todaysWorkLogs.map((log: any) => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{projects.find((p: any) => p.id === log.project)?.name}</div>
                    <div className="text-sm text-gray-600">{log.work_description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{log.hours_spent}h</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Projects List */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded"
              >
                {showProjectForm ? 'Cancel' : 'New Project'}
              </button>
            </div>

            {showProjectForm && (
              <form onSubmit={handleProjectSubmit} className="mb-4 p-4 bg-gray-50 rounded space-y-3">
                <input
                  type="text"
                  name="name"
                  value={projectForm.name}
                  onChange={handleProjectChange}
                  placeholder="Project name"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleProjectChange}
                  placeholder="Project description"
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={projectsLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
                >
                  {projectsLoading ? 'Creating...' : 'Create Project'}
                </button>
              </form>
            )}

            <div className="space-y-2">
              {projects.map((project: any) => (
                <div key={project.id} className="p-3 border rounded">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-gray-600">{project.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Work Logs */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Work Logs</h2>
            <div className="space-y-2">
              {worklogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">
                        {projects.find((p: any) => p.id === log.project)?.name}
                      </div>
                      <div className="text-xs text-gray-600">{log.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{log.hours_spent}h</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-700 mt-1">{log.work_description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkPage;
