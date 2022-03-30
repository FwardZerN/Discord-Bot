import { Message } from "discord.js";
import ICommandInfo from "./ICommandInfo";

export default interface ICommand {
    getInfo(): ICommandInfo
    handle(message: Message, args: string[]): Promise<any>
}