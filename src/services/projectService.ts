import { API_HOST, API_ENDPOINTS } from '../config/apiConfig';
import { Project, CreateProjectRequest, CreateProjectResponse } from '../types/project';

class ProjectService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async getProjects(): Promise<{ count: number; next: string | null; previous: string | null; results: Project[] }> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.PROJECTS_LIST}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  }

  async createProject(projectData: CreateProjectRequest): Promise<CreateProjectResponse> {
    const response = await fetch(`${API_HOST}${API_ENDPOINTS.CREATE_PROJECT}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData)
    });

    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  }
}

export const projectService = new ProjectService();
