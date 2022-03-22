#!/bin/bash

echo "BASH INTERNAL EXTENSION: BEGIN"

echo "$@"
echo "{$1, $2, $3, $4, $5, $6, $7}"
exec $1 $2 $3 $4 $5 $6 "--require" "/var/task/internal-extension.js" $7
# exec "/var/lang/bin/node --expose-gc --max-http-header-size 81920 --max-semi-space-size=6 --max-old-space-size=116 /var/runtime/index.js"

# the path to the interpreter and all of the originally intended arguments
# args=("$@")

# # the extra options to pass to the interpreter
# extra_args=("--require" "/var/task/internal-extension.js")

# # insert the extra options
# args=("${args[@]:0:$#-1}" "${extra_args[@]}" "${args[@]: -1}")

# #start the runtime with the extra options
# echo "${args[@]}"
# exec "${args[@]}"
echo "BASH INTERNAL EXTENSION: END"
