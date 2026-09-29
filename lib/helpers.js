import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Regras de situação do estoque (nunca definida manualmente):
 * - "sem-estoque": quantidade === 0
 * - "estoque-baixo": quantidade > 0 e quantidade < estoqueMinimo
 * - "normal": quantidade >= estoqueMinimo e quantidade > 0
 */
export const SITUACOES = {
  NORMAL: "normal",
  BAIXO: "estoque-baixo",
  SEM_ESTOQUE: "sem-estoque",
};

export const SITUACAO_LABEL = {
  [SITUACOES.NORMAL]: "Normal",
  [SITUACOES.BAIXO]: "Estoque baixo",
  [SITUACOES.SEM_ESTOQUE]: "Sem estoque",
};

export function calcularSituacao(quantidade, estoqueMinimo) {
  if (quantidade === 0) return SITUACOES.SEM_ESTOQUE;
  if (quantidade > 0 && quantidade < estoqueMinimo) return SITUACOES.BAIXO;
  return SITUACOES.NORMAL;
}

export function comSituacaoRecalculada(material) {
  return {
    ...material,
    situacao: calcularSituacao(material.quantidade, material.estoqueMinimo),
  };
}
