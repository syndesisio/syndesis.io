---
draft: false
title: "Connection Autodiscovery"
toc: true
weight: 40
---

Most steps on any integration have an input data source coming from the previous step and output another data source to the following step. Each type of connector expects different data sources. These data source formats are the ones used on the mapping steps to match the output of one step to the input of the following step. 

But sometimes we don't have a pre-defined format for those data sources, but a format that is dependent on the context. For example, if we are querying a database, the data format will depend on the query we are executing and the parameters we use on that query.

On Syndesis we can define automatically those data sources formats. Any connector can provide the `Connection Autodiscovery` feature by implementing an auto discovery of metadata.

## JSON Descriptor

The first thing we need to do is to configure the json connector configuration. We add the `dynamic` tag to the connection section. This tag will let Syndesis know that metadata of this connector have to be loaded on runtime.


```json
{
  "actions": [...],
  ...
  "properties": {
    "connection-ip": {
      "componentProperty": true,
      ...
    }
  },
  "tags": [
    "verifier",
    "dynamic"
  ]
}
```

Full documentation about this connector configuration format can be found on the [Connector Schema](/docs/connector-schema) section.

## Metadata Retrieval

Now we need to extend the connector metadata retrieval. If it does not exist, you can [create a new one by following this tutorial](/docs/datashapes/#development-example). The implementation must override `ComponentMetadataRetrieval`, which implements `MetadataRetrieval`. 

```java
    public interface MetadataRetrieval {
        /**
         * Provide all dynamic properties configured for the specific connector.
         * It can use {@link CamelContext} to retrieve {@link MetaData} or use other Syndesis internal components
         * to provide such properties.
         */
        default SyndesisMetadataProperties fetchProperties(CamelContext context, String componentId, Map<String, Object> properties) {
            return SyndesisMetadataProperties.EMPTY;
        }
        ...
}
```

We have to implement the `fetchProperties` function in order to generate dynamically this information, which will be return in the form of a `SyndesisMetadataProperties` object. The user interface will take care to render this information to the user as if it was statically defined on the JSON Descriptor.

```java
    @Override
    public SyndesisMetadataProperties fetchProperties(CamelContext context, String componentId,
                                                      Map<String, Object> properties) {
        List<PropertyPair> connectionIps = new ArrayList<>();
        //... Read the ips from a service registry
        Map<String, List<PropertyPair>> dynamicProperties = new HashMap<>();
        dynamicProperties.put("connection-ip", connectionIps);
        return new SyndesisMetadataProperties(dynamicProperties);
    }
```

It's important to familiarize with the list of properties configured for this connection. In this example we are expecting to fill the `connection-ip`, that was previously configured in the json connector configuration. Then, you just have to connect to an existing registry (it may be any online directory) and get those data.

Let's leverage this feature to offer a stronger and much integrated IPAAS capability.

### Cloud native platform registry

Syndesis is targeted for cloud native platforms where you can query for resources and configurations. You can therefore think to substitute that `service registry` with any inner implementation offered by your environment. 

As an example, the `kafka` connector uses the [Kubernetes Client library](https://github.com/fabric8io/kubernetes-client) to query Custom Resource Descriptions (CDR) and list all the [Kafka brokers](https://kafka.apache.org/) available in the platform. This information is then used by the user interface to fill an auto-completion field when creating connections. You can [check the source code here](https://github.com/syndesisio/syndesis/blob/master/app/connector/kafka/src/main/java/io/syndesis/connector/kafka/KafkaMetaDataRetrieval.java#L75-L95)
