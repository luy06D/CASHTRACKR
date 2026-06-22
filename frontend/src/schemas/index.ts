import {z} from 'zod'


// Schema para validacion de formulacion / registro de usuario
export const RegisterSchema =  z.object({
    email: z.string()
            .min(1, {message: 'El Email es obligatorio'})
            .email({message: 'E-mail no válido'}),
    name: z.string()
            .min(1, {message: 'El nombre no puede ir vacio'}),
    password: z.string()
                .min(8,{message: 'El password debe tener como minimo 8 caracteres' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Los password no son iguales',
    path: ['password_confirmation']
})

export const SuccessSchema = z.string()
export const ErrorResponseSchema = z.object({
    error: z.string()
})


export const TokenSchema = z.string({message: "Token no valido"} )
                            .length(6, {message: "Token no valido"})