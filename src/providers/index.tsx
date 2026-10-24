import { ReactNode } from "react";

export default function providers ({children} : {children : ReactNode}) {
    return(
        <div>
            {children}
        </div>
    )
}