import MQChannel from "../MQChannel";

export default class Receiver {
    static async consumeMessage(exchangeName: string) {
        const connection = await MQChannel.getInstance();
        const channel = connection.getChannel();
        await channel.assertExchange(exchangeName, "fanout", { durable: false })
        const q = await channel.assertQueue("", { exclusive: true });
        channel.bindQueue(q.queue, exchangeName, "")
        channel.consume(q.queue, message => {
            console.log("[x] Received:", message?.content.toString())
        }, { noAck: true })
    }
}

Receiver.consumeMessage("logs")