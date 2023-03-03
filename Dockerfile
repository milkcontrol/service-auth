FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .

EXPOSE ${PORT}

COPY entrypoint.sh /
RUN chmod +x entrypoint.sh

VOLUME [ "/app/uploads" ]

# CMD ["./start.sh"]
# RUN ./start.sh
ENTRYPOINT ["./entrypoint.sh"]



