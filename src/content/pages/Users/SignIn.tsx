import { ChangeEvent, forwardRef, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  AlertColor,
  Snackbar,
  Card,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { messages } from 'src/utils/messages';
import { JwtToken, Login } from 'src/types/Login';
import { LoadingButton } from '@mui/lab';
import { useSignInMutation } from 'src/feautures/services/userService';
import { useDispatch } from 'react-redux';
import { setIsLogged } from 'src/feautures/authSlice';
import { LocalStorage, LocalKey } from "ts-localstorage";
import { Auth } from 'src/types/User';
import jwt_decode from "jwt-decode";

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const MainContainer = styled(Card)(
    () => `
      width: 300px;
    `
)

function StatusComingSoon() {
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const [username, setUsername] = useState<string>('glu')
  const [password, setPassowrd] = useState<string>('!Ttm0000')

  const [ signIn ] = useSignInMutation()

  const handleUsername = (event : ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
  const handlePassword = (event : ChangeEvent<HTMLInputElement>) => setPassowrd(event.target.value)

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event : SubmitEvent)  => {
    setIsLoading(true)
    const user : Login = { 
      username,
      password,
    }
    try {
      const result = await signIn(user).unwrap()
      const key = new LocalKey<Auth>("user", {accessToken: '', isLogged: false});
      const decoded_token : JwtToken = jwt_decode(result.accessToken)
      const authorities = [];
      decoded_token.authorities.map(auths => authorities.push(auths.authority))
      LocalStorage.setItem(key, {accessToken: result.accessToken, isLogged: true});
      setAlertSeverity('success');
      setAlertMsg( messages.status.signingIn );
      setOpen(true);
      setIsLoading(false);
      setTimeout(() => {
        dispatch(setIsLogged({accessToken: result.accessToken, isLogged: true, authorities}));
      }, 1000);
    } catch (e) {
      setIsLoading(false)
      setAlertSeverity('error')
      setAlertMsg(e.data.message)
      setOpen(true)
    }
  }

  return (
    <>
      <Helmet>
        <title>Login In</title>
      </Helmet>
      <MainContent>
        <MainContainer  sx={{paddingY: 7, paddingX: 2}}>
          <Box textAlign="center" mb={3}>
            <Container maxWidth="xs">
             <img
              alt="Welcome"
              height={75}
              src="/static/images/logo/logo.png"
            />
              <Typography variant="h3" sx={{ mt: 2, mb: 2 }}>
                Bem Vindo
              </Typography>
            </Container>
          </Box>
            <Box sx={{ textAlign: 'center' }}> 
                <ValidatorForm
                      sx={{
                    '& .MuiTextField-root': { marginTop: 1 },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                <TextValidator
                    required
                    id="outlined-required"
                    label="Nome de utilizador"
                    size='small'
                    fullWidth={true}
                    value={username}
                    onChange={handleUsername}
                    validators={['required']}
                    errorMessages={[messages.validation.required]}
                />
                <TextValidator
                    required
                    id="outlined-required"
                    label="Senha"
                    size='small'
                    fullWidth={true}
                    value={password}
                    sx={{mt: 2}}
                    type='password'
                    onChange={handlePassword}
                    validators={['required']}
                    errorMessages={[messages.validation.required]}
                />
                <LoadingButton
                    sx={{mt: 3}}
                    loading={isLoading}
                    startIcon={<ArrowUpIcon />}
                    variant="contained"
                    color="success"
                    type="submit"
                    >
                    { messages.buttons.login }
                </LoadingButton>
             </ValidatorForm>
          </Box>
        </MainContainer>
       <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      </MainContent>
    </>
  );
}

export default StatusComingSoon;
