# 插件管理器 · DSH Plugin Manager

一个给 DeepSeek Harness 用的侧栏插件管理器：把当前 profile 里**所有非 DSH 原生**的插件收进一个页面，逐条看描述、启用 / 停用、卸载。

![icon](icon.svg)

- 侧栏入口位于「插件市场」正下方（`sidebar.footer.action`，order 10），点击后在主区域打开管理器。
- 数据来自 DSH 宿主的 `pluginManager` 服务（`listBundles` / `listPlugins`），只展示 `availability === "profile"` 的 bundle —— 也就是你自己装进来的那些：插件市场下载、npm 直装、GitHub 直装、本地 link 自编，都在列表里。
- 每张卡片显示：标题、版本、来源徽标（npm 市场 / GitHub 直装 / 本地自编）、包名、功能描述、启用状态。
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
- 启停：卡片左侧开关即整包开关；「组件 (N)」里的开关只控制单个 Loader 行。
- 卸载：点「卸载」→ 变成「确认卸载」→ 再点一次才真正删除；点「取消」放弃。
- 操作结果会在面板底部以提示条给出：已生效 / 已保存，重启 DSH 后生效 / 已被更上层覆盖 / 操作失败。

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
- 客户端代码改动需要整页刷新（Ctrl+R）才会加载新版 `client.js`；桌面版重开更稳。
- 卸载不备份，删了就删了；删前请确认还能重装。
- 只在深色主题下做视觉验证；面板只使用 `--dsw-alias-*` 主题 token，浅色主题理论可读但未单独验证。

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

A sidebar plugin manager for DeepSeek Harness: lists every non-native plugin installed in the current profile (market, npm, GitHub, or locally linked), shows a short description and source badge, and lets you enable, disable, or uninstall each bundle (plus its individual loader rows) from one panel.

Install it as a bundle by pointing DSH's plugin manager at this directory, then refresh the page. Requires DSH 0.2.1.x.

## License

MIT
