import LogChannel from "../LogChannel";

export default class Consumer {
    static async consumeMessage() {
        const producer = await LogChannel.getInstance();
        const channel = producer.getChannel();
        const queue = await channel.assertQueue("sampleExchangeNameLog");

        await channel.bindQueue(queue.queue, "sampleExchangeNameLog", "Info")
        channel.consume(queue.queue, (message) => {
            console.log(message)
            if (message) {
                const data = JSON.parse(message?.content.toString())
                console.log(data)
                channel.ack(message)
            }
            
        })
    }
}