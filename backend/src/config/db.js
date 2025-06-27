
import mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import colors from 'colors';

const connectDB = async () => {
  try {
    // Verify MONGODB_URI exists before attempting connection
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables'.red);
    }

    console.log('Attempting to connect to MongoDB...'.yellow);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red.bold);
    console.error('Please check your:');
    console.error('- MongoDB connection string in config.env'.yellow);
    console.error('- Internet connection'.yellow);
    console.error('- Database credentials'.yellow);
    process.exit(1);
  }
};

export default connectDB;