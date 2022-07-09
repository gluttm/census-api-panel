import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Card, CardHeader, CardContent, Box, FormControlLabel, Checkbox, Divider, Snackbar, AlertColor } from '@mui/material';
import Footer from 'src/components/Footer';
import { useGetPermissionsQuery } from 'src/feautures/services/permissionService';
import { ChangeEvent, forwardRef, useCallback, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useGetRoleMutation, useSaveRoleMutation, useUpdateRoleMutation } from 'src/feautures/services/roleService';
import { Role } from 'src/types/Role';
import { Permission } from 'src/types/Permission';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { messages } from 'src/utils/messages';
import { useParams, useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function AddRoles() {

  const [selectedRoles, setSelectedPermissions] = useState<number[]>([])
  const [roleName, setRoleName] = useState<string>('')
  const [roleId, setRoleId] = useState<number>(0)
  const [roleDisplayName, setRoleDisplayName] = useState<string>('')
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [open, setOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { currentData } = useGetPermissionsQuery()
  const params = useParams()
  const [ getRole ] = useGetRoleMutation()
  const [ saveRole ] = useSaveRoleMutation()
  const [ updateRole ] = useUpdateRoleMutation()
  const navigate = useNavigate()

  // const  = async () => {
    
  // }

  const handleGetRole = useCallback(async (id : number) => {
    setIsUpdate(true)
    try {
      const result = await getRole(id).unwrap()
      setRoleId(result.id)
      setRoleName(result.name)
      setRoleDisplayName(result.displayName)
      const perms : number[] = []
      result.permissions.map(p => perms.push(p.id))
      setSelectedPermissions([...perms])
    } catch (e) {
      setAlertSeverity('error')
      setAlertMsg(e.data.message)
      setOpen(true)
    }
  }, [getRole])

  useEffect( () => {
    if (params.id) {
      
      handleGetRole(parseInt(params.id))
    }
  }, [params,handleGetRole])
  

  
  const handleSinglePermissionSelect = (event : ChangeEvent<HTMLInputElement>, id : number) : void => {
    if (!selectedRoles.includes(id)) {
      setSelectedPermissions((prevData) => [...prevData, id]);
    } else {
      setSelectedPermissions((prevSelected) => 
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

  const selectedPermissionsPrepared : Permission[] = [];
  const mapSelectedPermissions = (ids : number[]) => {
    ids.map((id) => selectedPermissionsPrepared.push({id, name: '', displayName: ''}));
    return selectedPermissionsPrepared;
  }

  const handleRoleName = (event : ChangeEvent<HTMLInputElement>) => setRoleName(event.target.value)
  const handleRoleDisplayName = (event : ChangeEvent<HTMLInputElement>) => setRoleDisplayName(event.target.value)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event : SubmitEvent)  => {
    setIsLoading(true)
    const role : Role = { 
      id: roleId,
      displayName: roleDisplayName,
      name: roleName,
      permissions: mapSelectedPermissions(selectedRoles)
    }
    try {
      if (!isUpdate) {
        await saveRole(role).unwrap();
      } else {
        await updateRole(role).unwrap();
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
    setRoleName('');
    setRoleDisplayName('')
    setSelectedPermissions([])
  }

  const handleSelectAllRoles = (event : ChangeEvent<HTMLInputElement>) => {
    setSelectedPermissions(event.target.checked ? currentData.map((role) => role.id) : [])
  }

  const selectAllRoles = currentData?.length === selectedRoles.length;
  
  return (
    <>
      <Helmet>
        <title>Adicionar Cargo</title>
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
          <Grid item xs={4}>
            <Card>
              <CardHeader title="Cargo" />
               <CardContent>
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
                      label="Nome"
                      size='small'
                      value={roleName}
                      fullWidth={true}
                      onChange={handleRoleName}
                      validators={['required']}
                      errorMessages={[messages.validation.required]}
                    />
                    <TextValidator
                      label="Alcunha"
                      size='small'
                      value={roleDisplayName}
                      sx={{marginTop: 1}}
                      fullWidth={true}
                      onChange={handleRoleDisplayName}
                    />

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
          <Grid item xs={8}>
            <Card>
                 <CardHeader title="Permissões" />
               <CardContent>
                   <FormControlLabel 
                      onChange={(event : ChangeEvent<HTMLInputElement>) => handleSelectAllRoles(event)}
                      checked={selectAllRoles}
                      control={
                      <Checkbox />} label="Selecionar todas." />
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    {currentData
                        ?.map((p, i) => {
                          const isRoleSelected = selectedRoles.includes(p.id)
                          return <FormControlLabel 
                                    key={i}
                                    checked={isRoleSelected}
                                    value={isRoleSelected}
                                    control={<Checkbox />} 
                                    label={p.displayName} 
                                    onChange={(event : ChangeEvent<HTMLInputElement>) => handleSinglePermissionSelect(event, p.id)}
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

export default AddRoles;
