import amqp, { Channel, Connection } from "amqplib";
import { envKeys } from "../util/config"

export default class LogChannel {
    static getInstace() {
        throw new Error("Method not implemented.");
    }

    private static instance: LogChannel;
    private channel: unknown;

    private constructor() {
        this.channel = undefined;
    }

    public getChannel(): Channel {
        return this.channel as Channel;
    }

    private async createChannel(): Promise<void> {
        const {
            RABBIT_MQ_URL
        } = envKeys();
        const connection: Connection = await amqp.connect(RABBIT_MQ_URL);
        this.channel = await connection.createChannel();
    }

    public static async getInstance(): Promise<LogChannel> {
        if(!LogChannel.instance) {
            console.log("Creating new rabitmq instance...")
            LogChannel.instance = new LogChannel()
            await LogChannel.instance.createChannel()
        }

        return LogChannel.instance;
    }
}