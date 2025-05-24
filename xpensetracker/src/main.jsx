import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Modal from 'react-modal';
import { SnackbarProvider } from 'notistack';

// Set the root element for accessibility support in react-modal
Modal.setAppElement('#root');

// Create and render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={3} // Optional: limits concurrent snackbars
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000} // Optional: time before snackbar disappears
    >
      <App />
    </SnackbarProvider>
  </StrictMode>
);
