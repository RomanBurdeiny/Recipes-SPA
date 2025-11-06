import { type SubmitHandler } from 'react-hook-form';
export interface AuthFormProps {
  onSubmit: SubmitHandler<IAuthForm>;
  isDarkMode: boolean;
  authTitle: string;
  authLink: string;
  backLink: string;
}
export interface IAuthForm {
  email: string;
  password: string;
}
