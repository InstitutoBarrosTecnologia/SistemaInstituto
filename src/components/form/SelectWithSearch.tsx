import Select, { StylesConfig, components } from 'react-select';

export interface Option {
  value: string;
  label: string;
}

interface SelectWithSearchProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;
}

const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  className = "",
  disabled = false,
  isClearable = true,
  noOptionsMessage = "Nenhum resultado encontrado",
}) => {
  // Encontrar a opção selecionada
  const selectedOption = options.find(opt => opt.value === value) || null;

  // Estilos customizados que seguem o design do projeto
  const customStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      height: '44px',
      minHeight: '44px',
      borderColor: state.isFocused 
        ? 'rgb(147 51 234)' // brand-600
        : 'rgb(209 213 219)', // gray-300
      boxShadow: state.isFocused 
        ? '0 0 0 3px rgba(147, 51, 234, 0.1)' 
        : 'none',
      '&:hover': {
        borderColor: state.isFocused 
          ? 'rgb(147 51 234)' 
          : 'rgb(156 163 175)', // gray-400
      },
      backgroundColor: 'transparent',
      borderRadius: '0.5rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 16px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: 'inherit',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgb(156 163 175)', // gray-400
    }),
    singleValue: (base) => ({
      ...base,
      color: 'rgb(31 41 55)', // gray-800
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      marginTop: '8px',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgb(229 231 235)', // gray-200
      overflow: 'hidden',
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: '240px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'rgb(147 51 234)' // brand-600
        : state.isFocused 
          ? 'rgb(243 244 246)' // gray-100
          : 'white',
      color: state.isSelected ? 'white' : 'rgb(55 65 81)', // gray-700
      padding: '10px 16px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.15s',
      '&:active': {
        backgroundColor: 'rgb(147 51 234)',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: 'rgb(156 163 175)', // gray-400
      padding: '8px',
      transition: 'all 0.2s',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': {
        color: 'rgb(107 114 128)', // gray-500
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: 'rgb(156 163 175)', // gray-400
      padding: '8px',
      cursor: 'pointer',
      '&:hover': {
        color: 'rgb(239 68 68)', // red-500
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: 'rgb(156 163 175)', // gray-400
      fontSize: '0.875rem',
      padding: '12px 16px',
    }),
  };

  // Estilos para dark mode
  const darkModeStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      height: '44px',
      minHeight: '44px',
      borderColor: state.isFocused 
        ? 'rgb(147 51 234)' // brand-600
        : 'rgb(55 65 81)', // gray-700
      boxShadow: state.isFocused 
        ? '0 0 0 3px rgba(147, 51, 234, 0.1)' 
        : 'none',
      '&:hover': {
        borderColor: state.isFocused 
          ? 'rgb(147 51 234)' 
          : 'rgb(75 85 99)', // gray-600
      },
      backgroundColor: 'rgb(17 24 39)', // gray-900
      borderRadius: '0.5rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 16px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: 'rgba(255, 255, 255, 0.9)',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.3)',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.9)',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      marginTop: '8px',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgb(55 65 81)', // gray-700
      backgroundColor: 'rgb(31 41 55)', // gray-800
      overflow: 'hidden',
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: '240px',
      backgroundColor: 'rgb(31 41 55)', // gray-800
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'rgb(147 51 234)' // brand-600
        : state.isFocused 
          ? 'rgba(255, 255, 255, 0.05)' // hover light
          : 'transparent',
      color: state.isSelected ? 'white' : 'rgba(255, 255, 255, 0.9)',
      padding: '10px 16px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.15s',
      '&:active': {
        backgroundColor: 'rgb(147 51 234)',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.5)',
      padding: '8px',
      transition: 'all 0.2s',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.5)',
      padding: '8px',
      cursor: 'pointer',
      '&:hover': {
        color: 'rgb(239 68 68)', // red-500
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '0.875rem',
      padding: '12px 16px',
    }),
  };

  // Detectar dark mode
  const isDarkMode = document.documentElement.classList.contains('dark');
  const styles = isDarkMode ? darkModeStyles : customStyles;

  // Componente customizado para o ícone de dropdown
  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path 
            d="M6 8l4 4 4-4" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </components.DropdownIndicator>
    );
  };

  return (
    <div className={className}>
      <Select<Option>
        options={options}
        value={selectedOption}
        onChange={(option) => onChange(option?.value || "")}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={isClearable}
        isSearchable={true}
        noOptionsMessage={() => noOptionsMessage}
        styles={styles}
        components={{ DropdownIndicator }}
        classNamePrefix="react-select"
        // Configurações para melhor UX
        filterOption={(option, inputValue) => {
          // Busca case-insensitive que procura em qualquer parte do texto
          return option.label.toLowerCase().includes(inputValue.toLowerCase());
        }}
        // Mensagens em português
        loadingMessage={() => "Carregando..."}
        // Acessibilidade
        aria-label={placeholder}
        inputId={`select-${placeholder.replace(/\s+/g, '-').toLowerCase()}`}
      />
    </div>
  );
};

export default SelectWithSearch;
