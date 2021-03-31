import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { StampGroup } from './StampGroup'
import { StampTask } from './StampTask'
import { StampUserEnv } from './StampUserEnv'

@Index('stamp_user_stamp_group_gid_fk', ['gid'], {})
@Entity('stamp_user', { schema: 'stamp-hyc' })
export class StampUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number

  @Column('varchar', { name: 'user_pwd', length: 64, default: () => "'0'" })
  userPwd: string

  @Column('varchar', { name: 'user_name', length: 20, default: () => "'0'" })
  userName: string

  @Column('datetime', { name: 'create_time', nullable: true })
  createTime: Date | null

  @Column('varchar', { name: 'user_email', nullable: true, length: 32 })
  userEmail: string | null

  @Column('varchar', { name: 'user_realname', nullable: true, length: 20 })
  userRealname: string | null

  @Column('int', { name: 'vcoin', default: () => "'1000'" })
  vcoin: number

  @Column('int', { name: 'gid', nullable: true })
  gid: number | null

  @Column('int', {
    name: 'storage_space',
    nullable: true,
    default: () => "'2048'",
  })
  storageSpace: number | null

  @OneToMany(() => StampGroup, stampGroup => stampGroup.gadmin2)
  stampGroups: StampGroup[]

  @OneToMany(() => StampTask, stampTask => stampTask.user)
  stampTasks: StampTask[]

  @OneToMany(() => StampUserEnv, stampUserEnv => stampUserEnv.user)
  stampUserEnvs: StampUserEnv[]

  @ManyToOne(() => StampGroup, stampGroup => stampGroup.stampUsers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gid', referencedColumnName: 'gid' }])
  g: StampGroup
}
