import { PubSub }       from '@google-cloud/pubsub';

/**
 * Publishes data onto a PubSub Topic.
 *
 * The function(s) registered on the PubSup Topic will pick up the data and fire and execute with it as a result.
 *
 * @param topic - Topic to publish to
 * @param data  - Data to publish onto the topic.
 *
 * @returns {string} handlerId - Topic published ID.
 */
export async function __PubSubPublishAction<T>(topic: string, data: T)
{
  const pubsub = new PubSub();

  // Get the topic to publish to.
  const pubsubTopic = pubsub.topic(topic).publisher;

  // Make data publishable. The command bus expects Base64 encoded data.
  const publishableData  = Buffer.from(JSON.stringify(data));

  // Publish the data onto the command bus.
  const handlerId = await pubsubTopic.publish(publishableData);

  return handlerId;
}
