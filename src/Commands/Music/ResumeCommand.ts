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
            name: "resume",
            description: "繼續播放音樂",
            usage: ["resume"],
            example: ["resume"]
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
        this.client.distube.resume(message)
        return message.channel.send("成功繼續播放音樂！")
    }
}