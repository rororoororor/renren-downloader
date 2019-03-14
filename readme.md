1. 装一下[nodejs](https://nodejs.org/en/), `node install`
2. 登录人人，copy个cookie出来，比如这个接口
```
http://photo.renren.com/photo/{userId}/albumlist/v7
```
copy 进auth-provider/auth-provider.js, 替代那个cookie（=。= 太暴力了）
3. 改main.js, 最下面，把userId和路径改掉
4. node ./src/main.js 即可
