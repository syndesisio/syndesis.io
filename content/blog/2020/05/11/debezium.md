---
date: "2020-05-11T10:00:00+01:00"
draft: false
weight: 180
title: "Change Data Capture connector"
menu:
  topnav:
    parent: blog
---

A couple of weeks ago, [Red Hat celebrated its 2020 summit](https://www.redhat.com/en/summit). The summit is one of the most important events in the IT industry and Syndesis (through its product branded by Red Hat, [Fuse Online](https://www.redhat.com/es/technologies/jboss-middleware/fuse-online)) was there too!

One of the most recurrent pattern we've observed during different sessions was about the usage of changes happening on an application data layer. Those changes are streamed to a topic and provided as event to be consumed by integrations. We'll see how Syndesis and [Debezium](https://debezium.io/), a Change Data Capture software, are a powerful combination that will simplify all that work for you. 

## Change Data Capture

A Change Data Capture (shortly `CDC`) software is a combined set of technologies that tail the database log journal in order to capture the changes happening on any table/collection of the database and present as a stream of events.

These events can be therefore consumed by any application, in our case, any integration that is interested in the changes happening on certain tables.

One of the coolest project on the scene is without any doubt, Debezium, an open source CDC framework. Debezium supports many database, either relational or NOSQL databases.

### Debezium architecture

We won't enter in deep details, but let's have a quick look on how the Debezium ecosystem works:

<div style="text-align: center; margin: 20px 0px;">
    <img src="https://debezium.io/documentation/reference/1.1/_images/debezium-architecture.png" width="1024" />
    <br>
    <span style="font-style:italic;">Figure 1. Debezium high level architecture</span>
</div>

There are two mode supported, the `embedded` mode and the `kafka` mode. The `embedded` is a lighter version that can be used in experiments or if you don't have strict mission critical requirements. The `kafka` mode is where we're mostly interested as it use `Apache Kafka` ecosystem to stream events of a `Kafka` broker using a `Kafka Connect` connector.

Basically, once Debezium is up and running, you can create a connector in order to "tail" any database change and stream changes to a `kafka` topic.

## Debezium connector

As the changes are streamed to a `kafka` topic, it's easy to think we can leverage a Kafka connector and consume them within an integration. It's a fair approach and it will work smoothly: it was the approach shown during the summit.

However, this approach has a couple of limitations:

* You must know beforehand the event schema (the table/collection structure expected)
* The event schema mixes structure and meta information (such as the operation)

Some time ago we started a Debezium connector that solved those limitations. We give to `citizen integrator` the possibility to automatically discover the schema structure while creating the integration. We also provide the operation as a message header, therefore making it easy to use it during the integration composition (ie, through a conditional flow).

### Use case scenario

In order to show how this connector works, let's use a microservice decoupling approach described in this [blog post](https://developers.redhat.com/blog/2019/11/19/decoupling-microservices-with-apache-camel-and-debezium/): this time we'll use the `low code` superpowers of Syndesis though!

In short, we have a `User` microservice that must be notified when a new `Order` is created: the CDC will capture the changes happening on `Order` and Syndesis will take care to call an API exposed by `User`. The code and detailed step to execute this example are provided in this [github repo](https://github.com/squakez/debezium-syndesis-demo).

The first thing to do is to select the topic where the `Order` changes will be streamed.

<div style="text-align: center; margin: 20px 0px;">
    <img src="https://raw.githubusercontent.com/squakez/debezium-syndesis-demo/master/img/1-1-integration-subscribe.png" width="1024" />
    <br>
    <span style="font-style:italic;">Figure 2. Subscribe to a table change</span>
</div>

Then we will filter those actions we're interested: in our case we want to add an `Order` to `User` list when a new `Order` is created, and delete it when it's deleted. A conditional flow will help us to define both flows.

<div style="text-align: center; margin: 20px 0px;">
    <img src="https://raw.githubusercontent.com/squakez/debezium-syndesis-demo/master/img/3-conditions.png" width="1024" />
    <br>
    <span style="font-style:italic;">Figure 3. Filter CREATE and DELETE events only</span>
</div>

In the `CREATE` condition branch we will select the `addOrder` endpoint provided by `User` API.

<div style="text-align: center; margin: 20px 0px;">
    <img src="https://raw.githubusercontent.com/squakez/debezium-syndesis-demo/master/img/6-user-api-addorder.png" width="1024" />
    <br>
    <span style="font-style:italic;">Figure 4. Update user when adding an Order</span>
</div>

Once we choose the operation we must map correctly the fields coming from the event with the fields expected by the API call.

<div style="text-align: center; margin: 20px 0px;">
    <img src="https://raw.githubusercontent.com/squakez/debezium-syndesis-demo/master/img/7-data-mapping.png" width="1024" />
    <br>
    <span style="font-style:italic;">Figure 5. Data mapping between event and API call</span>
</div>

As soon as the integration is up and running, it will be easy to perform some API request and see how the `User` is updated when any `Order` is created or deleted.

Yes, the two microservices are loosely coupled! And, yes! we performed that decoupling without writing a line of code!

### Development status

The actual development can be considered as a POC as it is actually based on `MySQL` database only. However, given the great interest that CDC software is having we are targeting to work during next release and make it a stable development! We'd love to hear any feedback about. You're invited to try and [let us know](https://syndesis.io/community/)!