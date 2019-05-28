```ts


const remoteev = {
    client:{
        sendInformation(exp:number, hp:number){},
        clientJoin(player:Player){},
        message(message:string){},
    },
    server:{
        buyItem(itemName:string){},
        sellItem(item:Tool){}
    }
};



// client
const remoteEvent = createClientRemoteEvent(remoteev);
remoteEvent.server.buyItem('Item');
remoteEvent.server.sellItem(tool);

remoteEvent.client.sendInformation((exp, hp)=>{
    print(`exp=${exp}  hp=${hp}`);
});
remoteEvent.client.clientJoin((player)=>{
    print(`${player.Name} joined.`);
});
remoteEvent.client.message((player)=>{
    print(`message: ${message}`);
});


// server
const remoteEvent = createServerRemoteEvent(remoteev);
remoteEvent.client.sendInformation(10, 10);
remoteEvent.client.clientJoin(client);
remoteEvent.client.message('Server Started');

remoteEvent.server.buyItem((player, itemName)=>{
    print(`${player.Name} buy ${itemName}`);
});
remoteEvent.server.sellItem((player, tool)=>{
    print(`${player.Name} sell ${tool.Name}`);
});


```