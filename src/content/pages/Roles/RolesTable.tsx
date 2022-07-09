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
import { initialRolePageData, RolePage } from 'src/types/Role';
import { useDeleteRoleMutation, useGetRolesQuery } from 'src/feautures/services/roleService';
import { messages } from 'src/utils/messages';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router';


const initialData : RolePage =  initialRolePageData

const Roles: FC = () => {

  const [roles, setRoles] = useState<RolePage>(initialData)
  const [openPrompt, setOpenPrompt] = useState<boolean>(false)
  const [selectedRoles] = useState<number[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [open, setOpen] = useState<boolean>(false);

  const { isLoading, currentData } = useGetRolesQuery(roles)
  const [deleteRole] = useDeleteRoleMutation()
  const navigate = useNavigate()


  const handleClosePrompt = () => {
    setOpenPrompt(false)
  } 
  const handleOpenPrompt = (id : number) => {
    setSelectedItemId(id)
    setOpenPrompt(true)
  } 

  const handleEditRole = (id : number) => {
    navigate(`/roles/edit/${id}`)
  }

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleDeleteRole = async (id : number) => {
    setOpenPrompt(false)
    try {
      const result = await deleteRole(id).unwrap()
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
    setRoles((rls) => {
      return {...rls, number: newPage}
    })
  }

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRoles((rls) => {
      return {...rls, size: parseInt(event.target.value)}
    })
  };

  const theme = useTheme();

  if (isLoading ){
    return null
  }
  return (
    <Card>

      <Divider />
       <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Cargo</TableCell>
              <TableCell>Autoridades</TableCell>
              <TableCell align="right">Acções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData?.content.map((role, i) => {
              const isRoleSelected = selectedRoles.includes(
                role.id
              );
              return (
                <TableRow
                  hover
                  key={i}
                  selected={isRoleSelected}
                >
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {role.displayName}
                    </Typography>
                  </TableCell>
                  <TableCell>{role.permissions.map
                          ((p, i) => 
                            <Chip key={i} sx={{margin: 0.5}} color='success' label={p.displayName} size='small' variant='outlined' />)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar cargo" arrow>
                      <IconButton
                        onClick={() => handleEditRole(role.id)}
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
                    <Tooltip title="Apagar cargo" arrow>
                      <IconButton
                        onClick={() => handleOpenPrompt(role.id)}
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
          <Button size="small" variant="contained" color={'error'} onClick={() => handleDeleteRole(selectedItemId)} autoFocus>
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

Roles.propTypes = {
  roles: PropTypes.array.isRequired
};

Roles.defaultProps = {
  roles: []
};

export default Roles;
