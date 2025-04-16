import { BaseRequestDto } from "./BaseRequestDto";

export interface UserRequestDto extends BaseRequestDto {   
    usrDescricaoDesativacao?: string;
    funcionarioId?: string;
    email: string;
    password: string;
    userName: string;
  }