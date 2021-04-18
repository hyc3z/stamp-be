import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm'
  
  @Entity('stamp_cluster_env', { schema: 'stamp-hyc' })
  export class StampClusterEnv {
    @PrimaryGeneratedColumn({ type: 'int', name: 'envId' })
    envId: number
  
    @Column('varchar', { name: 'env_key', length: 32, default: () => "'0'" })
    envKey: string
  
    @Column('varchar', { name: 'env_val', length: 1024, default: () => "'0'" })
    envVal: string
  
  }
  