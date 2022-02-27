# Monster Factory

This game is dedicated to my 2 year old son Moos who loves to find and point out little monsters in his books. 

The game is currently open-sourced on github and the game can be played online on github-pages with the link below.

The game is currently in early release.  The finished version would contain 5-8 levels of toys, animals, .... where monsters are invading and the user (kid) has to spot them and remove them to save the world!

Any feedback is appreciated, bugs and suggestions can be reported in the github issue section.

​Thank you for taking the time to tryout this game!

# Play the game online:
https://ben-kn-app.github.io/Monster-Factory/ 

We used the below template to start:

# Trello Board:
https://trello.com/b/6bKl4N4i/monster-factory 

# Instructions on using this repository

1. Clone this repository
2. npm install
3. nx serve monster-factory

# Credits to OpenForge Ionic Monorepo Example

# Important - Utilizing this Repo

Most of the commands to generate projects/capabilities/apps are default to NX, Ionic, or Angular (in that order), so we will NOT include their specific instructions since as the packages update so will the documentation.  

With that said, there are some special things to keep in mind...

## Generating a Project - Additional Step

After any project is created by NX, we MUST add StyleLint

nx g nx-stylelint:configuration --project <projectName>

## Generate an application

The normal NX command to generate an app is `nx g @nrwl/react:app moster-factory` ; however, there are some special steps to generate an Ionic App.  These are defined well in [Eric Jeker's post here](https://medium.com/@eric.jeker/how-to-integrate-ionic-in-nrwl-nx-3493fcb7e85e)

When using Nx, you can create multiple applications and libraries in the same workspace.

# NX Original Instructions

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@com.knapp.monsterfactory/mylib`.

## Development server

Run `npx nx run monster-factory:serve` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=moster-factory` to generate a new component.

## Build

Run `nx build moster-factory` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test moster-factory` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e moster-factory` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

