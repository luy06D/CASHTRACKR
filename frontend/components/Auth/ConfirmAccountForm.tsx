"use client"
import { ConfirmAccount } from "@/actions/confirm-account-action"
import { PinInput, PinInputField } from "@chakra-ui/pin-input"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function ConfirmAccountForm() {
  const router = useRouter()
  const [token , setToken] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  // bind nos sirve para pasar datos adicionales 
  const confirmAccountWithToken = ConfirmAccount.bind(null, token) 
  const [state , dispatch] = useFormState(confirmAccountWithToken, {
    errors: [],
    success : ''
  })

  //Esperamos a que iscomplete tengo datos para confirmar
  useEffect (() => {
    if(isComplete){
      dispatch()
    }
  }, [isComplete])

  // Si hay errores los muestra con react-toastify
  useEffect(() => {
    if(state.errors){
      state.errors.forEach(error => {
        toast.error(error)
      })
    }

    if(state.success){
      toast.success(state.success, {
        onClose: () => {
          router.push('/auth/login')
        }
      })
    }
  }, [state])

  const handleChange = (token: string) => {
    setIsComplete(false)
    setToken(token)
  }

  const handleComplete = () => {
    setIsComplete(true)
  }

  return (
    <>
    <div className="flex justify-center gap-5 my-10">
        <PinInput
        
        value={token}
        onChange={handleChange}
        onComplete={handleComplete}
        >
            <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white"/>
            <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white"/>
            <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white"/>
            <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white"/>
            <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white"/>
            <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white"/>
        </PinInput>

        
    </div>
    </>
  )
}