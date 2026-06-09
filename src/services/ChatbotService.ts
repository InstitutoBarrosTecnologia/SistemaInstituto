import { instanceApi } from './service/AxioService';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ChatbotRequest {
  command: string;
  periodo?: 'dia' | 'semana' | 'mes' | 'ano';
  filialId?: string;
}

export interface ChatbotResponse {
  command: string;
  title: string;
  type: string;
  text: string;
  data: unknown;
  suggestions: string[];
  periodo?: string;
}

export interface ChatbotCommandInfo {
  command: string;
  description: string;
  example: string;
  icon: string;
}

export interface ChatbotHelpResponse {
  title: string;
  commands: ChatbotCommandInfo[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const ChatbotService = {
  async processCommand(request: ChatbotRequest): Promise<ChatbotResponse> {
    const response = await instanceApi.post<ChatbotResponse>(
      '/api/Chatbot/command',
      request
    );
    return response.data;
  },

  async getHelp(): Promise<ChatbotHelpResponse> {
    const response = await instanceApi.get<ChatbotHelpResponse>('/api/Chatbot/help');
    return response.data;
  },
};

export default ChatbotService;
