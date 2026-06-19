import type { Metadata } from "next"
import LoginForm from "@/components/Auth/LoginForm"
import Link from "next/link"

export const metadata: Metadata = {
    title: "CashTrackr - Iniciar Sesión",
    description: "CashTrackr - Iniciar Sesión"
}


export default function RegisterPage() {
    return (
        <>
            <h1 className="text-6xl font-black text-purple-950">Iniciar Sesión</h1>
            <p className="text-3xl font-bold">y controla tus <span className="text-amber-500">finanzas</span></p>

            <LoginForm />


            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    href='/auth/register'
                    className="text-gray-500 text-center"
                >
                    ¿Aun no tienes una cuenta ? Registrate
                </Link>
            </nav>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    href='/auth/forgot-password'
                    className="text-gray-500 text-center"
                >
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </nav>
        </>
    )
}