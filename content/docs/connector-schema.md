---
draft: false
title: "Connector Schema"
sidebar: "sidenav"
menu:
  sidenav:
    name: Connector Schema
    weight: 5
    parent: "Develop a connector"
toc: true
weight: 20
---

As we've already seen in the [Connector Development guidelines](https://syndesis.io/docs/connectors/), the connection to or from a generic data source is proxied by the presence of the _Connector Proxy_ component. In this page you will find how to configure it in all its details. The descriptor does a fundamental job in linking together the GUI (who will use the configuration to dynamically define the connector behavior), the server, the meta (which can be required to serve certain meta information dynamically) and finally the integration platform runtime where the application will run (being [Apache Camel](https://camel.apache.org/) the one we use as reference).

### JSON Descriptor

The features required by the proxy are expressed through a configuration file defined as a [_json-schema_](https://github.com/syndesisio/syndesis/blob/master/app/connector/support/maven-plugin/src/main/resources/connector-schema.json). Each connector development will be validating this schema through a maven plugin that you can execute as a standalone task through:

```shell
$ mvn process-classes
```
The validator (and later the other packaging processes) is expecting a descriptor in the following location:

```
syndesis/app/connector/<connectorName>/src/main/resources/META-INF/syndesis/connector/<connectorId>.json
```

where `<connectorName>` is the directory holding your development and `<connectorId>` is the `id` you're going to set in the descriptor.
In order to proper develop your connector and get the full of `Syndesis` you must be aware of how this is working and what each properties is supposed to mean. Let's examine the _json-schema_ in detail:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "actions": {"type": "array"...},
    "componentScheme": {"type": "string"...},
    "configuredProperties": {"type": "object"...},
    "connectorCustomizers": {"type": "array"...},
    "connectorFactory": {"type": "string"...},
    "dependencies": {"type": "array"...},
    "description": {"type": "string"...},
    "icon": {"type": "string"...},
    "id": {"type": "string"...},
    "metadata": {"type": "object"...},
    "name": {"type": "string"...},
    "properties": {"type": "object"...},
    "tags": {"type": "array"...}
  },
  "required": [
    "actions",
    "description",
    "icon",
    "id",
    "name"
  ],
  "additionalProperties": false
}
```

##### actions
Every connector is able to perform one or more different actions. An action will let you define what an integration has to do, if it is expected to produce or consume data and how to decorate those data according to the integration platform you're targeting. As this can get a bit complex, let's review all the properties, and then drill down the most important ones:

```json
    "actions": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "actionType": {"type": "string"...},
            "description": {"type": "string"...},
            "descriptor": {
              "type": "object",
              "properties": {
                "componentScheme": {"type": "string"...},
                "configuredProperties": {"type": "object"...},
                "connectorFactory": {"type": "string"...},
                "connectorCustomizers": {"type": "array"...},
                "inputDataShape": {"type": "object"...},
                "outputDataShape": {"type": "object"...},
                "propertyDefinitionSteps": {"type": "array"...},
                "standardizedErrors": {"type": "array"...},
              "required": [
                "inputDataShape",
                "outputDataShape"
              ],
              "additionalProperties": false
            },
            "id": {"type": "string"...},
            "metadata": {"type": "object"...},
            "name": {"type": "string"...},
            "pattern": {"type": "string"...},
            "tags": {"type": "array"...}
          },
          "required": [
            "actionType",
            "description",
            "descriptor",
            "id",
            "name",
            "pattern"
          ],
          "additionalProperties": false
        }
      ]
    },
