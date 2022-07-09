import { Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

function PageHeader() {
  const navigate = useNavigate()
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h4" component="h3" gutterBottom>
          Níveis de acesso
        </Typography>
      </Grid>
      <Grid item>
        <Button
          component={RouterLink}
          to='/census/add'
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Adicionar
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
