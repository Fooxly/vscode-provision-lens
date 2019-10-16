
<h1 align="center">
  <p align="center">
    <a title="Provision" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens">
      <!-- <img src="./assets/readme/provision.png" alt="Provision" width="40%" /> -->
    </a>
  </p>
  <br>
  <p>Provision: Lens</p>
  <p style="color: #A2A2A2; font-size: 18px;">The best way to keep your notes organized</p>
  
  <br>
  <p align="center">
    <a style="color: #3366BB; font-size: 14px; font-weight: normal;" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision">Provision Bundle</a>&nbsp;&nbsp;&nbsp;
    <a style="color: #3366BB; font-size: 14px; font-weight: normal;" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens">Provision: Lens</a>&nbsp;&nbsp;&nbsp;
    <a style="color: #3366BB; font-size: 14px; font-weight: normal;" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-bar">Provision: Bar</a>&nbsp;&nbsp;&nbsp;
    <a style="color: #3366BB; font-size: 14px; font-weight: normal;" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-syntax">Provision: Syntax</a>
  </p>

  [![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
  [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
  [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
  [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
  ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

</h1>
<br/>

```
ext install fooxly.provision-lens
```

<br/>

## Whats new in Provision: Lens 3
* Quicker load and response time 🚀
* Easier to use settings


## Support us
You can support us by donating through [BuyMeACoffee](https://www.buymeacoffee.com/fooxly) or [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE).

<!-- <p align="center">
<a title="BuyMeACoffee" href="https://www.buymeacoffee.com/fooxly">
  <img src="./assets/readme/buymeacoffee.png" alt="BuyMeACoffee" width="25%" style="max-width: 180px" />
</a>&nbsp;&nbsp;
<a title="Patreon" href="https://www.patreon.com">
  <img src="./assets/readme/patreon.png" alt="Patreon" width="25%" style="max-width: 180px"/>
</a>&nbsp;&nbsp;
<a title="PayPal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3GEYSYZFXV9GE">
  <img src="./assets/readme/paypal.png" alt="PayPal" width="25%" style="max-width: 180px" />
</a>
</p> -->

<br/>

# Provision: Lens

`Provision: Lens` provides an `easy to use` and `highly customizable` lens above functions and classes or at the top of files to view the
notes you or your team have left inside the file. This will you `save lots of time searching` for unfolding functions or classes and finding
if there are any notes left. 

A package by [Fooxly](https://www.fooxly.com).

### Features
* Create custom keywords with all the settings you want
* Group keywords together
* Popup with all the notes found inside the file/class/function
* Jump directly to a note
* View all of your notes in a long and complex file **instantly**
* Jump to the next or previous note in the file

### Commands

* `Provision: Help` Instructions on how to create a new keyword or group
* `Provision: List` Shows all the notes in the current file
* `Provision: Previous Note` Move to the **previous** note based on your cursor position
* `Provision: Next Note` Move to the **next** note based on your cursor position

<br/><br/>

// TODO: add examples here

<br/>

## Available Settings

* Jump to the note when there is only a single note found within the file/class/function (`true` by default)
```json
"provision.moveOnSingle": <true|false>
```

* The sorting method used for ordering the popup items (`line_numbers_asc` by default)
```json
"provision.popup.sorting": <"line_numbers_asc"|"line_numbers_asc"|"category">
```

* The display method used for the lenses inside the files (`default` by default)
```json
"provision.lens.displayMethod": <"default"|"file"|"detailed">
```

<br/>

## Setting up Keywords and Groups
You can create a new keyword by following these steps and pasting them inside your `settings.json`.

> **NOTE:** other provision extensions could need other properties inside your keyword or group object.
> For an up to date version of the manual use the `Provision: Help` command or view the manual [here](https://packages.fooxly.com/provision/manual).

###  Step 1
Add a new object inside your `provision.keywords` object. The following properties can be set:

```json
  "TODO": {
    "keyword": "TODO",
    "caseSensitive": true,
    "includesColon": true
  }
```

#### What do the properties do
* `keyword`: The exact keyword which needs to be found inside your files.
* `caseSensitive`: If the keyword needs to be case sensitive or not.
* `includesColon`: If the keyword can only be valid with a colon sign afterwards.

### Step 2
> If you are planning to add the keyword to a group you can skip this step.

Add the `title` property to your newly created keyword.

If you have done this the keyword is correctly added to your setttings.

```json
  "TODO": {
    "keyword": "TODO",
    "caseSensitive": true,
    "includesColon": true,
    "title": {
      "1": "{0} TODO",
      "*": "{0} TODO's"
    },
    "tooltip": "All the todo's and fixme's found in this file"
  }
```

#### What do the properties do
* `title`: An object with the different titles used. `*` is the default text and every other number (the amount of notes found) will be chosen if there is a title.
* `tooltip`: The text shown when hovering over.

### Step 3
> If you did step 2, ignore this step

Add your newly created keyword to an existing group (or create a new one).
This is done by adding the following object to your `provision.groups` setting.

```json
  {
    "keywords": ["TODO", "FIXME"],
    "title": {
      "1": "{0} TODO",
      "*": "{0} TODO's"
    },
    "tooltip": "All the todo's and fixme's found in this file"
  }
```

#### What do the properties do
* `title`: An object with the different titles used. `*` is the default text and every other number (the amount of notes found) will be chosen if there is a title.
* `tooltip`: The text shown when hovering over.

# License

[MIT](LICENSE) &copy; Fooxly