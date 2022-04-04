import { Client, GuildTextBasedChannel, Message } from "discord.js";
import ICommand from "../../Interfaces/ICommand";
import ICommandInfo from "../../Interfaces/ICommandInfo";

export default class Play implements ICommand{
    private client:Client

    public constructor(client:Client){
        this.client=client
    }
    public getInfo(): ICommandInfo {
        return {
            name:"play",
            description:"播放音樂",
            usage:["play 連結","play 關鍵字"],
            example:["play https://www.youtube.com/watch?v=dQw4w9WgXcQ","play never gonna give you up"]
        }
    }

    public async handle(message: Message, args: string[]): Promise<any> {
        if(!args.length)return message.channel.send("請輸入要搜尋的歌曲名稱")
        const voiceChannel=message.member.voice.channel
        if(!voiceChannel)return message.channel.send("請加入一個語音頻道")
        const myVoiceChannel=message.guild.me.voice.channel
        if(myVoiceChannel && myVoiceChannel.id!==voiceChannel.id)return message.channel.send("您跟我在不同語音頻道！")
        this.client.distube.play(voiceChannel,args.join(" "),{
            message,
            textChannel:message.channel as GuildTextBasedChannel
        })
    }
}