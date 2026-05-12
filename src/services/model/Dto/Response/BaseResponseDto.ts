export interface BaseResponseDto {
    id?: string;
    dataCadastro?: string; // ou Date se for tratado como objeto Date
    dataDesativacao?: string; // idem acima
    usrCadastro?: string;
    usrCadastroDesc?: string;          // alias usado em alguns endpoints
    usrDescricaoCadastro?: string;     // nome retornado pela API de Schedule (e outros)
    prestadorId?: string;
    usrDesativacao?: string;
    usrDescricaoDesativacao?: string;
}