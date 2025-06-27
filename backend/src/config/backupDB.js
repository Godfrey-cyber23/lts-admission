import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backupDir = path.join(__dirname, 'backups');

cron.schedule('0 2 * * *', () => { // 2 AM daily
  const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out=${backupDir}`;
  
  exec(cmd, (error) => {
    if (error) {
      console.error('Backup failed:', error);
      // Consider adding error notification (email, logging service, etc.)
    } else {
      console.log('Backup completed:', new Date().toISOString());
      // You might want to add backup rotation logic here
    }
  });
});

// Optional: Add error handling for cron job
process.on('uncaughtException', (err) => {
  console.error('Cron job error:', err);
});