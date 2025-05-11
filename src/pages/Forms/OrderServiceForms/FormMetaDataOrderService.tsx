import Label from "../../../components/form/Label";
import { useEffect, useMemo, useState } from "react";
import { OrderServiceResponseDto } from "../../../services/model/Dto/Response/OrderServiceResponseDto";
import { OrderServiceRequestDto } from "../../../services/model/Dto/Request/OrderServiceRequestDto";
import Badge from "../../../components/ui/badge/Badge";
import { formatCurrencyPtBr, formatDate, formatPaymentMethod } from "../../../components/helper/formatUtils";

interface FormOrderServiceProps {
    data?: OrderServiceResponseDto;
    edit?: boolean;
}

export default function FormMetaDataOrderService({ data, edit }: FormOrderServiceProps) {

    const [formData, setFormData] = useState<OrderServiceRequestDto>({
        referencia: "",
        status: 0,
        precoOrdem: 0,
        precoDesconto: 0,
        percentualGanho: 0,
        precoDescontado: 0,
        descontoPercentual: 0,
        formaPagamento: 0,
        clienteId: "",
        funcionarioId: "",
        dataPagamento: new Date().toISOString().split("T")[0],
        qtdSessaoTotal: 0,
        qtdSessaoRealizada: 0,
        servicos: [],
        sessoes: [],
    });

    useEffect(() => {
        if (edit && data) {
            setFormData({
                id: data.id,
                referencia: data.referencia,
                status: data.status,
                precoOrdem: data.precoOrdem,
                precoDesconto: data.precoDesconto,
                formaPagamento: data.formaPagamento,
                clienteId: data.clienteId,
                funcionarioId: data.funcionarioId,
                dataPagamento: data.dataPagamento?.split("T")[0],
                qtdSessaoTotal: data.qtdSessaoTotal,
                qtdSessaoRealizada: data.qtdSessaoRealizada,
                funcionario: data.funcionario,
                cliente: data.cliente,
                servicos: data.servicos ?? [],
                sessoes: data.sessoes ?? []
            });

        }
    }, [edit, data]);


    const totalServicos = useMemo(() => {
        if (!data?.servicos || !Array.isArray(data.servicos)) return 0;

        return data.servicos.reduce((acc, servico) => {
            return acc + (servico?.valor ?? 0);
        }, 0);
    }, [data?.servicos]);

    const percentualGanhoCalculado = useMemo(() => {
        if (!totalServicos || totalServicos === 0 || !formData.precoOrdem) return 0;
        return ((formData.precoOrdem - totalServicos) / totalServicos) * 100;
    }, [formData.precoOrdem, totalServicos]);

    return (
        <>
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Tratamento
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Informações do tratamento
                    </p>
                </div>

                <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                    <div>
                        <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                            Informações
                        </h5>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 p-1">
                            <Badge
                                size="sm"
                                color={
                                    formData.status === 0
                                        ? "primary"     
                                        : formData.status === 1
                                            ? "info"      
                                            : formData.status === 2
                                                ? "info"    
                                                : formData.status === 3
                                                    ? "success" 
                                                    : formData.status === 4
                                                        ? "success"  
                                                        : formData.status === 5
                                                            ? "warning"
                                                            : formData.status === 6
                                                                ? "success" 
                                                                : formData.status === 7
                                                                    ? "success"
                                                                    : formData.status === 8
                                                                        ? "error" 
                                                                        : formData.status === 9
                                                                            ? "error" 
                                                                            : "light"
                                }
                            >
                                {
                                    formData.status === 0
                                        ? "Novo Paciente"
                                        : formData.status === 1
                                            ? "Aguardando Avaliação"
                                            : formData.status === 2
                                                ? "Em Avaliação"
                                                : formData.status === 3
                                                    ? "Plano de Tratamento"
                                                    : formData.status === 4
                                                        ? "Em Atendimento"
                                                        : formData.status === 5
                                                            ? "Faltou Atendimento"
                                                            : formData.status === 6
                                                                ? "Tratamento Concluído"
                                                                : formData.status === 7
                                                                    ? "Alta"
                                                                    : formData.status === 8
                                                                        ? "Cancelado"
                                                                        : formData.status === 9
                                                                            ? "Inativo"
                                                                            : "Desconhecido"
                                }
                            </Badge>
                        </div>
                        <br></br>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Referência:</Label>
                                <Label>{formData.referencia}</Label>
                            </div>
                            <div>
                                <Label>Cliente:</Label>
                                <Label>{formData.cliente?.nome}</Label>
                            </div>
                        </div>
                        <br></br>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Qtd. Sessão Mínima:</Label>
                                <Label>{formData.qtdSessaoRealizada}</Label>
                            </div>
                            <div>
                                <Label>Qtd. Sessão Máxima:</Label>
                                <Label>{formData.qtdSessaoTotal}</Label>
                            </div>
                        </div>
                        <br></br>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                            <div>
                                <Label>Total da Ordem:</Label>
                                <Label>{formatCurrencyPtBr(formData.precoOrdem)}</Label>
                            </div>
                            <div>
                                <Label>Serviços:</Label>
                                <Label>{formatCurrencyPtBr(totalServicos)}</Label>
                            </div>
                            <div>
                                <Label>Desconto R$:</Label>
                                <Label>{formatCurrencyPtBr(formData.precoDesconto ?? 0)}</Label>
                            </div>
                        </div>
                        <br></br>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Percentual de ganho:</Label>
                                <Label>{percentualGanhoCalculado.toFixed(2)}%</Label>
                            </div>
                            <div>
                                <Label>Desconto:</Label>
                                <Label>{formData.descontoPercentual ?? 0}%</Label>
                            </div>
                        </div>

                        <br></br>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Forma de pagamento</Label>
                                <Label>{formatPaymentMethod(formData.formaPagamento)}</Label>
                            </div>
                            <div>
                                <Label>Data pagamento</Label>
                                <Label>{formatDate(formData.dataPagamento)}</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}