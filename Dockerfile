FROM node:20-alpine

WORKDIR /api-users

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3006

CMD [ "npm", "run" , "start:prod" ]
