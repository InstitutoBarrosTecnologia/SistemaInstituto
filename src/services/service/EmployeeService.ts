import { EmployeeRequestDto } from "../model/Dto/Request/EmployeeRequestDto";
import { EmployeeResponseDto } from "../model/Dto/Response/EmployeeResponseDto";
import { instanceApi } from "./AxioService";

const endpoint = "/Employee";

export const EmployeeService = {
  async getAll(): Promise<EmployeeResponseDto[]> {
    const response = await instanceApi.get(`${endpoint}`);
    return response.data;
  },

  async getById(id: string): Promise<EmployeeResponseDto> {
    const response = await instanceApi.get(`${endpoint}/${id}`);
    return response.data;
  },

  async create(data: EmployeeRequestDto) {
    return await instanceApi.post(`${endpoint}`, data);
  },

  async update(data: EmployeeRequestDto) {
    return await instanceApi.put(`${endpoint}`, data);
  },

  async delete(id: string): Promise<void> {
    await instanceApi.delete(`${endpoint}/${id}`);
  },

  async disable(id: string): Promise<void> {
    await instanceApi.put(`${endpoint}/Desativarfuncionario/${id}`);
  }
};


export default EmployeeService;