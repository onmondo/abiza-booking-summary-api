import { ConsumeMessage } from "amqplib";
import LogChannel from "../LogChannel";
import { randomUUID, RandomUUIDOptions } from "crypto";

export default class Server {
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
    //         }
    //     })
    // }

    static async consumeMessage() {
        const connection = await LogChannel.getInstance();
        const channel = connection.getChannel();

        // await channel.publish(
        //     "", 
        //     replyQueueName, 
        //     Buffer.from(JSON.stringify(data)), {
        //         replyTo: replyQueueName,
        //         correlationId
        //     }
        // );

        await channel.assertQueue("request-queue")
        await channel.consume("request-queue", (message: ConsumeMessage | null) => {
            if (message?.content) {
                console.log("message is: ", message.content.toString())
                // message.properties.correlationId
                channel.publish(
                    "", 
                    message.properties.replyTo, 
                    Buffer.from(JSON.stringify({reply: "Hey, its you"})), {
                        replyTo: message.properties.replyTo,
                        correlationId: message.properties.correlationId
                    }
                );
            }
        }, { noAck: true} )
        // const correlationId = randomUUID();
        // console.log(`Sending request: ${correlationId}`)
        // channel.sendToQueue("request-queue", Buffer.from(JSON.stringify(data)), {
        //     replyTo: replyQueueName,
        //     correlationId
        // })
    }
}