#!/bin/bash
if [[ "$#" -eq 0 ]]; then
    echo "Build Production"
    docker build --platform linux/amd64 -f ./Dockerfile --force-rm -t kakakhang/e-contract:latest . && docker push kakakhang/e-contract:latest  && ssh -A -J root@sys-remote-02.pvssolution.com  root@14.225.239.83 -p 28022 ./e-contract-production.sh && docker rmi -f $(docker images -f "dangling=true" -q)
else
    echo "Build Testing"
    docker build --platform linux/amd64 -f ./Dockerfile-Test --force-rm -t kakakhang/e-contract:test . && docker push kakakhang/e-contract:test && ssh -A -J root@sys-remote-02.pvssolution.com -p 28022  root@14.225.239.83 ./e-contract.sh  && docker rmi -f $(docker images -f "dangling=true" -q)
fi