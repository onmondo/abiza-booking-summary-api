import { envKeys } from "../../util/config";
import LogChannel from "../MQChannel";

export default class Producer {
    static async publishMesssage(routingKey: string, message: string) {
        const { RABBIT_MQ_EXCHG_NAME } = envKeys()
        const producer = await LogChannel.getInstance()
        const channel = producer.getChannel();
        await channel.assertExchange(RABBIT_MQ_EXCHG_NAME, "direct") // the type here might have difference variants, one is direct messaging
        await channel.publish(
            RABBIT_MQ_EXCHG_NAME, 
            routingKey, 
            Buffer.from(JSON.stringify({
                logType: routingKey,
                message,
                dateTime: new Date(),
            }))
        );

        console.log(`The message ${message} is sent to exchange ${RABBIT_MQ_EXCHG_NAME}`)
    }
}