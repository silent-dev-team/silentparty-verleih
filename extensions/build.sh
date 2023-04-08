#!/bin/bash

for d in */ ; do
  cd "$d" && make
  cd ..
done

chmod -R a+rwx ./dist