import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Card, CardHeader, CardContent, Box, FormControlLabel, Checkbox, Divider, Snackbar, AlertColor } from '@mui/material';
import Footer from 'src/components/Footer';
import { ChangeEvent, forwardRef, useCallback, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useGetRolesQuery } from 'src/feautures/services/roleService';
import { initialRolePageData } from 'src/types/Role';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { messages } from 'src/utils/messages';
import { useParams, useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGetUserMutation, useSaveUserMutation, useUpdateUserMutation } from 'src/feautures/services/userService';
import { User } from 'src/types/User';


function AddUsers() {
  // States
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [userId, setUserId] = useState<number>(0)
  const [firstName, setFirstName] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [gender, setGender] = useState<string>('MALE')
  const [password, setPassowrd] = useState<string>('')
  const [passwordConfirm, setPassowrdConfirm] = useState<string>('')


  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [open, setOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { currentData } = useGetRolesQuery(initialRolePageData)
  const params = useParams()
  const [ getUser ] = useGetUserMutation()
  const [ saveUser ] = useSaveUserMutation()
  const [ updateUser ] = useUpdateUserMutation()
  const navigate = useNavigate()

  const handleGetUser = useCallback(async (id : number) => {
  try {
    const result = await getUser(id).unwrap()
    setUserId(result.id)
    setFirstName(result.firstName)
    setLastname(result.lastname)
    setUsername(result.username)
    setGender(result.gender)
    setEmail(result.email)
    const rols : number[] = []
    result.roles.map(p => rols.push(p.id))
    setSelectedRoles([...rols])
  } catch (e) {
    setAlertSeverity('error')
    setAlertMsg(e.data.message)
    setOpen(true)
  }
}, [getUser])
  
  useEffect( () => {
    if (params.id) {
      setIsUpdate(true)
      handleGetUser(parseInt(params.id))
    }
  }, [params, handleGetUser])

  ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== password) {
          return false;
      }
      return true;
  });
  ValidatorForm.addValidationRule('isPasswordStrong', (value : string) => {
      if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/)) {
          return false;
      }
      return true;
  });
  

  
  const handleSingleRoleSelect = (event : ChangeEvent<HTMLInputElement>, id : number) : void => {
    if (!selectedRoles.includes(id)) {
      setSelectedRoles((prevData) => [...prevData, id]);
    } else {
      setSelectedRoles((prevSelected) => 
        prevSelected.filter((idPrev) => id !== idPrev)
      );
    }
  }

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const selectedRolesPrepared : number[] = [];
  const mapSelectedRoles = (ids : number[]) => {
    ids.map((id) => selectedRolesPrepared.push(id));
    return selectedRolesPrepared;
  }

  const handleFirstName = (event : ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)
  const handleLastname = (event : ChangeEvent<HTMLInputElement>) => setLastname(event.target.value)
  const handleEmail = (event : ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)
  const handleUsername = (event : ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
  const handlePassword = (event : ChangeEvent<HTMLInputElement>) => setPassowrd(event.target.value)
  const handlePasswordConfirm = (event : ChangeEvent<HTMLInputElement>) => setPassowrdConfirm(event.target.value)
  const handleGender = (event : SelectChangeEvent) => setGender(event.target.value)

  

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event : SubmitEvent)  => {
    
    if (selectedRoles.length < 1) {
      setAlertSeverity('error')
      setAlertMsg(messages.validation.selectOneRole);
      setOpen(true);
      return
    }
    setIsLoading(true)
    const user : User = { 
      id: userId,
      firstName,
      lastname,
      username,
      email,
      password,
      passwordConfirm,
      gender,
      rolesIds: mapSelectedRoles(selectedRoles)
    }
    try {
      if (!isUpdate) {
        await saveUser(user).unwrap();
      } else {
        await updateUser(user).unwrap();
      }
      setAlertSeverity('success')
      setAlertMsg(!isUpdate ? messages.status.created : messages.status.updated);
      setOpen(true);
      setIsLoading(false)
      if (!isUpdate) formReset()
    } catch (e) {
      setIsLoading(false)
      setAlertSeverity('error')
      if(e.data.validation){
        const errors = e.data.validation
        for (var key in errors) {
          if(errors.hasOwnProperty(key)) {
            setAlertMsg(errors[key])
            setOpen(true)
          }
        }
      } else {
        setAlertMsg(e.data.message)
        setOpen(true)
      }
    }
  }

  const formReset = () => {
    setFirstName('');
    setLastname('')
    setEmail('')
    setUsername('')
    setPassowrd('')
    setPassowrdConfirm('')
    setSelectedRoles([])
  }

  const handleSelectAllRoles = (event : ChangeEvent<HTMLInputElement>) => {
    setSelectedRoles(event.target.checked ? currentData?.content.map((role) => role.id) : [])
  }

  const selectAllRoles = currentData?.content.length === selectedRoles.length;
  
  return (
    <>
      <Helmet>
        <title>Adicionar Utilizador</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <ArrowBackIcon sx={{'cursor': 'pointer'}} onClick={() => navigate(-1)} />
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={8}>
            <Card>
              <CardHeader title="Dados do Utilizador" />
               <CardContent>
                  <ValidatorForm
                      sx={{
                    '& .MuiTextField-root': { marginTop: 1 },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                  >
                    <Grid container>
                      <Grid item xs={6} padding={1}>
                        <TextValidator
                          required
                          id="outlined-required"
                          label="Primeiro Nome"
                          size='small'
                          value={firstName}
                          onChange={handleFirstName}
                          sx={{margin: 0.5}}
                          fullWidth={true}
                          validators={['required']}
                          errorMessages={[messages.validation.required]}
                        />
                      </Grid>
                      <Grid item xs={6} padding={1}>
                        <TextValidator
                          required
                          id="outlined-required"
                          label="Apelido"
                          size='small'
                          fullWidth={true}
                          value={lastname}
                          sx={{margin: 0.5}}
                          onChange={handleLastname}
                          validators={['required']}
                          errorMessages={[messages.validation.required]}
                        />
                      </Grid>
                      <Grid item xs={4} padding={1}>
                        <TextValidator
                          required
                          id="outlined-required"
                          label="Nome de utilizador"
                          size='small'
                          value={username}
                          sx={{margin: 0.5}}
                          fullWidth={true}
                          onChange={handleUsername}
                          validators={['required']}
                          errorMessages={[messages.validation.required]}
                        />

                      </Grid>
                      <Grid item xs={8} padding={1}>
                        <TextValidator
                          label="Email"
                          size='small'
                          fullWidth={true}
                          value={email}
                          sx={{margin: 0.5}}
                          onChange={handleEmail}
                          validators={['required', 'isEmail']}
                          errorMessages={[messages.validation.required, messages.validation.email]}
                        />

                      </Grid>
                      <Grid item xs={4} padding={1}>
                         <FormControl sx={{ m: 0.5 }} fullWidth={true} size="small">
                          <InputLabel id="select-gender">Gênero</InputLabel>
                          <Select
                            labelId="select-gender"
                            id="select-gender"
                            value={gender}
                            label="Gênero"
                            onChange={handleGender}
                          >
                            <MenuItem value={'MALE'}>Masculino</MenuItem>
                            <MenuItem value={'FEMALE'}>Femenino</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} padding={1}>
                        <TextValidator
                          required
                          id="outlined-required"
                          label="Senha"
                          size='small'
                          fullWidth={true}
                          value={password}
                          sx={{margin: 0.5}}
                          type='password'
                          onChange={handlePassword}
                          validators={['required', 'isPasswordStrong']}
                          errorMessages={[messages.validation.required, messages.validation.strongPassword]}
                        />
                      </Grid>
                      <Grid item xs={4} padding={1}>
                        <TextValidator
                          required
                          id="outlined-required"
                          label="Confirmar senha"
                          size='small'
                          type='password'
                          value={passwordConfirm}
                          sx={{margin: 0.5}}
                          fullWidth={true}
                          onChange={handlePasswordConfirm}
                          validators={['isPasswordMatch','required']}
                          errorMessages={[messages.validation.mustMatch, messages.validation.required]}
                        />

                      </Grid>
                    </Grid>
                  
                    <Divider />
                    <Grid
                    container
                    justifyContent={'flex-end'}
                    >
                      <LoadingButton
                        sx={{marginTop: 1}}
                        loading={isLoading}
                        startIcon={<SaveIcon />}
                        variant="outlined"
                        type="submit"
                      >
                        { !isUpdate ? messages.buttons.save : messages.buttons.update }
                      </LoadingButton>
                    </Grid>
                  </ValidatorForm>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
                 <CardHeader title="Cargos" />
               <CardContent>
                   <FormControlLabel 
                      onChange={(event : ChangeEvent<HTMLInputElement>) => handleSelectAllRoles(event)}
                      checked={selectAllRoles}
                      control={
                      <Checkbox />} label="Selecionar todos." />
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    {currentData?.content
                        .map((p, i) => {
                          const isRoleSelected = selectedRoles.includes(p.id)
                          return <FormControlLabel 
                                    key={i}
                                    checked={isRoleSelected}
                                    value={isRoleSelected}
                                    control={<Checkbox />} 
                                    label={p.displayName} 
                                    onChange={(event : ChangeEvent<HTMLInputElement>) => handleSingleRoleSelect(event, p.id)}
                                  />
                        })}
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddUsers;
