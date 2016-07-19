Blueprints
---

> NOTE: This is very much work in progress and is not ready for production use. But feel free to take a peak and explore 😎

The purpose of this project is to define a branded styleguide for people to import and use in their projects.

### How do I view Blueprints documentation?

You have three options.

#### Option 1

http://10.133.192.166:3000/

#### Option 2

Presuming you have Docker and Docker Compose setup on your machine, the following command will get you up and running:

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
# Creates a distribution
$ grunt dist

# Cleans the `build/` directory
$ grunt clean

# Compiles SASS to CSS and creates a build in `build/` directory
$ grunt sass

# Builds the Bootstrap documentation
# by cloning Bootstrap repository
# copying Jekyll partials and parsing them
$ grunt docs:build

# Serves the documentation
$ grunt docs:serve

# Watches `src/` directory for changes and runs SASS compiler
$ grunt watch
```
