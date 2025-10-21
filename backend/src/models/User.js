// src/models/User.js
import bcrypt from 'bcrypt';
import { supabase } from '../config/db.js';

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.password_hash = userData.password_hash;
    this.role = userData.role;
    this.isActive = userData.isActive;
    this.fullName = userData.full_name;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('isActive', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No user found
        }
        throw error;
      }

      return data ? new User(data) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('isActive', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data ? new User(data) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password_hash);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Convert to JSON (exclude password)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      fullName: this.fullName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create new user
  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: userData.email.toLowerCase(),
            password_hash: hashedPassword,
            role: userData.role || 'staff',
            full_name: userData.fullName,
            isActive: true
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return new User(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}

export default User;