---
bref: ""
draft: false
title: "Extensions"
weight: 40
collapsible: true
pre: "<i class='fas fa-window-restore'></i>"
---

Syndesis is a platform designed to provide maximum flexibility to your integrations. Most of the time you will be fine using the connectors and other tools provided, but, in a certain situation you may feel you need something specific to your business goal. For that situation we've thought to provide a special mechanism called `Extension`.

An extension is a dedicate development that will enhance the functionality of your platform and integration runtime by adding any custom behavior you need. You can import that special behavior on your Syndesis installation. 

We provide three way to add extensions:

- Connector
- Step
- Library

#### Connector

You may be already familiar with the concept of a `Connector` in Syndesis. With the extension you may include a new connector any time, not necessarily during platform build time.

#### Step

You can develop an extension to be an extra `Step` to be used in your integration. Do you need some special logic to be performed? Any EIP we're missing? Then, this is the best way to enhance your integrations.

#### Library

Through a library you will be able to include in your integration runtime classpath any java dependency. You may need this if you're using an SQL `jdbc driver` or in general when you want to use a custom runtime library.

We do have already a list of extensions you may use. And you can follow the guide to know how to develop your own extension.
