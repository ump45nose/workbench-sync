# workbench-sync

SillyTavern 服务端插件：把世界书、角色、预设、连接、Persona、大纲和数据库表以可读写文件的形式提供给 IDE（配套 VS Code 扩展）。本仓库由 [ump45nose/SillyTavern](https://github.com/ump45nose/SillyTavern) 的 `workbench` 分支自动构建发布，构建来源记录在 `.source-sha`。

## 安装

1. 把本仓库克隆到酒馆的 `plugins` 目录（或仅下载 `index.mjs` 放入 `plugins/workbench-sync/`）：

   ```bash
   git clone https://github.com/ump45nose/workbench-sync.git plugins/workbench-sync
   ```

2. 确认酒馆 `config.yaml` 中 `enableServerPlugins: true`。
3. 重启酒馆；日志出现 `Initializing plugin from .../workbench-sync/index.mjs` 即已加载。

路由挂在 `/api/plugins/workbench-sync/`，位于酒馆登录、Basic Auth 与 CSRF 中间件之后。配套前端扩展见 [noval-workbench](https://github.com/ump45nose/noval-workbench)。
