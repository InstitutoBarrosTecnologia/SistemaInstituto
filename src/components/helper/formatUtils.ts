export const formatCPF = (cpf?: string): string => {
  if (!cpf) return "";
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
};

export const formatPhone = (phone?: string): string => {
  if (!phone) return "";
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
};

export const formatRG = (rg?: string): string => {
  if (!rg) return "";
  return rg.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
};

export const formatDate = (date?: string): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR");
};

export const formatCurrencyPtBr = (valor?: number): string => {
  if (valor === null || valor === undefined || isNaN(valor)) return "R$ 0,00";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export const formatPaymentMethod = (value?: number): string => {
  switch (value) {
    case 0:
      return "À vista (Pix)";
    case 1:
      return "À vista (Boleto)";
    case 2:
      return "Parcelado (Boleto)";
    case 3:
      return "Cartão de Crédito (À vista)";
    case 4:
      return "Cartão de Crédito (Parcelado)";
    case 5:
      return "Cartão de Débito";
    default:
      return "Não informado";
  }
};

export const formatCEP = (cep?: string): string => {
  if (!cep) return "";
  return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};