import { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string;
  onClick?: () => void; // Optional className for styling
}


// Props for PaginationProps
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  onClick
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`} onClick={onClick}>{children}</CellTag>;
};

//Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  // Garantir valores válidos
  const safePage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const safeTotal = isNaN(totalPages) || totalPages < 1 ? 1 : totalPages;

  return (
    <div className="px-6 py-4 border-t flex justify-between items-center">
      <button
        onClick={() => onPageChange(Math.max(safePage - 1, 1))}
        disabled={safePage === 1}
        className="px-4 py-2 bg-gray-300 border-gray-900 rounded dark:text-white dark:bg-blue-600 dark:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <div className="flex flex-col items-center gap-1">
        <span className="dark:text-white font-medium">
          Página {safePage} de {safeTotal}
        </span>
        {totalItems && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total de {totalItems} {totalItems === 1 ? "registro" : "registros"}
          </span>
        )}
      </div>
      <button
        onClick={() => onPageChange(Math.min(safePage + 1, safeTotal))}
        disabled={safePage === safeTotal}
        className="px-4 py-2 bg-gray-300 border-gray-900 rounded dark:text-white dark:bg-blue-600 dark:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próximo
      </button>
    </div>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell, Pagination };
