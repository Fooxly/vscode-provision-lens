<h1 align="center">
  <p align="center">
    <a title="ProVision" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-bar">
      <img src="https://assets.fooxly.com/extensions/provision/general/icon.png" alt="ProVision" height="150" />
    </a>
  </p>
  <p>ProVision: Bar</p>
  <p style="color: #A2A2A2; font-size: 18px;">The best way to keep your notes organized</p>
  <br>
  <p style="color: #3366BB; font-size: 14px; font-weight: normal;">
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision">Provision Bundle</a>&nbsp;&nbsp;&nbsp;
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens">Provision: Lens</a>&nbsp;&nbsp;&nbsp;
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-bar">Provision: Bar</a>&nbsp;&nbsp;&nbsp;
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-syntax">Provision: Syntax</a>
  </p>
</h1>

[![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.provision-bar.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-bar)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.provision-bar.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-bar)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.provision-bar.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-bar)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/Fooxly/vscode-provision-bar/blob/master/LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

<br />

```sh
ext install fooxly.provision-bar
```

<br />
<p align="center">
  <img src="https://assets.fooxly.com/extensions/provision/bar/example.gif" alt="Preview" width="400" />
</p>
<br />

## What's new in Provision: Bar 3

* Even quicker load and response times 🚀
* Easier configuration

## ️️❤️&nbsp; Support us

> About **40%** of your donation goes to one of the charities we support. For further information or questions please visit [our website](https://www.fooxly.com/charity) or contact us via [charity@fooxly.com](mailto:charity@fooxly.com).

<p>
  <a title="BuyMeACoffee" href="https://www.buymeacoffee.com/fooxly">
    <img src="https://assets.fooxly.com/third_party/buymeacoffee.png" alt="BuyMeACoffee" width="180" height="43" />
  </a>&nbsp;&nbsp;
  <a title="Patreon" href="https://www.patreon.com/fooxly">
    <img src="https://assets.fooxly.com/third_party/patreon.png" alt="Patreon" width="180" height="43" />
  </a>&nbsp;&nbsp;
  <a title="PayPal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE">
    <img src="https://assets.fooxly.com/third_party/paypal.png" alt="PayPal" width="180" height="43" />
  </a>
</p>

<br/>

# Provision: Bar

> A package by [Fooxly](https://www.fooxly.com).

**Provision: Bar** provides an **easy to use** and **highly customizable** items to your statusbar
to view the notes you or others in your team have left. This will **save you lots of time** searching and unfolding functions
and/or classes to determine if there are any notes left.

## 📐 &nbsp;Features

* Create custom keywords with plenty of customization options
* Group keywords together
* Show pop-ups with every note inside a file
* Jump directly to a note
* View all of your notes in a long and complex file **instantly**

## 📙 &nbsp;How to use

Check out our [Getting Started](https://developer.fooxly.com/extensions/provision/guide) guide or use `Help: Provision` for more information.

## 📕 &nbsp;Commands

* `Help: Provision` Instructions on how to create a new keyword or group
* `Provision: List` Show all notes in the current file

## ⚙️ &nbsp;Available Settings

* `provision.moveOnSingle`: Jump instantly to a note when there are no others inside the file/class/function (`true` by default)

  ```json
  "provision.moveOnSingle": <true|false>
  ```

* `provision.popup.sorting`: Sorting method used to order the pop-up items (`"line_numbers_asc"` by default)

  ```json
  "provision.popup.sorting": <"line_numbers_asc"|"line_numbers_asc"|"category">
  ```

* `provision.bar.showWhenEmpty`: Show a statusbar button when the amount of items is 0 (`false` by default)

  ```json
  "provision.bar.showWhenEmpty": <true|false>
  ```

* `provision.bar.position`: The position for the statusbar buttons (`left` by default)

  ```json
  "provision.bar.position": <"left"|"right">
  ```

* `provision.bar.priority`: The priority given to the statusbar buttons (`1` by default)

  ```json
  "provision.bar.priority": <number>
  ```

* `provision.keywords`: Keywords to look for with a specific configuration

  ```json
  "provision.keywords": {
    "NOTE": {
      "keyword": <"string">,
      "caseSensitive": <true|false>,
      "includesColon": <true|false>,
      "title": {
        "1": <"string">,
        "*": <"string">
      },
      "tooltip": <"string">
    }
  }
  ```

  * `keyword` *(optional)*: If the keyword needs to be different from the keywords object key, if it is not set the keywords object key will be used.
  * `caseSensitive` *(optional)*: Whether or not the keyword needs to be case sensitive. (`true` by default)
  * `includesColon` *(optional)*: Whether or not the keyword is only valid with a colon sign suffix. (`true` by default)
  * `title` *(optional)*: An object with the titles used for the amount of notes. `*` is the fallback text if the specific number is not listed. To show the amount use `{0}` inside the string.
  * `tooltip` *(optional)*: An string shown when hovering on the statusbar items.

* `provision.groups`: Group certain keywords together with one title and tooltip

  ```json
  "provision.groups": [{
    "keywords": [<"keyword">, <"keyword">],
    "title": {
      "1": <"string">,
      "*": <"string">
    },
    "tooltip": <"string">
  }]
  ```

  * `keywords`: Array of keywords to group.
  * `title`: An object with the titles used for the amount of notes. `*` is the fallback text if the specific number is not listed. To show the amount use `{0}` inside the string.
  * `tooltip`: An string shown when hovering on the statusbar items.

## License

[MIT](https://github.com/Fooxly/vscode-provision-bar/blob/master/LICENSE) &copy; Fooxly
