
import Link from "next/link"
import { Button } from "../ui/button"
// import { Button } from "../ui/button"

export default function Header  () {
    const routes = [
        {name : "Home", url : "/"},
        {name : "About Us", url : "/about-us"},
    ]
        return(
            <header className="w-full h-16  border border-b">
               <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
          <img src="/public/logo.jpg" alt="" />
          <span>Blood Link</span>
        </div>
                <nav className="flex gap-5">
                {
               routes.map(route => <Link key={route.url} href={route.url}>{route.name}</Link> )
               }
               </nav>
               <div>
                <Button
                variant="outline"
                render={<Link href="/login">Lgoin</Link>}
                nativeButton ={false}
                >
                    Login
                </Button>
               </div>
               </div>
            </header>
        )
    }