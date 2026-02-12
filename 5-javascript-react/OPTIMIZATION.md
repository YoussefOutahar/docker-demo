# Docker Image Optimization Guide

This guide demonstrates the difference between unoptimized and optimized Docker images using the React application as an example.

## Files

- **`Dockerfile`** - Optimized version (default, used by docker-compose)
- **`Dockerfile.optimized`** - Heavily documented optimized version
- **`Dockerfile.unoptimized`** - Anti-pattern example showing common mistakes

## Quick Comparison

| Metric | Unoptimized | Optimized | Improvement |
|--------|-------------|-----------|-------------|
| **Image Size** | ~1.2 GB | ~45 MB | **96% smaller** |
| **Build Stages** | 1 | 2-3 | Multi-stage |
| **Base Image** | node:18 | nginx:alpine | Minimal |
| **Layer Caching** | Poor | Excellent | Faster rebuilds |
| **Dependencies in Final Image** | Yes | No | Cleaner |
| **Build Time (cached)** | Slow | Fast | Better caching |
| **Security** | Root user | Non-root | More secure |

## Build Both Versions

### Unoptimized Version
```bash
cd 5-javascript-react

# Build unoptimized image
docker build -f Dockerfile.unoptimized -t react-unoptimized .

# Check size
docker images react-unoptimized
```

### Optimized Version
```bash
# Build optimized image
docker build -f Dockerfile.optimized -t react-optimized .

# Check size
docker images react-optimized
```

### Compare Sizes
```bash
docker images | grep react
```

Expected output:
```
react-optimized      latest    abc123    2 min ago    45MB
react-unoptimized    latest    def456    3 min ago    1.2GB
```

## Optimization Techniques Explained

### 1. Multi-Stage Builds

**❌ Unoptimized (Single Stage):**
```dockerfile
FROM node:18
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
CMD ["serve", "-s", "build"]
```
- Everything in one stage
- Final image contains Node.js, npm, source code, node_modules
- Image size: ~1.2GB

**✅ Optimized (Multi-Stage):**
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY public ./public
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```
- Build stage compiles the app
- Production stage only has static files
- Final image size: ~45MB

### 2. Layer Caching Optimization

**❌ Unoptimized:**
```dockerfile
COPY . /app              # Copies everything first
RUN npm install          # Invalidated on ANY file change
```
- Any source code change invalidates npm install
- Full dependency reinstall on every build

**✅ Optimized:**
```dockerfile
COPY package.json package-lock.json ./  # Copy only dependency files
RUN npm ci                               # Cached unless dependencies change
COPY src ./src                           # Copy source after install
```
- Dependencies cached unless package.json changes
- Source changes don't trigger dependency reinstall
- Faster rebuilds

### 3. Base Image Selection

**❌ Unoptimized:**
```dockerfile
FROM node:18           # Full Debian-based image: ~900MB
```

**✅ Optimized:**
```dockerfile
FROM node:18-alpine    # Alpine-based: ~180MB
FROM nginx:alpine      # Final image: ~40MB
```

Alpine Linux benefits:
- Minimal base (~5MB vs ~120MB for Debian)
- Smaller attack surface
- Faster pulls and deploys

### 4. Dependency Management

**❌ Unoptimized:**
```dockerfile
RUN npm install        # Installs devDependencies too
                       # Non-deterministic (no lock)
```

**✅ Optimized:**
```dockerfile
RUN npm ci --frozen-lockfile           # Exact versions from lock file
RUN npm ci --only=production           # Production deps only
RUN npm cache clean --force            # Clean up after install
```

Benefits:
- Reproducible builds
- Smaller node_modules
- Faster installs

### 5. File Copying Strategy

**❌ Unoptimized:**
```dockerfile
COPY . /app            # Copies everything including:
                       # - node_modules
                       # - .git
                       # - README.md
                       # - .env files
