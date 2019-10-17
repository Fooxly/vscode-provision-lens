<h1 align="center">
  <a title="Provision" href="https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens">
    <img src="./assets/readme/provision.png" alt="Provision" height="150" />
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

  [![Version](https://vsmarketplacebadge.apphb.com/version-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
  [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
  [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/fooxly.provision-lens.svg)](https://marketplace.visualstudio.com/items?itemName=fooxly.provision-lens)
  [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
  ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
</h1>

## Getting Started Guide

### Setting up Keywords and Groups

You can create a new keyword by following the steps below and configuring them inside your `settings.json`.

> **Note**: Other Provision extensions might require other properties inside your `keywords` or `groups` configuration. For an up-to-date
> version of the manual use the `Provision: Help` command or view the manual [here](https://developers.fooxly.com/extensions/provision/manual).

#### Step 1

Add a new object to your `provision.keywords` configuration. The following properties can be set:

```json
"provision.keywords": {
  "TODO": {
    "keyword": "TODO",
    "caseSensitive": true,
    "includesColon": true
  }
}
```

#### Step 2

##### Single Keyword

Add the `title` property to your newly created keyword.
You can configure the titles for the lens for the amount of notes in a file/class/function.

```json
  "TODO": {
    "keyword": "TODO",
    "caseSensitive": true,
    "includesColon": true,
    "title": {
      "1": "{0} TODO",
      "*": "{0} TODO's"
    }
  }
```

##### Grouped Keyword

Add your newly created keyword to an existing group (or create a new one).
This is done by adding the following object to your `provision.groups` configuration.

```json
  {
    "keywords": ["TODO", "FIXME"],
    "title": {
      "1": "{0} TODO",
      "*": "{0} TODO's"
    }
  }
```

> **Note**: The keyword that you add to the keywords array needs to be the same as the `keyword object key` *(highlighted green)*
> inside your `provision.keywords` object and **NOT** the `keyword object keyword property` *(highlighted red)*.

<img src="./assets/keyword_info.png" alt="Guide" width="80%" style="max-width: 400px" />
