import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

export default function SnackbarMessage({ open, message, onClose, backgroundColor = '#143ceeff', duration = 3000 }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={onClose}
      autoHideDuration={duration}
      key="top-center"
    >
      <SnackbarContent
        message={message}
        sx={{
          backgroundColor: backgroundColor,
          fontWeight: '500'
        }}
      />
    </Snackbar>
  );
}
