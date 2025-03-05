import {GoogleOAuthProvider} from "@react-oauth/google";
function GoogleAuth () {
    return (
        <div>
            <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}`}></GoogleOAuthProvider>
        </div>
    )
}