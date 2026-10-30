import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export default function googleAuthProvider ({children} : {children : ReactNode} ){
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if(!clientId){
        return<>{children}</>
    }
return(
    <GoogleOAuthProvider clientId={clientId}>
        {children}
    </GoogleOAuthProvider>
)
}