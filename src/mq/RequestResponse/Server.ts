import { ConsumeMessage, Message } from "amqplib";
import LogChannel from "../LogChannel";

export default class Server {
    static async consumeMessage(rpcQueueName: string) {
        const connection = await LogChannel.getInstance();
        const channel = connection.getChannel();
        await channel.assertQueue(rpcQueueName, { durable: false })
        channel.prefetch(1);
        console.log("Awaiting RPC requests")

        channel.consume(rpcQueueName, (message: ConsumeMessage | null) => {
            if (message) {
                console.log("Received: ", message.content.toString())
            }

            channel.sendToQueue(
                message?.properties.replyTo, 
                Buffer.from("Acknowledging the message"), 
                { correlationId: message?.properties.correlationId }
            )

            channel.ack(message as Message);

        }, { noAck: false })
    }
}