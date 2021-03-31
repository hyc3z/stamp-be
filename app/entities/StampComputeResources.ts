import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { StampResourceTypes } from './StampResourceTypes'
import { StampNodeInfo } from './StampNodeInfo'

@Index('FK_stamp_compute_resources_stamp_node_info', ['nodeId'], {})
@Entity('stamp_compute_resources', { schema: 'stamp-hyc' })
export class StampComputeResources {
  @Column('tinyint', { primary: true, name: 'resource_type' })
  resourceType: number

  @Column('int', { primary: true, name: 'node_id' })
  nodeId: number

  @Column('bigint', { name: 'total_amount' })
  totalAmount: string

  @Column('bigint', { name: 'used_amount', default: () => "'0'" })
  usedAmount: string

  @Column('int', {
    name: 'unit_price',
    comment: 'price_per_second',
    default: () => "'0'",
  })
  unitPrice: number

  @ManyToOne(
    () => StampResourceTypes,
    stampResourceTypes => stampResourceTypes.stampComputeResources,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'resource_type', referencedColumnName: 'typeId' }])
  resourceType2: StampResourceTypes

  @ManyToOne(() => StampNodeInfo, stampNodeInfo => stampNodeInfo.stampComputeResources, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'node_id', referencedColumnName: 'nodeId' }])
  node: StampNodeInfo
}
