import { supabase } from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');

    // Create users table if it doesn't exist
    console.log('📊 Creating users table...');
    const { error: usersError } = await supabase.rpc('create_users_table_if_not_exists');

    if (usersError && !usersError.message.includes('function')) {
      console.log('Creating users table manually...');
      
      // You would run SQL directly here, but for Supabase you might need to use the SQL editor
      // This is a simplified example - you'd typically run this in Supabase's SQL editor
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    }

    // Create other necessary tables...
    console.log('✅ Database setup completed!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
};

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;