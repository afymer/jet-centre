# About docker

Quick explainations of docker if you never used it before.

## TL;DR

### Installation

You only need the docker engine, sadly this is only available on linux (docker HEAVILY uses the linux kernel).

[Docker for ubuntu](https://docs.docker.com/engine/install/ubuntu/)  
[Docker for debian](https://docs.docker.com/engine/install/debian/)

Don't worry, you can still install docker on windows. But because it needs to use wsl, you can't simply install the docker engine, you have to go with the whole desktop installation.

[Docker desktop for windows](https://docs.docker.com/desktop/setup/install/windows-install/)

#### **/!\ IMPORTANT**

You do want to perform some simple [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/) if you don't want to encounter annoying issues about privilegies (you can omit the default logging driver).

### Usage

`docker compose -f docker-compose.dev.yml up --build` to launch the containers  
`docker compose -f docker-compose.dev.yml down` to stop the containers  
`docker ps -a` to list the containers

Pro-tip : use the provided Makefile and simply run

`make dev`  
`make stop`

## Definitions

**Docker** : open-source platform that lets you build, package, and run applications in containers.

**Container** : lightweight, portable, and self-sufficient unit that includes everything needed to run a piece of software. You can think of it as a lightweight virtual machine.

## Docker in jet-centre

We have 3 _images_ :

- app : the main image, runs node with NextJS
- postgres : the databse, in its own container that doesn't need to be rebuilt over and over
- cache : the cache (we currently use redis), also in its own container

At any point you can list the created containers with `docker ps` (this only lists containers that are running, you can specify the `-a` flag to see all the containers registered as well as some usefull details about them)

Docker relies on the concept of images. An image is a read-only blueprint used to create containers — it includes the application code, dependencies, and configuration needed to run the app. You can think of it as a snapshot of the app’s environment. When you run an image, Docker creates a container based on that image.
These images can be published (like npm packages) to the docker hub and used as a starting point to build other images.

We use existing images for postgres and redis, but the image for the app is custom. This custom image is described in `Dockerfile` (note that this file has two flavors : one for dev and one for prod. The Makefile takes care of chosing the right one depending on the configuration).

## Dockerfile

A `Dockerfile` is like a script that builds the image sequentially.

- `FROM node:22-slim AS builder` : we use node:22-slim as our base image, for the builder stage (having multiple stages is usefull to eliminate the garbage produced by building stages, but for now we only have one stage). node:22 means that the image already has node 22 installed, slim means that many non-essential features were removed to reduce the size of the image.
- `WORKDIR /app` : we use the folder /app (in the container!) as the base folder. Every command later refering to the "current" directory will refer to this folder. Note that we could have chosen any folder.
- `COPY package*.json ./` : we copy package.json and package-lock.json from our directory to the container /app directory
- `RUN apt update -y && apt install -y openssl` : we install openssl on the container (not already present because we chose en slim version)
- `RUN npm install --omit=dev`
- `COPY . .` : because our container has no clue about the code which lives on our machine, we have to copy the entire source tree to the container.
- `RUN npx prisma generate`
- `EXPOSE 5005` : we want to expose the port 5005 from the container. This can later be forwarded.

The `Dockerfile.dev` is a bit simpler

```dockerfile
FROM node:22-slim
WORKDIR /app
RUN apt update -y && apt install -y openssl
EXPOSE 5005
EXPOSE 5555
CMD ["npm", "run", "dev"]
```

We can see that no file is copied. This is because the source tree of our machine is mounted on the image directly to allow for hot reloading.

## Docker compose

These 3 containers can be _composed_ together (launched at the same time and connected via a dedicated network) using the very useful `docker compose` command.

- `docker compose up` launches the containers. `-d` may be used to detach them, kinda like appending `&` after a command using bash
- `docker compose down` shuts down the containers (you can still see them using `docker ps -a`)
- `docker compose build` builds the images...

For example, let's have a look at `docker-compose.yml`

```yml
services:
    postgres:
        image: postgres:15
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
            POSTGRES_DB: maindb
        volumes:
            - postgres_data:/var/lib/postgresql/data
        networks:
            - app-network

    cache:
        image: redis:latest
        restart: always
        ports:
            - '6379:6379'
        command: redis-server --save 20 1
        volumes:
            - cache:/data
        networks:
            - cache-network

    app:
        build:
            context: .
            dockerfile: Dockerfile.dev
        container_name: app-dev
        volumes:
            - .:/app
        ports:
            # For the app
            - '5005:5005'
            # For prisma studio
            - '5555:5555'
        env_file:
            - .env
        depends_on:
            - postgres
            - cache
        networks:
            - app-network
            - cache-network
        command: npm run dev

networks:
    app-network:
        driver: bridge
    cache-network:
        driver: bridge

volumes:
    postgres_data:
    cache:
```

We can see that we defined custom networks to allow for communication between containers.
There is also some port forwarding happening.

Finally we can verify that the postgres and cache containers both used a premade image (postgres:15 and redis:latest respectively), while app is based on `Dockerfile.dev`
