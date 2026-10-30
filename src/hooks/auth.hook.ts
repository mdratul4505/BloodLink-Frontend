import { getMe, googleOAuth, userLogin, userLogOut } from "@/api";
import { useGoogleOAuth } from "@react-oauth/google";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export function UseLogin () {
 return useMutation({
    mutationFn : userLogin
 })
}

export function UseLogOut () {
 return useMutation({
    mutationFn : userLogOut
 })
}

export function UseGoogleOAuth () {
   return useMutation({
      mutationFn : googleOAuth
   })
}

export function UseGetMe () {
 return useQuery({
   queryKey : ["user"],
   queryFn : getMe,
   retry : false,
 })
}

