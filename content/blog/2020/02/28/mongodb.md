---
date: "2020-02-28T12:00:00+01:00"
draft: false
weight: 180
title: "MongoDB connector General Available"
menu:
  topnav:
    parent: blog
---

MongoDB connector was first introduced in Syndesis 1.8 as `tech preview` feature. We've worked hard during the development of version 1.9 and have it now as a `general available` feature!

Document-oriented databases have become extremely popular in the last years becoming one of the most important NO SQL choice out there. Without any doubt, MongoDB is the most prominent solution in this space. The easiest way to learn about this connector is to play around with the [MongoDB Quickstart](https://github.com/syndesisio/syndesis-quickstarts/tree/master/mongodb).

The features offered by the connectors are:

* Connect to a MongoDB cluster (not available in TP)
* Retrieve a document from a collection
* Store a document into a collection
* Update, Upsert and Delete a document
* Retrieve the collection schema, if defined (not available in TP)
* Tail a collection as a stream (not available in TP)

Let's focus on the new features that made the connector to move to GA.

### Connect to a MongoDB cluster
When creating a connection to MongoDB you will be now able to provide a list of hosts that belong to a cluster. Moreover you can specify the `replicaset` name. This will cover the majority of [MongoDB replication configuration](https://docs.mongodb.com/manual/replication/).

### Retrieve the collection schema
A document-database is well known for its ability to host any schema-less kind of data structure. However it's quite common to have a well-known schema to adhere for each collection. In MongoDB they can be enforced by the presence of a [schema validation](https://docs.mongodb.com/manual/core/schema-validation/). As Syndesis needs to be aware of the expected [Datashape](https://syndesis.io/docs/datashapes/), it's quite important to have this feature enabled on all the collection we'll be using in the integration. If this is not enabled, then Syndesis won't be able to know the expected data structure. That means that you won't be able to use data mapping steps, making the integrations quite limited.

### Streaming collection
The [change stream](https://docs.mongodb.com/manual/changeStreams/) feature is a very powerful feature available on MongoDB replica set configuration. Basically it allows you to receive the documents that are introduced in a given collection at real time. Having a stream of documents will give you the possibility to easily resolve complex integration scenarios. When you create a new integration you can now select the `change stream` operation and watch a given collection. Quite useful in those integration when you need to react on events posted to the MongoDB.