import {Table, Column, Model ,DataType, HasMany, BelongsTo, AllowNull,  ForeignKey} from 'sequelize-typescript'
import Expense from './Expense'
import User from './User'


// CREANDO LA TABLA PRESUPUESTOS
@Table({
    tableName: 'budgets'
})

// definimos los atributos
class Budget extends Model{

    @AllowNull(true)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @AllowNull(true)
    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number

    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expense : Expense[]

    //SE DEFINE LA CLAVE FORANEA DE USER
    @ForeignKey(() => User)
    declare userId: number

    @BelongsTo(() => User)
    declare user : User
 
}

export default Budget