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