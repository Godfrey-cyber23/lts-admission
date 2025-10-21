import { supabase } from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createFirstAdmin = async () => {
  try {
    console.log('👑 Checking for existing admin users...');
    
    // Check if any admin users exist
    const { data: existingAdmins, error: checkError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('role', 'admin')
      .limit(1);

    if (checkError && !checkError.message.includes('exist')) {
      throw checkError;
    }

    if (!existingAdmins || existingAdmins.length === 0) {
      console.log('No admin users found. Creating first admin...');
      
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
      }

      // Create admin user using Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
      });

      if (authError) {
        throw authError;
      }

      console.log('✅ First admin user created successfully:', authData.user.id);
      console.log('📧 Admin email:', process.env.ADMIN_EMAIL);
    } else {
      console.log('ℹ️ Admin user(s) already exist:');
      existingAdmins.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.role})`);
      });
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.message.includes('JWT')) {
      console.log('🔐 Please check your SUPABASE_SERVICE_ROLE_KEY');
    } else if (error.message.includes('database')) {
      console.log('🗄️ Please run the database setup script first');
    }
  }
};

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createFirstAdmin();
}

export default createFirstAdmin;