export interface OrderServiceHistoryResponseDto {
    id: string;
    ordemServicoId: string;
    campo: string;
    valorAnterior: string | null;
    valorNovo: string | null;
    usuarioNome: string | null;
    dataAtualizacao: string;
    dataCadastro: string;
}
