import { Column, Entity, OneToMany } from 'typeorm'
import { StampComputeResources } from './StampComputeResources'
import { StampTask } from './StampTask'

@Entity('stamp_resource_types', { schema: 'stamp-hyc' })
export class StampResourceTypes {
  @Column('tinyint', { primary: true, name: 'type_id' })
  typeId: number

  @Column('varchar', { name: 'type_description', length: 64 })
  typeDescription: string

  @OneToMany(
    () => StampComputeResources,
    stampComputeResources => stampComputeResources.resourceType2,
  )
  stampComputeResources: StampComputeResources[]

  @OneToMany(() => StampTask, stampTask => stampTask.resourceType2)
  stampTasks: StampTask[]
}
