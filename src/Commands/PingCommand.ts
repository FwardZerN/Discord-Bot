import { Client, Message } from "discord.js";
import ICommand from "../Interfaces/ICommand";
import ICommandInfo from "../Interfaces/ICommandInfo";

export default class Ping implements ICommand {
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }
    public getInfo(): ICommandInfo {
        return {
            name: "ping",
        }
    }
    public async handle(message: Message<boolean>, args: string[]): Promise<any> {
        return message.channel.send(`WS Ping:${this.client.ws.ping} ms`)
    }
}