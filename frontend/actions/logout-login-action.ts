"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logoutLogin(){
    cookies().delete('CASHTRAKER_TOKEN')
    redirect('/auth/login')
}