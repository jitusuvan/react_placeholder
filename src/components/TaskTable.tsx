import React, { useState } from 'react';
import { Task, TaskFilters } from '../types/task';
import { Search, Edit, Trash2, CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  filters: TaskFilters;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    currentPage: number;
  };
  onFiltersChange: (filters: TaskFilters) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading,
  filters,
  pagination,
  onFiltersChange,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchTerm, page: 1 });
  };

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 input-field rounded-l-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 btn-primary rounded-r-lg flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>

          <select
            value={filters.completed?.toString() || ''}
            onChange={(e) => handleFilterChange('completed', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="px-3 py-2 input-field rounded-lg"
          >
            <option value="">All Tasks</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>

          <select
            value={filters.ordering || ''}
            onChange={(e) => handleFilterChange('ordering', e.target.value || undefined)}
            className="px-3 py-2 input-field rounded-lg"
          >
            <option value="">Default Order</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="due_date">Due Date (Asc)</option>
            <option value="-due_date">Due Date (Desc)</option>
            <option value="title">Title (A-Z)</option>
            <option value="-title">Title (Z-A)</option>
          </select>

          <input
            type="date"
            value={filters.due_date || ''}
            onChange={(e) => handleFilterChange('due_date', e.target.value || undefined)}
            className="px-3 py-2 input-field rounded-lg"
            placeholder="Filter by due date"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <ListTodo className="w-16 h-16 mx-auto mb-4 opacity-50" />
            No tasks found. Create your first task!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {tasks.map((task) => (
                  <tr key={task.id} className={`hover:bg-muted/50 transition-colors ${isOverdue(task.due_date, task.completed) ? 'bg-destructive/5' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleComplete(task.id, !task.completed)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          task.completed
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : isOverdue(task.due_date, task.completed)
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : isOverdue(task.due_date, task.completed) ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {task.completed ? 'Completed' : isOverdue(task.due_date, task.completed) ? 'Overdue' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-foreground">{task.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">{task.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {formatDate(task.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(task.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onEdit(task)}
                          className="text-primary hover:text-primary/80 transition-colors p-1 rounded hover:bg-primary/10"
                          title="Edit task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(task.id)}
                          className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded hover:bg-destructive/10"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.count > 10 && (
        <div className="bg-card border border-border px-6 py-4 flex items-center justify-between rounded-xl shadow-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.previous}
              className="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.next}
              className="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing page <span className="font-semibold text-foreground">{pagination.currentPage}</span> of{' '}
                <span className="font-semibold text-foreground">{Math.ceil(pagination.count / 10)}</span> pages
                ({pagination.count} total tasks)
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-lg shadow-sm">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.previous}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.next}
                  className="relative inline-flex items-center px-4 py-2 rounded-r-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};