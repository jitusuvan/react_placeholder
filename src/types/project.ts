export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CreateProjectResponse {
  message: string;
  project: Project;
}
