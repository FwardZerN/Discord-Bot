import { Message, Client } from "discord.js";
import IEvent from "../../Interfaces/IEvent";
import IEventInfo from "../../Interfaces/IEventInfo";

export default class messageCreate implements IEvent {
    private client: Client;

    public constructor(client: Client) {
        this.client = client
    }

    public getInfo(): IEventInfo {
        return {
            type: "on",
            event: "messageCreate"
        }
    }
    public async handle(message: Message): Promise<any> {
        const mentionRegexPrefix: RegExp = RegExp(
            `^<@!${this.client.user.id}>`,
        );

        if (!message.guild || message.author.bot) return;

        const prefix: string = message.content.match(mentionRegexPrefix)
            ? message.content.match(mentionRegexPrefix)[0]
            : this.client.prefix.find((e) => message.content.startsWith(e));

        if (!prefix) return;

        this.client.commandManager.handle(message, prefix);
    }
}