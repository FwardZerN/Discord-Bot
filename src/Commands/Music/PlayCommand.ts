import {
    Client,
    GuildTextBasedChannel,
    Message,
    MessageActionRow,
    MessageSelectMenu,
    MessageSelectOptionData,
    SelectMenuInteraction,
} from "discord.js";
import ICommand from "../../Interfaces/ICommand";
import ICommandInfo from "../../Interfaces/ICommandInfo";

export default class Play implements ICommand {
    private client: Client;

    public constructor(client: Client) {
        this.client = client;
    }
    public getInfo(): ICommandInfo {
        return {
            name: "play",
            description: "播放音樂",
            usage: ["play 連結", "play 關鍵字"],
            example: [
                "play https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "play never gonna give you up",
            ],
        };
    }

    public async handle(message: Message, args: string[]): Promise<any> {
        if (!args.length) return message.channel.send("請輸入要搜尋的歌曲名稱");
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("請加入一個語音頻道");
        const myVoiceChannel = message.guild.me.voice.channel;
        if (myVoiceChannel && myVoiceChannel.id !== voiceChannel.id)
            return message.channel.send("您跟我在不同語音頻道！");
        const searchResult = await this.client.distube.search(args.join(" "));
        const option: MessageSelectOptionData[] = searchResult.map((e, i) => ({
            label: e.uploader.name.slice(0, 25),
            description: e.name.slice(0, 50),
            value: i.toString(),
        }));
        const select = new MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder("請選擇曲目")
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(option);
        const actionRaw = new MessageActionRow().addComponents(select);
        const selectMsg = await message.channel.send({
            components: [actionRaw],
        });

        const disableSelect = new MessageSelectMenu(select).setDisabled(true);
        let interaction: SelectMenuInteraction;
        try {
            interaction = await selectMsg.awaitMessageComponent({
                filter: (i) => i.member === message.member,
                time: 30e3,
                componentType: "SELECT_MENU",
            });
        } catch (e) {
            await selectMsg.edit({
                components: [
                    new MessageActionRow().addComponents(disableSelect),
                ],
            });
            return message.channel.send("已經超過選擇時間");
        }

        await interaction.deferUpdate();

        const index = Number.parseInt(interaction.values[0]);
        const track = searchResult[index];

        await interaction.deleteReply();

        this.client.distube.play(voiceChannel, track, {
            message,
            textChannel: message.channel as GuildTextBasedChannel,
        });
    }
}
