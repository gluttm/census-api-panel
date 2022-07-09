import { Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader() {
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
          to='/roles/add'
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
