import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Children, ReactNode } from "react";

function makeQueryClient () {
    return new QueryClient({
        defaultOptions : {
            queries:{
                staleTime: 60* 1000
            }
        }
    })

}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient () {
    if(environmentManager.isServer()){
        return makeQueryClient();
    }else{
        if(!browserQueryClient){
            browserQueryClient = makeQueryClient()
        }
        return browserQueryClient
    }
}

export default function providers ({children} : {children : ReactNode }) {
    const QueryClient = getQueryClient()
    return(
        <QueryClientProvider client={QueryClient}>
            {children}
        </QueryClientProvider >
    )
}