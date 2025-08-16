# Step 1: Use Node.js base image
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first
COPY package*.json ./

# Step 4: Install dependencies (ignore postinstall to avoid prisma crash)
RUN npm install --ignore-scripts

# Step 5: Copy the rest of the source code
COPY . .

# Step 6: Run prisma generate (now schema file exists inside container)
RUN npm run generate

# Step 7: Build TypeScript -> dist/
RUN npm run build

# Step 8: Expose app port
EXPOSE 3000

# Step 9: Start the app
CMD ["npm", "start"]
