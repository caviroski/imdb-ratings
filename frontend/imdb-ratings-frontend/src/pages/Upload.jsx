import { useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import UploadButton from '../components/UploadButton';
import AlertDialog from '../components/AlertDialog';
import SnackbarMessage from '../components/SnackbarMessage';
import { fetchDates } from '../api/fetchDates';
import { fillCountries, stopFillCountries } from '../api/fillCountries';
import { deleteFileByName } from '../api/deleteFileByName';

export default function Upload() {
  const [sortedDates, setSortedDates] = useState([]);
  const [filling, setFilling] = useState(false);
  const [fileName, setFileName] = useState("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchDates(setSortedDates);
  }, []);

  const clickDeleteButton = (value) => {
    setFileName(value);
    setAlertDialogOpen(true);
  };

  const deleteFile = async () => {
    try {
      const msg = await deleteFileByName(fileName);
      setSnack({ open: true, message: msg, color: '#44bd32', duration: 15000 });
      fetchDates(setSortedDates);
    } catch (err) {
      setSnack({ open: true, message: 'Failed to delete entry.', color: '#e84118' });
    }
  }

  const handleFillCountries = () => {
    setFilling(true);
    fillCountries();
  };

  const handleStopFillCountries = () => {
    setFilling(false);
    stopFillCountries();
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  }

  const handleAlertDialogConfirm = () => {
    setAlertDialogOpen(false);
    deleteFile();
  }

  const handleCloseSnackbar = () => {
    setSnack({ ...snack, open: false });
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '35px' }}>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <UploadButton onUploadSuccess={() => fetchDates(setSortedDates)} />
        </Box>
        <Stack direction="row" spacing={2} sx={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleFillCountries} disabled={filling}>
            {filling ? "Filling..." : "Fill Missing Countries"}
          </Button>
          <Button variant="contained" onClick={handleStopFillCountries} style={{ marginRight: '15px' }}>
            Stop filling countries
          </Button>
        </Stack>
      </Box>

      <List sx={{ width: '100%', maxWidth: 200, bgcolor: '#2add8cff', paddingTop: '0', paddingBottom: '0', margin: '20px auto 0 auto' }}>
        {sortedDates.map((value) => (
          <ListItem
            style={{ borderBottom: '1px solid #ccc' }}
            key={value}
            secondaryAction={
              <IconButton aria-label="delete" onClick={() => clickDeleteButton(value)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`${value}`} />
          </ListItem>
        ))}
      </List>

      <AlertDialog
        open={alertDialogOpen}
        onClose={() => {handleAlertDialogClose()}}
        onConfirm={() => {handleAlertDialogConfirm()}}
        title="Confirm Deletion"
        message={`Are you sure you want to delete all the entries from ${fileName}?`}
      />

      <SnackbarMessage
        open={snack.open}
        message={snack.message}
        onClose={handleCloseSnackbar}
        backgroundColor={snack.color}
        duration={snack.duration}
      />
    </div>
  )
}