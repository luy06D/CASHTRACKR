import {Table, Column, Model ,DataType, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript'
import Expense from './Expense'


// CREANDO LA TABLA PRESUPUESTOS
@Table({
    tableName: 'budgets'
})

// definimos los atributos
class Budget extends Model{
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number

    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expense : Expense[]
}

export default Budget