# Använd Node 20 Alpine
FROM node:20-alpine

# Skapa arbetskatalog
WORKDIR /app

# Kopiera package.json och package-lock.json först
COPY package*.json ./

# Installera dependencies
RUN npm install

# Kopiera resten av koden
COPY . .

# Exponera port
EXPOSE 3000

# Starta appen
CMD ["node", "start.js"]
