import { request, apiClient } from './apiClient';

export interface WelcomeResponse {
  message: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  college: string;
  department: string;
  year: string;
  phone: string;
  whatsapp: string;
  eventName: string;
  paymentScreenshot?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    eventName: string;
  };
}

export const registrationService = {
  /**
   * Fetches the welcome message from the backend base route
   */
  async getWelcomeMessage(): Promise<WelcomeResponse> {
    return request<WelcomeResponse>('/');
  },

  /**
   * Submits a participant registration payload to the backend
   */
  async registerParticipant(payload: RegisterPayload): Promise<RegisterResponse> {
    return request<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetches all registrations (for the future admin dashboard)
   */
  async getAllRegistrations(): Promise<any> {
    return request<any>('/register', {
      method: 'GET',
    });
  },

  /**
   * Uploads a screenshot to the backend and returns the URL
   */
  async uploadScreenshot(file: File): Promise<{ success: boolean; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/register/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
