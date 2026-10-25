"use client"
import { useForm } from "@tanstack/react-form"

import { email } from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Field, FieldError, FieldLabel } from "../ui/field"
import {loginSchema} from "@/validation"
export default function LoginForm () {

    const form = useForm({
        defaultValues: {
            email: "",
            password : ""
        },
        validators : {
            onSubmit:loginSchema
        },
        onSubmit:  (value) =>{
                console.log(value.value)
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

                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                       return(
                        <Field>
                            <FieldLabel htmlFor={field.name}> Email</FieldLabel>
                            <Input
                            id={field.name}
                          name={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          autoComplete="off"
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors}></FieldError>}
                        </Field>
                         
                       )
                    

                }
               }
                </form.Field>

                <Button type="submit">Submit</Button>

               </form>

            </div>
        )
    }