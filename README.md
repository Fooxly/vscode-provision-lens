<p align="center">
  <a title="Learn more about the Provision Lens" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens">
    <img src="https://gitlab.com/fooxly/vscode-provision-lens/raw/master/assets/icon_banner.png" alt="Provision Lens Logo" width="50%" />
  </a>
</p><br/>

[![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# 🚀 Recently Added

* Lenses for each class and function (can be disabled)
* Show **highlights** of the keywords specified
* Show all the keywords of the current files in a dropdown
* Localization support
* `Next Note` and `Previous Note` commands (also available in context menu) based on the current cursor position

<p align="center">
  <img src="https://gitlab.com/fooxly/vscode-provision-lens/raw/master/assets/list_sample.gif" alt="Provision Lens Example" />
</p>

# 🔍 Provision Lens

The `Provision Lens` provides a simple way to view all of your `notes` in your workspace based on keywords. You'll find one or more lenses at the top of each file with a quick overview of all your notes.

A package by [Fooxly](https://www.fooxly.com).

## 📕 Features

* Overview of the keywords provided in your settings.json
* **Customizable** syntax highlighting for the keywords with colors in the **overview ruler**
* **Jump** between notes by using the context menu or commands
* **View** all of your notes in a long and complex file (unless ignored) in just seconds

## 📐 Configuration

### Commands

* `Provision Lens: List` Shows all the notes in the current file
* `Provision Lens: Previous Note` Move to the **previous** note based on your cursor position
* `Provision Lens: Next Note` Move to the **next** note based on your cursor position

### Config

You can customize your keywords for the lens and lots of other stuff in your `settings.json` using the following options:

| property | type | default |  options | description |
|---|---|---|---|---|
| provisionlens.dropdownOrdering | enum | line_numbers_asc | line_numbers_asc<br/>  line_numbers_desc<br/>category | The order in which the items need to be shown in the dropdown |
| provisionlens.useHighlighting | boolean | true | true<br/>false | If you want to use another syntax highlighter you can disable ours |
| provisionlens.hideWhenZero | boolean | true | true<br/>false | Hide the lens if there are no items in the open file |
| provisionlens.ignoreFiles | array | [.gitignore, .ignore] | - | A list of the ignore files you use (in your workspace or by default) |
| provisionlens.showLensAboveClasses | boolean | true | true<br/>false | Show a lens above each class |
| provisionlens.showLensAboveFunctions | boolean | true | true<br/>false | Show a lens above each function |

#### Keywords

All keywords need to be defined using the `provisionlens.keywords` property.

**Note**: The keywords are case insensitive.

**Example**:

```json
"provisionlens.keywords": {
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

#### Groups

All lens groups need to be defined using the `provisionlens.groups` property.

**Note**: The keywords are case insensitive, just make sure the keyword is defined using the [keywords](#keywords) property.

**Example**:

```json
"provisionlens.groups": [{
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

## 🖥️ Preview

![Preview](https://gitlab.com/fooxly/vscode-provision-lens/raw/master/assets/sample.png)

## ❤️ Support our projects

You can support us by donating through BuyMeACoffee [here](https://www.buymeacoffee.com/fooxly).

![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)
