# Environment Variables in Docker

This guide demonstrates how to configure Docker containers using environment variables.

## Why Environment Variables?

- ✅ **Configuration without code changes**: Change behavior without rebuilding images
- ✅ **Different values per environment**: Dev, staging, production
- ✅ **Security**: Keep secrets out of source code
- ✅ **Service discovery**: Configure service URLs dynamically

## Example: Spring Boot → Flask Communication

This demo shows Spring Boot calling Flask using a configurable URL.

### 1. Define Environment Variable in docker-compose.yml

```yaml
services:
  java-springboot:
    environment:
      - FLASK_API_URL=http://python-flask:5001
    depends_on:
      - python-flask
```

### 2. Read Environment Variable in Application

**Spring Boot** (`application.properties`):
```properties
flask.api.url=${FLASK_API_URL:http://python-flask:5001}
#              ^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^
#              Env variable     Default value
```

**Java Code**:
```java
@Value("${flask.api.url}")
private String flaskApiUrl;
```

### 3. Use the Variable

```java
@GetMapping("/api/call-flask")
public Map<String, Object> callFlask() {
    String url = flaskApiUrl + "/api/data";
    Map<String, Object> data = restTemplate.getForObject(url, Map.class);
    return data;
}
```

## Testing

### Start Services
```bash
docker compose up --build -d
```

### Test the Endpoint
```bash
# Spring Boot calls Flask using the configured URL
curl http://localhost:8080/api/call-flask
```

### Verify Environment Variable
```bash
# Check what's set in the container
docker exec java-springboot-demo env | grep FLASK
```

Expected output:
```
FLASK_API_URL=http://python-flask:5001
```

## Common Patterns

### Pattern 1: Direct Value
```yaml
environment:
  - DATABASE_URL=postgresql://db:5432/mydb
  - API_KEY=abc123
```

### Pattern 2: From .env File
Create `.env` file:
```
FLASK_URL=http://python-flask:5001
DEBUG_MODE=false
```

In `docker-compose.yml`:
```yaml
environment:
  - FLASK_API_URL=${FLASK_URL}
  - DEBUG=${DEBUG_MODE}
```

### Pattern 3: Multiple Variables
```yaml
environment:
  - SERVICE_HOST=python-flask
  - SERVICE_PORT=5001
  - API_VERSION=v1
```

### Pattern 4: Override at Runtime
```bash
docker run -e FLASK_API_URL=http://different-host:5001 myapp
```

## Service Discovery with Docker

When using service names in Docker Compose:

```yaml
services:
  backend:
    # Accessible at hostname "backend"

  frontend:
    environment:
      - BACKEND_URL=http://backend:8080
      #              ^^^^^^^ Service name as hostname
```

Docker's internal DNS resolves service names to container IPs automatically.

## Best Practices

### ✅ Do:
- Use environment variables for configuration
- Provide default values
- Document required variables
- Use `.env` files for local development
- Keep secrets in environment variables (not in code)

### ❌ Don't:
- Hard-code URLs or credentials
- Commit `.env` files with secrets to Git
- Use environment variables for large data
- Expose sensitive values in logs

## Example Output

When Spring Boot calls Flask:

```json
{
  "success": true,
  "message": "Spring Boot successfully called Flask API",
  "springBootContainer": "java-springboot-demo",
  "flaskApiUrl": "http://python-flask:5001/api/data",
  "networkingType": "Server-to-Server (using Docker service name)",
  "flaskData": {
    "success": true,
    "message": "Data from Flask API",
    "framework": "Python Flask",
    "container": "python-flask-demo",
    "data": {
      "items": [
        {"id": 1, "name": "Docker", "type": "Container Platform"},
        {"id": 2, "name": "Flask", "type": "Python Framework"},
        {"id": 3, "name": "React", "type": "JavaScript Library"}
      ]
    }
  }
}
```

## Other Frameworks

### Python (Flask)
```python
import os
backend_url = os.getenv('BACKEND_URL', 'http://localhost:8080')
```

### Node.js
```javascript
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
```

### PHP
```php
$backendUrl = getenv('BACKEND_URL') ?: 'http://localhost:8080';
```

### C#
```csharp
var backendUrl = Environment.GetEnvironmentVariable("BACKEND_URL") ?? "http://localhost:8080";
```

## Troubleshooting

### Variable not set?
```bash
# Check inside container
docker exec <container-name> env

# Verify docker-compose configuration
docker compose config
```

### Wrong value?
- Check `.env` file (if using)
- Verify `docker-compose.yml` syntax
- Rebuild containers: `docker compose up --build`

### Can't connect to service?
- Verify service name matches in docker-compose.yml
- Both services must be on same network
- Check `depends_on` is set correctly
