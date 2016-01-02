# robodash-core

##Highlevel description:

Robodash-core provides an API to interact with a robot that has a network adapter (LoRaWAN, BLE, WiFi) and is connected to the computer running Robodash-core. 

*Control:*
Robodash-core can send direct commands (e.g. "drive to X") to be executed immediately. In contrast to this, automatic command logic can be defined and run (e.g. "go to X, then do Y if Z" or responding to events or emitting events itself).

*Logging:*
Robodash-core stores the incoming robot data locally (PouchDB) but can be synchronised to the cloud (CouchDB). It stores the outgoing robot commands in an auditable log.

*Analysis:*
All robot data can be analysed in Robodash-desktop and Robodash-browser. Robodash-core only acts as a data provider.

##Architecture:
Robodash core utilises CyclonJS for robot interaction and control. If a robot supports a hardware connection, CyclonJS can provide access to the data going over the connection and must call a robodash-core method to store any data. Examples are BLE characteristic read/notify/write.

Robodash core can access peripherals like a Dual Shock 3 joystick (also via CyclonJS). 

Data persistence is achieved with a CouchDB where events, robot metadata and control logic is stored. Synchronisation is built-in to CouchDB. The local instance (PouchDB) has the option to synchronise to the "cloud".

The HTTP API module of CyclonJS implements the [CPPP-IO](https://github.com/hybridgroup/cppp-io)  which allows direct execution of commands over HTTP. It does this by utilising the CyclonJS MCP.

The MCP provides a Javascript API for all commands and events of CyclonJS.



