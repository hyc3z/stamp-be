const a = ["slurm-4.out", "slurm-5.out", "slurm-6.out", "slurm-51.out"]
const list = a.sort((a, b) => {
    const idA = parseInt(a.match(/^slurm-(\d+).out/i)[1]);
    const idB = parseInt(b.match(/^slurm-(\d+).out/i)[1]);
    return idA < idB
})
console.log(list)