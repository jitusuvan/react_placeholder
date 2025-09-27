import { useState } from 'react';
import { CreateTaskRequest, UpdateTaskRequest } from '../types/task';

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
}

interface TaskFormErrors {
  title?: string;
  description?: string;
  due_date?: string;
}

export const useTaskForm = (initialData?: Partial<TaskFormData>) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    due_date: initialData?.due_date || '',
    completed: initialData?.completed || false,
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: TaskFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof TaskFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof TaskFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      completed: false,
    });
    setErrors({});
  };

  const getCreateData = (): CreateTaskRequest => ({
    title: formData.title,
    description: formData.description,
    due_date: formData.due_date,
    completed: formData.completed,
  });

  const getUpdateData = (): UpdateTaskRequest => ({
    title: formData.title,
    description: formData.description,
    due_date: formData.due_date,
    completed: formData.completed,
  });

  return {
    formData,
    errors,
    validateForm,
    updateField,
    resetForm,
    getCreateData,
    getUpdateData,
  };
};