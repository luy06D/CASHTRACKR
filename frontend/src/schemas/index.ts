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

export const LoginSchema = z.object({
        email: z.string()
                .min(1, {message: 'El Email es Obligatorio'})
                .email( {message: 'Email no válido'}),
        password: z.string()
                .min(1, {message: 'El Password no puede ir vacio'})
})

export const ForgotPasswordSchema = z.object({
        email: z.string()   
                .min(1, {message: 'El Email es Obligatorio'})
                .email( {message: 'Email no válido'}),
    })

export const TokenSchema = z.string({message: "Token no valido"} )
                            .length(6, {message: "Token no valido"})

                            
export const ResetPasswordSchema = z.object({
        password: z.string()
                .min(8, {message: 'El Password debe ser de al menos 8 caracteres'}),
        password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
        message: "Los Passwords no son iguales",
        path: ["password_confirmation"]
});

// BUDGETSS
export const DraftBudgetSchema = z.object({
        name: z.string()
                .min(1, {message: 'El nombre del presupuesto es obligatorio'}),
        amount: z.coerce.
                number({message: 'Cantidad no válida'})
                .min(1, {message: 'Cantidad no válida'}),
})

export const PasswordValidationSchema = z.string().min(1, {message: 'Password no válido'})

// Schema for Expenses
export const DraftExpenseSchema = z.object({
        name: z.string()
                .min(1, {message: 'El nombre del gasto es obligatorio'}),
        amount: z.coerce.number().min(1, {message: 'Cantidad no válida'})      
})

// Validacion - Update Password
export const UpdatePasswordSchema = z.object({
        current_password: z.string().min(1, {message: 'El password no puede ir vacio'}),
        password: z.string().min(8, {message: 'El nuevo Password debe ser de almenos 8 caracteres'}),
        password_confirmation: z.string()
}).refine((data) => data.password == data.password_confirmation, {
        message: 'Los password no son iguales',
        path: ["password_confirmation"]
})


export const SuccessSchema = z.string()
export const ErrorResponseSchema = z.object({
    error: z.string()
})

export const UserSchema = z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email()
})

//Schema expenses - mostrar los gastos
export const ExpensesAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        budgetId: z.number()
})
// Schema budgets - mostrar los presupuestos
export const BudgetAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.string(),
        userId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
        expense: z.array(ExpensesAPIResponseSchema)
})
// omit => omite el campo expense de BudgetAPIResponseSchema
export const BudgetsAPIResponseSchema = z.array(BudgetAPIResponseSchema.omit({expense:true}))

export type User = z.infer<typeof UserSchema>
export type Budget = z.infer<typeof BudgetAPIResponseSchema>
export type DraftExpense = z.infer<typeof DraftExpenseSchema>
export type Expense = z.infer<typeof ExpensesAPIResponseSchema>