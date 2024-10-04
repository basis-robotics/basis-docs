ARG BASE_IMAGE=ubuntu:22.04
FROM $BASE_IMAGE AS basis-docs

WORKDIR /basis_doc

RUN apt update && apt install -y \
    sudo \
    curl

ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=18

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION} && nvm alias default ${NODE_VERSION}
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN . "$NVM_DIR/nvm.sh" && npm install docusaurus

#
# --- Build:
# docker build --tag basis-docs --target basis-docs -f Dockerfile .
#
# --- Start Docker container:
# docker run -v C:\Users\thoma\source\repos\basis-docs:/basis_doc  -p 4000:4000 --name basis-docs --rm -it basis-docs /bin/bash 
#
# --- Run docusaurus:
# cd /basis_doc/docs
# ./start.sh