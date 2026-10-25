import Link from "next/link"

export default function Header  () {
    const routes = [
        {name : "Home", url : "/"},
        {name : "About Us", url : "/about-us"},
    ]
        return(
            <header className="w-full h-16 flex justify-center border border-b items-center">
               <nav className="flex gap-5">
                {
               routes.map(route => <Link key={route.url} href={route.url}>{route.name}</Link> )
               }
               </nav>
            </header>
        )
    }