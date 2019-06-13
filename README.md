TODO LENS
===

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

Create a list of keywords at the top of each file. This makes it easy to see how many `Notes` or `TODOs` there are.

### Preview

![](https://gitlab.com/fooxly/todo-lens/raw/master/assets/sample.png)


### Commands

This extension contributes the following commands to the Command palette.
- `List`: show all the `TODOs` and `notes` in the current file.
![](https://gitlab.com/fooxly/todo-lens/raw/master/assets/list_sample.gif)

### Config

You can customize the keywords and other stuff with the following settings in your `settings.json`.

| property | type | default | description |
|---|---|---|---|
| todolens.hideWhenZero | boolean | true | Hide the lens if there are no items in the open file |
| todolens.caseSensitive | boolean | false | If the keywords need to be case sensetive |

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

---

## :heart: Support our projects

You can support us by donating through BuyMeACoffee [here](https://www.buymeacoffee.com/fooxly).

![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)
