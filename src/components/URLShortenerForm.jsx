import React, { useState } from 'react';
import { TextField, Button, Stack, Alert, Slider, List, ListItem, ListItemText, IconButton, Tooltip, Divider } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { v4 as uuidv4 } from 'uuid';

/**
 * Simple client-side URL shortener form.  
 * NOTE: In a real-world app you would call a backend.  
 * Here we just persist data in localStorage so the rest of the UI works.
 */
const URLShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [alias, setAlias] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [urls, setUrls] = useState(() => JSON.parse(localStorage.getItem('shortenedUrls') || '[]'));
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShortcode('');

    try {
      // Basic validation
      try {
        // Throws if invalid
        new URL(originalUrl);
      } catch {
        setError('Please enter a valid URL');
        return;
      }

      // Use alias if provided else generate shortcode
      const code = alias ? alias.trim() : uuidv4().slice(0, 6);
      // Check duplication
      const exists = JSON.parse(localStorage.getItem('shortenedUrls') || '[]').some(u => u.shortcode === code);
      if (exists) {
        setError('Alias already in use. Please choose a different one.');
        return;
      }
      const now = new Date();
      const expiry = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);

      const newEntry = {
        shortcode: code,
        originalUrl,
        createdAt: now.toISOString(),
        expiryTime: expiry.toISOString(),
        clicks: 0,
        clickLogs: [],
      };

      // Persist to localStorage
      const stored = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      stored.push(newEntry);
      localStorage.setItem('shortenedUrls', JSON.stringify(stored));
      setUrls(stored);

      setShortcode(code);
      setOriginalUrl('');
      setAlias('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Enter URL"
          fullWidth
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <TextField
          label="Custom Alias (optional)"
          fullWidth
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          helperText="Leave blank to auto-generate"
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Slider
            value={expiryDays}
            onChange={(_,v)=>setExpiryDays(v)}
            min={1}
            max={30}
            valueLabelDisplay="auto"
          />
          <span>{expiryDays} days expiry</span>
        </Stack>
        <Button type="submit" variant="contained">
          Shorten
        </Button>
        {shortcode && (
          <Alert severity="success">
            Short URL:&nbsp;
            <strong>{window.location.origin}/{shortcode}</strong>
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <Divider />
        {urls.length>0 && (
          <List>
            {urls.map(u => (
              <ListItem key={u.shortcode} secondaryAction={
                <Tooltip title="Copy">
                  <IconButton edge="end" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${u.shortcode}`)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              }>
                <ListItemText
                  primary={`${window.location.origin}/${u.shortcode}`}
                  secondary={u.originalUrl}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </form>
  );
};

export default URLShortenerForm;
