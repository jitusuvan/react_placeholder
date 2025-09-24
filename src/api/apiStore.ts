/**
 * This file contains centralized API functions for the app.
 * Replace the placeholder implementations with real API calls.
 */

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    // TODO: Replace with real API call
    return { id: "1", email, name: "Demo User" };
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    await delay(500);
    // TODO: Replace with real API call
    return { id: "2", email, name };
  },

  fetchTodos: async (): Promise<Todo[]> => {
    await delay(500);
    // TODO: Replace with real API call
    return [
      { id: "1", text: "Sample todo 1", completed: false },
      { id: "2", text: "Sample todo 2", completed: true },
    ];
  },

  addTodo: async (text: string): Promise<Todo> => {
    await delay(500);
    // TODO: Replace with real API call
    return { id: Date.now().toString(), text, completed: false };
  },

  updateTodo: async (todo: Todo): Promise<Todo> => {
    await delay(500);
    // TODO: Replace with real API call
    return todo;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await delay(500);
    // TODO: Replace with real API call
  },
};
