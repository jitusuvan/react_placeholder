import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasks, createTask, updateTask, deleteTask, setFilters } from '../store/taskSlice';
import { TaskTable } from './TaskTable';
import { TaskModal } from './TaskModal';
import { Header } from './Header';
import { Task, TaskFilters } from '../types/task';
import { Plus, CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';

export const TaskDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, pagination, filters, error } = useAppSelector(state => state.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const handleFiltersChange = (newFilters: TaskFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleCreateTask = async (taskData: any) => {
    setActionLoading(true);
    try {
      await dispatch(createTask(taskData)).unwrap();
      setIsModalOpen(false);
      dispatch(fetchTasks(filters));
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;
    
    setActionLoading(true);
    try {
      await dispatch(updateTask({ id: editingTask.id, task: taskData })).unwrap();
      setIsModalOpen(false);
      setEditingTask(undefined);
      dispatch(fetchTasks(filters));
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await dispatch(deleteTask(id)).unwrap();
      dispatch(fetchTasks(filters));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await dispatch(updateTask({ id, task: { completed } })).unwrap();
      dispatch(fetchTasks(filters));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const getTaskStats = () => {
    const total = pagination.count;
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const overdue = tasks.filter(task => 
      !task.completed && new Date(task.due_date) < new Date()
    ).length;

    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <ListTodo className="w-8 h-8 text-primary" />
                Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">Manage your tasks efficiently</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Create New Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border overflow-hidden shadow-lg rounded-xl card-hover">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ListTodo className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Total Tasks</dt>
                    <dd className="text-2xl font-bold text-foreground">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow-lg rounded-xl card-hover">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Completed</dt>
                    <dd className="text-2xl font-bold text-foreground">{stats.completed}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow-lg rounded-xl card-hover">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Pending</dt>
                    <dd className="text-2xl font-bold text-foreground">{stats.pending}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow-lg rounded-xl card-hover">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Overdue</dt>
                    <dd className="text-2xl font-bold text-foreground">{stats.overdue}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Task Table */}
        <TaskTable
          tasks={tasks}
          loading={loading}
          filters={filters}
          pagination={pagination}
          onFiltersChange={handleFiltersChange}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          loading={actionLoading}
        />
        </div>
      </div>
    </div>
  );
};