"use client"
import { ReactNode } from "react";
import QueryProviders from "./query.provider";
import GoogleAuthProvider from "./google-auth.provider";


export default function Providers ({children} : {children : ReactNode}) {
    return(
        <GoogleAuthProvider>
            <QueryProviders>
            {children}
        </QueryProviders>
        </GoogleAuthProvider>
        
    )
}