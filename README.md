TODO LENS
===

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens) [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens)

Highlight all the `TODOs` and `Notes` in your file and get a easy to use and very customizable code lens with a overview of all the thing you have to do.

### Preview

Code lens & Syntax highlighting
![](https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/sample.png)

### Commands

This extension contributes the following commands to the Command palette.
- `List`: show all the `TODOs` and `Notes` in the current file.

![](https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/list_sample.gif)

### Config

You can customize the keywords and other stuff with the following settings in your `settings.json`.

| property | type | default |  options | description |
|---|---|---|---|---|
| todolens.dropdownOrdering | enum | line_numbers_asc | line_numbers_asc<br/>  line_numbers_desc<br/>category | The order in which the items need to be shown in the dropdown |
| todolens.useHighlighting | boolean | true | true<br/>false | If you want to use another syntax highlighter you can disable ours |
| todolens.hideWhenZero | boolean | true | true<br/>false | Hide the lens if there are no items in the open file |

All the different keywords need to be defined in the `todolens.keywords` property. For example:

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

All the lens groups need to be specified in the `todolens.groups` property.
For example:

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

---

## ❤️ Support our projects

You can support us by donating through BuyMeACoffee [here](https://www.buymeacoffee.com/fooxly).

![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)
