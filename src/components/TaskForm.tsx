import React from 'react';
import { useTaskForm } from '../hooks/useTaskForm';
import { Task } from '../types/task';
import { Check, Calendar, FileText, Type } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, loading }) => {
  const { formData, errors, validateForm, updateField, getCreateData, getUpdateData } = useTaskForm(task);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data = task ? getUpdateData() : getCreateData();
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Type className="w-4 h-4 text-primary" />
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className={`input-field rounded-lg ${
            errors.title ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
          placeholder="Enter task title"
        />
        {errors.title && <p className="text-destructive text-sm mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-destructive rounded-full"></span>
          {errors.title}
        </p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <FileText className="w-4 h-4 text-primary" />
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
          className={`input-field rounded-lg resize-none ${
            errors.description ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
          placeholder="Enter task description"
        />
        {errors.description && <p className="text-destructive text-sm mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-destructive rounded-full"></span>
          {errors.description}
        </p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Calendar className="w-4 h-4 text-primary" />
          Due Date *
        </label>
        <input
          type="date"
          value={formData.due_date}
          onChange={(e) => updateField('due_date', e.target.value)}
          className={`input-field rounded-lg ${
            errors.due_date ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
        />
        {errors.due_date && <p className="text-destructive text-sm mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-destructive rounded-full"></span>
          {errors.due_date}
        </p>}
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="completed"
          checked={formData.completed}
          onChange={(e) => updateField('completed', e.target.checked)}
          className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
        />
        <label htmlFor="completed" className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <Check className="w-4 h-4 text-primary" />
          Mark as completed
        </label>
      </div>

      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary py-3 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
          ) : (
            <>
              {task ? 'Update Task' : 'Create Task'}
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};