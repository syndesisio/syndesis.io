---
draft: false
title: "Data Shapes"
sidebar: "sidenav"
menu:
  sidenav:
    name: Data Shapes
    weight: 6
    parent: Developer Docs
toc: true
weight: 20
---

A very important feature of any integration platform is to manage transparently the data format between the source and the destination channel. Syndesis and the powerful visual data mapper tool bundled with it, simplifies this concept with the definition of a `datashape`.

A `datashape` is a way to describe any inbound/outbound message format and to allow the user to easily map each data property in the integration step: said in other words, you will be able to transform on the fly the input/output of the data involved in an integration.

### JSON Descriptor

When you [develop a new Syndesis connector](../connectors/) you must specify a file descriptor that defines several properties of the source/destination involved. The section related to the data shapes is defined by the `descriptor.inputDataShape` and `descriptor.outputDataShape`. The format is the same, but, as the name let it guess, you will be able to specify a different format if the data you're describing is the input or the output of the connector involved.

```json
{
  "actions": [
    {
      "actionType":
        ...
      "descriptor": {
        ...
        "inputDataShape": {
          "kind":
            ...
        },
        "outputDataShape": {
          "kind":
            ...
        },
```
First of all, let's explore a complete description of a datashape (we use as an example an `inputDataShape` but the same is valid for the output):

```json
        "inputDataShape": {
          "name": "my data shape",
          "description": "my data shape description",
          "kind": "java",
          "type": "io.syndesis.connector.mycomponent.MyModel",
          "specification": "used in json-schema only",
          "collectionClass": "java.util.ArrayList",
          "collectionType": "List",
          "metadata": {
            "variant": "collection"
          },
          "variants": [
            {
              "kind": "java",
              "metadata": {
                "compression": "true",
                "variant": "element"
              },
              "type": "io.syndesis.connector.mycomponent.MyModelSplit"
            }
          ]
        },
```

Don't worry, the above is the full definition, in majority of the cases you won't need to define all those configuration. Let's explain briefly what everything stands for.

The `kind` parameter is the most important as it is used by Syndesis to convert any input/output message to the specified `kind`. This is the only required field when declaring a datashape, so, most of the times, you will finally end up just setting this and the `specification` field when configuring your connector. We allow the following values:

* **any**: open specification - read next paragraph for more info
* **java**: used in conjunction of `type` to define the java class to convert the data to
* **json-schema**: used in conjunction to `specification` to define the json schema expected
* **json-instance**: used to represent a generic json instance
* **xml-schema**: used in conjunction to `specification` to define the xml schema expected
* **xml-schema-inspected**: used in conjunction to `specification` to define the xml schema expected inspecting any included resource type
* **xml-instance**: used to represent a generic xml instance
* **none**: used if no data is expected

The `type` is used only when the `kind` specified and will have to contain the full package and class name of the expected java type. The collections configuration are used when you're expecting a java collection of elements, you can specify the interface and the concrete implementation to use.

`metadata` and `variants` are used to specify certain configuration that could help the split and aggregate EIP features. By defining the `metadata` as either an `element` or `collection` you will declare explicitly if the expected data is a single element or an array of elements, sparing the "guesswork" at runtime. Also, using `variants` declaration, the splitting feature will be able to work correctly by knowing how to split the original message (ie, through another `java` class model).

##### ANY and NONE datashapes

We reserve a particular mention to the `any` datashape as this kind can be quite useful when you don't know beforehand the expected data model. When you define it, Syndesis will provide you an additional user interface requiring to fill with the expected datashape. This is particularly useful as you will leave the user to select the data model expect at runtime.

Also `none` is useful if you don't expect any data at all (tipically in the source connectors input data shapes).

##### Static vs Dynamic datashape

The above example is showing a "static" configuration of a datashape that will be always the same once it has been deployed to your platform. Most of the time this is not useful, as your data shape vary depending on the parameters configuration submitted by the final user. `dynamic` tag comes to rescue!

