import { Controller, useFormContext } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Container, Paper, TextField, Typography, Button, Stack } from '@mui/material';

import { type AuthFormProps, type IAuthForm } from './AuthFormType';

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, authLink, authTitle, backLink }) => {
  const { handleSubmit, control } = useFormContext<IAuthForm>();

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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.100',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <ToastContainer position="top-center" />

      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={1}>
            {authTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Enter your credentials to continue
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmitWithToast)}>
            <Stack spacing={3}>
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
                  <TextField
                    {...field}
                    label="Email"
                    placeholder="you@example.com"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Minimum 6 characters',
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                    message: 'Must contain at least one letter and one number',
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Stack direction="row" spacing={2} pt={1}>
                <Button component={RouterLink} to={authLink} variant="outlined" fullWidth>
                  {backLink}
                </Button>

                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthForm;
