# CMS 打包上传工具

## Usage

```bash
sudo npm i @dr/cms-uploader -g

# demo
cms -d 

# production
cms -p

# demo & production
cms -dp

```

## Config

dr-cms-upload 只需要下面一个配置项在你的 package.json 中即可,

```json
{
  "name": "",
  "version": ""
}
```
* name-version 将默认作为 cms 中的 name, name/version 作为 directory
* 默认将会上传 dist 文件夹内的所有文件  

![](http://o9zfwqxxz.bkt.clouddn.com/package.jpg)  
如这样的一个配置,在 cms 中的配置如下:
![](http://o9zfwqxxz.bkt.clouddn.com/example.jpg)  

如果你需要自定义 dist, name, directory 或者 description 你可以在像下面这样任意覆盖它们
````json
{
  "name": "",
  "description": "",
  "cms": {
    "name": "",
    "dist": "",
    "directory": ""
  }
}
````







