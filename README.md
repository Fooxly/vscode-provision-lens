<h1 align="center">
  <a title="Provision" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens">
    <img src="https://developer.fooxly.com/provision/assets/images/icon.png" alt="Provision" height="150" />
  </a>
  <p>Provision: Lens</p>
  <p style="color: #A2A2A2; font-size: 18px;">The best way to keep your notes organized</p>
  <br>
  <p style="color: #3366BB; font-size: 14px; font-weight: normal;">
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision">Provision Bundle</a>&nbsp;&nbsp;&nbsp;
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens">Provision: Lens</a>&nbsp;&nbsp;&nbsp;
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-bar">Provision: Bar</a>&nbsp;&nbsp;&nbsp;
    <a href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-syntax">Provision: Syntax</a>
  </p>
</h1>

[![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/Fooxly/vscode-provision-lens/blob/master/LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

<br />

```sh
ext install fooxly.provision-lens
```

## What's new in Provision: Lens 3

* Even quicker load and response times 🚀
* Easier configuration

## Support us &nbsp;❤

> <span style="color:#32CD32">**40%**</span> of the revenue made from the support you give us, will be donated to a [charity](https://teamtrees.org)

<p>
  <a title="BuyMeACoffee" href="https://www.buymeacoffee.com/fooxly">
    <img src="https://developer.fooxly.com/general/assets/images/buymeacoffee.png" alt="BuyMeACoffee" width="25%" style="max-width: 180px" />
  </a>&nbsp;&nbsp;
  <a title="Patreon" href="https://www.patreon.com/fooxly">
    <img src="https://developer.fooxly.com/general/assets/images/patreon.png" alt="Patreon" width="25%" style="max-width: 180px"/>
  </a>&nbsp;&nbsp;
  <a title="PayPal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE">
    <img src="https://developer.fooxly.com/general/assets/images/paypal.png" alt="PayPal" width="25%" style="max-width: 180px" />
  </a>
</p>

<br/>

# Provision: Lens

> A package by [Fooxly](https://www.fooxly.com).

**Provision: Lens** provides an **easy to use** and **highly customizable** lens above functions & classes or at the top of file,
to view the notes you or others in your team have left. This will **save you lots of time** searching and unfolding functions
and/or classes to determine if there are any notes left.

## 📐 &nbsp;Features

* Create custom keywords with plenty of customization options
* Group keywords together
* Show pop-ups with every note inside a file/class/function
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

* `provision.lens.displayMethod` Display method used for the lenses inside your files (`"default"` by default)

  ```json
  "provision.lens.displayMethod": <"default"|"file"|"detailed">
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
      }
    }
  }
  ```

  * `keyword` *(optional)*: If the keyword needs to be different from the keywords object key, if it is not set the keywords object key will be used.
  * `caseSensitive` *(optional)*: Whether or not the keyword needs to be case sensitive. (`true` by default)
  * `includesColon` *(optional)*: Whether or not the keyword is only valid with a colon sign suffix. (`true` by default)
  * `title` *(optional)*: An object with the titles used for the amount of notes. `*` is the fallback text if the specific number is not listed. To show the amount use `{0}` inside the string.

* `provision.groups`: Group certain keywords together with one title and tooltip

  ```json
  "provision.groups": [{
    "keywords": [<"keyword">, <"keyword">],
    "title": {
      "1": <"string">,
      "*": <"string">
    }
  }]
  ```

  * `keywords`: Array of keywords to group.
  * `title`: An object with the titles used for the amount of notes. `*` is the fallback text if the specific number is not listed. To show the amount use `{0}` inside the string.

## License

[MIT](https://github.com/Fooxly/vscode-provision-lens/blob/master/LICENSE) &copy; Fooxly
