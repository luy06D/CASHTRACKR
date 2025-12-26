import {Table, Column, Model ,DataType, HasMany, BelongsTo, ForeignKey,
    Unique, AllowNull, Default} from 'sequelize-typescript'
import Budget from './Budget'

@Table({
    tableName: 'users'
})

class User extends Model{

    @AllowNull(true)
    @Column({
        type: DataType.STRING(50)
    })
    declare name: string

    @AllowNull(true)
    @Column({
        type: DataType.STRING(100)
    })
    declare password: string

    @AllowNull(true)
    @Unique(true)
    @Column({
        type: DataType.STRING(50)
    })
    declare email: string


    @Column({
        type: DataType.STRING(6)
    })
    declare token: string

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    declare confirmed: boolean

    @HasMany(() => Budget, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budget : Budget[]
}


export default User
