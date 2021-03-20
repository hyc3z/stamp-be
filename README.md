Stamp-be

slurm 任务管理监控平台 后端部分

框架 Koa-ts 
组件 typeorm+mariadb 存储，jest QA测试

jwt鉴权，登陆，提交作业等

前端： stamp-fe

Setup

安装slurm，参考(Kiwis)['https://github.com/hyc3z/kiwis']
复制slurmrestd.conf到/etc/slurm 修改slurmrestd 默认是监听socket 要改成监听端口。
配置好mariadb，创建database
nfs mount好文件目录，默认为/mnt/slurm
slurm token 创建，修改好相应slurm.config.ts
`sudo scontrol token username=root lifespan=315360000`
root权限运行后端
创建管理员账户 用postman 或者requests
