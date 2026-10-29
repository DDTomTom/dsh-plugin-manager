# 插件管理器 · DSH Plugin Manager

一个给 DeepSeek Harness 用的侧栏插件管理器：把当前 profile 里**所有非 DSH 原生**的插件收进一个页面，逐条看描述、按功能分类筛选、启用 / 停用、卸载。

![icon](icon.svg)

- 侧栏入口位于「插件市场」正下方（`sidebar.footer.action`，order 10），点击后在主区域打开管理器。
- 数据来自 DSH 宿主的 `pluginManager` 服务（`listBundles` / `listPlugins`），只展示 `availability === "profile"` 的 bundle —— 也就是你自己装进来的那些：插件市场下载、npm 直装、GitHub 直装、本地 link 自编，都在列表里。
- 每张卡片显示：标题、版本、来源徽标（npm 市场 / GitHub 直装 / 本地自编）、**功能分类**、包名、功能描述、启用状态。
- **分类筛选**：页头下方一排分类 chip（全部 / 插件与市场 / 主题与外观 / UI 增强 / 身份与通信 / 记忆 / 用量与计费 / 工具与能力 / 会话与消息 / 浏览器与网页 / 开发与调试 / 模型与账号接入 / 内容与媒体 / 安全与权限 / 其他），带每类数量，点一下只看该类；分类由插件名称 + 描述关键词自动推断（不读网络、不改插件本身）。
- **开关**：整包启用 / 停用（`setBundleEnabled`）。
- **组件 (N)**：展开该包在 Loader 里的每一行，可逐行启用 / 停用（`setPluginEnabled`）。
- **卸载**：两步确认后调用 `removeBundle`，移除 profile 依赖；插件文件与数据可能保留。
- **刷新**：重新读取宿主清单。读取失败时在页面上显示原因，面板用错误边界兜底，不会白屏。

## 安装

需要一个已经能正常启动的 DeepSeek Harness（桌面版或 web 版 profile，DSH 0.2.1 系列），以及一个可写的 profile。

1. 取到本目录：

   ```bash
   git clone https://github.com/DDTomTom/dsh-plugin-manager.git
   ```

2. 在 DSH 会话里用插件管理器安装这个**目录**（bundle 安装，目标填绝对路径），例如：

   ```
   plugin_manager → action: install_bundle → target: /绝对路径/dsh-plugin-manager
   ```

3. 装完刷新页面（Web 版）/ 重开窗口（桌面版）。侧栏底部、既有「插件市场」的下一行会出现「插件管理」。

升级：改完源码后先 `remove_bundle` 再 `install_bundle`（本包是目录 link 安装时可直接改文件，再整页刷新）。

## 使用

- 打开：点侧栏「插件管理」。
- 分类：点 chip 过滤；分类是关键词启发式（标题 / 描述 / 包名），新插件可能落到「其他」，可以在 `client.js` 的 `CATEGORIES` 里补关键词。
- 启停：卡片左侧开关即整包开关；「组件 (N)」里的开关只控制单个 Loader 行。
- 卸载：点「卸载」→ 变成「确认卸载」→ 再点一次才真正删除；点「取消」放弃。
- 操作结果会在面板底部以提示条给出：已生效 / 已保存，重启 DSH 后生效 / 已被更上层覆盖 / 操作失败。

## 开关快照（一键恢复）

- **记住当前**：点快照栏的「记住当前」，名称默认 `快照 YYYY-MM-DD HH:mm`（本地时间，可改），保存时会记录当前 profile 全部 bundle 的开关以及每个 bundle 内组件行的开关。
- **查看 / 删除**：点「快照 (n)」展开列表（最新在前）；每条显示名称、本地时间、启用数与总数。删除两步：点「删除」变成「确认删除」，再点一次才真正删除，点其它位置取消确认。
- **恢复**：点「恢复」后先把当前状态自动存成 `恢复前 MM-DD HH:mm` 快照，再按快照顺序逐项调用 `setBundleEnabled` / `setPluginEnabled`，只改状态不同的项；当前清单里已不存在的 bundle 计为跳过（未安装）。单项失败不会中断整体，全部结束后刷新清单并给出「已恢复 / 跳过 / 失败」统计，需重启的项会额外提示。
- **存储**：快照存在当前浏览器 origin 的 `localStorage`，键为 `dsh-plugin-manager:snapshots:v1`，JSON 数组、最新在前、最多保留 20 条；损坏或不可解析的数据按空列表处理。Web 版与桌面版不共享快照。

## 来源徽标怎么判断

| 徽标 | 判断依据（bundle `source`） |
| --- | --- |
| 本地自编 | `link:<绝对路径>` |
| GitHub 直装 | `github:<owner>/<repo>#<sha>` |
| npm 市场 | 其它 npm 规格（`name@version` / `name@^version`） |

## 兼容性

- DSH 0.2.1 系列（在 0.2.1-rc.3 desktop profile 上实测）。
- 只提供 Web 侧 UI（`dsh.client.platform: "web"`），Host 半边不做任何事。

## 已知限制

- 列表以 **bundle** 为单位；没有 bundle patch 的裸依赖不会单独成卡。
- 分类是**关键词启发式**，不是插件自带元数据：判定结果可能和你的直觉不同（例如「余额挂件」归 UI 增强而不是用量与计费）。分类名与关键词都写在 `client.js` 顶部的 `CATEGORIES` 数组里，改完刷新即可。
- 客户端代码改动需要整页刷新（Ctrl+R）才会加载新版 `client.js`；桌面版重开更稳。
- 卸载不备份，删了就删了；删前请确认还能重装。
- 只在深色主题下做视觉验证；面板只使用 `--dsw-alias-*` 主题 token，浅色主题理论可读但未单独验证。
- 开关快照存在浏览器本地（见上节）：换浏览器、换 origin（Web / 桌面）或清理站点数据后不可用；快照只记录开关状态，不含插件配置和分类筛选。

## 目录结构

```
package.json        # dsh.bundle + dsh.client 清单
cordis.patch.yml    # 插入 dsh-plugin-manager 一行
index.js            # Host 半边（空实现）
client.js           # 侧栏入口 + 管理器面板
locale/zh.json      # 插件元数据（中文标题 / 描述）
locale/en.json      # 插件元数据（英文）
icon.svg            # 图标
```

## English

A sidebar plugin manager for DeepSeek Harness: lists every non-native plugin installed in the current profile (market, npm, GitHub, or locally linked), shows a short description and source badge, filters them by inferred function category, and lets you enable, disable, or uninstall each bundle (plus its individual loader rows) from one panel.

Snapshots: "Remember current" stores the enabled/disabled state of every profile bundle and its component rows in browser `localStorage` (key `dsh-plugin-manager:snapshots:v1`, latest 20, newest first). Restoring first saves a "Before restore" snapshot, then applies only the differences serially and reports applied / skipped / failed / restart counts. Web and desktop profiles do not share snapshots.

Categories are inferred from each plugin's name and description with keyword rules defined in `CATEGORIES` at the top of `client.js`; nothing is fetched from the network and the plugin itself is never modified.

Install it as a bundle by pointing DSH's plugin manager at this directory, then refresh the page. Requires DSH 0.2.1.x.

## License

MIT
