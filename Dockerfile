FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY dist .

CMD [ "node", "--experimental-modules", "app.js" ]
