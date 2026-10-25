"use client"
import { Field, useForm } from "@tanstack/react-form"

import { email } from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FieldContent } from "../ui/field"

export default function LoginForm () {

    const form = useForm({
        defaultValues: {
            email: "",
            password : ""
        },
        onSubmit:  (data) =>{
                console.log(data)
        }
    })

        return(
            <div>
               <p>login form</p>
               <form onSubmit={(e) =>{
                e.preventDefault()
                form.handleSubmit()
               }}>
                <form.Field name= "email">
               {
                (field)=>{

                        
                       return(
                         <Input className="border border-red-500" name={field.name}/>
                       )
                    

                }
               }
                </form.Field>

                <Button type="submit">Submit</Button>

               </form>

            </div>
        )
    }