#!/usr/bin/env bash

# source script to export
# secrets to bash process

export DATABASE_URL="mongodb://127.0.0.1/imdb"
export PORT=1339
export JWT_SECRET_KEY=$WINDOWID
export CLIENT_URL="http://localhost:1339/api/v1/"
