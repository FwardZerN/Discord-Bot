export default interface ICommandInfo {
    name: string
    aliases?: string[],
    description: string
    usage: string[],
    example: string[]
}