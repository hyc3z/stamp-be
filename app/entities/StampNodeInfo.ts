import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { StampComputeResources } from './StampComputeResources'
import { StampNodeRoles } from './StampNodeRoles'

@Index('FK_stamp_node_info_stamp_node_roles', ['role'], {})
@Entity('stamp_node_info', { schema: 'stamp-hyc' })
export class StampNodeInfo {
  @Column('int', { primary: true, name: 'node_id' })
  nodeId: number

  @Column('varchar', { name: 'host_name', length: 64 })
  hostName: string

  @Column('tinyint', { name: 'role', default: () => "'0'" })
  role: number

  @OneToMany(
    () => StampComputeResources,
    stampComputeResources => stampComputeResources.node,
  )
  stampComputeResources: StampComputeResources[]

  @ManyToOne(() => StampNodeRoles, stampNodeRoles => stampNodeRoles.stampNodeInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'role', referencedColumnName: 'roleId' }])
  role2: StampNodeRoles
}
