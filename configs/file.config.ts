export default {
  mountPath: '/mnt/slurm',
  subPaths: ['program', 'scripts', 'output'],
  fsType: 'nfs',
  createUserFolder: true,
}
