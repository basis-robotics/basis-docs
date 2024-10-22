ARG BASE_IMAGE=node:22
FROM $BASE_IMAGE AS basis-docs

WORKDIR /tmp/

RUN npm install docusaurus

#
# --- Build:
# docker build --tag basis-docs --target basis-docs -f Dockerfile .
#
# --- Start Docker container:
# docker run -v C:\Users\thoma\source\repos\basis-docs:/basis_docs  -p 4000:4000 --name basis-docs --rm -it basis-docs

WORKDIR /basis_docs/docs
CMD npm run start -- --host 0.0.0.0 --port 4000