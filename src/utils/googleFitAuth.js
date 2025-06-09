import { gapi } from "gapi-script";

const CLIENT_ID = "834220017139-u9vm70hqulkq4bgfqv8him5eb8ncns6m.apps.googleusercontent.com";
const API_KEY = "AIzaSyA7J7nuJEr7NcWJTGZtlynrn_OU3TXlUCQ";
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.read";

export const initializeGoogleFit = () => {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest"],
    });
  });
};

export const signInWithGoogleFit = async () => {
  try {
    const auth = gapi.auth2.getAuthInstance();
    const user = await auth.signIn();
    console.log("User Signed In:", user);
    return user;
  } catch (error) {
    console.error("Google Fit Sign-In Error:", error);
  }
};
