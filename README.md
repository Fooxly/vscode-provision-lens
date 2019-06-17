![](https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/icon_banner.png=100x100)
<p align="center">
  <br />
  <a title="Learn more about the TODO Lens" href="https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens"><img src="https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/icon_banner.png" alt="TODO Lens Logo" width="50%" /></a>
</p><br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens) [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens)

# What's new
* Lenses for each class and function (can be disabled)
* Show **highlights** of the keywords specified
* Show all the keywords of the current files in a dropdown
* Localization support
* `Next Note` and `Previous Note` commands (also available in context menu) based on the current cursor position

<br/>

![](https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/list_sample.gif)

<br/>

# TODO Lens

The `TODO Lens` provides a simple way to view all of your `notes` in your workspace. At the top of each file (if they are not ignored by the `.gitignore` or `.ignore` file) there will be a single or multiple lenses with a overview of all the notes found in the current file.

Here are some functions the extension provides:
* Overview of the keywords provided in the settings.json
* **Customizable** syntax highlighting for the keywords with colors in the **overview ruler**
* **Jump** between notes by using the context menu or commands
* **View** all your notes in a long and complex file in just seconds

## Features

### Commands
* `TODO Lens: List` Shows all the notes in the current file
* `TODO Lens: Previous Note` Move tho the **previous** note based on the cursor position
* `TODO Lens: Next Note` Move tho the **next** note based on the cursor position

### Config

You can customize the keywords and other stuff with the following settings in your `settings.json`.

| property | type | default |  options | description |
|---|---|---|---|---|
| todolens.dropdownOrdering | enum | line_numbers_asc | line_numbers_asc<br/>  line_numbers_desc<br/>category | The order in which the items need to be shown in the dropdown |
| todolens.useHighlighting | boolean | true | true<br/>false | If you want to use another syntax highlighter you can disable ours |
| todolens.hideWhenZero | boolean | true | true<br/>false | Hide the lens if there are no items in the open file |
| todolens.ignoreFiles | array | [.gitignore, .ignore] | - | A list of the ignore files you use (in your workspace or by default) |
| todolens.showLensAboveClasses | boolean | true | true<br/>false | Show a lens above each class |
| todolens.showLensAboveFunctions | boolean | true | true<br/>false | Show a lens above each function |

<br/>

All the different keywords need to be defined in the `todolens.keywords` property. <br/> For example:

```json
"todolens.keywords": {
  "TODO": {
    "color": "#fff",
    "backgroundColor": "#f2b01f",
    "overviewRulerColor": "rgba(242, 176, 31, 0.8)",
    "isWholeLine": false,
    "colorSpaceAfter": false,
    "caseSensitive": true
  },
  "FIXME": {
    "color": "#fff",
    "backgroundColor": "#d85f88",
    "overviewRulerColor": "rgba(216, 95, 136, 0.8)",
    "isWholeLine": false,
    "colorSpaceAfter": false,
    "caseSensitive": true
  },
  "NOTE": {
    "color": "#aaa",
    "backgroundColor": "#434343",
    "overviewRulerColor": "rgba(67, 67, 67, 0.8)",
    "isWholeLine": false,
    "colorSpaceAfter": false,
    "caseSensitive": true
  }
}
```

*`NOTE:`* The keyword property is case insensitive, this is handeld in the code itself.
<br/><br/>

All the lens groups need to be specified in the `todolens.groups` property.
<br/> For example:

```json
"todolens.groups": [{
  "keywords": ["TODO", "FIXME"],
  "text": {
    "one": "📝 {0} TODO",
    "multiple": "📝 {0} TODOs"
  }
},
{
  "keywords": ["NOTE"],
  "text": "📝 {0} Notes"
}]
```

*`NOTE:`* The keywords property is case insensitive, this is handeld in the code itself.
You just need to make sure the keyword exists in the keywords property.

<br/>

### Preview

![](https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/sample.png)

<br/>

---
## ❤️ Support our projects

You can support us by donating through BuyMeACoffee [here](https://www.buymeacoffee.com/fooxly).

![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)