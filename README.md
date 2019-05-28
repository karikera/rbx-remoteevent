

# References TO Implements!
![References TO Implements!](readme-image/first.png)

# Reference

## createServerRemoteEvents Function
Parameter - `args:{s2c:FunctionObjects, s2c:FunctionObjects}`  
Remote events references

Convert remote event references to functions.  
references are needed to define with empty functions.  
It will creates `RemoteEvent` to `ReplicatedStorage/rbx-remoteevent/*`.  
s2c functions will be [ServerRemoteSender](#methods-of-serverremotesender-class) class objects.  
c2s functions will be `OnClientEvent:Connection` functions.  

## createClientRemoteEvents Function
**This is a yielding function.**  
It will **WAITS** `RemoteEvent` creating of `createServerRemoteEvents`.  

Parameter - `args: {s2c:FunctionObjects, s2c:FunctionObjects}`  
Remote events references

Simmilar with `createServerRemoteEvents` but for client.  
s2c functions will be `FireServer` functions.
c2s functions will be `OnServerEvent:Connection` functions.

## Methods of ServerRemoteSender Class
* `fire(client, ...)` - send to one client  
* `fireAll(...)` - send to all clients  
* `fireWithout(client, ...)` - send to all without specific client  
* `fires(clientArray, ...)` - send to partial clients  

# Example
## common.ts
```typescript

// Define Remote Event Reference
export const remoteEventsReference = {
    s2c:{ // Server to Client
        youAre(a:number, b:string, c:boolean, name:string){},
        someoneJoined(a: number, b:string, c:boolean, name:string){},
    },
    c2s:{ // Client to Server
        whoAmI(a:number, b:string, c:boolean){}
    }
};

```

## client.ts
```typescript
import { createClientRemoteEvents } from "rbx-remoteevent";
import { remoteEventsReference } from "./common";

const {s2c, c2s} = createClientRemoteEvents(remoteEventsReference);


// Receive from Server
s2c.youAre((a:number, b:string, c:boolean, name:string)=>{
    print(`I'm ${name} (${a}, ${b}, ${tostring(c)})`);
});

// Send to Server
c2s.whoAmI(math.random(), 'string', true);

```

## server.ts
```typescript
import { createServerRemoteEvents } from "rbx-remoteevent";
import { remoteEventsReference } from "./common";

const {c2s, s2c} = createServerRemoteEvents(remoteEventsReference);


// Receive from Client
c2s.whoAmI((player:Player, a:number, b:string, c:boolean)=>{

    // Send to 'player'
    s2c.youAre.fire(player, a, b, c, player.Name);

    // Send to All
    s2c.someoneJoined.fireAll(a, b, c, player.Name);

    // Send to partial players
    const [p1, p2, p3] = game.GetService('Players').GetChildren();
    s2c.someoneJoined.fires([p1, p2, p3], a, b, c, player.Name);

    // Send to All without 'player'
    s2c.someoneJoined.fireWithout(player, a, b, c, player.Name);
});
```