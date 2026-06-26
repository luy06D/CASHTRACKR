import type { Metadata } from "next"
import RegisterForm from "@/components/Auth/RegisterForm"
import Link from "next/link"

export const metadata: Metadata = {
    title: "CashTrackr - Crear Cuenta",
    description: "CashTrackr - Crear Cuenta"
}


export default function RegisterPage() {
    return (
        <>
            <h1 className="text-6xl font-black text-purple-950">Crear una cuenta</h1>
            <p className="text-3xl font-bold">y controla tus <span className="text-amber-500">finanzas</span></p>

            <RegisterForm />

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
                    href='/auth/forgot-password'
                    className="text-gray-500 text-center"
                >
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </nav>
        </>
    )
}
