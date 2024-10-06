#!/bin/bash

if [[ "$1" == "clear" ]]; then
  echo -e "\n\n\n\n\nClearing cache...\n\n"
  npm run clear
fi

echo -e "\n\n\n\n\nStarting the server...\n\n"
npm run start -- --host 0.0.0.0 --port 4000\