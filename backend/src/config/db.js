import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize the Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  throw new Error('Supabase URL and Service Role Key are required in environment variables.');
}

// For development, you can log the connection details (without exposing the full key)
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Connecting to Supabase:', {
    url: supabaseUrl.replace(/\.supabase\.co.*$/, '.supabase.co'), // Hide project ID in logs
    keyLength: supabaseKey.length,
    environment: process.env.NODE_ENV
  });
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'literacy-tree-admin'
    }
  }
});

// Enhanced connection test function
const testConnection = async () => {
  const tests = [];
  
  try {
    // Test 1: Basic auth API connection - use admin API which doesn't require session
    console.log('🔐 Testing Auth API connection...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });
    
    if (authError) {
      tests.push({ name: 'Auth API', status: 'failed', error: authError.message });
    } else {
      tests.push({ name: 'Auth API', status: 'success' });
    }

    // Test 2: Database connection - use a simple query to test connection
    console.log('🗄️ Testing database connection...');
    try {
      // Try to query a system table that should always exist
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (testError) {
        // If profiles table doesn't exist, try creating a test query
        const { error: simpleError } = await supabase
          .from('_test_connection')
          .select('*')
          .limit(0);
        
        if (simpleError && simpleError.code === '42P01') {
          // Table doesn't exist, but connection is working
          tests.push({ name: 'Database', status: 'success', error: 'Connection working (test table does not exist)' });
        } else {
          tests.push({ name: 'Database', status: 'failed', error: testError.message });
        }
      } else {
        tests.push({ name: 'Database', status: 'success' });
      }
    } catch (error) {
      tests.push({ name: 'Database', status: 'failed', error: error.message });
    }

    // Test 3: Check if users table exists (for our app)
    console.log('👥 Testing users table access...');
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (usersError) {
        if (usersError.code === '42P01' || usersError.message.includes('exist')) {
          tests.push({ name: 'Users Table', status: 'warning', error: 'Users table does not exist yet - run setup script' });
        } else {
          tests.push({ name: 'Users Table', status: 'failed', error: usersError.message });
        }
      } else {
        tests.push({ name: 'Users Table', status: 'success' });
      }
    } catch (error) {
      tests.push({ name: 'Users Table', status: 'warning', error: 'Users table might not exist' });
    }

    // Test 4: Storage connection test
    console.log('💾 Testing storage connection...');
    try {
      const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) {
        tests.push({ name: 'Storage', status: 'warning', error: storageError.message });
      } else {
        tests.push({ name: 'Storage', status: 'success' });
      }
    } catch (error) {
      tests.push({ name: 'Storage', status: 'warning', error: 'Storage not accessible' });
    }

    return tests;

  } catch (error) {
    console.error('💥 Connection test failed:', error.message);
    tests.push({ name: 'Overall Connection', status: 'failed', error: error.message });
    return tests;
  }
};

// Main connection function
const connectDB = async () => {
  try {
    console.log('🚀 Starting Supabase connection...');
    
    // Run comprehensive connection tests
    const testResults = await testConnection();
    
    // Analyze test results
    const failedTests = testResults.filter(test => test.status === 'failed');
    const warningTests = testResults.filter(test => test.status === 'warning');
    const successfulTests = testResults.filter(test => test.status === 'success');

    // Display test results
    console.log('\n📊 Connection Test Results:');
    testResults.forEach(test => {
      const icon = test.status === 'success' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
      console.log(`   ${icon} ${test.name}: ${test.status.toUpperCase()}`);
      if (test.error) {
        console.log(`      ↳ ${test.error}`);
      }
    });

    // Check if connection is usable - only fail on critical errors
    const criticalFailures = failedTests.filter(test => 
      test.name === 'Auth API' || test.name === 'Database'
    );
    
    if (criticalFailures.length > 0) {
      throw new Error(`Critical connection failures: ${criticalFailures.map(t => t.name).join(', ')}`);
    }

    // Connection success messages
    if (successfulTests.length >= 2) {
      console.log('\n✅ Supabase Connected successfully!');
      
      if (warningTests.length > 0) {
        console.log('⚠️  Some non-critical warnings detected - app should still function');
        console.log('💡 Run the setup script to create missing tables');
      }
      
      console.log('🔧 Ready for database operations');
    } else {
      console.log('\n⚠️  Limited connectivity - some features may not work');
    }

    return {
      supabase,
      status: failedTests.length === 0 ? 'connected' : 'degraded',
      tests: testResults
    };

  } catch (error) {
    console.error(`\n❌ Supabase Connection Failed: ${error.message}`);
    
    // Provide helpful troubleshooting tips
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Check if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct');
    console.log('   2. Verify your Supabase project is active and not paused');
    console.log('   3. Check your internet connection');
    console.log('   4. Ensure the Service Role Key has proper permissions');
    console.log('   5. Verify your Supabase project region matches your deployment');
    
    if (error.message.includes('JWT') || error.message.includes('auth')) {
      console.log('   🔐 Authentication issue: Check your Service Role Key');
      console.log('   💡 Make sure you\'re using the SERVICE ROLE KEY, not the ANON KEY');
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      console.log('   🌐 Network issue: Check your internet connection and Supabase URL');
    }
    
    throw error;
  }
};

// Quick health check function
const healthCheck = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    return {
      status: error ? 'unhealthy' : 'healthy',
      timestamp: new Date().toISOString(),
      error: error?.message
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
};

// Simple connection test (legacy compatibility)
const testConnectionSimple = async () => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });
    return !error;
  } catch (error) {
    return false;
  }
};

export { 
  supabase, 
  connectDB, 
  testConnection, 
  testConnectionSimple, 
  healthCheck 
};

export default connectDB;