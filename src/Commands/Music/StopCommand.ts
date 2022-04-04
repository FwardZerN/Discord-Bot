import { Client, Message } from "discord.js";
import ICommand from "../../Interfaces/ICommand";
import ICommandInfo from "../../Interfaces/ICommandInfo";

export default class Pause implements ICommand {
    private client: Client;

    public constructor(client: Client) {
        this.client = client;
    }
    public getInfo(): ICommandInfo {
        return {
            name: "stop",
            description: "停止音樂",
            usage: ["stop"],
            example: ["stop"]
        };
    }
    public async handle(message: Message, args: string[]): Promise<any> {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("請加入一個語音頻道");
        const myVoiceChannel = message.guild.me.voice.channel;
        if (!myVoiceChannel)
            return message.channel.send("我不在一個語音頻道！");
        if (voiceChannel.id !== myVoiceChannel.id)
            return message.channel.send("你跟我在不同語音頻道！");

        return this.client.distube.stop(message)
    }
}