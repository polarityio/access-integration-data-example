'use strict';

let Logger;
let counter = 0;

function startup(logger) {
  Logger = logger;
}

function doLookup(entities, options, cb) {
  Logger.trace({ entities }, 'doLookup');

  let lookupResults = [];

  entities.forEach((entityObj) => {
    if (!options.privateIpOnly || (options.privateIpOnly && entityObj.isIP && entityObj.isPrivateIP)) {
      lookupResults.push({
        entity: entityObj,
        data: {
          summary: ['Data'], // summary is set via custom summary template
          details: {
            target: entityObj.value // date is formatted via the template
          }
        }
      });
    }
  });

  cb(null, lookupResults);
}

function onMessage(payload, options, cb) {
  Logger.info({ payload }, 'onMessage integration data received');
  cb(null, {
    success: true
  });
}

module.exports = {
  startup,
  doLookup,
  onMessage
};
