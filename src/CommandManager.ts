import { Client, Collection, Message } from "discord.js"
import glob1 from "glob"
import { promisify } from "util"
import ICommand from "./Interfaces/ICommand";
import ICommandInfo from "./Interfaces/ICommandInfo";
const glob = promisify(glob1);

export default class CommandManager {
    public commandsCollect = new Collection<string, ICommand>();
    public aliasesCollect = new Collection<string, string>();
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public async loadCommands() {
        return glob(`${__dirname}/Commands/**/*.{ts,js}`)
            .then(files => {
                for (const file of files) {
                    delete require.cache[require.resolve(file)]
                    const cmdfile = require(file).default
                    const cmdObj: ICommand = new cmdfile(this.client)
                    const cmdInfo: ICommandInfo = cmdObj.getInfo()
                    this.commandsCollect.set(cmdInfo.name, cmdObj);
                    if (cmdInfo.aliases) {
                        for (const aliase of cmdInfo.aliases) {
                            this.aliasesCollect.set(aliase, cmdInfo.name);
                        }
                    }
                }
            })
    }

    public async reloadCommands() {
        this.commandsCollect = new Collection()
        this.aliasesCollect = new Collection()
        await this.loadCommands()
    }

    public getCommand(cmd: string) {
        return this.commandsCollect.get(cmd) ?? this.commandsCollect.get(this.aliasesCollect.get(cmd))
    }

    public async handle(message: Message, prefix: string) {
        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)
        const cmdObj = this.getCommand(cmd);
        cmdObj?.handle(message, args)
    }
}