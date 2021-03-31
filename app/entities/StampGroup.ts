import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { StampUser } from './StampUser'

@Index('Fk_stamp_group_stamp_user_userId_fk', ['gadmin'], {})
@Entity('stamp_group', { schema: 'stamp-hyc' })
export class StampGroup {
  @PrimaryGeneratedColumn({ type: 'int', name: 'gid' })
  gid: number

  @Column('varchar', { name: 'gname', length: 20, nullable: true })
  gname: string

  @Column('int', { name: 'gadmin', nullable: true })
  gadmin: number | null

  @ManyToOne(() => StampUser, stampUser => stampUser.stampGroups, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gadmin', referencedColumnName: 'userId' }])
  gadmin2: StampUser

  @OneToMany(() => StampUser, stampUser => stampUser.g)
  stampUsers: StampUser[]
}
