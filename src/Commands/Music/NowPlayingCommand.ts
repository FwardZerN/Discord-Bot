import { Client, Message, MessageEmbed } from "discord.js";
import ICommand from "../../Interfaces/ICommand";
import ICommandInfo from "../../Interfaces/ICommandInfo";

export default class Pause implements ICommand {
    private client: Client;

    public constructor(client: Client) {
        this.client = client;
    }
    public getInfo(): ICommandInfo {
        return {
            name: "nowplaying",
            aliases: ["np"],
            description: "查看目前正在播放的音樂",
            usage: ["nowplaying"],
            example: ["nowplaying"]
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

        const queue = this.client.distube.getQueue(message)
        const songs = queue.songs
        if (!songs.length) return message.channel.send("目前沒有歌曲正在播放")
        const current = songs[0]

        const embed = new MessageEmbed()
            .setAuthor({ name: current.uploader.name, url: current.uploader.url })
            .setTitle(`正在播放：${current.name}`)
            .setThumbnail(current.thumbnail)
            .addField(`播放位置`, `${queue.currentTime}/${current.formattedDuration}`, false)

        return message.channel.send({ embeds: [embed] })
    }
}