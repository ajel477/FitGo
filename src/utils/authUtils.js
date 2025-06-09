import { supabase } from '../config/supabase';

/**
 * Gets the current user and ensures authentication is valid
 * @returns {Promise<Object>} The authenticated user or null
 */
export const getCurrentUser = async () => {
  try {
    // First check the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }
    
    if (!sessionData.session) {
      console.log('No active session');
      return null;
    }
    
    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

/**
 * Checks if user is authenticated and redirects to login if not
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const requireAuth = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    window.location.href = '/login';
    return false;
  }
  
  return true;
};

/**
 * Gets the user profile data
 * @param {string} userId - The user ID to get profile for
 * @returns {Promise<Object>} The user profile data or null
 */
export const getUserProfile = async (userId) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

/**
 * Updates a user profile
 * @param {string} userId - The user ID
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} Result of the update operation
 */
export const updateUserProfile = async (userId, profileData) => {
  if (!userId) throw new Error('User ID is required');
  
  // Check if profile exists
  const existingProfile = await getUserProfile(userId);
  
  if (existingProfile) {
    // Update existing profile
    return await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
  } else {
    // Insert new profile
    return await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  }
}; 