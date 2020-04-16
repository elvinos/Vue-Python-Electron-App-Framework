# Vue - Electron - Eel Framework for Desktop App Development

A framework designed to combine Vue.js as the frontend for python applications - rounded off with Electron to create
 fully fledged desktop applciations.
 
 Either use this as a base template for your new python project requiring a state-of-the art GUI or use this as a guide 
 for creating your own project.
 
 Main features include:
 
 - Vue-electron development tools with auto-reload for rapid GUI prototyping  
 - Build the app into a .app/ dmg (not tested with windows yet) rapidly
 - Python integrated made possible with Eel, run on launch 


## Requirements

- Node 12.x
- Yarn
- Python (recommend creating a new virtual env for this):
    - pyinstaller
    - eel 
 
Clone repository and begin...!

## Project setup
```
yarn install
```
Edit the app.spec file to meet your own build requiremnts
Make sure you are working in the right python environment when working on the project


### Compiles and hot-reloads for development
```
yarn electron:serve
```

### Compile and build/package the app 
Package up python env with:
```
pyinstaller app.spec
```
```
yarn electron:build
```