```json
{
  "actions": [
    {
        "inputDataShape": {...},
        "outputDataShape": {...},
      },
      ...
      "pattern": "To",
      "tags": [
        "dynamic"
      ]
```
When this is set, you're instructing Syndesis gui to look up for the `meta` information to be retrieved dynamically and according the parameters that the user is submitting in each step of the integration configuration, including the `datashape`s. The GUI is triggering a call to the `server` that will forward the request to the `meta` which is finally the one that knows how to retrieve such information (see [backend architecture diagram](../backend_architecture/)).

Let's then discover how to develop such extension and how to recover dynamically `metadata` in Syndesis.

### Development example

In order to simplify the discussion, let's follow up with the same example provided in the [connector development guideline](../connectors/).

We expect our integration to be able to handle any input coming from any source with the format expected by the collection provided by the user. So we'll define dynamically a `json-schema` that will read the specification directly from the database (at runtime). The output expected is a generic `json-instance`, as there are several operations that our producer can perform.

```json
{
  "actions": [
    {
      "actionType": "connector",
      "descriptor": {
        "componentScheme": "mongodb3",
        ...
        "inputDataShape": {
          "kind": "json-schema"
        },
        "outputDataShape": {
          "kind": "json-instance"
        },
      ...
      "pattern": "To",
      "tags": [
        "dynamic"
      ]
```

As we've marked the connector as dynamic we will have to instruct the platform how to properly retrieve the meta-information. We need to create a simple file beside the main json descriptor under

```
META-INF/syndesis/connector/meta/mongodb3
```

This will contain a simple configuration pointing at the right java class:

```
class=io.syndesis.connector.mongo.meta.MongoDBMetadataRetrieval
```

The class has to extend `io.syndesis.connector.support.verifier.api.ComponentMetadataRetrieval` with only a method, whose goal is to either retrieve the meta information you need, or, adapt the ones that may be already provided by the upstream component that you're extending from Camel. You should possibly adopt this last strategy deferring to the platform (Camel in our case) the duty to retrieve such meta information.

```java
public final class MongoDBMetadataRetrieval extends ComponentMetadataRetrieval {
    @Override
    protected SyndesisMetadata adapt(CamelContext context, String componentId, String actionId, Map<String, Object> properties, MetaDataExtension.MetaData metadata) {
        String jsonPayload = metadata.getPayload(String.class);
        LOGGER.debug("Adapting meta retrieved by upstream component {}", jsonPayload);
        DataShape jsonSchemaDataShape = new DataShape.Builder()
            .name(String.format("%s.%s", properties.get("database"), properties.get("collection")))
            .description(String.format("Schema validator for %s collection", properties.get("collection")))
            .kind(DataShapeKinds.JSON_SCHEMA)
            .specification(jsonPayload)
            .build();

        return SyndesisMetadata.of(jsonSchemaDataShape);
    }
}
```

The example above should ease the discussion. Our goal in Syndesis is to _adapt_ the meta information coming from the upstream platform: in our case, the payload retrieved in the `metadata` parameter is a json-schema payload that the `camel-mongodb` component is getting on our behalf - it uses the information in the properties to query the database and collection and return the expected [json-schema validator](https://docs.mongodb.com/manual/core/schema-validation/#json-schema). Of course, this business logic may be different in each component, but the principle is the same: getting the meta information on the source/destination, parse it here and adapt according to Syndesis data model.

As we'de delegated the complex stuff to the platform, the rest is to simply adapt the format. You can see that we're setting a nice `name` and `description`, the `kind` as json-schema and the retrieved `specification`. Finally we're calling the `SyndesisMetadata.of(...)` that will set the datashape both for input and output. Cool, with this example you will be able now to _adapt_ dynamically the datashape for any kind of connector, as you likely will have a different data structure for each of them.
