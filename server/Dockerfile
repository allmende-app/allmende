FROM ubuntu:20.04 as builder

RUN apt update -y
RUN apt -y upgrade
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
RUN apt install -y nodejs
RUN apt-get update && apt-get install -y software-properties-common gcc && \
    add-apt-repository -y ppa:deadsnakes/ppa
RUN apt-get update && apt-get install -y python3.8 python3-distutils python3-pip python3-apt python3.8-venv

ENV PYTHONUNBUFFERED=1

WORKDIR /var/src/allmende-server
COPY package.json .
COPY src src
COPY tsconfig.json .
COPY python python
COPY requirements.txt .
RUN python3 --version
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install -r requirements.txt
RUN npm install

FROM builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN npm run build
RUN rm -rf node_modules src tsconfig.json
RUN npm install --only=prod
RUN npm install -g pm2

ENV NODE_ENV production

EXPOSE 3000

ENTRYPOINT [ "pm2-runtime", "dist/index.js" ]



