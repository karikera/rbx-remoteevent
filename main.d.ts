
declare type RemoteEventReference = {
    [key: string]: (...args: any[]) => void;
};
declare type ServerRecv<T> = {
    [P in keyof T]: T[P] extends (...args: infer A) => void ? (callback: (player: Player, ...args: A) => void) => RBXScriptConnection : never;
};
declare type ServerSend<T> = {
    [P in keyof T]: T[P] extends (...args: infer A) => void ? ServerRemoteSender<A> : never;
};
declare type ClientRecv<T> = {
    [P in keyof T]: (callback: T[P]) => RBXScriptConnection;
};
declare type ClientSend<T> = {
    [P in keyof T]: T[P] extends (...args: infer A) => void ? (...args: A) => void : never;
};
declare type ServerRemoteEvents<ClientEvents extends RemoteEventReference, ServerEvents extends RemoteEventReference> = {
    client: ServerSend<ClientEvents>;
    server: ServerRecv<ServerEvents>;
};
declare type ClientRemoteEvents<ClientEvents extends RemoteEventReference, ServerEvents extends RemoteEventReference> = {
    client: ClientRecv<ClientEvents>;
    server: ClientSend<ServerEvents>;
};
declare class ServerRemoteSender<ARGS extends any[]> {
    private readonly event;
    fire(player: Player, ...args: ARGS): void;
    fireAll(...args: ARGS): void;
    fires(player: Player[], ...args: ARGS): void;
    fireWithout(without: Player, ...args: ARGS): void;
}
export declare function createServerRemoteEvents<ClientEvents extends RemoteEventReference, ServerEvents extends RemoteEventReference>(args: {
    client: ClientEvents;
    server: ServerEvents;
}): ServerRemoteEvents<ClientEvents, ServerEvents>;
export declare function createClientRemoteEvents<ClientEvents extends RemoteEventReference, ServerEvents extends RemoteEventReference>(args: {
    client: ClientEvents;
    server: ServerEvents;
}): ClientRemoteEvents<ClientEvents, ServerEvents>;
