import { Client, Message } from "discord.js";
import ICommand from "../../Interfaces/ICommand";
import ICommandInfo from "../../Interfaces/ICommandInfo";

export default class SetVolume implements ICommand {
    private client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public getInfo(): ICommandInfo {
        return {
            name: "setvolume",
            aliases: ["setvol", "vol"],
            description: "設定播放音量",
            usage: ["setvolume 音量大小"],
            example: ["setvolume 100"],
        };
    }

    public async handle(
        message: Message<boolean>,
        args: string[]
    ): Promise<any> {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("請加入一個語音頻道");
        const myVoiceChannel = message.guild.me.voice.channel;
        if (!myVoiceChannel)
            return message.channel.send("我不在一個語音頻道！");
        if (voiceChannel.id !== myVoiceChannel.id)
            return message.channel.send("你跟我在不同語音頻道！");
        if (!args.length) return message.channel.send("請輸入要設定的音量大小");
        const vol = Number.parseFloat(args[0]);
        if (isNaN(vol) || !(vol >= 0 && vol <= 100))
            return message.channel.send("音量必須介於0~100之間！");
        this.client.distube.getQueue(message).setVolume(vol);
        return message.channel.send(`成功將音量設置為${vol}%！`);
    }
}
