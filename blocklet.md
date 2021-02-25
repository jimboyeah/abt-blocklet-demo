# 🚩 ArcBlock Coding Test

👉 题目内容

编写 1 个可以部署到 ABT Node 的 Blocklet，需要实现的功能如下：

- 主界面包含输入框，用户输入某个比特币的 `Block Hash` 后能查询并展示对应 Block 中包含的所有 `Transaction`
- 根据 `Block Hash` 拿到 `区块数据`可以使用这个 API，API 介绍见这里
- 把比特币 `Block` 和 `Transaction` 数据渲染成 Bitcoin Explore 显示的样式，只需要包含`区块摘要`和`分页`的`交易列表`即可，网页的 Header 和 Footer 可以忽略
- 项目不要只支持渲染某个特定的 Block，而是可以`任意`输入 `Block Hash` 来查看结果

- rawblock JSON 区块数据 https://blockchain.info/rawblock/00000000000000000007878ec04bb2b2e12317804810f4c26033585b3f81ffaa
- Blockchain Data API https://www.blockchain.com/api/blockchain_api
- Bitcoin Explorer - Block https://www.blockchain.com/btc/block/00000000000000000007878ec04bb2b2e12317804810f4c26033585b3f81ffaa
- Get started with ABT Node  https://www.arcblock.io/en/get-started
- Blocklet 规范 https://github.com/blocklet/blocklet-specification/blob/main/docs/meta.md
- ABT Wallet https://abtwallet.io/zh/

- Kitchen Sink Demo https://github.com/blocklet/kitchen-sink-demo
- Demo - Install on my ABT Node https://github.com/blocklet/react-demo
- Install on ABT Node https://install.arcblock.io/?action=blocklet-install&meta_url=https://github.com/blocklet/react-demo/releases/download/0.1.4/blocklet.json


👉 其他要求或建议：

- 应该编写测试，并且测试能全部通过
- 应该包含 README.md 来告知面试官项目采用的技术栈，以及如何启动、构建项目，运行测试
- 基本界面和交互外，你可以自由发挥，目标是更好的展示区块链上的数据

👉 步骤建议

- 先使用你熟悉的框架、工具和库搭建出 Blocklet 骨架并添加基本功能，建议前端使用 create-react-app，后端使用 express.js
- 启动 ABT Node 本地实例，安装试用官方 Marketplace 里面的 Blocklet，了解 Blocklet 在 ABT Node 里面的运行环境，Blocklet 规范参见文档。
- 参照 React Demo 将你的应用变成 Blocklet，使其能运行在本地的 ABT Node 环境中，`blocklet.yml` 可以用 `blocklet init` 创建。
- 如果你的 Blocklet 不包含后端代码，group 建议选择 static 类型，main 建议选择 create-react-app 默认的 build 目录

👉 加分项

如果你能参照 Kitchen Sink Demo 中 CI 的配置，让你的 Blocklet 仓库支持 `Install on ABT Node` 功能（安装之后要能够正常启动、访问），将获得额外加分。
