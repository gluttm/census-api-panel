import { FC, ChangeEvent, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  Card,
  Checkbox,
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

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { Role, RolePage } from 'src/types/Role';
import { useDeleteRoleMutation, useGetRolesQuery } from 'src/feautures/services/roleService';
import { styled } from '@mui/material/styles';
import { messages } from 'src/utils/messages';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router';

const applyPagination = (
  roles: Role[],
  page: number,
  limit: number
): Role[] => {
  return roles?.slice(page * limit, page * limit + limit);
};

const initialData : RolePage =  {
  last: true,
  totalPages: 0,
  totalElements: 0,
  size: 10,
  number: 0,
  first: true,
  numberOfElements: 0,
  empty: true,
  content: [{
    "id": 1,
    "name": "",
    "displayName": "",
    "permissions": [
            {
                "id": 1,
                "name": "",
                "displayName": ""
            }
        ]
  }]
}

const Roles: FC = () => {

  const [roles, setRoles] = useState<RolePage>(initialData)
  const [page, setPage] = useState<number>(2);
  const [openPrompt, setOpenPrompt] = useState<boolean>(false)
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [open, setOpen] = useState<boolean>(false);

  const { isLoading, refetch, currentData, isSuccess,  } = useGetRolesQuery(roles)
  const [deleteRole] = useDeleteRoleMutation()
  const navigate = useNavigate()


  
  const selectedBulkActions = selectedRoles.length > 0;

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

  const handleSelectAllRoles = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedRoles(
      event.target.checked
        ? roles.content.map((role) => role.id)
        : []
    );
  };

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

  const handleSelectOneRole = (
    event: ChangeEvent<HTMLInputElement>,
    roleId: number
  ): void => {
    if (!selectedRoles.includes(roleId)) {
      setSelectedRoles((prevSelected) => [
        ...prevSelected,
        roleId
      ]);
    } else {
      setSelectedRoles((prevSelected) =>
        prevSelected.filter((id) => id !== roleId)
      );
    }
  };

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage)
    setRoles((rls) => {
      return {...rls, number: newPage}
    })
  }

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRoles((rls) => {
      return {...rls, size: parseInt(event.target.value)}
    })
  };

  const paginatedRoles = applyPagination(
    currentData?.content,
    page,
    currentData?.size
  );
  const selectedSomeRoles =
    selectedRoles.length > 0 &&
    selectedRoles.length < currentData?.content.length;
  const selectedAllRoles =
    selectedRoles.length === currentData?.content.length;
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllRoles}
                  indeterminate={selectedSomeRoles}
                  onChange={handleSelectAllRoles}
                />
              </TableCell>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isRoleSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneRole(event, role.id)
                      }
                      value={isRoleSelected}
                    />
                  </TableCell>

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
                            <Chip key={i} sx={{marginRight: 1}} color='success' label={p.displayName} size='small' variant='outlined' />)}
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
