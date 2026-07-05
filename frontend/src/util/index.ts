
// Formato para cantidades de dinero ---
export function formatCurrency(quantity: number){
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'PEN'
    }).format(quantity)
}

// Formato para fechas 
export function formatDate(isoString: string){
    const date = new Date(isoString)

    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return formatter.format(date)
}