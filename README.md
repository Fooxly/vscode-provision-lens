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

> **Note**: The [keywords](#keywords) and [groups](#groups) properties are required.

| property                             | type      | default               | options                                                  | description |
| ---                                  | ---       | ---                   | ---                                                      | ----        |
| provisionlens.keywords               | object    | *check below*         | [keywords](#Keywords)                                    | Object with keywords to use |
| provisionlens.groups                 | [object]  | *check below*         | [groups](#Groups)                                        | Array of group names with designated keywords (case sensitive) |
| provisionlens.translations           | object    | *check below*         | [translations](#Translations)                            | Object with translations |
| provisionlens.overview               | enum      | auto                  | auto, both, always-both, statusbar, top, always-top, off | Location in editor to show a quick overview of all notes |
| provisionlens.position               | enum      | both                  | above_functions, above_classes, both, off                | Show a seperate lens above functions and/or classes |
| provisionlens.highlighting           | boolean   | true                  | true, false                                              | Enable/disable syntax highlighting |
| provisionlens.alwaysShow             | boolean   | false                 | true, false                                              | Show the lens when there are no notes |
| provisionlens.instant                | boolean   | true                  | true, false                                              | Jump to a note instead of showing the dropdown when there is only one |
| provisionlens.dropdownType           | enum      | normal                | compact, normal, smart, smart_compact                    | The appereance of the dropdown items |
| provisionlens.dropdownOrder          | enum      | line_numbers_asc      | line_numbers_asc, line_numbers_des, category             | The order in which items need to be shown in the dropdown |
| provisionlens.whitelist              | [string]  | []                    | -                                                        | Array of files/folders for the lens to whitelist (relative to project root) |
| provisionlens.ignoreFiles            | [string]  | [.gitignore, .ignore] | -                                                        | Array of ignore files for the lens to use as blacklist (relative to project root) |

#### Keywords

All keywords need to be defined using the `provisionlens.keywords` property. You can customize keywords using the following options:

| property        | type    | default       | options                                                                     | description |
| ---             | ---     | ---           | ---                                                                         | ---         |
| color           | string  | *check below* | [color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) | Text color when highlighted |
| rulerPlacement  | enum    | right         | left, center, right, full, off                                              | The placement in the ruler |
| rulerColor      | string  | *check below* | [color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) | Color in overview ruler |
| backgroundColor | string  | *check below* | [color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) | Background color when highlighted |
| highlight       | enum    | keyword       | keyword, line, off                                                          | Type of highlighting |
| useColons       | boolean | true          | true, false                                                                 | Use a `:` to define |
| caseSensitive   | boolean | true          | true, false                                                                 | Use case sensitive detection |

**Default**:

```json
"provisionlens.keywords": {
  "TODO": {
    "color": "#fff",
    "backgroundColor": "#f2b01f",
    "rulerPlacement": "right",
    "rulerColor": "rgba(242, 176, 31, 0.8)",
    "highlight": "keyword",
    "useColons": true,
    "caseSensitive": true
  },
  "FIXME": {
    "color": "#fff",
    "backgroundColor": "#d85f88",
    "rulerPlacement": "right",
    "rulerColor": "rgba(216, 95, 136, 0.8)",
    "highlight": "keyword",
    "useColons": true,
    "caseSensitive": false
  },
  "NOTE": {
    "color": "#aaa",
    "backgroundColor": "#434343",
    "rulerPlacement": "right",
    "rulerColor": "rgba(67, 67, 67, 0.8)",
    "highlight": "keyword",
    "useColons": true,
    "caseSensitive": true
  }
}
```

#### Groups

All lens groups need to be defined using the `provisionlens.groups` property. You can customize groups using the following options:

> **Note**: The keywords are case sensitive, also make sure all keywords are defined using the [keywords](#keywords) property.

| property        | type           | default       | options                                         | description |
| ---             | ---            | ---           | ---                                             | ---         |
| keywords        | [string]       | *check below* | -                                               | Array of keywords to assign (case sensitive) |
| tooltip         | string         | *check below* | -                                               | Description used by tooltips |
| text            | object, string | *check below* | `string` or `{ one: string, multiple: string }` | Text for one or multiple results |

**Default**:

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
  "text": {
    "one": "📝 {0} Note",
    "multiple": "📝 {0} Notes"
  }
}]
```

#### Translations

Every line of text provided by this extension can be altered using the `provisionlens.translations` property.

**Default**:

```json
"provisionlens.translations": {
  "noNoteFound": "There are no notes past the current point",
  "dropdownText": "Notes found:",
  "key_not_found": "The following keyword is not defined: "
}
```

## 🖥️ Preview

![Preview](https://gitlab.com/fooxly/vscode-provision-lens/raw/master/assets/sample.png)

## ❤️ Support our projects

You can support us by donating through [BuyMeACoffee](https://www.buymeacoffee.com/fooxly) or [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE).

[![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/fooxly)&nbsp;&nbsp;&nbsp;
[![PayPal](https://i.imgur.com/T3AmGss.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE)
