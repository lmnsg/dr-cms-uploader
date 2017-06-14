# CMS 打包上传工具

## Usage

```bash
sudo npm i dr-cms-upload -g

# demo
cms -d 

# production
cms -p

# demo & production
cms -dp

# stay zip file
cms -ds
```

## Notify

dr-cms-upload 需要读取项目的 cms 信息才能够运行, 在你的项目目录下  
放置一个如下的 cms.yml 文件:

````yaml
# cms.yml
path: ./src 
 
cmsParams:
  name: cashloan-lp
  description: cashloan landing page
  directory: cashloan/lp
  forcePush: 'true'
````
path 是相对路径,指向你要打包的文件夹
name 是 cms 上显示的名称
directory 是访问路径

## Auth
cms 的上传接口需要使用 cms 账号通过 base auth 进行验证,  
dr-cms-upload 默认会使用你的用户根目录下的 .cmsrc 的配置

````json
{
    "user": "",
    "pass": ""
}
````






