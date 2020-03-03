---
date: "2020-03-02T12:00:00+01:00"
draft: false
weight: 180
title: "Connection autodiscovery"
menu:
  topnav:
    parent: blog
---

One of the most important reason why we are developing an `IPAAS` is to make citizen integrators life simpler. This persona must be able to quickly create integrations by composing heterogeneous sources of data. One of the typical gap that she finds is to be aware of which are those sources available. The expected scenario is to know before-hand the host names of databases, queues, REST endpoints...

## Datasource dashboard

What if this information is automatically discovered by the platform? The `citizen integrator` will have a dashboard full of all the different data sources available. She _won't need any longer to ask_ "what" is available, or "where" is it something located.

The "connection autodiscovery" feature introduced in Syndesis 1.9 is going to solve the problem. We introduced a mechanism that will read the data source connection information dynamically and will show up to the user:

![Discovering a Kafka broker](../kafka-autodiscovery.png)

_Figure 1. Discovering a Kafka broker_

The only thing you'll need to do is adding some configuration and provide a simple development, as explained in the [connection autodiscovery documentation](/docs/autodiscovery/).

## Scenario one: a company service registry

If you've read the development documentation, you've seen that the sample proposed is talking about a generic "service registry". If your company has a sort of directory where all the sources are listed, then you can think to point all your queries to this sort of simple registry.

## Scenario two: all your PAAS services

However, as the main target of Syndesis is to run over a PAAS, we think is more natural to query directly the platform, and list the available data sources. Thanks to the K8S RBAC and namespaces, we will also be able to secure the access only to the authorized resources. We have implemented the `Kafka` connector. You can have a look at the [quickstart](https://github.com/syndesisio/syndesis-quickstarts/tree/master/kafka-autodiscovery) to see how it's realized and watch the demo to see how it's working.

<iframe width="800" height="480" src="https://www.youtube.com/embed/kxqjeXcfMY0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>