FROM node:22-alpine

WORKDIR /app

# Copy package files first so Docker can cache the install step
COPY package*.json ./
RUN npm ci --omit=dev

# Then copy the source code
COPY . .

EXPOSE 4000

# Run as the non-root user that ships with the image
USER node

CMD ["node", "src/index.js"]