#!/bin/bash

export NODE_OPTIONS="${NODE_OPTIONS} --require /opt/internal/index.js"

exec "$@"
