import { Controller, useFormContext, type SubmitHandler } from 'react-hook-form';
import Button from './Button';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  authLink,
  authTitle,
  isDarkMode,
  backLink,
}) => {
  const { handleSubmit, control } = useFormContext<IAuthForm>();

  const inputClass = 'w-full border px-4 py-2 rounded-md mt-4';

  const onSubmitWithToast = async (data: IAuthForm) => {
    toast.promise(onSubmit(data) as Promise<void>, {
      pending: 'Please wait...',
      success: 'Successfully completed!',
      error: {
        render({ data }) {
          return `${(data as Error)?.message || 'Something went wrong'}`;
        },
      },
    });
  };

  return (
    <div
      className={`w-screen text-center m-auto min-h-screen flex justify-center items-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />

      <div
        className={`p-6 w-96 rounded-lg shadow-xl flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
      >
        <h2 className="text-xl font-bold text-center">{authTitle}</h2>

        <form onSubmit={handleSubmit(onSubmitWithToast)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field, fieldState }) => (
              <div>
                <input {...field} className={inputClass} placeholder="Email" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                message: 'Password must contain at least one letter and one number',
              },
            }}
            render={({ field, fieldState }) => (
              <div>
                <input type="password" {...field} className={inputClass} placeholder="Password" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <div className="flex justify-between mt-6 flex-row-reverse">
            <Button
              type="submit"
              isDarkMode={isDarkMode}
              className={`hover:bg-green-500 ${isDarkMode ? 'bg-green-800' : 'bg-green-600'}`}
            >
              Submit
            </Button>

            <Link to={authLink}>
              <Button
                type="button"
                isDarkMode={isDarkMode}
                className={`${isDarkMode ? 'bg-blue-900 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-400'}`}
              >
                {backLink}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
