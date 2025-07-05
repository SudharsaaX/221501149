import React from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Stats = () => {
  const urls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Statistics
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.shortcode}>
                <TableCell>
                  <Link href={`/${url.shortcode}`} target="_blank">
                    localhost:3000/{url.shortcode}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={url.originalUrl} target="_blank">
                    {url.originalUrl}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(url.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(url.expiryTime).toLocaleString()}
                </TableCell>
                <TableCell>{url.clicks || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {urls.map((url) => (
        <Accordion key={url.shortcode} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Click Details for /{url.shortcode}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(url.clickLogs || []).map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.referrer}</TableCell>
                      <TableCell>{log.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default Stats;