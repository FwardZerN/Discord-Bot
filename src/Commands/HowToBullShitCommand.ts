import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import { stripIndent } from "common-tags";
import ICommand from "../Interfaces/ICommand";
import ICommandInfo from "../Interfaces/ICommandInfo";

export default class HowToBullShit implements ICommand {
    public getInfo(): ICommandInfo {
        return {
            name: "hulan",
            aliases: ["bs", "bullshit"],
            description: "產生唬爛文",
            usage: ["hulan 主題"],
            example: ["hulan 科余"],
        };
    }

    public async handle(message: Message, args: string[]): Promise<any> {
        if (!args.length) return message.channel.send("請輸入主題");
        axios
            .post(`https://api.howtobullshit.me/bullshit`, {
                Topic: args.join(" "),
            })
            .then((res) => res.data)
            .then((data) => {
                const embed = new MessageEmbed()
                    .setTitle("唬爛產生器")
                    .setDescription(
                        stripIndent`
                        \`\`\`
                        ${data.replaceAll("&nbsp;","")}
                        \`\`\`
                        `
                    );

                return message.channel.send({ embeds: [embed] });
            });
    }
}
