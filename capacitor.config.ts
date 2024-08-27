// import type { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'com.example.app',
//   appName: 'timo-client',
//   webDir: 'build'
// };

// export default config;


import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Tasker',
  webDir: 'build',
  bundledWebRuntime: false,

  server: {
    // Setting cleartext to true if you need to allow HTTP connections (not needed for HTTPS backends)
    cleartext: false, // Change to true only if your backend uses HTTP (not recommended for production)
    hostname: 'task-test-backend.onrender.com', // Optional: Set if you want to ensure your app uses this hostname
  },

  android: {
    // Allows mixed content, needed if any resources use HTTP in addition to HTTPS
    allowMixedContent: false, // Set to false to only allow HTTPS content (recommended for production)
    webContentsDebuggingEnabled: true, // Useful for debugging
  },

  ios: {
    // Ensure navigation to your backend URL is allowed
    allowNavigation: ['https://task-test-backend.onrender.com'],
    minVersion: '11.0',
  },
};

export default config;
