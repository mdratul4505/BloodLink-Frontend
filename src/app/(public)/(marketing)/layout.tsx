import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/header";
import { ReactNode } from "react";

export default function Layout ({children} : {children : ReactNode}) {
        return(
            <div className="flex flex-col min-h-screen">
                <Header></Header>
                <main  className="flex-1">
                    {children}
                </main>
                <Footer></Footer>
            </div>
        )
    }