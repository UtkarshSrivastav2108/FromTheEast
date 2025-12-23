import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Snackbar Context
 * Provides global snackbar notification functionality
 */
const SnackbarContext = createContext(null);

/**
 * SnackbarProvider Component
 * Wraps the app to provide snackbar notifications
 */
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
  });

  /**
   * Show snackbar notification
   * @param {string} message - Message to display
   * @param {string} severity - Severity level ('success', 'error', 'warning', 'info')
   */
  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  /**
   * Close snackbar
   */
  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  /**
   * Show success message
   * @param {string} message - Success message
   */
  const showSuccess = useCallback((message) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  /**
   * Show error message
   * @param {string} message - Error message
   */
  const showError = useCallback((message) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  /**
   * Show warning message
   * @param {string} message - Warning message
   */
  const showWarning = useCallback((message) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  /**
   * Show info message
   * @param {string} message - Info message
   */
  const showInfo = useCallback((message) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  const value = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

/**
 * useSnackbar Hook
 * Hook to access snackbar functions
 * @returns {{ showSnackbar: Function, showSuccess: Function, showError: Function, showWarning: Function, showInfo: Function, closeSnackbar: Function }}
 */
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

