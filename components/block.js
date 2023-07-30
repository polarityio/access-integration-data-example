'use strict';

polarity.export = PolarityComponent.extend({
  // Inject the notification data service which is used to access the underlying integration data
  // stored in the Overlay Window
  notificationsData: Ember.inject.service('notificationsData'),
  init() {
    if (!this.get('block._state')) {
      this.set('block._state', {});
      this.set('block._state.isSubmitting', false);
      this.set('block._state.showSuccessMessage', false);
      this.set('block._state.message', '');
    }
    this._super(...arguments);
  },
  actions: {
    submit: function () {
      this.set('block._state.isSubmitting', true);

      const payload = {
        integrationData: this.getIntegrationData(),
        annotations: this.getAnnotations()
      };

      console.info(payload);

      // Send the integration data to the integration's `onMessage` hook in the
      // integration.js file for processing.
      this.sendIntegrationMessage(payload)
        .then((response) => {
          this.set('block._state.message', 'Success!');
          this.set('block._state.showSuccessMessage', true);
        })
        .catch(function (err) {
          self.set('block._state.message', JSON.stringify(err, null, 2));
        })
        .finally(() => {
          this.set('block._state.isSubmitting', false);

          setTimeout(() => {
            if (!this.isDestroyed) {
              this.set('block._state.showSuccessMessage', false);
            }
          }, 2000);
        });
    }
  },
  getIntegrationData: function () {
    // Get the integration data from the notification data service
    // `notifications` is a linked list which contains information for all entities
    // currently available in the Overlay Window
    const notificationList = this.notificationsData.getNotificationList();

    // Find the integration blocks that match the entity value of the current block
    // When storing entity values in the notification linked list each node is keyed
    // on the lowercase version of the entity value.  The notificationList supports
    // O(1) retrieval of nodes via the `findByValue` method:
    // `findByValue(string: entityValueLowercase): NotificationNode`
    const integrationBlocks = notificationList.findByValue(this.get('block.entity.value').toLowerCase());

    // The `blocks` property on the `integrationBlocks` object is an array of integration blocks
    // We filter out the block for this integration by checking the `integrationName` property
    return integrationBlocks.blocks.reduce((accum, block) => {
      if (block.integrationName !== this.get('block.integrationName') && block.type !== 'polarity') {
        // Return the `data` property of the block which matches the `data` property returned
        // via the `integration.js` file.  The `data` property is an object that contains
        // both a `summary` and `details` property.
        // ```
        // {
        //   summary: ['summary tag 1', 'summary tag 2'],
        //   details: {
        //     .. integration specific data
        //   }
        // }
        // ```
        accum.push({
          integrationName: block.integrationName,
          integrationId: block.integrationId,
          data: block.data
        });
      }
      return accum;
    }, []);
  },
  /**
   * Returns an array of annotation objects for the current block.  If no annotations
   * exist, returns null.
   *
   * ````
   * [
   *  {
   *      tag: "tagName",
   *      channel: "channelName",
   *      user: "username",
   *      applied: "Date"
   *  }
   * ]
   * ```
   * @returns [{}]
   */
  getAnnotations: function () {
    // Get the integration data from the notification data service
    // `notifications` is a linked list which contains information for all entities
    // currently available in the Overlay Window
    const notificationList = this.notificationsData.getNotificationList();

    // Find the integration blocks that match the entity value of the current block
    // When storing entity values in the notification linked list each node is keyed
    // on the lowercase version of the entity value.  The notificationList supports
    // O(1) retrieval of nodes via the `findByValue` method:
    // `findByValue(string: entityValueLowercase): NotificationNode`
    const integrationBlocks = notificationList.findByValue(this.get('block.entity.value').toLowerCase());

    // The `blocks` property on the `integrationBlocks` object is an array of integration blocks
    // We attempt to find a block of `type` "polarity" which will be the block containing annotations
    const polarityBlock = integrationBlocks.blocks.find((block) => {
      if (block.type === 'polarity') {
        return block;
      }
    });

    // If we have annotations, we flatten the data structure and return an array of annotation
    // objects where the object contains the "annotation" (tagName), "channel" (channelName), and
    // "user" (username), and applied (Date) properties.
    if (polarityBlock) {
      let annotations = [];
      polarityBlock.tagEntityPairs.forEach((pair) => {
        annotations.push({
          tag: pair.tag.tagName,
          channel: pair.channel.channelName,
          user: pair.get('user.username'),
          applied: pair.applied
        });
      });
      return annotations;
    }

    // No annotations were found so return null
    return null;
  }
});
