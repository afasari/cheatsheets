# HTTP Status Codes

Complete reference for HTTP response status codes.

## 1xx Informational Responses

| CODE | DESCRIPTION |
| --- | --- |
| `100 Continue` | Server received request headers |
| `101 Switching Protocols` | Switching to requested protocol |
| `102 Processing` | Server processing request (WebDAV) |

## 2xx Success

| CODE | DESCRIPTION |
| --- | --- |
| `200 OK` | Request succeeded |
| `201 Created` | Resource created successfully |
| `202 Accepted` | Request accepted for processing |
| `203 Non-Authoritative Information` | Modified headers from original |
| `204 No Content` | Success, no content returned |
| `205 Reset Content` | Reset content after request |
| `206 Partial Content` | Partial GET request succeeded |

## 3xx Redirection

| CODE | DESCRIPTION |
| --- | --- |
| `300 Multiple Choices` | Multiple options available |
| `301 Moved Permanently` | Resource moved permanently |
| `302 Found` | Resource moved temporarily |
| `303 See Other` | Redirect to different location |
| `304 Not Modified` | Resource not modified (ETag) |
| `305 Use Proxy` | Request via proxy |
| `306 Switch Proxy` | Switch proxy (deprecated) |
| `307 Temporary Redirect` | Redirect to same method |
| `308 Permanent Redirect` | Permanent redirect with same method |

## 4xx Client Errors

| CODE | DESCRIPTION |
| --- | --- |
| `400 Bad Request` | Invalid request syntax |
| `401 Unauthorized` | Authentication required |
| `402 Payment Required` | Payment required (rarely used) |
| `403 Forbidden` | Access denied |
| `404 Not Found` | Resource not found |
| `405 Method Not Allowed` | Method not allowed for resource |
| `406 Not Acceptable` | Not acceptable format |
| `407 Proxy Authentication Required` | Proxy authentication needed |
| `408 Request Timeout` | Client timeout |
| `409 Conflict` | Conflict with current state |
| `410 Gone` | Resource permanently removed |
| `411 Length Required` | Content-Length required |
| `412 Precondition Failed` | Precondition failed |
| `413 Payload Too Large` | Request entity too large |
| `414 URI Too Long` | URI too long |
| `415 Unsupported Media Type` | Unsupported media type |
| `416 Range Not Satisfiable` | Requested range invalid |
| `417 Expectation Failed` | Expectation failed |
| `418 I'm a teapot` | April Fools joke (HTCPCP) |
| `422 Unprocessable Entity` | Unprocessable entity (WebDAV) |
| `423 Locked` | Resource locked (WebDAV) |
| `424 Failed Dependency` | Dependency failed (WebDAV) |
| `425 Too Early` | Too early request |
| `426 Upgrade Required` | Upgrade required |
| `428 Precondition Required` | Precondition required |
| `429 Too Many Requests` | Rate limit exceeded |
| `431 Request Header Fields Too Large` | Headers too large |
| `451 Unavailable For Legal Reasons` | Unavailable for legal reasons |

## 5xx Server Errors

| CODE | DESCRIPTION |
| --- | --- |
| `500 Internal Server Error` | Generic server error |
| `501 Not Implemented` | Feature not implemented |
| `502 Bad Gateway` | Invalid response from upstream |
| `503 Service Unavailable` | Service temporarily unavailable |
| `504 Gateway Timeout` | Upstream timeout |
| `505 HTTP Version Not Supported` | HTTP version not supported |
| `506 Variant Also Negotiates` | Variant negotiates (rare) |
| `507 Insufficient Storage` | Insufficient storage (WebDAV) |
| `508 Loop Detected` | Loop detected (WebDAV) |
| `510 Not Extended` | Extensions not supported |
| `511 Network Authentication Required` | Network auth required |

## Common Status Codes

### 200 OK
The request succeeded.

**Example:**
```bash
curl -I https://example.com
# HTTP/1.1 200 OK
```

### 301 Moved Permanently
The resource has been permanently moved to a new location.

**Use Cases:**
- Changed URL structure
- Redirecting from non-www to www
- Protocol upgrade (HTTP to HTTPS)

**Example:**
```bash
curl -I http://example.com
# HTTP/1.1 301 Moved Permanently
# Location: https://example.com
```

### 302 Found
The resource temporarily resides at a different location.

**Use Cases:**
- Temporary redirects
- POST-Redirect-GET pattern

**Example:**
```bash
curl -I https://example.com/login
# HTTP/1.1 302 Found
# Location: https://example.com/dashboard
```

### 304 Not Modified
The resource has not been modified since last requested.

**Use Cases:**
- Caching with ETag headers
- Conditional requests

