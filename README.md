## Docompanion (Proof of Concept)

Docompanion is an app designed using the Flux pattern to allow for secondary media to
be consumed.  This secondary media might accompany a video game, movie, or even a book,
and this app provides an interface to be able to access, track, and enjoy that secondary
media.  In this proof of concept, the secondary contenet is actually primary content;
a short story written by H.P. Lovecraft called The Rats in the Walls. It not a proper
use case, but it provides a body of work that can be integrated with the application.

All items in the database are added by default, but by visiting /pages/debug you
can reset the database and perform other actions.  You can also just clear localStorage
and refresh the page to trigger a fresh database being loaded.

### Setup

##### Prerequisites

First, install [Polymer CLI](https://github.com/Polymer/polymer-cli) using
[npm](https://www.npmjs.com) (we assume you have pre-installed [node.js](https://nodejs.org)).

    npm install -g polymer-cli

### Start the development server

This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app:

    polymer serve --open

### Build

This command performs HTML, CSS, and JS minification on the application
dependencies, and generates a service-worker.js file with code to pre-cache the
dependencies based on the entrypoint and fragments specified in `polymer.json`.
The minified files are output to the `build/unbundled` folder, and are suitable
for serving from a HTTP/2+Push compatible server.

In addition the command also creates a fallback `build/bundled` folder,
generated using fragment bundling, suitable for serving from non
H2/push-compatible servers or to clients that do not support H2/Push.

    polymer build

### Preview the build

This command serves the minified version of the app at `http://localhost:8080`
in an unbundled state, as it would be served by a push-compatible server:

    polymer serve build/unbundled

This command serves the minified version of the app at `http://localhost:8080`
generated using fragment bundling:

    polymer serve build/bundled

### Run tests

This command will run [Web Component Tester](https://github.com/Polymer/web-component-tester)
against the browsers currently installed on your machine:

    polymer test
