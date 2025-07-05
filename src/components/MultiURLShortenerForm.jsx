import React, { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Snackbar,
  Typography,
  Box,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { v4 as uuidv4 } from 'uuid';

const emptyEntry = { originalUrl: '', alias: '', validity: 30 };

function MultiURLShortenerForm() {
  const [entries, setEntries] = useState([emptyEntry]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const clearAll = () => setEntries([emptyEntry]);
  const [urls, setUrls] = useState(() => JSON.parse(localStorage.getItem('shortenedUrls') || '[]'));

  const handleEntryChange = (idx, field, value) => {
    setEntries((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const addEntry = () => {
    if (entries.length >= 5) return;
    setEntries((prev) => [...prev, emptyEntry]);
  };

  const removeEntry = (idx) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const stored = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    const newRecords = [];

    for (const { originalUrl, alias, validity } of entries) {
      if (!originalUrl.trim()) {
        setError('Please enter all URLs before submitting.');
        return;
      }
      if (!validateUrl(originalUrl)) {
        setError(`Invalid URL: ${originalUrl}`);
        return;
      }

      const code = alias ? alias.trim() : uuidv4().slice(0, 6);
      if (stored.some((u) => u.shortcode === code) || newRecords.some((u) => u.shortcode === code)) {
        setError(`Alias/Shortcode already taken: ${code}`);
        return;
      }
      const now = new Date();
      const expiry = new Date(now.getTime() + (validity || 30) * 60 * 1000);
      newRecords.push({
        shortcode: code,
        originalUrl,
        createdAt: now.toISOString(),
        expiryTime: expiry.toISOString(),
        clicks: 0,
        clickLogs: [],
      });
    }

    const updated = [...stored, ...newRecords];
    localStorage.setItem('shortenedUrls', JSON.stringify(updated));
    setUrls(updated);
    setSuccessMsg(`${newRecords.length} URL(s) shortened successfully!`);
    setEntries([emptyEntry]);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {entries.map((entry, idx) => (
            <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={5}>
                    <TextField
                      label="Long URL"
                      fullWidth
                      required
                      value={entry.originalUrl}
                      onChange={(e) => handleEntryChange(idx, 'originalUrl', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Custom Alias"
                      fullWidth
                      placeholder="Optional"
                      value={entry.alias}
                      onChange={(e) => handleEntryChange(idx, 'alias', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={8} sm={5} md={2}>
                    <TextField
                      label="Validity (min)"
                      type="number"
                      fullWidth
                      value={entry.validity}
                      onChange={(e) => handleEntryChange(idx, 'validity', Number(e.target.value))}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={1} md={2} textAlign="right">
                    {entries.length > 1 && (
                      <Tooltip title="Remove">
                        <IconButton color="error" onClick={() => removeEntry(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              disabled={entries.length >= 5}
              onClick={addEntry}
            >
              Add URL
            </Button>
            <Typography variant="body2" color="text.secondary">
              You can shorten up to 5 URLs at once.
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
            <Button type="submit" variant="contained" fullWidth>
              Shorten All
            </Button>
            <Button variant="outlined" startIcon={<ClearAllIcon />} onClick={clearAll} fullWidth>
              Clear All
            </Button>
          </Stack>
        </Stack>
      </form>

      {/* Success / Error messages */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg('')}>{successMsg}</Alert>
      </Snackbar>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* List of shortened urls */}
      {urls.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Your Links</Typography>
          <Grid container spacing={2}>
            {urls.map((u) => (
              <Grid item xs={12} sm={6} md={4} key={u.shortcode}>
                <Card variant="outlined">
                  <CardContent sx={{ wordBreak: 'break-all' }}>
                    {window.location.origin}/{u.shortcode}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Copy">
                      <IconButton size="small" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${u.shortcode}`)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open in new tab">
                      <IconButton size="small" onClick={() => window.open(`${window.location.origin}/${u.shortcode}`, '_blank') }>
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}

export default MultiURLShortenerForm;
