export function concateEnvs(userEnvs: any[], defaultEnvs: { [x: string]: any }) {
  userEnvs.forEach(userEnv => {
    if (userEnv.envKey) {
      defaultEnvs[userEnv.envKey] = userEnv.envVal
    }
  })
  return defaultEnvs
}

export function diffSeconds(startDate: Date, endDate: Date): number {
  const msecNum =  Math.abs(endDate.getTime() - startDate.getTime());
  return Math.floor(msecNum / 1000);
}