FROM alpine:latest

RUN apk update && apk add --no-cache curl && apk add --no-cache busybox-suid

COPY request.sh /usr/local/bin/request.sh

RUN chmod +x /usr/local/bin/request.sh

RUN echo "*/1 * * * * /usr/local/bin/request.sh >> /var/log/cron.log 2>&1" > /etc/crontabs/root

ARG TARGET_URL
ARG EXPIRATION_SECRET

ENV TARGET_URL=${TARGET_URL}
ENV EXPIRATION_SECRET=${EXPIRATION_SECRET}

CMD ["crond", "-f", "-l", "2"]
