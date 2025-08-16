# Step 1: Use Node.js base image
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the source code
COPY . .

# Step 6: Build TypeScript → dist/
RUN npm run build

# Step 7: Expose port (same as your server listens on, e.g. 3000)
EXPOSE 5000

# Step 8: Run the app
CMD ["npm", "start"]
