import { Client, Collection, Message } from "discord.js"
import glob1 from "glob"
import { promisify } from "util"
import IEvent from "./Interfaces/IEvent";
import IEventInfo from "./Interfaces/IEventInfo";
const glob = promisify(glob1);

export default class CommandManager {
    public listenersArr: IEvent[] = []
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public async loadEvents() {
        return glob(`${__dirname}/Listeners/**/*.{ts,js}`)
            .then(files => {
                for (const file of files) {
                    delete require.cache[require.resolve(file)]
                    const listenerFile = require(file).default
                    const listenerObj: IEvent = new listenerFile(this.client)
                    const listenerInfo: IEventInfo = listenerObj.getInfo()
                    this.listenersArr.push(listenerObj)
                    this.client[listenerInfo.type](listenerInfo.event, (...args) => listenerObj.handle(...args))
                }
            })
    }

    public async reloadEvents() {
        this.listenersArr = []
        await this.loadEvents()
    }
}