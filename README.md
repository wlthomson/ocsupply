# ocsupply

## Prerequisites

- Docker

## Getting started

1. Get the latest couchdb image: `sudo docker pull apache/couchdb`.
2. Start a CouchDB instance: `sudo docker run -d --name my-couchdb -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password apache/couchdb:latest`.
3. Navigate to the Futon Web GUI: http://localhost:5984/_utils/#login.
4. CouchDB!