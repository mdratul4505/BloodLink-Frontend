"use client"
import { ReactNode } from "react";
import QueryProviders from "./query.provider";

export default function Providers ({children} : {children : ReactNode}) {
    return(
        <QueryProviders>
            {children}
        </QueryProviders>
    )
}