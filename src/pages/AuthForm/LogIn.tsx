import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import AuthForm from '../../components/AuthForm/AuthForm';
import { useForm, FormProvider } from 'react-hook-form';

export interface IAuthForm {
  email: string;
  password: string;
}

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<IAuthForm>();

  const logIn = async ({ email, password }: IAuthForm) => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/');
  };

  return (
    <FormProvider {...methods}>
      <AuthForm
        onSubmit={logIn}
        authLink="/signup"
        authTitle="Login to your account"
        isDarkMode={false}
        backLink="Back to SignUp"
      />
    </FormProvider>
  );
};

export default LogIn;
