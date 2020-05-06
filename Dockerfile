FROM ubuntu:latest

ADD ./dist/panoptic-linux /usr/bin/panoptic

ENTRYPOINT ["/usr/bin/panoptic"]
