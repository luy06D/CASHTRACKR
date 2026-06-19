import type { Metadata } from "next"
import ForgotForm from "@/components/Auth/ForgotPasswordForm"
import Link from "next/link"


export const metadata: Metadata = {
    title: "CashTrackr - Iniciar Sesión",
    description: "CashTrackr - Iniciar Sesión"
}


export default function RegisterPage() {
    return (
        <>
            <h1 className="text-6xl font-black text-purple-950">¿Olvidastes tu contraseña?</h1>
            <p className="text-3xl font-bold">aqui puedes <span className="text-amber-500">reestablecerla</span></p>

            <ForgotForm />

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    href='/auth/login'
                    className="text-gray-500 text-center"
                >
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>
            </nav>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    href='/auth/register'
                    className="text-gray-500 text-center"
                >
                    ¿Aun no tienes una cuenta ? Registrate
                </Link>
            </nav>
        </>
    )
}