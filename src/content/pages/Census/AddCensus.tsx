import { Helmet } from 'react-helmet-async';
import { Grid, Container, Card, CardHeader, CardContent, Autocomplete, FormControlLabel, Checkbox, Divider, Snackbar, AlertColor, Switch, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, TextField, CircularProgress } from '@mui/material';
import Footer from 'src/components/Footer';
import { ChangeEvent, forwardRef, Fragment, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useGetCensusMutation, useSaveCensusMutation, useUpdateCensusMutation } from 'src/feautures/services/censusService';
import { Census } from 'src/types/Census';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { messages } from 'src/utils/messages';
import { useParams, useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import { baseApiUrl } from 'src/configs';
import { useSelector } from 'react-redux';
import { RootState } from 'src/app/store';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { District } from 'src/types/District';
import { useGetDistrictsQuery, useGetFilteredDistrictsQuery } from 'src/feautures/services/districtService';


function AddCensus() {
  const [censusId, setCensusId] = useState<number>(0)
  const [districtId, setDistrictId] = useState<number>(0)
  const [districtName, setDistrictName] = useState<string>('a')
  const [districts, setDistricts] = useState<District[]>([{name: ''}])
  const [amount, setAmount] = useState<number>(0)
  const [age, setAge] = useState<number>(0)
  const [year, setYear] = useState<number>(2017)
  const [zone, setZone] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [file, setFile] = useState<any>()
  const [massInsertCheck, setMassInsertCheck] = useState<boolean>(false)

  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [open, setOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openAC, setOpenAC] = useState(false); //AC - short for AutoComplete
  const [optionsAC, setOptionsAC] = useState<readonly District[]>([]);
  const loading = open && optionsAC.length === 0;

  const { currentData, isSuccess } = useGetFilteredDistrictsQuery(districtName)
  const params = useParams()
  const [ getCensus ] = useGetCensusMutation()
  const [ saveCensus ] = useSaveCensusMutation()
  const [ updateCensus ] = useUpdateCensusMutation()
  const navigate = useNavigate()

  
  useEffect( () => {
    if (params.id) {
      setIsUpdate(true)
      handleGetDistrict(parseInt(params.id))
    }
    if (isSuccess) {
      setOptionsAC(currentData)
    }
  }, [params, isSuccess])

  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      //await sleep(1e3); // For demo purposes.

      if (active) {
        setOptionsAC([...districts]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptionsAC([]);
    }
  }, [open]);
  
  const handleGetDistrict = async (id : number) => {
    try {
      const result = await getCensus(id).unwrap()
      setCensusId(result.id)
    } catch (e) {
      setAlertSeverity('error')
      setAlertMsg(e.data.message)
      setOpen(true)
    }
  }

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleDistricId = (event : ChangeEvent<HTMLInputElement>, value) => setDistrictId(parseInt(value.id))
  const handleAge = (event : ChangeEvent<HTMLInputElement>) => setAge(parseInt(event.target.value))
  const handleYear = (event : ChangeEvent<HTMLInputElement>) => setYear(parseInt(event.target.value))
  const handleZone = (event : ChangeEvent<HTMLInputElement>) => setZone(event.target.value)
  const handleAmount = (event : ChangeEvent<HTMLInputElement>) => setAmount(parseInt(event.target.value))
  const handleCheckInsertType = (event : ChangeEvent<HTMLInputElement>) => setMassInsertCheck(event.target.checked)
  const handleGender = (event : SelectChangeEvent) => setGender(event.target.value)
 // const handleUpdateInput = (event : SelectChangeEvent) => setGender(event.target.value)
  //const handleSearchDistrict = (event : ChangeEvent<HTMLInputElement>, value) => setDistrictId(parseInt(value))

  const token = useSelector((state: RootState) => state.auth.accessToken)

  const handleFileUpload = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

   const massSaveSubmit = () => {
    const form = new FormData();
    form.append("file", file, file.name);
    form.append("districtId", `${districtId}`)
    form.append("year", `${year}`)
    form.append("zone", `${zone}`)
    form.append("gender", `${gender}`)
    axios
      .post(`${baseApiUrl}/census/upload`, form, { headers: {'Authorization': `Bearer ${token}`}})
      .then((response) => {
        setAlertSeverity('success')
        setAlertMsg(!isUpdate ? messages.status.created : messages.status.updated);
        setOpen(true);
        setIsLoading(false)
      })
      .catch((e) => {
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
      });
  };

  const handleSubmit = async (event : SubmitEvent)  => {
    setIsLoading(true)
    const census : Census = { 
      id: censusId,
      zone,
      age,
      amount,
      gender,
      year,
      districtId
    }
    try {
      if (!isUpdate) {
        await saveCensus(census).unwrap();
      } else {
        await updateCensus(census).unwrap();
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
    //setDistrictName('');
  }

  return (
    <>
      <Helmet>
        <title>Adicionar Census</title>
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
          <Grid item xs={5}>
            <Card>
              <CardHeader title="Pre-sets" />
               <CardContent>
                
                  <ValidatorForm
                      sx={{
                    '& .MuiTextField-root': { marginTop: 1 },
                  }}
                  noValidate
                  autoComplete="on"
                  onSubmit={handleSubmit}
                  >
                      <Grid item padding={1}>
                        <Autocomplete
                          id="asynchronous-district"
                          fullWidth={true}
                          size={'small'}
                          open={openAC}
                          onChange={handleDistricId}
                          onOpen={() => {
                            setOpenAC(true);
                          }}
                          onClose={() => {
                            setOpenAC(false);
                          }}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          getOptionLabel={(option) => `${option.name}`}
                          options={optionsAC}
                          loading={loading}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Distritos"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid container>
                        <Grid item xs={4} padding={1}>
                          <TextValidator
                            required
                            id="outlined-required"
                            label="Ano"
                            size='small'
                            value={year}
                            sx={{margin: 0.5}}
                            fullWidth={true}
                            onChange={handleYear}
                            validators={['required']}
                            errorMessages={[messages.validation.required]}
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
                         <FormControl sx={{ m: 0.5 }} fullWidth={true} size="small">
                          <InputLabel id="select-gender">Zona</InputLabel>
                          <Select
                            labelId="select-gender"
                            id="select-gender"
                            value={zone}
                            label="Zona"
                            onChange={handleZone}
                          >
                            <MenuItem value={'RURAL'}>Rural</MenuItem>
                            <MenuItem value={'URBAN'}>Urbana</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      </Grid>
                      <Grid item padding={1}>
                        <FormControlLabel 
                          sx={{marginTop: 3}}
                          checked={massInsertCheck} 
                          onChange={handleCheckInsertType} 
                          control={<Switch />} 
                          label="Inserção em Massa" 
                        />

                      </Grid>
            
                  </ValidatorForm>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={7}>
            <Card>
              <CardHeader title={massInsertCheck ? 'Inserção em Massa, formatos validos, (.xls, .xlsx)' : 'Detalhes'} />
              <CardContent>
                  { massInsertCheck ? 
                  <Grid container>
                    <Grid item>
                      <Button startIcon={<FilePresentIcon />}
                        variant="contained"
                        component="label"
                      >
                        Upload File
                        <input
                          onChange={handleFileUpload}
                          type="file"
                          hidden
                        />
                      </Button>
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
                        onClick={massSaveSubmit}
                      >
                        { !isUpdate ? messages.buttons.save : messages.buttons.update }
                      </LoadingButton>
                    </Grid>
                  </Grid>
                  :  <ValidatorForm
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
                          label="Idade"
                          size='small'
                          value={age}
                          onChange={handleAge}
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
                          label="Quantitade"
                          size='small'
                          fullWidth={true}
                          value={amount}
                          sx={{margin: 0.5}}
                          onChange={handleAmount}
                          validators={['required']}
                          errorMessages={[messages.validation.required]}
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
                        color="success"
                        variant='contained'
                        type="submit"
                      >
                        { !isUpdate ? messages.buttons.save : messages.buttons.update }
                      </LoadingButton>
                    </Grid>
                  </ValidatorForm> }
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

export default AddCensus;
