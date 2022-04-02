import { Client, Intents } from "discord.js";
import CommandManager from "./CommandManager";
import EventManager from "./EventManager";
import distube from "distube";
import { YtDlpPlugin } from "@distube/yt-dlp";

declare module "discord.js" {
    interface Client {
        commandManager: CommandManager,
        eventManager: EventManager,
        prefix: string[],
        distube:distube
    }
}

interface IBotConfig {
    token: string
    prefix: string[],
}

export default class JDAClient extends Client {
    public prefix: string[]
    public commandManager = new CommandManager(this)
    public eventManager = new EventManager(this)
    public distube: distube;

    public constructor(config: IBotConfig) {
        super({ intents: Object.values(Intents.FLAGS) as any, shards: "auto", shardCount: 100 })

        this.token = config.token
        this.prefix = config.prefix

        this.distube=new distube(this,{
            leaveOnEmpty:false,
            leaveOnFinish:false,
            leaveOnStop:false,
            youtubeDL:false,
            plugins:[new YtDlpPlugin()]
        })
        .on("addSong",(queue,song) => {
            queue.textChannel.send(`已成功將\`${song.name}\`加入歌單！`)
        })
        .on("playSong",(queue,song) => {
            queue.textChannel.send(`即將開始播放：${song.name}`)
        })
    }

    public async start() {
        await this.commandManager.loadCommands()
        await this.eventManager.loadEvents()
        this.login()
    }
}