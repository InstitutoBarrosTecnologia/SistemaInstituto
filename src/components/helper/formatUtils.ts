export const formatCPF = (cpf?: string): string => {
    if (!cpf) return "";
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
};

export const formatPhone = (phone?: string): string => {
    if (!phone) return "";
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
};