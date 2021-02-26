
# Blocklet demo with React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), it's a simple demo purpose [Blocklet](https://www.arcblock.io/en/blocklets) that runs on [ABT Node](https://www.arcblock.io/en/platform).

## Run Test suite

Run the following command to do test with React Testing Library.

```shell
yarn test
# or
npm run test
```

## Install to your ABT Node

If you have your own ABT Node and just want to try out this blocklet, simply click the following button to install:

[![Install on my ABT Node](https://raw.githubusercontent.com/blocklet/development-guide/main/assets/install_on_abtnode.svg)](https://install.arcblock.io/?action=blocklet-install&meta_url=https%3A%2F%2Fgithub.com%2Fjimboyeah%2Fabt-blocklet-demo%2Freleases%2Fdownload%2F1.0.0%2Fblocklet.json)

Or alternatively, you can find install this demo blocklet in [Blocklets Marketplace](https://blocklet.arcblock.io) or from the "Blocklet/Marketplace" menu in your ABT Node console. 


## Run and debug in the cloud with Gitpod

Click the "Open in Gitpod" button, Gitpod will start ABT Node and the blocklet.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/jimboyeah/abt-blocklet-demo)

## Run and debug locally

If you have not installed ABT Node locally, you can do it using the following: 
```shell
yarn global add @abtnode/cli
```
You can get more details from [Get started with ABT Node](https://www.arcblock.io/en/get-started) page or if you need help installing ABT Node. 

Clone the repo and start development using a debug mode ABT Node instance inside this project:
```shell
git clone git@github.com:jimboyeah/abt-blocklet-demo.git
cd react-demo
yarn
abtnode init --mode debug
abtnode start
blocklet dev
```

## Build

Build this project before bundle and package.

```shell
yarn build
```

## Bundle and Package 

Use bundle command to tranform static output in `build` to `.blocklet`, then deploy it in your local ABT Node.

```shell
blocklet bundle
blocklet deploy .blocklet/bundle
```


## Learn more about ABT Node and Blocklet

* [ABT Node Overview](https://docs.arcblock.io/en/abtnode/introduction/abtnode-overview)
* [Get started with ABT Node](https://www.arcblock.io/en/get-started)
* [ABT Node CLI](https://docs.arcblock.io/en/abtnode/developer/abtnode-cli)
* [Blocklet Development Documents](https://docs.arcblock.io/en/abtnode/developer/blocklet-spec)


## More on ABT Node CLI
- https://docs.arcblock.io/abtnode/zh/developer/abtnode-cli
- https://github.com/ArcBlock/abt-node

安装，初始化并启动 ABT Node 进行配置：

    yarn global add @abtnode/cli
    npm install -g @abtnode/cli

    abtnode init
    abtnode start

使用中遇到权限问题，启动 ABT Node 后，blocklet 也不能顺利安装：

    {
        errno: -13,
        code: 'EACCES',
        syscall: 'rename',
        path: '/home/jeango/.nvm/versions/node/v15.9.0/lib/node_modules/@abtnode/cli',
        dest: '/home/jeango/.nvm/versions/node/v15.9.0/lib/node_modules/@abtnode/.cli-V32Ka8cV'
    }

试以 root 身份运行安装命令。

    sudo npm install -g @abtnode/cli 
    sudo npm install --unsafe-perm=true -g @abtnode/cli
    sudo npm install --unsafe-perm=true --allow-root -g @abtnode/cli

以上安装方式对我的开发环境还是不起作用，系统是 Windows WSL Ubuntu，Node.js v15.9.0。

下面开始源代码补丁模式，修改 `@abtnode\core\lib\blocklet\manager\disk.js` 代码文件 Line 1800，将 fs.move 方法调用改成 fs.copy 方式，总共 2 处：

    async _resolveDownload(cwd, tarFile, originalMeta) {
         ...
        // await fs.move(downloadDir, installDir, { overwrite: true });
        logger.info('🚩======= move: ', {downloadDir, installDir});
        await fs.copy(downloadDir, installDir, { overwrite: true });
        fs.removeSync(downloadDir);
    }

安装完成后，启动 ABT Node，使用你的 ABT 钱包并扫描二维码登录。

    bundle [options]           Bundle a blocklet that can run in ABT Node
    start [options]            Start ABT Node Daemon
    init                       Init ABT Node config
    status                     Show ABT Node and blocklet status
    logs                       Show ABT Node and blocklet logs
    stop|kill [options]        Stop ABT Node and blocklets
    info [options]             Get environment information for debugging and
                               issue reporting
    deploy [options] <folder>  Deploy blocklet from local directory to ABT Node
    blocklet:init              Create an empty blocklet project
    upgrade                    Self-Upgrade ABTNode
    help [command]             display help for command

ABT Node v1.2.0 里面包含了 Breaking Change，安装 @abtnode/cli 后会产生两个全局的命令行工具 `abtnode` 和 `blocklet`，前者用来管理 ABT Node，后者用来操作 Blocklet：

- abtnode deploy 变成了 blocklet deploy
- abtnode bundle 变成了 blocklet bundle
- abtnode blocklet:* 变成了 blocklet *

ABT Node 默认的 Blocklet Registry 变更为 https://booster.registry.arcblock.io 新 Registry 启用了 AWS 的全球 CDN 加速，下载速度会更快。


使用 yarn 安装，请导出 `~/.yarn/bin` 目录以正常使用 abtnode 命令。

修改 `~/.bashrc` `~/.profile` `~/.zshrc` 之一个，以自动查找 nvm 命令：

    export NVM_DIR="$HOME/.yarn/bin"


## License

The code is licensed under the MIT license found in the
[LICENSE](LICENSE) file.
