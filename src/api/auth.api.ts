import { apiClient } from "@/lib/apiClient";

export function userLogin (payload : {email :string , password : string}) {
 return apiClient("/auth/login", {method : "POST" , body : payload})
}
export function userLogOut () {
 return apiClient("/auth/logout", {method : "POST" })
}


export function getMe () {
 return apiClient("/users/me")
}

export function googleOAuth ( payload : {idToken : string}) {
return apiClient("/auth/google", {body:payload})
}