# Docker Networking Demo

This demo showcases how containers communicate with each other in a Docker network.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                   (demo-network)                         │
│                                                          │
│  ┌──────────────┐              ┌──────────────┐        │
│  │   React      │   HTTP API   │   Flask      │        │
│  │  Container   │──────────────>│  Container   │        │
│  │              │              │              │        │
│  │ Port: 8082   │              │ Port: 5001   │        │
│  └──────────────┘              └──────────────┘        │
│         │                                               │
└─────────┼───────────────────────────────────────────────┘
          │
          │ Browser Access
          ▼
    Your Computer
   (localhost:8082)
```

## How It Works

### 1. **Docker Network**
All containers are connected to a bridge network called `demo-network` (defined in `docker-compose.yml`).

```yaml
networks:
  demo-network:
    driver: bridge
```

### 2. **Service Discovery**
In Docker Compose, containers can reach each other using their service names as hostnames:
- `php-laravel` → accessible at `http://php-laravel:80`
- `python-flask` → accessible at `http://python-flask:5001`
- `java-springboot` → accessible at `http://java-springboot:8080`
- `javascript-react` → accessible at `http://javascript-react:80`

### 3. **React ➔ Flask Communication**

#### Client-Side (Browser)
Since React runs in the browser, it calls the Flask API using `localhost:5001`:

```javascript
fetch('http://localhost:5001/api/data')
```

This works because:
1. Your browser is on your host machine
2. Docker maps port 5001 from the container to localhost:5001
3. The browser accesses Flask through the port mapping

#### CORS Configuration
Flask enables CORS (Cross-Origin Resource Sharing) to allow requests from the React app:

```python
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}})
```

## Testing the Network

### 1. Start All Services
```bash
docker compose up --build -d
```

### 2. Access React Frontend
Open http://localhost:8082 in your browser.

You should see:
- ✅ React app UI
- ✅ "Docker Network Demo" section
- ✅ Data loaded from Flask API
- ✅ List of items retrieved from Flask

### 3. Verify Flask API
You can also directly access the Flask API:

```bash
# Main endpoint
curl http://localhost:5001/

# API data endpoint
curl http://localhost:5001/api/data
```

### 4. Check Container Connectivity

Access the React container and ping Flask:
```bash
docker exec -it javascript-react-demo sh
# Inside the container (won't work for nginx, just an example)
```

Access the Flask container:
```bash
docker exec -it python-flask-demo sh
# Inside the container
ping php-laravel    # Test connectivity to PHP container
ping java-springboot # Test connectivity to Java container
```

## Network Inspection

### View Network Details
```bash
# List all networks
docker network ls

# Inspect the demo network
docker network inspect docker-demo_demo-network
```

### View Connected Containers
```bash
docker network inspect docker-demo_demo-network --format='{{range .Containers}}{{.Name}} {{end}}'
```

## Inter-Container Communication Examples

### From Python Flask to Java Spring Boot
If you wanted Flask to call Spring Boot, you would use:
```python
import requests
response = requests.get('http://java-springboot:8080/')
```

### From Java Spring Boot to PHP Laravel
```java
RestTemplate restTemplate = new RestTemplate();
String result = restTemplate.getForObject("http://php-laravel:80/", String.class);
```

## Port Mapping Summary

| Service        | Internal Port | External Port | Access URL                 |
|----------------|---------------|---------------|----------------------------|
| PHP Laravel    | 80            | 8081          | http://localhost:8081      |
| Python Flask   | 5001          | 5001          | http://localhost:5001      |
| Java Spring    | 8080          | 8080          | http://localhost:8080      |
| React          | 80            | 8082          | http://localhost:8082      |
| .NET Console   | -             | -             | (Console app, no web port) |

## Key Concepts

### 1. **Bridge Network**
- Default network driver for Docker Compose
- Containers can communicate using service names
- Isolated from host network

### 2. **DNS Resolution**
- Docker provides built-in DNS
- Service names automatically resolve to container IPs
- No need to hard-code IP addresses

### 3. **Port Publishing**
- Format: `host_port:container_port`
- Makes container services accessible from host machine
- Required for browser access

### 4. **Network Isolation**
- Containers in the same network can communicate
- Containers in different networks are isolated
- Better security and organization

## Troubleshooting

### React can't connect to Flask
1. Make sure Flask is running: `docker ps`
2. Check Flask logs: `docker logs python-flask-demo`
3. Verify port mapping: `docker ps | grep flask`
4. Test Flask directly: `curl http://localhost:5001/api/data`

### CORS errors in browser
- Check Flask has `flask-cors` installed
- Verify CORS is enabled in `app.py`
- Check browser console for specific error

### Port 5000 conflict on macOS
**Problem:** macOS AirPlay Receiver uses port 5000 by default, causing 403 Forbidden errors with `AirTunes` server headers.

**Solution 1 (Recommended):** This project uses port 5001 instead to avoid conflicts.

**Solution 2 (Alternative):** Disable AirPlay Receiver:
1. Open System Settings
2. Go to General → AirDrop & Handoff
3. Uncheck "AirPlay Receiver"

### Network not found
```bash
# Recreate network
docker compose down
docker compose up -d
```

## Learning Objectives

After completing this demo, you should understand:
- ✅ How Docker networks connect containers
- ✅ Service discovery using DNS names
- ✅ Port mapping vs internal networking
- ✅ CORS configuration for APIs
- ✅ Client-side vs server-side networking
- ✅ Inspecting Docker networks

## Next Steps

1. **Add more API endpoints** to Flask for React to consume
2. **Implement authentication** between services
3. **Add a reverse proxy** (nginx) for routing
4. **Use environment variables** for API URLs
5. **Implement service-to-service** calls (Flask → Spring Boot)
6. **Add health checks** to monitor service availability