**Example:**
```bash
curl -I https://example.com/resource -H "If-None-Match: etag-value"
# HTTP/1.1 304 Not Modified
```

### 400 Bad Request
The server cannot process the request due to client error.

**Use Cases:**
- Invalid JSON/XML
- Missing required parameters
- Invalid request syntax

**Example:**
```json
{
  "error": "Bad Request",
  "message": "Invalid JSON syntax"
}
```

### 401 Unauthorized
Authentication is required.

**Use Cases:**
- Missing authentication token
- Invalid credentials
- Expired session

**Example:**
```bash
curl https://api.example.com/users
# HTTP/1.1 401 Unauthorized
# WWW-Authenticate: Bearer
```

### 403 Forbidden
The server understood the request but refuses to authorize it.

**Use Cases:**
- Insufficient permissions
- IP-based restrictions
- Geographic restrictions

**Example:**
```bash
curl https://api.example.com/admin
# HTTP/1.1 403 Forbidden
```

### 404 Not Found
The resource could not be found.

**Use Cases:**
- Invalid URL
- Deleted resource
- Typo in URL

**Example:**
```bash
curl https://example.com/invalid-page
# HTTP/1.1 404 Not Found
```

### 429 Too Many Requests
The user has sent too many requests in a given time.

**Use Cases:**
- Rate limiting
- API throttling

**Example:**
```bash
curl -I https://api.example.com/data
# HTTP/1.1 429 Too Many Requests
# Retry-After: 60
```

### 500 Internal Server Error
Unexpected error occurred on server.

**Use Cases:**
- Unhandled exceptions
- Database errors
- Configuration errors

**Example:**
```bash
curl https://api.example.com/error
# HTTP/1.1 500 Internal Server Error
```

### 502 Bad Gateway
The server received invalid response from upstream server.

**Use Cases:**
- Upstream server down
- Upstream server timeout
- Invalid upstream response

**Example:**
```bash
curl https://example.com/proxy
# HTTP/1.1 502 Bad Gateway
```

### 503 Service Unavailable
The server is temporarily unavailable.

**Use Cases:**
- Server maintenance
- Overloaded server
- DDoS protection

**Example:**
```bash
curl -I https://example.com
# HTTP/1.1 503 Service Unavailable
# Retry-After: 3600
```

### 504 Gateway Timeout
The server did not receive timely response from upstream.

**Use Cases:**
- Upstream server slow
- Upstream server timeout
- Network issues

**Example:**
```bash
curl https://example.com/slow
# HTTP/1.1 504 Gateway Timeout
```

## HTTP Headers

### Common Request Headers
| HEADER | DESCRIPTION |
| --- | --- |
| `Accept` | Content types acceptable |
| `Accept-Language` | Preferred language |
| `Authorization` | Authentication credentials |
| `Content-Type` | Media type of body |
| `Cookie` | HTTP cookies |
| `User-Agent` | Client user agent |

### Common Response Headers
| HEADER | DESCRIPTION |
| --- | --- |
| `Content-Type` | Media type of response |
| `Content-Length` | Response body length |
| `Set-Cookie` | HTTP cookies |
| `Cache-Control` | Caching directives |
| `ETag` | Entity tag for caching |
| `Location` | Redirect location |
| `Retry-After` | Retry after time |
| `WWW-Authenticate` | Authentication scheme |

## Curl Examples

### Check Status Code
```bash
# Get status code only
curl -o /dev/null -s -w "%{http_code}" https://example.com

# With redirect
curl -o /dev/null -s -w "%{http_code}" -L https://example.com
```

### Follow Redirects
```bash
curl -L https://example.com
```

### With Custom Headers
```bash
curl -H "Authorization: Bearer token" https://api.example.com
```

### POST Request
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"key":"value"}' https://api.example.com
```

### Upload File
```bash
curl -F "file=@localfile.txt" https://example.com/upload
```

## Best Practices

- Use 301 for permanent redirects
- Use 302 for temporary redirects
- Implement proper error handling for 4xx codes
- Log and monitor 5xx errors
- Use appropriate status codes
- Include proper error messages
- Implement rate limiting (429)
- Cache responses with 304
- Use proper authentication (401)
- Set proper headers
- Monitor response times

## Troubleshooting

### Debug HTTP Requests
```bash
# Verbose mode
curl -v https://example.com

# Show headers only
curl -I https://example.com
```

### Check Redirect Chain
```bash
# Follow all redirects
curl -L -v https://example.com 2>&1 | grep "HTTP/"
```

### Test with Different Methods
```bash
# HEAD request
curl -I https://example.com

# OPTIONS request
curl -X OPTIONS https://example.com
```

::: tip
Use `curl -v` (verbose) to debug HTTP requests and see full request/response headers.
:::
