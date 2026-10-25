import Link from "next/link"

export default function Header  () {
    const routes = [
        {name : "Home", url : "/"},
        {name : "About Us", url : "/about-us"},
        {name : "Home", url : "/"},
        {name : "Home", url : "/"},
        {name : "Home", url : "/"},
    ]
        return(
            <header className="w-full h-16">
               {
               routes.map(route => <Link key={route.url} href={route.url}>{route.name}</Link> )
               }
            </header>
        )
    }