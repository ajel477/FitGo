export const WITHINGS_CONFIG = {
  client_id: import.meta.env.VITE_WITHINGS_CLIENT_ID,
  client_secret: import.meta.env.VITE_WITHINGS_CLIENT_SECRET,
  redirect_uri: `${window.location.origin}/dashboard/connect-withings`,
  scope: 'user.info,user.metrics,user.activity'
};

export const WITHINGS_AUTH_URL = 'https://account.withings.com/oauth2_user/authorize2';
export const WITHINGS_TOKEN_URL = 'https://wbsapi.withings.net/v2/oauth2';
export const WITHINGS_API_BASE = 'https://wbsapi.withings.net'; 