# use the official Node.js image
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# install pnpm and build dependencies
RUN apk add --no-cache python3 make g++ && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json pnpm-lock.yaml /temp/dev/
RUN cd /temp/dev && pnpm install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml /temp/prod/
RUN cd /temp/prod && pnpm install --frozen-lockfile --prod

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# build
ENV NODE_ENV=production
# Add environment variables for build
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
RUN pnpm run build

# copy production dependencies and source code into final image
FROM nginx:alpine AS release
COPY --from=prerelease /usr/src/app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# run the app
EXPOSE 80/tcp
ENTRYPOINT ["nginx", "-g", "daemon off;"]