```

* **actionType**: you must configure using `connector`. Also `step` type exists but it's reserved for extensions development. 
* **description**: a text description for this action
* **descriptor**: detailed configuration for this action - see next chapter
* **id**: a unique identifier for this action
* **metadata**: an object that will be used by GUI to define certain visual aspects
* **name**: the name identifying this action
* **pattern**: `From`, `To` or `Pipe`, representing if it's a data consumer, producer or a step beetween them. Please, notice `Pipe` is not yet fully supported.
* **tags**: a list of open text labels, can be used by GUI to perform certain actions based on it. Particularly important is the [`dynamic` tag](https://syndesis.io/docs/datashapes/#static-vs-dynamic-datashape) which define certain facets of a `datashape`.

###### Descriptor
Let's dig a little bit more into the _descriptor_ parameter, as it defines in detail the behavior of the action and which is the business logic that drives it.

```json
  "descriptor": {
    "type": "object",
    "properties": {
      "componentScheme": {...},
      "configuredProperties": {...},
      "connectorFactory": {...},
      "connectorCustomizers": {...},
      "inputDataShape": {...},
      "outputDataShape": {...},
      "propertyDefinitionSteps": {...},
      "standardizedErrors": {...},
    "required": [
      "inputDataShape",
      "outputDataShape"
    ],
    "additionalProperties": false
  },
```

* **componentScheme**: represents the URI scheme of the component you'd like to use (particularly useful for Camel integration platform). You can define this at **action** level to override **connector** level.
* **configuredProperties**: constant parameters object expected by this action
* **connectorFactory**: fully qualified java class name to which you will delegate the **action** lifecycle management (see [component delegate](https://syndesis.io/docs/connectors/#componentdelegate))
* **connectorCustomizers**: array of fully qualified java class names that will decorate this **action** with their application logic
* **inputDataShape**: expected format for input data (see [Data Shape](https://syndesis.io/docs/datashapes/))
* **outputDataShape**: expected format for output data (see [Data Shape](https://syndesis.io/docs/datashapes/))
* **propertyDefinitionSteps**: array of parameters object expected by the action. This field is used by the GUI to query user about **integration** configuration setting
* **standardizedErrors**: message format conversion to represent error messages more user friendly

The only required fields are the data shape that define the format data expected. You will probably make a deep use of _propertyDefinitionSteps_ and _connectorCustomizers_ too, as we expect that a user can configure an integration with certain parameters and some customization on the data coming from/to integration platform has to be done (see [development guidelines](https://syndesis.io/docs/connectors/#customizer)).

Please notice that many parameters have the same name when applied to **connector** and to **action**. Depending on where those are configured they can provide a different behavior.

##### componentScheme

It represents the URI scheme of the component you'd like to use (particularly useful for Camel integration platform) for this **connector**. It can be overridden at **action** level.

##### configuredProperties

Constant parameters object expected by the component and its actions.

##### connectorCustomizers

Array of fully qualified java class names that will decorate the **connector actions** with their application logic. Please notice that also the action configuration can configure a customizer. In such circumstances, the action will be configured with both the application logic provided at **connector** level and at **action** level.

##### connectorFactory

Fully qualified java class name to which you will delegate the **connector** lifecycle management (see [component delegate](https://syndesis.io/docs/connectors/#componentdelegate)).

##### dependencies

List of dependencies needed by the connector in order to work correctly. Supported values: `MAVEN`, `EXTENSION`, `EXTENSION_TAG`, `ICON`. All connectors must define their self maven dependency as defined below:

```json
  "dependencies": [
    {
      "id": "@project.groupId@:@project.artifactId@:@project.version@",
      "type": "MAVEN"
    }
  ],
```

You will also find useful `EXTENSION` and `EXTENSION_TAG` that may be needed to reference external dependencies that are uploaded at runtime in the platform through the [extension mechanism](https://github.com/syndesisio/syndesis-extensions). As they are needed by your application and not provided out of the box (ie, JDBC drivers), you will need to import before using. Through the `dependencies` option you can declare its usage.

##### description

Text description of this connector.

##### icon

Image used by GUI to represent this component. Format expected is `assets:<image.ext>`. The `<image.ext>` is expected to be present at `app/ui-react/syndesis/public/icons/` folder.

##### id

Unique identifier of the connector.

##### metadata

Used by GUI to read about certain characteristic of the connector. Generally they are flags, here the most common ones: `tech-preview`, `hide-from-connection-pages`, `hide-from-step-select`.

##### name

A name that is used to define this connector.

##### properties

Array of parameters object expected by the connector. This field is used by the GUI to query user about **connection** configuration setting. You must pay attention at the difference between connector _properties_ that feed `Connection`s and action _propertyDefinitionSteps_ that feed `Integration`s.

##### tags

A list of open text labels, can be used by GUI to perform certain actions based on it. Particularly important is the [`verifier` tag](https://syndesis.io/docs/connectors/#connection-verifier) which the GUI uses to provide a `Connection` verification function. From version 2.0 it is available also the `dynamic` tag which allow any connector to provide dynamic properties to the connection page.

### Catalog

Last thing that is worth to mention is that the all the connectors descriptors are packed together and bundled into a [support catalog library](https://github.com/syndesisio/syndesis/blob/master/app/connector/support/catalog/pom.xml). This is then used by `server` and `integration` to know which are the available connectors and provide the expected configuration to the GUI and to the final integration runtime.
