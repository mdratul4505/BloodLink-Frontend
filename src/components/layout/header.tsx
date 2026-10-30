"use client"
import Link from "next/link"
import { Button } from "../ui/button"
import { UseGetMe, UseLogOut } from "@/hooks"
import { toast } from "../ui/toast"
import { useQueryClient } from "@tanstack/react-query"
// import { Button } from "../ui/button"

export default function Header  () {

    const {data , isLoading} = UseGetMe()
    const {mutate : LogOut} = UseLogOut()
    const queryClient = useQueryClient()
    const handleLogOut = () =>{
        LogOut(undefined, {
            onSuccess: ()=>{
                toast.add({
                    title : "Good Bye",
                    description : "LogOut Successfully",
                    type : "success"
                })
                queryClient.removeQueries({
                    queryKey: ["user"]
                })
            },
            onError:()=>{
                toast.add({
                    title : "LogOut Failed",
                    description : "Something went Worng",
                    type : "error"
                })

            }
        })
    }

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
                {!isLoading && !data&& <Button
                variant="outline"
                render={<Link href="/login">Login</Link>}
                nativeButton ={false}
                >
                    Login
                </Button>}
                {!isLoading && data&& <Button onClick={handleLogOut} variant={"destructive"}
                
                >
                    LogOut
                </Button>}
               </div>
               </div>
            </header>
        )
    }