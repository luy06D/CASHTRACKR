import ConfirmAccountForm from "@/components/Auth/ConfirmAccountForm";


export default function ConfirmAccountPage() {

  return (
    <>
      <h1 className="text-6xl font-black text-purple-950">Confirma tu Cuenta</h1>
      <p className="text-3xl font-bold">Ingresa el codigo que recibiste
        <span className="text-amber-500"> por email</span>
      </p>

      <ConfirmAccountForm/> 

    </>
  )
}
