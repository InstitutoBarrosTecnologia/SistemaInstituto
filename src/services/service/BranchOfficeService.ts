import { BranchOfficeRequestDto } from "../model/Dto/Request/BranchOfficeRequestDto";
import { BranchOfficeResponseDto } from "../model/Dto/Response/BranchOfficeResponseDto";
import { instanceApi } from "./AxioService";


const baseUrl = "/BranchOffice";

export const BranchOfficeService = {
    async getAll(): Promise<BranchOfficeResponseDto[]> {
        const response = await instanceApi.get(baseUrl);
        return response.data;
    },

    async getById(id: string): Promise<BranchOfficeResponseDto> {
        const response = await instanceApi.get(`${baseUrl}/${id}`);
        return response.data;
    },

    async create(data: BranchOfficeRequestDto) {
       return await instanceApi.post(baseUrl, data);
    },

    async update(data: BranchOfficeRequestDto) {
        return await instanceApi.put(`${baseUrl}`, data);
    },

    async delete(id: string): Promise<void> {
        await instanceApi.delete(`${baseUrl}/${id}`);
    },

    async disable(id: string): Promise<void> {
        await instanceApi.put(`${baseUrl}/DesativarFilial/${id}`);
    }
};
