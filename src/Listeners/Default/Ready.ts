import { Client } from "discord.js";
import IEvent from "../../Interfaces/IEvent";
import IEventInfo from "../../Interfaces/IEventInfo";

export default class Ready implements IEvent{
    private client:Client

    public constructor(client:Client){
        this.client=client
    }

    public getInfo(): IEventInfo {
        return {
            type:"once",
            event:"ready"
        }
    }
    public async handle(...args: any[]): Promise<any> {
        console.log([
            `Logged in as ${this.client.user.tag}!`,
            `Loaded ${this.client.commandManager.commandsCollect.size} commands!`,
            `Loaded ${this.client.eventManager.listenersArr.length} events!`
        ].join("\n"))   
    }
}