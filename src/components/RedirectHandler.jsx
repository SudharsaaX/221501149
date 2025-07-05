import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import logger from '../middleware/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = () => {
      try {
        const urls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
        const urlData = urls.find(u => u.shortcode === shortcode);

        if (!urlData) {
          logger.error('URL not found', { shortcode });
          setError('URL not found or has expired');
          return;
        }

        const now = new Date();
        if (new Date(urlData.expiryTime) < now) {
          logger.error('URL expired', { shortcode });
          setError('This URL has expired');
          return;
        }

        // Log the click
        const clickLog = {
          timestamp: now.toISOString(),
          referrer: document.referrer || 'Direct',
          location: 'Mock Location'
        };

        urlData.clicks = (urlData.clicks || 0) + 1;
        urlData.clickLogs = [...(urlData.clickLogs || []), clickLog];

        // Update storage
        const updatedUrls = urls.map(u => 
          u.shortcode === shortcode ? urlData : u
        );
        localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));

        logger.info('Redirecting to URL', { shortcode, originalUrl: urlData.originalUrl });
        window.location.href = urlData.originalUrl;
      } catch (error) {
        logger.error('Error during redirect', error);
        setError('An error occurred during redirect');
      }
    };

    handleRedirect();
  }, [shortcode, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Redirecting...</Typography>
        </>
      )}
    </Container>
  );
};

export default RedirectHandler;