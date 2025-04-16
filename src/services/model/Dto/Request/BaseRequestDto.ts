export interface BaseRequestDto {
    id?: string;
    dataCadastro?: string; // ou Date se for tratado como objeto Date
    dataDesativacao?: string; // idem acima
    usrCadastro?: string;
    usrCadastroDesc?: string;
    prestadorId?: string;
    usrDesativacao?: string;
}