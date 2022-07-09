import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { Typography } from '@mui/material';


function DashboardCrypto() {
  return (
    <>
      <Helmet>
        <title>Crypto Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <Typography>Hello User</Typography>
      </PageTitleWrapper>

      <Footer />
    </>
  );
}

export default DashboardCrypto;
