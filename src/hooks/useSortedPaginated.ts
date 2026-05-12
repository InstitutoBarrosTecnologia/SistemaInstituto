import { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

type ColType = "string" | "number" | "date" | "currency";

export interface ColDef {
  key: string;
  type: ColType;
  /** accessor: extrai o valor bruto do item para comparação */
  accessor: (item: unknown) => unknown;
}

const PAGE_SIZE = 20;

function compareValues(a: unknown, b: unknown, type: ColType): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  switch (type) {
    case "number":
    case "currency":
      return (Number(a) || 0) - (Number(b) || 0);
    case "date": {
      const da = new Date(a as string).getTime();
      const db = new Date(b as string).getTime();
      if (isNaN(da) && isNaN(db)) return 0;
      if (isNaN(da)) return 1;
      if (isNaN(db)) return -1;
      return da - db;
    }
    case "string":
    default:
      return String(a).localeCompare(String(b), "pt-BR", { sensitivity: "base" });
  }
}

export function useSortedPaginated<T>(
  data: T[],
  cols: ColDef[],
  defaultSort?: SortState
) {
  const [sort, setSort] = useState<SortState>(
    defaultSort ?? { key: cols[0]?.key ?? "", direction: "asc" }
  );
  const [page, setPage] = useState(1);

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
    setPage(1);
  };

  const sorted = useMemo(() => {
    const col = cols.find((c) => c.key === sort.key);
    if (!col) return [...data];
    return [...data].sort((a, b) => {
      const va = col.accessor(a);
      const vb = col.accessor(b);
      const cmp = compareValues(va, vb, col.type);
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [data, sort, cols]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const paginated = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  );

  return {
    sorted,       // todos os dados ordenados (para export)
    paginated,    // só a página atual (para exibição)
    sort,
    toggleSort,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}
