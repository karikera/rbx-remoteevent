import { Players, ReplicatedStorage } from "rbx-services";


type RemoteEventReference = {[key:string]:(...args:any[])=>void};


type ServerRecv<T>={
    [P in keyof T]:T[P] extends (...args:infer A)=>void? 
    (callback:(player:Player, ...args:A)=>void)=>RBXScriptConnection
    :never;
};
type ServerSend<T>={
    [P in keyof T]:T[P] extends (...args:infer A)=>void?
    ServerRemoteSender<A>
    :never;
};
type ClientRecv<T>={
    [P in keyof T]:(callback:T[P])=>RBXScriptConnection;
};
type ClientSend<T>={
    [P in keyof T]:T[P] extends (...args:infer A)=>void?
    (...args:A)=>void
    :never;
};

type ServerUnknown = {
    c2s:{[key:string]:(callback:(...args:unknown[])=>void)=>RBXScriptConnection},
    s2c:{[key:string]:ServerRemoteSender<any>}
};

type ClientUnknown = {
    c2s:{[key:string]:(...args:unknown[])=>void}, 
    s2c:{[key:string]:(callback:(...args:unknown[])=>void)=>RBXScriptConnection}
};

type ServerRemoteEvents<S2C extends RemoteEventReference, C2S extends RemoteEventReference> = {
    s2c:ServerSend<S2C>,
    c2s:ServerRecv<C2S>
};

type ClientRemoteEvents<S2C extends RemoteEventReference, C2S extends RemoteEventReference> = {
    s2c:ClientRecv<S2C>,
    c2s:ClientSend<C2S>
};

class ServerRemoteSender<ARGS extends Array<unknown>>
{
    constructor(private readonly event:RemoteEvent)
    {
    }

    fire(player:Player, ...args:ARGS):void
    {
        this.event.FireClient(player, ...<unknown[]>args);
    }

    fireAll(...args:ARGS):void
    {
        this.event.FireAllClients(...<unknown[]>args);
    }

    fires(player:Player[], ...args:ARGS):void
    {
        for (const plr of player)
        {
            this.event.FireClient(plr, ...<unknown[]>args);
        }
    }

    fireWithout(without:Player, ...args:ARGS):void
    {
        for (const plr of Players.GetPlayers())
        {
            if (plr !== without)
            {
                this.event.FireClient(plr, ...<unknown[]>args);
            }
        }
    }
}

export function createServerRemoteEvents
    <S2C extends RemoteEventReference, C2S extends RemoteEventReference>
    (args:{s2c:S2C, c2s:C2S}):ServerRemoteEvents<S2C, C2S>
{
    const eventsFolder = new Instance('Folder', ReplicatedStorage);
    eventsFolder.Name = 'rbx-remoteevent';

    const events:ServerUnknown = {
        s2c:{},
        c2s:{},
    };
    for (const name of Object.keys(args.c2s))
    {
        const event = new Instance('RemoteEvent', eventsFolder);
        event.Name = name;
        events.c2s[name] = (callback:(...args:unknown[])=>void)=>event.OnServerEvent.Connect(callback);
    }
    
    for (const name of Object.keys(args.s2c))
    {
        const event = new Instance('RemoteEvent', eventsFolder);
        event.Name = name;
        events.s2c[name] = new ServerRemoteSender<any[]>(event);
    }
    return <ServerRemoteEvents<S2C, C2S>>events;
}


export function createClientRemoteEvents
    <S2C extends RemoteEventReference, C2S extends RemoteEventReference>
    (args:{s2c:S2C, c2s:C2S}):ClientRemoteEvents<S2C, C2S>
{
    const eventsFolder = ReplicatedStorage.WaitForChild<Folder>('rbx-remoteevent');
    const events:ClientUnknown = {
        s2c:{},
        c2s:{}
    };
    for (const name of Object.keys(args.s2c))
    {
        const event = eventsFolder.WaitForChild<RemoteEvent>(name);
        events.s2c[name] = callback=>event.OnClientEvent.Connect(callback);
    }
    
    for (const name of Object.keys(args.c2s))
    {
        const event = eventsFolder.WaitForChild<RemoteEvent>(name);
        events.c2s[name] = (...args)=>event.FireServer(...args);
    }
    return <ClientRemoteEvents<S2C, C2S>>events;    
}

