export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDarkMode: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  isDarkMode,
  ...rest
}) => {
  const baseClass = isDarkMode ? 'text-white' : 'text-black';

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition duration-1000 ${baseClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
