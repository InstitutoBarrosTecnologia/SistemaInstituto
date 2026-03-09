interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <button className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
        <svg
          className="fill-gray-500 dark:fill-gray-400"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
            fill=""
          />
        </svg>
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="dark:bg-dark-900 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute -translate-y-1/2 right-4 top-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Limpar busca"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
