const logger = {
  info: (message, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      data
    };
    
    const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('appLogs', JSON.stringify(logs));
  },

  error: (message, error = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error.message || error
    };
    
    const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('appLogs', JSON.stringify(logs));
  },

  getLogs: () => {
    return JSON.parse(localStorage.getItem('appLogs') || '[]');
  }
};

export default logger;