import { DespesaRequestDto } from "../model/Dto/Request/DespesaRequestDto";
import { DespesaResponseDto, EDespesaStatus } from "../model/Dto/Response/DespesaResponseDto";

// Simulação de dados para desenvolvimento
const mockDespesas: DespesaResponseDto[] = [
  {
    id: "1",
    nomeDespesa: "Material de Escritório",
    descricao: "Canetas, papéis e materiais diversos para o escritório",
    unidadeId: "unidade-1",
    nomeUnidade: "Matriz São Paulo",
    quantidade: 50,
    status: EDespesaStatus.Aprovado,
    arquivo: "materiais-escritorio.pdf",
    dataCadastro: "2024-12-01T10:00:00Z",
    usrCadastro: "admin",
    prestadorId: "prestador-1"
  },
  {
    id: "2", 
    nomeDespesa: "Equipamentos de Fisioterapia",
    descricao: "Aquisição de novos equipamentos para tratamento",
    unidadeId: "unidade-2",
    nomeUnidade: "Filial Rio de Janeiro",
    quantidade: 3,
    status: EDespesaStatus.Analise,
    arquivo: "equipamentos-fisio.pdf",
    dataCadastro: "2024-12-02T14:30:00Z",
    usrCadastro: "gerente",
    prestadorId: "prestador-1"
  },
  {
    id: "3",
    nomeDespesa: "Limpeza e Higiene",
    descricao: "Produtos de limpeza para manutenção das unidades",
    unidadeId: "unidade-1",
    nomeUnidade: "Matriz São Paulo",
    quantidade: 25,
    status: EDespesaStatus.Recusado,
    observacoes: "Valores acima do orçamento aprovado",
    dataCadastro: "2024-12-03T09:15:00Z",
    usrCadastro: "funcionario",
    prestadorId: "prestador-1"
  },
  {
    id: "4",
    nomeDespesa: "Software de Gestão",
    descricao: "Licenças anuais para software de gestão",
    unidadeId: "unidade-3",
    nomeUnidade: "Filial Belo Horizonte",
    quantidade: 10,
    status: EDespesaStatus.Aprovado,
    arquivo: "licencas-software.pdf",
    dataCadastro: "2024-12-04T16:45:00Z",
    usrCadastro: "admin",
    prestadorId: "prestador-1"
  }
];

export const DespesaService = {
  async getAll(): Promise<DespesaResponseDto[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockDespesas;
  },

  async getById(id: string): Promise<DespesaResponseDto> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const despesa = mockDespesas.find(d => d.id === id);
    if (!despesa) {
      throw new Error("Despesa não encontrada");
    }
    return despesa;
  },

  async create(data: DespesaRequestDto): Promise<{ status: number; data: DespesaResponseDto }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDespesa: DespesaResponseDto = {
      id: Date.now().toString(),
      nomeDespesa: data.nomeDespesa,
      descricao: data.descricao,
      unidadeId: data.unidadeId,
      nomeUnidade: "Unidade Selecionada", // Seria resolvido pelo backend
      quantidade: data.quantidade,
      status: EDespesaStatus.Analise, // Sempre inicia em análise
      arquivo: data.arquivo,
      observacoes: data.observacoes,
      dataCadastro: new Date().toISOString(),
      usrCadastro: "usuario-atual",
      prestadorId: "prestador-1"
    };

    mockDespesas.push(newDespesa);
    return { status: 200, data: newDespesa };
  },

  async update(data: DespesaRequestDto): Promise<{ status: number; data: DespesaResponseDto }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const index = mockDespesas.findIndex(d => d.id === data.id);
    if (index === -1) {
      throw new Error("Despesa não encontrada");
    }

    mockDespesas[index] = {
      ...mockDespesas[index],
      nomeDespesa: data.nomeDespesa,
      descricao: data.descricao,
      unidadeId: data.unidadeId,
      quantidade: data.quantidade,
      status: data.status,
      arquivo: data.arquivo,
      observacoes: data.observacoes
    };

    return { status: 200, data: mockDespesas[index] };
  },

  async updateStatus(id: string, status: EDespesaStatus, observacoes?: string): Promise<{ status: number }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockDespesas.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error("Despesa não encontrada");
    }

    mockDespesas[index] = {
      ...mockDespesas[index],
      status,
      observacoes: observacoes || mockDespesas[index].observacoes
    };

    return { status: 200 };
  },

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockDespesas.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error("Despesa não encontrada");
    }

    mockDespesas.splice(index, 1);
  }
};
