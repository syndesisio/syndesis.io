---
draft: false
title: "What is a Connector"
toc: true
weight: 1
---

Syndesis use `Connector`s to communicate with an integration platform and its underlying components. An integration platform like `Apache Camel`, our choice of reference, typically has one or more components used to communicate with external data sources. A connector is a proxy to that component, and is used to instruct Syndesis what that component is expecting and how to communicate with it.

Put in other words, the goal of the `Connector` proxy is to simplify or provide additional logic to what is expected by an integration platform's component. To have a better understanding from an architectural point of view you can have a look at the [Syndesis architecture document](/docs/architecture/syndesis/).

Any `Connector` can also define its own business logic. Syndesis works very well on top of a classic integration platform, but you can develop a connector with its `Connection` and `Actions` from scratch, not relying to any integration platform component.

#### Connection

A `Connector` generally needs to be configured with a `Connection` in order to know the source or destination data configuration (think a database connection, for example).

The integration platform defines what kind of configuration is expected by each of its components. The goal of the `Connector` is therefore to map Syndesis user inputs to that component. In many cases, you can hide the component complexity configuration by defining a subset of settings exposed to the `Connector`.

##### Actions

The second aspect to take care is defining the actions enabled on Syndesis. Here you will be able to customize the integration platform behavior by decorating the component logic with any additional logic you need in Syndesis.

We identified three types of different actions that a user can configure in an integration:

- Source
- Destination
- Pipe

A source, identified by the action type `From`, is used to read data from the component. As an example you can think of reading data from a database, or from a socket.

A destination, identified by the action type `To`, is used to write data to the component. Think as an example at writing to a database or a file.

A pipe, identified by the action type `Pipe`, is used to elaborate data and pass to the next component. It's not a common use, as the `To` action can be used for the same purpose as well. The difference is that the pipe cannot terminate an integration.

Any `Connector` can specify one or more actions. 

##### Datashapes

This is the coolest feature we have in Syndesis. A `Datashape` is a way to define the input/output of an `Action` as a structured document. The presence of a `Datashape` format will drive the UI and the Data mapper tool to associate the result coming from an action to the input expected by another action.

Let's say you have a database with a known schema. Then you need to create an integration that move the data from that database to another database with a different schema. Thanks to `Datashape`s, Syndesis will dynamically learn about the structures of the source and the destination database and will warn the user that they differ.

Thanks to the presence of a `Data mapper`, the user will be now able to map those different structure and instruct the integration to associate a certain source field to another destination field. [Learn more about datashapes](../datashapes/)

##### Syndesis Data mapper: Atlasmap

Syndesis is using [Atlasmap as data mapping tool](https://www.atlasmap.io/). It's a great visual tool that let the user map any data source and destination and provide nice transformations too.

Thanks to a Atlasmap you will be able to map different data structures of different connector types! Say you need to start an integration from an OpenAPI and back it with a SQL database. Thanks to the data mapper the user will be able to associate the OpenAPI parameters expected by the API to the table structure existing in the database. [Learn more about this use case](https://github.com/syndesisio/syndesis-quickstarts/tree/master/api-provider).

##### Connectionless connectors

There are special cases where a `Connector` does not need to provide a `Connection`, typically when the source or destination is implicit (for example, a `Log` connector is bound to standard output).

Majority of the time, your connectors will specify one, though.

#### Create a connector

Now that you know what is a connector, you can learn more by [creating a new connector](../create/)!