import { WITHINGS_CONFIG, WITHINGS_AUTH_URL, WITHINGS_TOKEN_URL, WITHINGS_API_BASE } from '../config/withings';
import { supabase } from '../config/supabase';

export const getAuthUrl = () => {
  console.log('Withings Config:', {
    clientId: WITHINGS_CONFIG.client_id,
    redirectUri: WITHINGS_CONFIG.redirect_uri,
    scope: WITHINGS_CONFIG.scope
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: WITHINGS_CONFIG.client_id,
    scope: WITHINGS_CONFIG.scope,
    redirect_uri: WITHINGS_CONFIG.redirect_uri,
    state: 'withings_auth'
  });

  const authUrl = `${WITHINGS_AUTH_URL}?${params.toString()}`;
  console.log('Generated Auth URL:', authUrl);
  return authUrl;
};

export const exchangeCodeForToken = async (code) => {
  try {
    const params = new URLSearchParams({
      action: 'requesttoken',
      grant_type: 'authorization_code',
      client_id: WITHINGS_CONFIG.client_id,
      client_secret: WITHINGS_CONFIG.client_secret,
      code: code,
      redirect_uri: WITHINGS_CONFIG.redirect_uri
    });

    const response = await fetch(`${WITHINGS_TOKEN_URL}?${params.toString()}`, {
      method: 'POST'
    });

    const data = await response.json();
    
    if (data.status !== 0) {
      throw new Error(data.error || 'Failed to exchange code for token');
    }

    // Store tokens in Supabase
    const { error } = await supabase
      .from('user_withings_tokens')
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user.id,
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: new Date(Date.now() + data.body.expires_in * 1000).toISOString()
      });

    if (error) throw error;

    return data.body;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

export const refreshAccessToken = async (refresh_token) => {
  try {
    const params = new URLSearchParams({
      action: 'requesttoken',
      grant_type: 'refresh_token',
      client_id: WITHINGS_CONFIG.client_id,
      client_secret: WITHINGS_CONFIG.client_secret,
      refresh_token: refresh_token
    });

    const response = await fetch(`${WITHINGS_TOKEN_URL}?${params.toString()}`, {
      method: 'POST'
    });

    const data = await response.json();
    
    if (data.status !== 0) {
      throw new Error(data.error || 'Failed to refresh token');
    }

    // Update tokens in Supabase
    const { error } = await supabase
      .from('user_withings_tokens')
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user.id,
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: new Date(Date.now() + data.body.expires_in * 1000).toISOString()
      });

    if (error) throw error;

    return data.body;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

export const getMeasurements = async () => {
  try {
    // First check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user's tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('user_withings_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError) {
      console.error('Token error:', tokenError);
      throw new Error('No Withings token found');
    }

    if (!tokens) {
      throw new Error('No Withings token found');
    }

    // Check if token needs refresh
    if (new Date(tokens.expires_in) <= new Date()) {
      await refreshAccessToken(tokens.refresh_token);
    }

    const params = new URLSearchParams({
      action: 'getmeas',
      access_token: tokens.access_token
    });

    const response = await fetch(`${WITHINGS_API_BASE}/measure?${params.toString()}`);
    const data = await response.json();

    if (data.status !== 0) {
      throw new Error(data.error || 'Failed to get measurements');
    }

    return data.body;
  } catch (error) {
    console.error('Error getting measurements:', error);
    throw error;
  }
};

export const getActivity = async (startdate, enddate) => {
  try {
    // Get user's tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('user_withings_tokens')
      .select('*')
      .single();

    if (tokenError) throw tokenError;

    // Check if token needs refresh
    if (new Date(tokens.expires_in) <= new Date()) {
      await refreshAccessToken(tokens.refresh_token);
    }

    const params = new URLSearchParams({
      action: 'getactivity',
      access_token: tokens.access_token,
      startdate,
      enddate,
      data_fields: 'steps,distance,calories,elevation,soft,moderate,intense,active'
    });

    const response = await fetch(`${WITHINGS_API_BASE}/v2/measure?${params.toString()}`);
    const data = await response.json();

    if (data.status !== 0) {
      throw new Error(data.error || 'Failed to get activity data');
    }

    return data.body;
  } catch (error) {
    console.error('Error getting activity:', error);
    throw error;
  }
}; 