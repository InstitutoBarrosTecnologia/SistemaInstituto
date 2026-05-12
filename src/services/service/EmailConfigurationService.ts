import { instanceApi } from './AxioService';
import {
  EmailConfigurationRequestDto,
  EmailConfigurationResponseDto,
  EmailConfigurationListResponseDto,
} from '../model/email.types';

const BASE = '/EmailConfiguration';

const EmailConfigurationService = {
  async getAll(page = 1, pageSize = 10, ativo?: boolean): Promise<EmailConfigurationListResponseDto> {
    const params: Record<string, unknown> = { page, pageSize };
    if (ativo !== undefined) params.ativo = ativo;
    const response = await instanceApi.get(BASE, { params });
    return response.data;
  },

  async getActive(): Promise<EmailConfigurationResponseDto | null> {
    const response = await instanceApi.get(`${BASE}/active`);
    return response.status === 204 ? null : response.data;
  },

  async getById(id: string): Promise<EmailConfigurationResponseDto> {
    const response = await instanceApi.get(`${BASE}/${id}`);
    return response.data;
  },

  async create(data: EmailConfigurationRequestDto): Promise<EmailConfigurationResponseDto> {
    const response = await instanceApi.post(BASE, data);
    return response.data;
  },

  async update(id: string, data: EmailConfigurationRequestDto): Promise<EmailConfigurationResponseDto> {
    const response = await instanceApi.put(`${BASE}/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await instanceApi.delete(`${BASE}/${id}`);
  },
};

export default EmailConfigurationService;
