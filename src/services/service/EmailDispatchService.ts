import { instanceApi } from './AxioService';
import {
  EmailDispatchRequestDto,
  EmailDispatchResponseDto,
  EmailDispatchListResponseDto,
} from '../model/email.types';

const BASE = '/EmailDispatch';

const EmailDispatchService = {
  async getAll(page = 1, pageSize = 10, status?: string): Promise<EmailDispatchListResponseDto> {
    const params: Record<string, unknown> = { page, pageSize };
    if (status) params.status = status;
    const response = await instanceApi.get(BASE, { params });
    return response.data;
  },

  async getById(id: string): Promise<EmailDispatchResponseDto> {
    const response = await instanceApi.get(`${BASE}/${id}`);
    return response.data;
  },

  async send(data: EmailDispatchRequestDto): Promise<EmailDispatchResponseDto> {
    const response = await instanceApi.post(`${BASE}/send`, data);
    return response.data;
  },
};

export default EmailDispatchService;
