import {Table, Column, Model ,DataType, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript'


// CREANDO LA TABLA PRESUPUESTOS
@Table({
    tableName: 'budgets'
})

// definimos los atributos
class Budget extends Model{
    @Column({
        type: DataType.STRING(100)
    })
    name: string

    @Column({
        type: DataType.DECIMAL
    })
    amount: number
}

export default Budget