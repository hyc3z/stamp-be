Stamp-be

slurm 任务管理监控平台 后端部分

框架 Koa-ts
组件 typeorm+mariadb 存储，jest QA 测试

jwt 鉴权，登陆，提交作业等

前端： stamp-fe

Setup

安装 slurm，参考(Kiwis)['https://github.com/hyc3z/kiwis']
复制 slurmrestd.conf 到/etc/slurm 修改 slurmrestd 默认是监听 socket 要改成监听端口。
配置好 mariadb，创建 database
nfs mount 好文件目录，默认为/mnt/slurm
slurm token 创建，修改好相应 slurm.config.ts
`sudo scontrol token username=root lifespan=315360000`
root 权限运行后端
创建管理员账户 用 postman 或者 requests

TODO:
Task 不能删除 计费
监控
Task create partition
scheduling
