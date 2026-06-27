import { ValidateToken } from "@/actions/validate-token-action";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useEffect, useState, Dispatch,SetStateAction } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

type ValidateTokenFormProps = {
    setIsValidToken : Dispatch<SetStateAction<boolean>>
}

export default function ValidateTokenForm({setIsValidToken} : ValidateTokenFormProps) {
    const [token, setToken] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const confirmValidateToken = ValidateToken.bind(null, token)
    const [state, dispatch] = useFormState(confirmValidateToken, {
        errors:[],
        success: ''
    })

    // Disparar el dispatch
    useEffect(() => {
        if(isComplete){
            dispatch()
        }
    }, [isComplete])

    useEffect(() => {
        if(state.errors){
            state.errors.forEach(error =>{
                toast.error(error)
            })
        }
        if(state.success){
            toast.success(state.success)  
            // Si es true nos redireccion  ResetPasswordForm
            setIsValidToken(true) 
        }
    },[state])


    const handleChange = (token: string) => {
        setIsComplete(false)
        setToken(token)

    }

    const handleComplete = () => {
        setIsComplete(true)
    }

    return (
        <div className="flex justify-center gap-5 my-10">
            <PinInput
                value={token}
                onChange={handleChange}
                onComplete={handleComplete}
            >
                <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
            </PinInput>
        </div>
    )
}