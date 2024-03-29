import MQChannel from "../MQChannel";

export default class Caster {
    static async sendMessage(exchangeName: string, data: any) {
        const connection = await MQChannel.getInstance();
        const channel = connection.getChannel();
        await channel.assertExchange(exchangeName, "fanout", { durable: false })

        console.log(`Broadcasting: ${data}`)
        channel.publish(exchangeName, "", Buffer.from(JSON.stringify(data)))
    }
}