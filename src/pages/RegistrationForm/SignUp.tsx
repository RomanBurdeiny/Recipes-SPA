import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import AuthForm from '../../components/AuthForm';
import { useForm, FormProvider } from 'react-hook-form';

export interface IAuthForm {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<IAuthForm>();

  const signUp = async ({ email, password }: IAuthForm) => {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate('/');
  };

  return (
    <FormProvider {...methods}>
      <AuthForm
        onSubmit={signUp}
        authLink="/login"
        authTitle="Create an account"
        isDarkMode={false}
        backLink="Back to Login"
      />
    </FormProvider>
  );
};

export default SignUp;
