const data = `
● slurmrestd.service - Slurm REST daemon
   Loaded: loaded (/usr/lib/systemd/system/slurmrestd.service; enabled; vendor preset: disabled)
   Active: active (running) since Sat 2021-04-17 13:25:09 CST; 24h ago
 Main PID: 1403 (slurmrestd)
    Tasks: 21 (limit: 409450)
   Memory: 7.2M
   CGroup: /system.slice/slurmrestd.service
           └─1403 /usr/sbin/slurmrestd -f /etc/slurm/slurmrestd.conf 0.0.0.0:6820

Apr 18 13:36:38 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35216] GET /slurm/v0.0.36/jobs
Apr 18 13:37:09 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35232] GET /slurm/v0.0.36/jobs
Apr 18 13:37:40 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35262] GET /slurm/v0.0.36/jobs
Apr 18 13:38:08 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35278] GET /slurm/v0.0.36/jobs
Apr 18 13:40:22 Gargantua slurmrestd[1403]: slurmrestd: operations_router: [[localhost]:35308] GET /slurm/v0.0.36/jobs
Apr 18 13:40:22 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35308] GET /slurm/v0.0.36/jobs
Apr 18 13:42:49 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35430] GET /slurm/v0.0.36/jobs
Apr 18 13:45:43 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35490] GET /slurm/v0.0.36/jobs
Apr 18 13:46:56 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35506] GET /slurm/v0.0.36/jobs
Apr 18 13:48:09 Gargantua slurmrestd[1403]: operations_router: [[localhost]:35536] GET /slurm/v0.0.36/jobs`

const statusReg = /Active: (.*?) \(/g
console.log(statusReg.exec(data)[1])