```

**✅ Optimized:**
```dockerfile
# With .dockerignore file
COPY package.json package-lock.json ./
COPY src ./src
COPY public ./public
```

Plus `.dockerignore`:
```
node_modules
.git
.env
README.md
```

### 6. Production Web Server

**❌ Unoptimized:**
```dockerfile
RUN npm install -g serve
CMD ["serve", "-s", "build"]
```
- Development-grade server
- Requires full Node.js runtime
- Not optimized for production traffic

**✅ Optimized:**
```dockerfile
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
```
- Production-grade nginx
- Optimized for static files
- Better performance and security

### 7. Health Checks

**❌ Unoptimized:**
```dockerfile
# No health check
```

**✅ Optimized:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

Benefits:
- Docker/Kubernetes can detect unhealthy containers
- Automatic restarts if health check fails
- Better monitoring and reliability

### 8. Security Best Practices

**❌ Unoptimized:**
```dockerfile
# Runs as root user
# No security scanning
# Includes unnecessary tools
```

**✅ Optimized:**
```dockerfile
FROM nginx:alpine      # Nginx runs as non-root by default
# Minimal base = smaller attack surface
# Fewer packages = fewer vulnerabilities
```

## Advanced Optimization: 3-Stage Build

For even better optimization, split into 3 stages:

```dockerfile
# Stage 1: Dependencies only
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production --frozen-lockfile

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY public ./public
RUN npm run build

# Stage 3: Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
```

Benefits:
- Even better layer caching
- Separate production and dev dependencies
- Can build dependencies stage once and reuse

## Build Performance Comparison

### First Build (No Cache)
```bash
# Unoptimized
time docker build -f Dockerfile.unoptimized -t react-unoptimized .
# Time: ~3-5 minutes

# Optimized
time docker build -f Dockerfile.optimized -t react-optimized .
# Time: ~2-3 minutes
```

### Second Build (Source Code Changed)
```bash
# Unoptimized - Reinstalls ALL dependencies
# Time: ~3-5 minutes (no cache benefit)

# Optimized - Reuses dependency layer
# Time: ~30 seconds (only rebuilds changed layers)
```

## Testing Both Images

### Run Unoptimized
```bash
docker run -p 3001:3000 react-unoptimized
```
Visit: http://localhost:3001

### Run Optimized
```bash
docker run -p 3002:80 react-optimized
```
Visit: http://localhost:3002

### Compare Resource Usage
```bash
# While both are running
docker stats
```

## Best Practices Checklist

### Image Size
- ✅ Use multi-stage builds
- ✅ Choose minimal base images (alpine)
- ✅ Remove build dependencies from final image
- ✅ Clean up package manager cache

### Build Performance
- ✅ Order COPY commands by change frequency
- ✅ Copy package files before source code
- ✅ Use .dockerignore
- ✅ Combine RUN commands to reduce layers

### Security
- ✅ Run as non-root user
- ✅ Scan images for vulnerabilities
- ✅ Keep base images updated
- ✅ Don't include secrets in images

### Production Readiness
- ✅ Use production-grade web servers
- ✅ Add health checks
- ✅ Set proper labels and metadata
- ✅ Use specific version tags (not :latest)

## Dockerfile Linting

Use `hadolint` to check for best practices:

```bash
# Install hadolint
brew install hadolint  # macOS
# or
docker pull hadolint/hadolint

# Lint unoptimized
hadolint Dockerfile.unoptimized

# Lint optimized
hadolint Dockerfile.optimized
```

## Further Optimization Ideas

1. **Use BuildKit** (faster builds):
   ```bash
   DOCKER_BUILDKIT=1 docker build -t myapp .
   ```

2. **Build arguments** for configuration:
   ```dockerfile
   ARG NODE_ENV=production
   ENV NODE_ENV=$NODE_ENV
   ```

3. **Multi-platform builds**:
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 -t myapp .
   ```

4. **Cache mount** (BuildKit feature):
   ```dockerfile
   RUN --mount=type=cache,target=/root/.npm \
       npm ci
   ```

5. **Distroless images** (even smaller):
   ```dockerfile
   FROM gcr.io/distroless/static
   ```

## Summary

The optimized Dockerfile is:
- **96% smaller** (45MB vs 1.2GB)
- **Faster to build** with better caching
- **More secure** with minimal base image
- **Production-ready** with nginx and health checks
- **Easier to maintain** with clear stages

This demonstrates that proper Docker optimization can dramatically improve your deployment pipeline!
