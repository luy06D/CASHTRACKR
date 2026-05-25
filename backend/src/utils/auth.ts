import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
   /* const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt) **/
    // Manera optimizada 
    return await bcrypt.hash(password, 10) // funcion salt mas directa
}

export const comparePassword = async (password : string , hash : string) => {
    return await bcrypt.compare(password, hash)
}