import IEventInfo from "./IEventInfo";

export default interface IEvent {
    getInfo(): IEventInfo
    handle(...args: any[]): Promise<any>
}