
local _exports = {};
local ServerRemoteSender;
local Players = game:GetService("Players");
local ReplicatedStorage = game:GetService("ReplicatedStorage");
do
	ServerRemoteSender = {};
	ServerRemoteSender.__index = {
		fire = function(self, player, ...)
			self.event:FireClient(player, ...);
		end;
		fireAll = function(self, ...)
			self.event:FireAllClients(...);
		end;
		fires = function(self, player, ...)
			for _1 = 1, #player do
				local plr = player[_1];
				self.event:FireClient(plr, ...);
			end;
		end;
		fireWithout = function(self, without, ...)
			local _1 = Players:GetPlayers();
			for _2 = 1, #_1 do
				local plr = _1[_2];
				if plr ~= without then
					self.event:FireClient(plr, ...);
				end;
			end;
		end;
	};
	ServerRemoteSender.new = function(event)
		return setmetatable({event=event}, ServerRemoteSender);
	end;
end;
local createServerRemoteEvents = function(args)
	local eventsFolder = Instance.new('Folder', ReplicatedStorage);
	eventsFolder.Name = 'rbx-remoteevent';
	local events = {
		client = {};
		server = {};
	};
	for name in pairs(args.server) do
		local event = Instance.new('RemoteEvent', eventsFolder);
		event.Name = name;
		events.server[name] = function(callback)
			return event.OnServerEvent:Connect(callback);
		end;
	end;
	for name in pairs(args.client) do
		local event = Instance.new('RemoteEvent', eventsFolder);
		event.Name = name;
		events.client[name] = ServerRemoteSender.new(event);
	end;
	return events;
end;
local createClientRemoteEvents = function(args)
	local eventsFolder = ReplicatedStorage:WaitForChild('rbx-remoteevent');
	local events = {
		client = {};
		server = {};
	};
	for name in pairs(args.client) do
		local event = eventsFolder:WaitForChild(name);
		events.client[name] = function(callback)
			return event.OnClientEvent:Connect(callback);
		end;
	end;
	for name in pairs(args.server) do
		local event = eventsFolder:WaitForChild(name);
		events.server[name] = function(...)
			return event:FireServer(...);
		end;
	end;
	return events;
end;
_exports.createServerRemoteEvents = createServerRemoteEvents;
_exports.createClientRemoteEvents = createClientRemoteEvents;
return _exports;
