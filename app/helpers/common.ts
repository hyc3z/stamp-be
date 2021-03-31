export function concateEnvs(userEnvs: any[], defaultEnvs: { [x: string]: any }) {
  userEnvs.forEach(userEnv => {
    if (userEnv.envKey) {
      defaultEnvs[userEnv.envKey] = userEnv.envVal
    }
  })
  return defaultEnvs
}
