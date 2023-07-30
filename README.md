# Polarity Access Integration Data Example Integration

![mode:on demand only](https://img.shields.io/badge/mode-on%20demand%20only-blue.svg)

> This is a code sample only and is not designed to be used as a production integration.

This integration demonstrates how you can access integration data for an entity from an integration's component file (block.js).

This integration implements a simple button in the template which when pressed, gathers all the integration data (including annotations), for the given entity, and sends it to the server's `onMessage` hook for further processing.

Please see the `components/block.js` file for sample implementations for `getIntegrationData()` and `getAnnotations()`.

## About Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see:

https://polarity.io/
