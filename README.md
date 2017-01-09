Blueprints
---

> NOTE: This is very much work in progress and is not ready for production use. But feel free to take a peak and explore 😎

The purpose of this project is to define a branded styleguide for people to import and use in their projects.

### How do I view Blueprints documentation?

You have three options.

#### Option 1

http://10.133.192.166:3000/

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
