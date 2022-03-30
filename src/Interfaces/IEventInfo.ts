import { ClientEvents } from "discord.js"

export default interface IEventInfo {
    type: "on" | "once"
    event: keyof ClientEvents
}