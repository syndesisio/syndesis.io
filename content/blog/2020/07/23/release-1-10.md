---
date: "2020-07-23T07:00:00+01:00"
draft: false
weight: 180
title: "Announcing Syndesis 1.10"
menu:
  topnav:
    parent: blog
---

Syndesis team is happy to announce the release of version 1.10. We've worked hard to bring new features and quite a lot of fixes and improvements. [Download and try version 1.10.0](https://github.com/syndesisio/syndesis/releases/tag/1.10.0) and feel free to submit comments or any issue you may find. We're already at work to bring to you more exciting features in the next release!

## What's new in 1.10.0

Let's quickly recap what new feature you will find in these new release:

* SOAP Connector
* Runtime Dependency Libraries
* Migration to PatternFly 4
* Webhook error handling

We've also dedicated time to fix known issues and prepare the field for 2.0 release that we're planning to release very soon (stay tuned!!). 

#### SOAP Connector

This was a long time and high demand requested feature. Since Syndesis 1.10 you will be able to create connection to **old style web services**. Although the software industry is in love with REST, we know there is a lot of software still "talking" SOAP. We decided to address this need by creating a new connector and let you consume and produce messages from/to SOAP endpoints. 

#### Runtime Dependency Libraries

Before version 1.10 you had no easy way to **include any library into your integration**. We've discussed this topic in a [recent blog and](https://syndesis.io/blog/2020/04/24/extensions/#libraries), since version 1.10, we've added the possibility to include any library dependency that your integration may need. Right before publishing an integration you will have the possibility to include a library dependency that you've previously imported in Syndesis.

#### Migration to PatternFly 4

The most immediate feature you will notice will be the slightly different **look and feel** provided by migrating the UI to [PatternFly 4](https://www.patternfly.org/v4/). Kudos to our UI contributors that have worked on this! 

#### Webhook error handling

Another important improvement we've done is about enhancing the **error handling** in webhook connector. Webhook is a very important input source in our integrations. Enhancing its capability to provide correct error codes will improve the way you make integration by exposing the correct kind of error that may happen.

Thanks to all contributors and look forward to the next release milestone!!