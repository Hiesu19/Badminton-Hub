#!/bin/sh
set -e

# Start each preview server on its designated port, keep container running until all exit.
pnpm --filter admin preview --host 0.0.0.0 --port 4173 &
pnpm --filter client preview --host 0.0.0.0 --port 4174 &
pnpm --filter owner preview --host 0.0.0.0 --port 4175 &

wait

