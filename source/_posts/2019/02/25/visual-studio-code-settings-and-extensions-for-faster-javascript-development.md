---
title: 高效开发者是如何个性化 VS Code 插件与配置的？

date: 2019-02-25 10:00:00

tags: [转载, VS Code]

keywords: VS Code

description: 高效开发者是如何个性化 VS Code 插件与配置的？
---

**译者按：** IDE 是生产力的保证！

<!-- more -->

- 原文：[Visual Studio Code Settings and Extensions for Faster JavaScript Development](http://tilomitra.com/vs-code-settings-and-extensions-for-faster-javascript-development/)
- 译者: [Fundebug](https://www.fundebug.com/)

**本文采用意译，版权归原作者所有**

![](https://image.fundebug.com/2019-02-23-01.jpeg)

2 年之前，我放弃了 Sublime Text，选择了[Visual Studio Code](https://code.visualstudio.com/)作为代码编辑器。

我每天花在 VS Code 上的时间长达 5~6 个小时，因此按照我的需求优化 VS Code 配置十分必要。过去这 2 年里，我试过各种各样的插件与配置，而现在我感觉一切都完美了，是时候给大家分享一下我的使用技巧了！

### 插件

VS Code 有着非常丰富的插件，这里我给大家推荐几个我最喜欢的 VS Code 插件。

#### [Prettier Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

**下载量：167 万**

我使用 Prettier 来统一代码风格，当我保存 HTML/CSS/JavaScript 文件时，它会自动调整代码格式。这样，我不用担心代码格式问题了。由于 Prettier 本身不能个性化配置，有时可能会引起不适，但是至少保证团队成员可以轻易统一代码风格。

![](https://image.fundebug.com/2019-02-23-02.png)

#### [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script)

**下载量：119 万**

npm 插件可以检查 package.json 中所定义的 npm 模块与实际安装的 npm 模块是否一致：

- package.json 中定义了，但是实际未安装
- package.json 中未定义，但是实际安装了
- package.json 中定义的版本与实际安装的版本不一致

![](https://image.fundebug.com/2019-02-23-03.png)

#### [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)

**下载量：105 万**

npm Intellisense 插件会为 package.json 建立索引，这样当我 require 某个模块时，它可以自动补全。

![](https://image.fundebug.com/2019-02-23-04.gif)

#### [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)

**下载量：95 万**

Bracket Pair Colorizer 可以为代码中的匹配的括号自动着色，以不同的颜色进行区分，这样我们可以轻易地辨别某个代码块的开始与结束。

![](https://image.fundebug.com/2019-02-23-05.png)

_[Fundebug](https://www.fundebug.com/), 1 代码搞定 BUG 监控！_

#### [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

**下载量：117 万**

Auto Close Tag 插件的功能非常简单，它可以自动补全 HTML/XML 的关闭标签。

![](https://image.fundebug.com/2019-02-23-06.gif)

#### [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

**下载量：164 万**

我非常喜欢 Gitlens，因为它可以帮助我快速理解代码的修改历史。

**Current Line Blame**：查看当前行代码的结尾查看最近一次 commit 的姓名、时间以及信息

![](https://image.fundebug.com/2019-02-23-07.png)

**Current Line Hovers**：在当前行代码的悬浮框查看详细的最近一次的 commit 信息。

![](https://image.fundebug.com/2019-02-23-08.png)

#### [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

**下载量：45 万**

Markdown All in One 插件帮助我编写 README 以及其他 MarkDown 文件。我尤其喜欢它处理列表以及表格的方式。

**自动调整列表的数字序号**

![](https://image.fundebug.com/2019-02-23-09.gif)

**自动格式化表格**

![](https://image.fundebug.com/2019-02-23-10.gif)

### 用户配置

除了安装各种各样的插件，我们还可以通过配置 VS Code 的 User Settings 来个性化我们的 VS Code。

#### 字体设置

我非常喜欢带有 ligatures(合字、连字、连结字或合体字)的字体。ligatures 就是将多于一个字母的合成一个字形。我主要使用[Fira Code](https://github.com/tonsky/FiraCode)作为我编程所使用的字体，如下图中的`=>`与`===`：

![](https://image.fundebug.com/2019-02-24-001.png)

我的字体配置如下:

```json
"editor.fontFamily": "'Fira Code', 'Operator Mono', 'iA Writer Duospace', 'Source Code Pro', Menlo, Monaco, monospace",
"editor.fontLigatures": true
```

关于缩进，我是这样配置的：

```json
 "editor.detectIndentation": true,
 "editor.renderIndentGuides": false,
```

import 路径移动或者重命名时，自动更新:

```json
"javascript.updateImportsOnFileMove.enabled": "always",
```

### user-settings.json

下面是我的 VS Code 的配置文件**user-settings.json**：

```json
{
  "workbench.colorCustomizations": {
    "activityBar.background": "#111111",
    "activityBarBadge.background": "#FFA000",
    "list.activeSelectionForeground": "#FFA000",
    "list.inactiveSelectionForeground": "#FFA000",
    "list.highlightForeground": "#FFA000",
    "scrollbarSlider.activeBackground": "#FFA00050",
    "editorSuggestWidget.highlightForeground": "#FFA000",
    "textLink.foreground": "#FFA000",
    "progressBar.background": "#FFA000",
    "pickerGroup.foreground": "#FFA000",
    "tab.activeBorder": "#FFA000",
    "notificationLink.foreground": "#FFA000",
    "editorWidget.resizeBorder": "#FFA000",
    "editorWidget.border": "#FFA000",
    "settings.modifiedItemIndicator": "#FFA000",
    "settings.headerForeground": "#FFA000",
    "panelTitle.activeBorder": "#FFA000",
    "breadcrumb.activeSelectionForeground": "#FFA000",
    "menu.selectionForeground": "#FFA000",
    "menubar.selectionForeground": "#FFA000"
  },
  "editor.fontSize": 14,
  "editor.lineHeight": 24,
  // These are for subliminal, check them out.
  "editor.hideCursorInOverviewRuler": true,
  "editor.lineNumbers": "on",
  "editor.overviewRulerBorder": false,
  "editor.renderIndentGuides": false,
  "editor.renderLineHighlight": "none",
  "editor.quickSuggestions": true,
  // end subliminal changes
  "editor.fontFamily": "'Fira Code', 'Operator Mono', 'iA Writer Duospace', 'Source Code Pro', Menlo, Monaco, monospace",
  "vsicons.projectDetection.autoReload": true,
  "editor.formatOnPaste": false,
  "editor.formatOnSave": true,
  "editor.fontLigatures": true,
  "prettier.tabWidth": 4,
  "editor.wordWrap": "on",
  "editor.detectIndentation": true,
  "workbench.iconTheme": "eq-material-theme-icons-palenight",
  "editor.minimap.enabled": false,
  "editor.minimap.renderCharacters": false,
  "prettier.parser": "flow",
  "workbench.editor.enablePreview": false,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "jsx-sublime-babel-tags": "javascriptreact"
  },
  "emmet.triggerExpansionOnTab": true,
  "emmet.showExpandedAbbreviation": "never",
  "workbench.statusBar.visible": true,
  "workbench.activityBar.visible": true,
  "workbench.editor.showIcons": false,
  "editor.multiCursorModifier": "ctrlCmd",
  "explorer.confirmDelete": false,
  "window.zoomLevel": 0,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "materialTheme.accent": "Yellow",
  "editor.cursorBlinking": "smooth",
  "editor.fontWeight": "500"
}
```

如果你想知道更多的 VS Code 使用技巧，可以查看[VSCode Can Do That](http://vscodecandothat.com/)。

### 推荐阅读

- [30 个极大提高开发效率的 VS Code 插件](https://blog.fundebug.com/2018/07/24/vs-extensions/)
- [我为什么推荐 Prettier 来统一代码风格](https://blog.fundebug.com/2017/10/23/format-code-use-Prettier/)
