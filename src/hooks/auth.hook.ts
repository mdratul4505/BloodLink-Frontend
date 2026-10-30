import { getMe, userLogin, userLogOut } from "@/api";
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

export function UseGetMe () {
 return useQuery({
   queryKey : ["user"],
   queryFn : getMe,
   retry : false,
 })
}

