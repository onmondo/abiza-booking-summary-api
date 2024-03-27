import { ConsumeMessage } from "amqplib";
import LogChannel from "../LogChannel";
import { randomUUID } from "crypto";

export default class Client {
    // static async consumeMessage() {
    //     const connection = await LogChannel.getInstance();
    //     const channel = connection.getChannel();
    //     const { queue: replyQueueName } = await channel.assertQueue("", {
    //         exclusive: true // if server is down, this queue is deleted
    //     })

    //     console.log("Ready to consume message...")
    //     channel.consume(replyQueueName, (message: ConsumeMessage | null) => {
    //         if (message) {
    //             console.log("message is: ", message.content.toString())
    //             // message.properties.correlationId
    //             channel.publish(
    //                 "", 
    //                 replyQueueName,
    //                 Buffer.from(JSON.stringify({request: "Request for ping"})), {
    //                     replyTo: message.properties.replyTo,
    //                     correlationId: message.properties.correlationId
    //                 }
    //             );
    //         }
    //     })
    // }

    static async produceMessage(queueName: string, data: any) {
        const connection = await LogChannel.getInstance();
        const channel = connection.getChannel();
        const queue = await channel.assertQueue("", { exclusive: true })

        const correlationId = randomUUID();
        console.log(`Sending request: ${correlationId}`)
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            replyTo: queue.queue,
            correlationId
        })

        channel.consume(queue.queue, (message: ConsumeMessage | null) => {
            if (message?.properties.correlationId === correlationId) {
                console.log("Got: ", message.content.toString())
                setTimeout(() => {
                    connection.closeConnection()
                }, 500)
            }

        }, { noAck: true })
    }
}