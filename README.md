Blueprints
---

> NOTE: This is very much work in progress and is not ready for production use. But feel free to take a peak and explore 😎

The purpose of this project is to define a branded styleguide for people to import and use in their projects.

### How do I use Blueprints in my app?

Blueprints is NPM installable, just put `"blueprints": "git://github.private.linksynergy.com/SD/blueprints.git#release_tag_here"` in your package.json and npm install.

The recommended way to use Blueprints is to include the /dist/blueprints.min.js in your app, and include Blueprints's src/blueprints.scss file in your app scss so you have access to all the variables (like colors and sizes) to use in your custom css. You can also just include the relevant component/variable/mixin/helper files when you need them to get minimal-weight on-brand css rules for your app.

You can also include the minimized /dist/blueprints.min.css instead of building from the .scss file if you want to just write HTML. Blueprints is based on Bootstrap, so Bootstrap-style HTML will give you a branded app that looks like you'd expect. This is a workable solution for simple UIs.

If you don't want to use NPM to install Blueprints, you can use our remotely hosted prebuilt versions. Released versions of Blueprints live at `https://blueprints-prod.s3.amazonaws.com`. Each version gets a directory and the dist from the release is uploaded there. For instance, to use v1.0.0-rc.5, you can include `http://blueprints-prod.s3.amazonaws.com/v1.0.0-rc.5/blueprints.min.js` and `http://blueprints-prod.s3.amazonaws.com/v1.0.0-rc.5/blueprints.min.css` in your app head.

### How do I view Blueprints documentation?

You have three options.

#### Option 1

http://blueprints.local.rakutenmarketing.com:3000/

#### Option 2

Before you proceed with this option, you'll need to make sure that you have a valid SSH key in the project root directory.
This is to ensure, that Docker can install private dependencies from our Github Enterprise.

```bash
 ssh-keygen -t rsa -b 4096 -C "`whoami`@rakuten.com" -f deploy.key -N ''
```

You also need to add `deploy.key.pub` to your Github SSH keys list.

Assuming you have Docker and Docker Compose setup on your machine, the following command will get you up and running:

```bash
$ docker-compose up
```

Once it finishes the building process, the styleguide will be available on:

[http://192.168.99.100:3000](http://192.168.99.100:3000)

The IP of the Docker host may be different, but you can check that:

```bash
$ docker-machine ip default
```

#### Option 3

Feeling adventurous? No worries, got you covered.

Project dependencies:

* Node (>=5.8.0)

To run the docs:

* Clone the repository
* Run `npm install`
* Run `npm start`
* Visit [http://localhost:3000](http://localhost:3000)

### How do I contribute?

Visit Blueprints documentation page for more details.

### Grunt tasks

```bash

# Builds the Bootstrap documentation
$ grunt build

# Serves the documentation
$ grunt server

# Watches `src/` directory for changes and runs SASS compiler
$ grunt watch
```
