TODO LENS
===

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens) [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.todo-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.todo-lens)

Create a list of keywords at the top of each file. This makes it easy to see how many `Notes` or `TODOs` there are.

### Preview

Code lens & Syntax highlighting
![](https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/sample.png)

### Commands

This extension contributes the following commands to the Command palette.
- `List`: show all the `TODOs` and `notes` in the current file.
![](https://gitlab.com/fooxly/vscode-todo-lens/raw/master/assets/list_sample.gif)

### Config

You can customize the keywords and other stuff with the following settings in your `settings.json`.

| property | type | default | description |
|---|---|---|---|
| todolens.hideWhenZero | boolean | true | Hide the lens if there are no items in the open file |
| todolens.caseSensitive | boolean | false | If the keywords need to be case sensetive |
| todolens.useHighlighting | boolean | true | If you want to use another syntax highlighter you can disable ours |

### Lens

The different types can be set by using `todolens.types` property.
For example:
```json
"todolens.types": [{
  "title": "📝 {0} TODOs",
  "types": [
    "TODO",
    "FIXME"
  ]
},
{
  "title": "📝 {0} Notes",
  "types": [
    "NOTE"
  ]
}]
```

### Syntax Highlighting

For the syntax highlighting you can change the `todolens.highlights` property.
For example:
```json
"todolens.highlights": [{
  "keyword": "TODO",
  "color": "#fff",
  "backgroundColor": "#f2b01f",
  "overviewRulerColor": "rgba(242, 176, 31, 0.8)",
  "isWholeLine": false,
  "colorSpaceAfter": false
},
{
  "keyword": "FIXME",
  "color": "#fff",
  "backgroundColor": "#d85f88",
  "overviewRulerColor": "rgba(216, 95, 136, 0.8)",
  "isWholeLine": false,
  "colorSpaceAfter": false
},
{
  "keyword": "NOTE",
  "color": "#aaa",
  "backgroundColor": "#434343",
  "overviewRulerColor": "rgba(67, 67, 67, 0.8)",
  "isWholeLine": false,
  "colorSpaceAfter": false
}]
```

---

## ❤️ Support our projects

You can support us by donating through BuyMeACoffee [here](https://www.buymeacoffee.com/fooxly).

![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)
