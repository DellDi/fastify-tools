# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# 启用 Corepack
RUN corepack enable

# 设置 corepack的环境变量
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com

# Set the npm registry to the mirror
RUN pnpm config set registry https://registry.npmmirror.com

# Copy the package.json and package-lock.json
COPY package.json .

# Install dependencies for the entire monorepo
RUN pnpm install

# Remove .env.local file
RUN rm -f .env.local

# Copy the rest of the files
COPY  . .

# Build the application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["pnpm", "start"]
