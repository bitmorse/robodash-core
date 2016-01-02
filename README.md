# robodash-core

##Highlevel description:

Robodash-core provides an API to interact with a robot that has a network adapter (LoRaWAN, BLE, WiFi) and is connected to the computer running Robodash-core. 

*Control:*
Robodash-core can send direct commands (e.g. "drive to X") to be executed immediately. In contrast to this, automatic command logic can be defined and run (e.g. "go to X, then do Y if Z" or responding to events or emitting events itself).

*Storage/Logging:*
Robodash-core stores the incoming robot data locally (PouchDB) but can be synchronised to the cloud (CouchDB). It stores the outgoing robot commands in an auditable log. Stored data is dynamically fed back to CyclonJS which exposes new robots/events/devices.

*Analysis:*
All robot data can be analysed in Robodash-desktop and Robodash-browser. Robodash-core only acts as a data provider.

*API:*
CyclonJS-HTTP-API is utilised by the frontend (Robodash-desktop and Robodash-browser).


##Architecture:
Robodash core utilises CyclonJS for robot interaction and control. If a robot supports a hardware connection, CyclonJS can provide access to the data going over the connection and must call a robodash-core method to store any data. Examples are BLE characteristic read/notify/write.

Robodash core can access peripherals like a Dual Shock 3 joystick (also via CyclonJS). 

Data persistence is achieved with a CouchDB where events, robot metadata and control logic is stored. Synchronisation is built-in to CouchDB. The local instance (PouchDB) has the option to synchronise to the "cloud".

The HTTP API module of CyclonJS implements the [CPPP-IO](https://github.com/hybridgroup/cppp-io)  which allows direct execution of commands over HTTP. It does this by utilising the CyclonJS MCP.

The MCP provides a Javascript API for all commands and events of CyclonJS.

Events that happen while Robodash-core is not running on the users computer (Robodash-desktop) are processed by the server (if the users CouchDB was synchronised). The server responds if any automatic command logic was defined. Commands and events are logged just as they were when running on the local instance. If the local instance is running and online, the server does not run the automatic command logic anymore.

One CouchDB database per user. One document per data emitting device (storage). One document for all robots.

Events: The Robodash-core provides a data ingest endpoints for LoRaWAN packet forwarders, Iridium and other providers, where external events and data can be sent to. (i.e. LoRaWAN gateway sends packets to this endpoint). This endpoint has access to the couchdb and writes to the appropriate location after processing of data. With live sync, the changes are instantly visible in the Robodash-desktop client.

Replication: CouchDB replication is unidirectional (source -> target), thus two replication must be made. Changes include new documents, changed documents, and deleted documents. Documents that already exist on the target in the same revision are not transferred; only newer revisions are. 



