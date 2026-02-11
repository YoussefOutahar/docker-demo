# Docker Demo Projects

A collection of minimal "Hello World" applications demonstrating Docker containerization across 5 different technology stacks. Perfect for learning Docker basics with various programming languages and frameworks.

## Projects Overview

1. **PHP Laravel** - Simple PHP application with Apache
2. **Python Flask** - Lightweight Python web framework
3. **Java Spring Boot** - Enterprise Java application with multi-stage build
4. **C# .NET** - Console application demonstrating .NET containerization
5. **JavaScript React** - Modern frontend application with Nginx

## Prerequisites

- Docker installed on your system ([Download Docker](https://www.docker.com/products/docker-desktop))
- Basic understanding of command line/terminal
- No programming language runtimes needed (that's the beauty of Docker!)

## Quick Start

You have two options: run all projects together with Docker Compose (recommended for demos) or run each project individually.

### Option 1: Run All Projects with Docker Compose (Recommended)

The easiest way to run all 5 projects at once:

```bash
# Build and start all containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

Once running, access the applications at:
- **PHP Laravel**: http://localhost:8081
- **Python Flask**: http://localhost:5000
- **Java Spring Boot**: http://localhost:8080
- **JavaScript React**: http://localhost:8082
- **C# .NET**: View logs with `docker logs csharp-dotnet-demo`

**Useful Docker Compose commands:**
```bash
# View all running services
docker-compose ps

# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs python-flask

# Stop all services
docker-compose down

# Rebuild a specific service
docker-compose up --build python-flask

# Stop and remove all containers, networks, and volumes
docker-compose down -v
```

---

### Option 2: Run Projects Individually

Each project can be built and run independently. Navigate to any project directory and follow the instructions below.

### 1. PHP Laravel

```bash
cd 1-php-laravel
docker build -t php-laravel-demo .
docker run -p 8081:80 php-laravel-demo
```

**Test:** Open http://localhost:8081 in your browser or run:
```bash
curl http://localhost:8081
```

**Expected output:** JSON response with "Hello from Laravel"

---

### 2. Python Flask

```bash
cd 2-python-flask
docker build -t python-flask-demo .
docker run -p 5000:5000 python-flask-demo
```

**Test:** Open http://localhost:5000 in your browser or run:
```bash
curl http://localhost:5000
```

**Expected output:** JSON response with "Hello from Flask"

---

### 3. Java Spring Boot

```bash
cd 3-java-springboot
docker build -t java-springboot-demo .
docker run -p 8080:8080 java-springboot-demo
```

**Test:** Open http://localhost:8080 in your browser or run:
```bash
curl http://localhost:8080
```

**Expected output:** JSON response with "Hello from Spring Boot"

**Note:** This build takes longer due to Maven dependency downloads (first time only).

---

### 4. C# .NET

```bash
cd 4-csharp-dotnet
docker build -t csharp-dotnet-demo .
docker run -it csharp-dotnet-demo
```

**Expected output:** Console output displaying "Hello from .NET!" with version information.

**Note:** Use `-it` flag for interactive terminal. Press any key to exit the container.

---

### 5. JavaScript React

```bash
cd 5-javascript-react
docker build -t javascript-react-demo .
docker run -p 8082:80 javascript-react-demo
```

**Test:** Open http://localhost:8082 in your browser

**Expected output:** React webpage displaying "Hello from React" with styling.

**Note:** This build takes longer due to npm install and build process (first time only).

---

## Docker Concepts Demonstrated

### Single-Stage Builds
- **PHP Laravel**: Simple copy-and-run pattern
- **Python Flask**: Install dependencies then run

### Multi-Stage Builds
- **Java Spring Boot**: Build with Maven, run with JRE (smaller final image)
- **C# .NET**: Build with SDK, run with Runtime (smaller final image)
- **JavaScript React**: Build with Node.js, serve with Nginx (production-ready)

### Docker Compose Orchestration
- **Service Definition**: Multiple services in one configuration file
- **Networking**: All containers connected via a bridge network
- **Port Mapping**: Each service exposed on different host ports
- **Container Naming**: Consistent, predictable container names
- **Restart Policies**: Auto-restart for web services

### Best Practices Shown
- Using official base images
- Leveraging `.dockerignore` to exclude unnecessary files
- Exposing appropriate ports
- Using `WORKDIR` for organization
- Copying dependency files first for better layer caching
- Using slim/alpine variants for smaller images
- Organizing multi-container applications with Docker Compose

## Useful Docker Commands

### View running containers
```bash
docker ps
```

### Stop a running container
```bash
docker stop <container-id>
```

### Remove a container
```bash
docker rm <container-id>
```

### View all images
```bash
docker images
```

### Remove an image
```bash
docker rmi <image-name>
```

### View container logs
```bash
docker logs <container-id>
```

### Run container in detached mode (background)
```bash
docker run -d -p <port>:<port> <image-name>
```

### Execute command in running container
```bash
docker exec -it <container-id> /bin/bash
```

## Troubleshooting

### Port already in use
If you get a port binding error, either:
- Stop the container using that port: `docker ps` then `docker stop <container-id>`
- Use a different host port: `docker run -p 8888:80 <image-name>`

### Build fails
- Ensure you're in the correct project directory
- Check Docker is running: `docker version`
- Try cleaning up: `docker system prune`

### Container exits immediately
- For the .NET console app, this is expected unless you use `-it` flag
- For web apps, check logs: `docker logs <container-id>`

## Learning Path

1. Start with **Python Flask** - simplest web application
2. Try **PHP Laravel** - similar but different runtime
3. Build **Java Spring Boot** - introduces multi-stage builds
4. Explore **C# .NET** - console app pattern
5. Finish with **JavaScript React** - production build pattern with Nginx

## File Structure

```
docker-demo/
├── README.md
├── docker-compose.yml
├── 1-php-laravel/
│   ├── Dockerfile
│   ├── index.php
│   └── .dockerignore
├── 2-python-flask/
│   ├── Dockerfile
│   ├── app.py
│   ├── requirements.txt
│   └── .dockerignore
├── 3-java-springboot/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── .dockerignore
│   └── src/main/java/com/demo/
│       ├── Application.java
│       └── HelloController.java
├── 4-csharp-dotnet/
│   ├── Dockerfile
│   ├── Program.cs
│   ├── dotnet-demo.csproj
│   └── .dockerignore
└── 5-javascript-react/
    ├── Dockerfile
    ├── package.json
    ├── .dockerignore
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        └── index.js
```

## Next Steps

After mastering these basics, explore:
- ✅ **Docker Compose** - Already included in this project!
- Docker volumes for data persistence
- Environment variables and configuration
- Advanced Docker networking
- Building optimized production images
- Docker secrets and configs
- Health checks and monitoring
- Container orchestration with Kubernetes or Docker Swarm

## License

Free to use for educational purposes.

## Contributing

Feel free to suggest improvements or report issues!
