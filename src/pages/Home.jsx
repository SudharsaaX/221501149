import React from 'react';
import { Container, Typography } from '@mui/material';
import MultiURLShortenerForm from '../components/MultiURLShortenerForm';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener
      </Typography>
      <MultiURLShortenerForm />
    </Container>
  );
};

export default Home;