import { FC, ChangeEvent, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  Typography,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  AlertColor,
  Snackbar,
  Chip
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BulkActions from './BulkActions';
import { initialUserDataPage, UserPage } from 'src/types/User';
import { useDeleteUserMutation, useGetUsersQuery } from 'src/feautures/services/userService';
import { messages } from 'src/utils/messages';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router';


const initialData : UserPage =  initialUserDataPage

const Users: FC = () => {

  const [users, setUsers] = useState<UserPage>(initialData)
  const [openPrompt, setOpenPrompt] = useState<boolean>(false)
  const [selectedUsers] = useState<number[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [open, setOpen] = useState<boolean>(false);

  const { isLoading, currentData } = useGetUsersQuery(users)
  const [deleteUser] = useDeleteUserMutation()
  const navigate = useNavigate()


  
  const selectedBulkActions = selectedUsers.length > 0;

  const handleClosePrompt = () => {
    setOpenPrompt(false)
  } 
  const handleOpenPrompt = (id : number) => {
    setSelectedItemId(id)
    setOpenPrompt(true)
  } 

  const handleEditUser = (id : number) => {
    navigate(`/users/edit/${id}`)
  }

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleDeleteUser = async (id : number) => {
    setOpenPrompt(false)
    try {
      const result = await deleteUser(id).unwrap()
      setAlertSeverity('success')
      setAlertMsg(result.msg);
      setOpen(true);
    } catch(e) {
      setAlertSeverity('error')
      setAlertMsg(e.data.message)
      setOpen(true)
    }
  }

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setUsers((rls) => {
      return {...rls, number: newPage}
    })
  }

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsers((rls) => {
      return {...rls, size: parseInt(event.target.value)}
    })
  };

  const theme = useTheme();

  if (isLoading ){
    return null
  }
  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}

      <Divider />
       <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Nome de Utilizador</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Cargos</TableCell>
              <TableCell align="right">Ac????es</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData?.content.map((user, i) => {
              return (
                <TableRow
                  hover
                  key={i}
                >
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {`${user.firstName} ${user.lastname}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.roles.map
                          ((p, i) => 
                            <Chip key={i} sx={{marginRight: 1}} color='success' label={p.displayName} size='small' variant='outlined' />)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Activar/Desativar utilizador" arrow>
                      <IconButton
                        // onClick={() => handleEditUser(user.id)}
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <PowerSettingsNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar utilizador" arrow>
                      <IconButton
                        onClick={() => handleEditUser(user.id)}
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar utilizador" arrow>
                      <IconButton
                        onClick={() => handleOpenPrompt(user.id)}
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={currentData?.totalElements ?? 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleSizeChange}
          page={currentData?.number ?? 0}
          rowsPerPage={currentData?.size ?? 0}
          rowsPerPageOptions={[2, 5, 10, 25, 30]}

        />
      </Box>

      <Dialog
        open={openPrompt}
        onClose={handleClosePrompt}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {messages.prompt.delete}
        </DialogTitle>
        <DialogActions>
          <Button size="small" variant="outlined" onClick={handleClosePrompt}>{messages.prompt.no}</Button>
          <Button size="small" variant="contained" color={'error'} onClick={() => handleDeleteUser(selectedItemId)} autoFocus>
            {messages.prompt.yes}
          </Button>
        </DialogActions>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseToast}>
          <Alert onClose={handleCloseToast} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMsg}
          </Alert>
        </Snackbar>
      </Dialog>
    </Card>
  );
};

Users.propTypes = {
  users: PropTypes.array.isRequired
};

Users.defaultProps = {
  users: []
};

export default Users;
