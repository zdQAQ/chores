### 浅谈Electron应用自动更新

什么是Electron应用？

> Electron 是一个使用 JavaScript, HTML 和 CSS 等 Web 技术创建原生应用的框架，使用Electron这个框架创建的桌面应用程序就是Electron应用。

什么是自动更新？

> 以桌面应用为例：程序A在安装到用户的电脑上（磁盘）的时候，版本号是001，过了一个月之后，程序A发布了新版本002，用户不需要再次去程序A的官网下载新版本再安装，而是在再次启动程序A的时候，发现程序A已经更新成了版本002，或者程序A提示需要重启应用更新，省去了安装的过程。这就实现了自动更新。

为什么移动端应用不用考虑自动更新功能，而桌面端应用需要？

>在移动端，比如IOS系统上，应用都是通过AppStore来安装，神奇的地方在于我们安装了第一次之后就再也不用更新，magic！每当应用有新版本后，AppStore替我们做了自动升级，让应用开发者可以不用关心如何去实现“自动升级”这个功能。当然，这个功能是可以被用户关闭的，如果应用需要强制升级，还是需要在应用内处理。
>
>在桌面端情况就不一样了，在Windows上，没有一个类似AppStore这样的门卫兼物管，用户可以从网络上随意去下载应用，也没人能替开发者们进行版本管理新。即使在相对严格的macOS上也可以通过配置来安装来源不明的应用，自动更新也就无从谈起。于是桌面端开发者们需要自己想办法了。

介绍了一些通用的背景知识之后，来看看我们的Electron应用（Ada工作台，是公司内部集开发、部署、发布、运维为一体的前端桌面工具）现有的版本升级方案：

1. 通过[electron-builder](https://github.com/electron-userland/electron-builder)进行应用的打包 
2. 打包后的安装程序上传到一个自建的服务器[electron-release-server](https://github.com/ArekSredzki/electron-release-server)
3. 应用内自行编写更新逻辑，通过定时器查询是否有新的版本可供下载，如果有，将一个完整的安装程序下载到本地，下载完成后提示用户，用户确认后可以启动新的安装程序安装覆盖原有的版本

看起来不错，已经实现了基本的更新逻辑，但是我们要做得更好，向着VSCode的restart to update的方式看齐，也就是第三步的优化：让用户不用再等待一个新的安装过程，我们替用户去安装，用户只需要重新启动应用程序就能体验到最新的版本。

从官方文档的[autoUpdater](https://www.electronjs.org/docs/api/auto-updater)以及我们现有使用的库来看，我们的可选方案是有限的。更新服务器的方案不需要更换，[electron-release-server](https://github.com/ArekSredzki/electron-release-server)已经能满足版本管理的需求，在自动升级上也与官方的[autoUpdater](https://www.electronjs.org/docs/api/auto-updater)匹配。那么现在的问题只是第三步的优化，怎样才能做到不让用户自己去安装？

[autoUpdater.quitAndInstall](https://www.electronjs.org/docs/api/auto-updater#autoupdaterquitandinstall)就是答案。原来官方已经解决了这个问题，囧。所以有的时候自己闭门造车还不如上官网上查查文档。

接下来我们要做的就是准备实现了。

1. 使用[autoUpdater](https://www.electronjs.org/docs/api/auto-updater)中的方法替换现有方案中的第三步
2. 考虑自动升级失败的备用方案，在自动升级失败时，使用原有的第三步中的方案，让用户重新安装完整的安装包

~~~javascript
```javascript
autoUpdater.on('checking-for-update', () => {
  // 开始检查是否有新版本
})

autoUpdater.on('update-available', (info) => {
  // 检查到有新版本
})

autoUpdater.on('update-not-available', (info) => {
  // 检查到无新版本
})

autoUpdater.on('error', (err) => {
  // 自动升级遇到错误，执行备用升级逻辑
})

autoUpdater.on('update-downloaded', (ev, releaseNotes, releaseName) => {
  // 自动升级下载完成，可以执行 autoUpdater.quitAndInstall()
})
```
~~~

 当思路清晰时，其实所做的工作无非是找到合适的类库，调用API。大部分情况下我们不会是第一个遇到类似问题的人，否则我们就需要自己动手去写一个解决方案了。开源类库给我们提供了不少便利，但在使用他人提供的类库时，即使有详尽的文档也可能会遇到一些问题（even bug）。

1. ```javascript
   autoUpdater.on('error', (err) => {
     console.log(err) //"Error: The resource could not be loaded because the App Transport Security policy requires the use of a secure connection."
   })
   ```

   第一个遇到的问题出现得猝不及防，错误的描述其实已经很清晰，App Transport Security 要求资源通过安全的连接来加载，也就是通过HTTPS协议。autoUpdater.setFeedURL的url地址一看是https的，然后就略过了这里，殊不知后来发现这个接口中我们又对[electron-release-server](https://github.com/ArekSredzki/electron-release-server)的接口进行了封装，而[electron-release-server](https://github.com/ArekSredzki/electron-release-server)的接口并不是https的。然后将[appUrl](https://github.com/ArekSredzki/electron-release-server/blob/master/docs/urls.md#about-using-https)改成https即可，btw，这个文档的位置可真难找。

2. [electron-release-server更新接口](https://github.com/ArekSredzki/electron-release-server/blob/master/docs/urls.md#download-endpoints)的检查更新逻辑问题。

   ```javascript
   ${ADA_AUTOUPDATE_FEED_API}${platform}/${version}/${channel}
   ```

   channel为beta时，预期是不管任何时候，只要version不是最新的beta版本，接口应该返回最新的beta版本。但是实际发现这个接口的实现跟上传时间有关，比如version为2.18.0-beta.202008051710时，接口返回2.18.0-beta.202008142217。这是正常的。但是version为2.18.0-beta.202008051438时，接口返回2.18.0，返回的是stable的版本，并且没有按预期找到最新的beta版本。这里的解决方案是自行提供一个符合我们预期的接口。

总结来看，其实问题并不难，但在实际解决的过程中，先花费了不少时间了解Electron框架及我们团队现有的代码逻辑，再去明确我们要优化的点具体在哪里，再到最后的方案实现，这中间其实对问题的定义我认为是最重要的。

以我的理解分享一下我们团队的需求分析之道：

> 第一步，认清目的：想要达成的效果或是要解决的问题 （确定一个一个的点）
>
> 第二步，明确范围：影响了哪些模块哪些其它的功能 （形成一个面）
>
> 第三步，时间闭合：根据重要程度预估工时（时间维度为轴，形成一个三维立体）

或许这不失为一个面对问题的通用的思考框架。

学而不思则罔，思而不学则殆。与君共勉。

