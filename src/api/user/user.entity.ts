import { Exclude } from 'class-transformer';
import * as typeorm from 'typeorm';
import { UserRoleEnum } from './user.types';

@typeorm.Entity()
class UserEntity extends typeorm.BaseEntity {
  @typeorm.PrimaryGeneratedColumn()
  public id!: number;

  @typeorm.Column({ type: 'varchar', nullable: false, unique: true })
  public email: string;

  @Exclude()
  @typeorm.Column({ type: 'varchar', nullable: false, select: false })
  public password: string;

  @typeorm.Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @typeorm.Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;
}

export default UserEntity;
