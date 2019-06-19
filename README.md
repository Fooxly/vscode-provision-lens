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

| property                             | type    | default               | options                                      | description |
| ---                                  | ---     | ---                   | ---                                          | ----        |
| provisionlens.keywords               | array   | *check below*         | *check below*                                | Array of keywords to use (case insensitive) |
| provisionlens.groups                 | array   | *check below*         | *check below*                                | Array of group names with designated keywords (case insensitive) |
| provisionlens.translations           | object  | *check below*         | *check below*                                | Object with translations |
| provisionlens.fileOverview           | enum    | line_numbers_asc      | statusbar, top, both, off                    | Location in editor to show a quick overview of all notes |
| provisionlens.dropdownOrdering       | enum    | line_numbers_asc      | line_numbers_asc, line_numbers_des, category | The order in which items need to be shown in the dropdown |
| provisionlens.useHighlighting        | boolean | true                  | true, false                                  | Enable/disable syntax highlighting |
| provisionlens.hideWhenZero           | boolean | true                  | true, false                                  | Hide the lens when there are no notes |
| provisionlens.ignoreFiles            | array   | [.gitignore, .ignore] | -                                            | Array of ignore files for the lens to blacklist (relative to project root) |
| provisionlens.include                | array   | []                    | -                                            | Array of files/folders for the lens to whitelist (relative to project root, overrides blacklist) |
| provisionlens.showLensAboveClasses   | boolean | true                  | true, false                                  | Show a seperate lens above each class |
| provisionlens.showLensAboveFunctions | boolean | true                  | true, false                                  | Show a seperate lens above each function |

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
    "useColons": true,
    "caseSensitive": true
  },
  "FIXME": {
    "color": "#fff",
    "backgroundColor": "#d85f88",
    "overviewRulerColor": "rgba(216, 95, 136, 0.8)",
    "isWholeLine": false,
    "useColons": true,
    "caseSensitive": true
  },
  "NOTE": {
    "color": "#aaa",
    "backgroundColor": "#434343",
    "overviewRulerColor": "rgba(67, 67, 67, 0.8)",
    "isWholeLine": false,
    "useColons": true,
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
  "tooltip": "These are all the 'TODO' and 'FIXME' notes in this file",
  "text": {
    "one": "📝 {0} TODO",
    "multiple": "📝 {0} TODOs"
  }
},
{
  "keywords": ["NOTE"],
  "tooltip": "These are all the notes in this file",
  "text": "📝 {0} Notes"
}]
```

#### Translations

All the translations can be changed using the `provisionlens.translations` property.

**Example**:

```json
"provisionlens.translations": {
  "noNoteFound": "No notes found past the current point"
}
```

## 🖥️ Preview

![Preview](https://gitlab.com/fooxly/vscode-provision-lens/raw/master/assets/sample.png)

## ❤️ Support our projects

You can support us by donating through [BuyMeACoffee](https://www.buymeacoffee.com/fooxly) or [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE).

[![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/fooxly)&nbsp;&nbsp;&nbsp;
[![PayPal](https://i.imgur.com/T3AmGss.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE)
