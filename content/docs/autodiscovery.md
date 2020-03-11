---
draft: false
title: "Connection Autodiscovery"
sidebar: "sidenav"
menu:
  sidenav:
    name: Connection Autodiscovery
    weight: 7
    parent: "Develop a connector"
toc: true
weight: 20
---

Any integration you need to create typically starts and ends to a data source. Thanks to Syndesis you will be able to discover automatically any of those data sources and make easier the configuration of connection for the citizen integrator. Any connector can provide the "Connection Autodiscovery" feature by making a little extra development and using any kind of `service registry` you have at your disposal.

### JSON Descriptor

The first thing we need to do is to configure the json connector configuration. We just have to add the `dynamic` tag to the connection section:

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

The next step is to extend the connector `meta` development. If it does not exist, you can [create a new one by following this tutorial](/docs/datashapes/#development-example). The implementation must override `ComponentMetadataRetrieval` that implements `MetadataRetrieval`. 

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

We must develop the `fetchProperties(...)` in order to read dynamically the information and return it into the `SyndesisMetadataProperties` object. The `UI` will take care to render this information to the user that will be finally able to choose among the results provided.

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

## Cloud native platform registry

Syndesis is targeted for cloud native platforms and here you typically have the possibility to manage also your data sources. You can therefore think to substitute that `service registry` with any inner implementation offered by the PAAS. As an example, you can use the [Kubernetes Client library](https://github.com/fabric8io/kubernetes-client).

The idea is that you can get any information you want by querying the client. You must configure properly permissions in order to be able to trigger the information you need. As an example, the `kafka` connector implementation we did is querying the `k8s client` to dynamically recover all the brokers available in the platform.

```java
    @Override
    public SyndesisMetadataProperties fetchProperties(CamelContext context, String componentId,
                                                      Map<String, Object> properties) {
        List<PropertyPair> brokers = new ArrayList<>();
        try (KubernetesClient client = createKubernetesClient()) {
            client.customResourceDefinitions().list().getItems()
                .stream().filter(KafkaMetaDataRetrieval::isKafkaCustomResourceDefinition)
                .forEach(kafka -> processKafkaCustomResourceDefinition(brokers, client, kafka));
        } catch (Exception t) {
            LOG.warn("Couldn't auto discover any broker.");
            LOG.debug("Couldn't auto discover any broker.", t);
        }

        Map<String, List<PropertyPair>> dynamicProperties = new HashMap<>();
        dynamicProperties.put("brokers", brokers);
        return new SyndesisMetadataProperties(dynamicProperties);
    }
```

We list all the `CRD`s, filtering only the kafka ones we need. From there we parse the result and get the broker URI that we'll return to the final user.