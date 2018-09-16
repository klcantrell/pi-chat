# PiChat

### A chat app that lets you subscribe to real-time updates of temperature readings from a Raspberry Pi. Built with React, GraphQL, and AppSync.

The chat style interface of this app accepts commands from the user.  The user can send a command to subscribe to real-time updates of temperature readings from the Raspberry Pi.  If the user wants to unsubscribe or just wants the latest temperature reading, there are commands for that, too.

User can:

* Interact with a Raspberry Pi through a chat UI
* Subscribe to real-time data
* Be notified if they issue a command that the Pi doesn't understand

Tech Highlights:

* Used **AWS AppSync** to run a **GraphQL** back-end service
* Used **React** for rendering the UI and managing app state
* Used **Raspberry Pi** running **Node** and **Apollo Client** for sending data

#### Visit the site!
#### https://pichat.surge.sh/