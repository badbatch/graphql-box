#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

if ! [ "$(command -v mise)" ]; then
  curl -sSf https://mise.run | sh
  mise activate >/dev/null
fi

if [[ -z "${CI}" ]]; then
  mise install
fi
