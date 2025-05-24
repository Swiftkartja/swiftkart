// Load environment variables
const ENV = {
  // API Keys
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  FYGARO_API_KEY: process.env.FYGARO_API_KEY || '',
  FYGARO_PUBLIC_KEY: process.env.FYGARO_PUBLIC_KEY || '',
  
  // App Config
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_PIN: process.env.ADMIN_PIN || '1234',
  
  // Firebase (if needed)
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
} as const;

// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_MAPS_API_KEY',
  'FYGARO_API_KEY',
  'FYGARO_PUBLIC_KEY',
] as const;

// Check for missing required environment variables
const missingEnvVars = requiredEnvVars.filter(
  (key) => !process.env[key] && ENV.NODE_ENV === 'production'
);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
  if (ENV.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export default ENV;
