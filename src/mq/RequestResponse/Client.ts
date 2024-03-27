import { ConsumeMessage } from "amqplib";
import MQChannel from "../MQChannel";
import { randomUUID } from "crypto";

export default class Client {
    static async produceMessage(queueName: string, data: any) {
        const connection = await MQChannel.getInstance();
        const channel = connection.getChannel();
        const queue = await channel.assertQueue("", { exclusive: true })

        const correlationId = randomUUID();
        console.log(`Sending new booking request: ${correlationId}`)
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            replyTo: queue.queue,
            correlationId
        })

        channel.consume(queue.queue, (message: ConsumeMessage | null) => {
            if (message?.properties.correlationId === correlationId) {
                console.log("new booking acknowledge, thank you: ", message.content.toString())
                setTimeout(() => {
                    connection.closeConnection()
                }, 500)
            }

        }, { noAck: true })
    }
}