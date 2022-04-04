import { Client, Message, MessageEmbed } from "discord.js";
import ICommand from "../Interfaces/ICommand";
import ICommandInfo from "../Interfaces/ICommandInfo";

export default class Help implements ICommand {
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }

    public getInfo(): ICommandInfo {
        return {
            name: "help",
            description: "查看指令幫助",
            usage: ["help", "help 指令名稱/別名"],
            example: ["help", "help help"]
        }
    }

    public async handle(message: Message<boolean>, args: string[]): Promise<any> {
        if (!args.length) {
            const commandsArr = Array.from(this.client.commandManager.commandsCollect.values())
            const cliUser = this.client.user
            const embed = new MessageEmbed()
                .setAuthor({ name: cliUser.username, iconURL: cliUser.avatar })
                .setDescription(`輸入\`${this.client.prefix[0]}help 指令名稱/別名\`來查看該指令幫助`)
                .addField("所有指令", commandsArr.map(e => `\`${e.getInfo().name}\``).join(" "), true)
                .setThumbnail(cliUser.avatar)

            return message.channel.send({ embeds: [embed] })
        }
        else {
            const cmdObj = this.client.commandManager.getCommand(args[0])
            if (!cmdObj) return message.channel.send(`找不到此指令！請輸入${this.client.prefix[0]}help查看所有指令！`)

            const cmdInfo = cmdObj.getInfo()
            const embed = new MessageEmbed()
                .setTitle(`${cmdInfo.name}${cmdInfo.aliases?.length ? `/${cmdInfo.aliases.join("/")}` : ``}`)
                .setDescription(cmdInfo.description)
                .addField(`用法`, `\`\`\`\n${cmdInfo.usage.join("\n")}\n\`\`\``, true)
                .addField(`範例`, `\`\`\`\n${cmdInfo.example.join("\n")}\n\`\`\``, true)

            return message.channel.send({ embeds: [embed] })
        }
    }
}