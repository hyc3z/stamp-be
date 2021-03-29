

const envs = [
    {envKey: "a",envVal: "233"},
    {envKey: "b",envVal: "33"},
    {envKey: "PATH",envVal: '/bsd'},
    {de: "d"}
]

const environment = {
    "PATH" : "/bin:/usr/bin:/usr/local/bin",
    "LD_LIBRARY_PATH" : "/lib/:/lib64/:/usr/local/lib:/usr/lib64/mpich/lib",
    "OMPI_ALLOW_RUN_AS_ROOT": "1",
    "OMPI_ALLOW_RUN_AS_ROOT_CONFIRM": "1",
}

function concateEnvs(userEnvs, defaultEnvs) {
    userEnvs.forEach((userEnv) => {
        if(userEnv.envKey){
            defaultEnvs[userEnv.envKey] = userEnv.envVal
        }
    })
    return defaultEnvs
}
console.log(concateEnvs(envs, environment))