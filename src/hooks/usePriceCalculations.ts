/**
 * usePriceCalculations - Hook para cálculos de preço
 * 
 * Extrai toda a lógica de cálculo de preços, descontos e ganhos
 * do FormOrderService.tsx
 * 
 * Responsabilidades:
 * - Calcular preço com desconto
 * - Calcular ganho percentual
 * - Validar valores
 * - Manter estado de preços
 */

import { useState, useCallback, useMemo } from 'react';

interface PriceState {
  precoOrdem: number;
  precoDesconto: number;
  percentualGanho: number;
  precoDescontado: number;
  descontoPercentual: number;
  descontoReais: number;
}

interface PriceManualState {
  isManualPrecoOrdem: boolean;
  isManualTotalComGanho: boolean;
  precoOrdemInput: string;
  totalComGanhoInput: string;
  descontoPercentualInput: string;
  descontoReaisInput: string;
}

export function usePriceCalculations(initialPrice: PriceState = {
  precoOrdem: 0,
  precoDesconto: 0,
  percentualGanho: 0,
  precoDescontado: 0,
  descontoPercentual: 0,
  descontoReais: 0,
}) {
  const [priceState, setPriceState] = useState<PriceState>(initialPrice);
  const [manualState, setManualState] = useState<PriceManualState>({
    isManualPrecoOrdem: false,
    isManualTotalComGanho: false,
    precoOrdemInput: '',
    totalComGanhoInput: '',
    descontoPercentualInput: '',
    descontoReaisInput: '',
  });

  /**
   * Calcular preço com desconto percentual
   */
  const calculateDiscountedPrice = useCallback(
    (basePrice: number, discountPercent: number): number => {
      if (basePrice <= 0 || discountPercent < 0 || discountPercent > 100) {
        return basePrice;
      }
      return basePrice * (1 - discountPercent / 100);
    },
    []
  );

  /**
   * Calcular desconto em reais
   */
  const calculateDiscountInReais = useCallback(
    (basePrice: number, discountPercent: number): number => {
      return basePrice - calculateDiscountedPrice(basePrice, discountPercent);
    },
    [calculateDiscountedPrice]
  );

  /**
   * Calcular percentual de ganho
   */
  const calculateProfitPercent = useCallback(
    (basePrice: number, profitValue: number): number => {
      if (basePrice <= 0) return 0;
      return (profitValue / basePrice) * 100;
    },
    []
  );

  /**
   * Calcular preço final com ganho
   */
  const calculatePriceWithProfit = useCallback(
    (basePrice: number, profitPercent: number): number => {
      if (basePrice <= 0 || profitPercent < 0) {
        return basePrice;
      }
      return basePrice * (1 + profitPercent / 100);
    },
    []
  );

  /**
   * Atualizar preço base
   */
  const updateBasePrice = useCallback((price: number) => {
    setPriceState((prev) => ({
      ...prev,
      precoOrdem: Math.max(0, price),
      precoDescontado: Math.max(0, price), // Reset desconto
      descontoPercentual: 0,
      descontoReais: 0,
    }));
  }, []);

  /**
   * Atualizar preço com desconto percentual
   */
  const updateDiscountPercent = useCallback(
    (discountPercent: number) => {
      const basePrice = priceState.precoOrdem;
      const clamped = Math.max(0, Math.min(100, discountPercent));

      const discountedPrice = calculateDiscountedPrice(basePrice, clamped);
      const discountReais = calculateDiscountInReais(basePrice, clamped);

      setPriceState((prev) => ({
        ...prev,
        descontoPercentual: clamped,
        precoDescontado: discountedPrice,
        descontoReais: discountReais,
      }));
    },
    [priceState.precoOrdem, calculateDiscountedPrice, calculateDiscountInReais]
  );

  /**
   * Atualizar preço com desconto em reais
   */
  const updateDiscountReais = useCallback(
    (discountReais: number) => {
      const basePrice = priceState.precoOrdem;
      const clamped = Math.max(0, Math.min(basePrice, discountReais));

      const discountPercent =
        basePrice > 0 ? (clamped / basePrice) * 100 : 0;
      const discountedPrice = basePrice - clamped;

      setPriceState((prev) => ({
        ...prev,
        descontoReais: clamped,
        descontoPercentual: discountPercent,
        precoDescontado: discountedPrice,
      }));
    },
    [priceState.precoOrdem]
  );

  /**
   * Atualizar ganho percentual
   */
  const updateProfitPercent = useCallback(
    (profitPercent: number) => {
      setPriceState((prev) => ({
        ...prev,
        percentualGanho: Math.max(0, profitPercent),
        precoDesconto: calculatePriceWithProfit(
          prev.precoDescontado || prev.precoOrdem,
          Math.max(0, profitPercent)
        ),
      }));
    },
    [calculatePriceWithProfit]
  );

  /**
   * Atualizar ganho em valor absoluto
   */
  const updateProfitValue = useCallback(
    (profitValue: number) => {
      const basePrice = priceState.precoDescontado || priceState.precoOrdem;
      const profitPercent = calculateProfitPercent(basePrice, profitValue);

      setPriceState((prev) => ({
        ...prev,
        percentualGanho: profitPercent,
        precoDesconto: basePrice + profitValue,
      }));
    },
    [priceState.precoDescontado, priceState.precoOrdem, calculateProfitPercent]
  );

  /**
   * Toggle modo de entrada manual de preço
   */
  const toggleManualPriceInput = useCallback(() => {
    setManualState((prev) => ({
      ...prev,
      isManualPrecoOrdem: !prev.isManualPrecoOrdem,
    }));
  }, []);

  /**
   * Toggle modo de entrada manual de ganho total
   */
  const toggleManualProfitInput = useCallback(() => {
    setManualState((prev) => ({
      ...prev,
      isManualTotalComGanho: !prev.isManualTotalComGanho,
    }));
  }, []);

  /**
   * Atualizar entrada de preço manual
   */
  const updateManualPriceInput = useCallback((value: string) => {
    setManualState((prev) => ({
      ...prev,
      precoOrdemInput: value,
    }));

    if (value && !isNaN(Number(value))) {
      updateBasePrice(Number(value));
    }
  }, [updateBasePrice]);

  /**
   * Atualizar entrada de ganho manual
   */
  const updateManualProfitInput = useCallback((value: string) => {
    setManualState((prev) => ({
      ...prev,
      totalComGanhoInput: value,
    }));

    if (value && !isNaN(Number(value))) {
      updateProfitValue(Number(value));
    }
  }, [updateProfitValue]);

  /**
   * Atualizar entrada de desconto percentual manual
   */
  const updateManualDiscountPercentInput = useCallback((value: string) => {
    setManualState((prev) => ({
      ...prev,
      descontoPercentualInput: value,
    }));

    if (value && !isNaN(Number(value))) {
      updateDiscountPercent(Number(value));
    }
  }, [updateDiscountPercent]);

  /**
   * Atualizar entrada de desconto em reais manual
   */
  const updateManualDiscountReaisInput = useCallback((value: string) => {
    setManualState((prev) => ({
      ...prev,
      descontoReaisInput: value,
    }));

    if (value && !isNaN(Number(value))) {
      updateDiscountReais(Number(value));
    }
  }, [updateDiscountReais]);

  /**
   * Calcular resumo de preços
   */
  const priceSummary = useMemo(() => {
    return {
      basePrice: priceState.precoOrdem,
      discountPercent: priceState.descontoPercentual,
      discountReais: priceState.descontoReais,
      priceAfterDiscount: priceState.precoDescontado,
      profitPercent: priceState.percentualGanho,
      profitValue: priceState.precoDesconto - (priceState.precoDescontado || priceState.precoOrdem),
      finalPrice: priceState.precoDesconto,
    };
  }, [priceState]);

  /**
   * Validar preços
   */
  const isPriceValid = useCallback((): boolean => {
    return (
      priceState.precoOrdem > 0 &&
      priceState.precoDescontado > 0 &&
      priceState.precoDesconto > 0 &&
      priceState.precoDesconto >= priceState.precoDescontado
    );
  }, [priceState]);

  return {
    // Estado
    priceState,
    manualState,

    // Atualizadores de preço
    updateBasePrice,
    updateDiscountPercent,
    updateDiscountReais,
    updateProfitPercent,
    updateProfitValue,

    // Toggles de entrada manual
    toggleManualPriceInput,
    toggleManualProfitInput,

    // Atualizadores de entrada manual
    updateManualPriceInput,
    updateManualProfitInput,
    updateManualDiscountPercentInput,
    updateManualDiscountReaisInput,

    // Dados
    priceSummary,
    isPriceValid,

    // Cálculos diretos
    calculateDiscountedPrice,
    calculateDiscountInReais,
    calculateProfitPercent,
    calculatePriceWithProfit,
  };
}

export default usePriceCalculations;
