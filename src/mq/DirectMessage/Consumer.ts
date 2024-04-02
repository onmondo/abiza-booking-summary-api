import MQChannel from "../MQChannel";

export default class Consumer {
    static async consumeMessage(exchangeName: string, routingKeys: string[]) {
        const producer = await MQChannel.getInstance();
        const channel = producer.getChannel();
        await channel.assertExchange(exchangeName, "direct", {durable: false})
        const q = await channel.assertQueue("", {exclusive: true});
        // await channel.bindQueue(q.queue, exchangeName, "warning")
        routingKeys.forEach(routingKey => {
            channel.bindQueue(q.queue, exchangeName, routingKey)
        })
        channel.consume(q.queue, (message) => {
            
            if (message?.content) {
                console.log(`[x] Received: ${message?.content.toString()}`)
            }
        }, { noAck: true })
    }
}

Consumer.consumeMessage("logsExchange", ["info", "warning"])