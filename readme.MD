## Description

With this resource you can easily edit props position/rotation in game, using threejs transform controls.

## How to start example resource

First, install all dependencies

```
yarn init
```

Then, build client and cef

```
yarn build-client
yarn build-cef
```

Create resource.toml in dist folder. Example resource.toml file:

```toml
# The serverside type of your resource (the correct module for that type has to be loaded)
type = "js"
# The clientside type of your resource (the correct module for that type has to be loaded)
client-type = "js"
# The main serverside file that will get loaded when the server starts
# The main clientside file that will get loaded when the client starts
client-main = "client.js"
# The files that the client has access to (The client-main file does not have to be included here)
client-files = [
    "html/*",
    "client.js"
]
```

Add resource to server.toml and start server. Now you can use console command edit-object to test it.

## Keybinds:

```
K - toggle cursor
ENTER - save
BACKSPACE - cancel
W - change edit to position
E - change edit to rotation

```
