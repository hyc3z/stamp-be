export const environment = {
  PATH: '/bin:/usr/bin:/usr/local/bin',
  LD_LIBRARY_PATH: '/lib/:/lib64/:/usr/local/lib:/usr/lib64/mpich/lib',
  OMPI_ALLOW_RUN_AS_ROOT: '1',
  OMPI_ALLOW_RUN_AS_ROOT_CONFIRM: '1',
}

export const STATE_WHEN_NOT_EXIST = 'COMPLETED'
