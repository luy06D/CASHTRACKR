import RegisterForm from "@/components/Auth/registerForm"

export default function RegisterPage() {
    return (
        <>
            <h1 className="text-6xl font-black text-purple-950">Crear una cuenta</h1>
            <p className="text-3xl font-bold">y controla tus <span className="text-amber-500">finanzas</span></p>
           
            <RegisterForm />
        </>
    )
}
