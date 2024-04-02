import MQChannel from "../MQChannel";

export default class Producer {
    static async publishMesssage(exchangeName: string, routingKey: string, message: string) {
        const producer = await MQChannel.getInstance()
        const channel = producer.getChannel();
        await channel.assertExchange(exchangeName, "direct", {durable: false}) // the type here might have difference variants, one is direct messaging

        channel.publish(
            exchangeName, 
            routingKey, 
            Buffer.from(JSON.stringify({
                logType: routingKey,
                message,
                dateTime: new Date(),
            }))
        );

        console.log(`Broadcasting: ${message} to ${routingKey}`)
    }
}

Producer.publishMesssage("logsExchange", "info", "info logs for ordering products")