"use client"

import { useState } from 'react'
import ValidateTokenForm from './ValidateTokenForm'
import ResetPasswordForm from './ResetPasswordForm'

export default function PasswordResetHandler() {

  const [isValidToken, setIsValidToken] = useState(false)
  return (
    // Si el toquen no esta validado mostramos ValidateTokenForm
    <>
      {!isValidToken ?
        <ValidateTokenForm
        setIsValidToken = {setIsValidToken}

        /> :
        <ResetPasswordForm />
      }
    </>
  )
}
