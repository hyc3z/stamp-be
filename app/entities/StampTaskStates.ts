import { Column, Entity, OneToMany } from 'typeorm'
import { StampTask } from './StampTask'

@Entity('stamp_task_states', { schema: 'stamp-hyc' })
export class StampTaskStates {
  @Column('tinyint', { primary: true, name: 'state_id' })
  stateId: number

  @Column('varchar', { name: 'state_description', length: 64 })
  stateDescription: string

  @OneToMany(() => StampTask, stampTask => stampTask.state)
  stampTasks: StampTask[]
}
