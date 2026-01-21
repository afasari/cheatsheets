# OAuth 2.0

Authorization framework for delegated access.

## OAuth 2.0 Roles

| ROLE | DESCRIPTION |
| --- | --- |
| **Resource Owner** | User who owns the data |
| **Client** | Application requesting access |
| **Authorization Server** | Server that issues tokens |
| **Resource Server** | Server hosting protected resources |

## OAuth 2.0 Grant Types

### 1. Authorization Code Grant
Used for web applications with server-side components.

```
1. User visits client application
2. Client redirects to authorization server
3. User authenticates and grants permission
4. Authorization server redirects with authorization code
5. Client exchanges code for access token
6. Client uses access token to access resources
```

**Example Request:**
```
GET /authorize?
  response_type=code&
  client_id=CLIENT_ID&
  redirect_uri=REDIRECT_URI&
  scope=read+write&
  state=xyz HTTP/1.1
```

**Example Token Request:**
```
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
redirect_uri=REDIRECT_URI&
client_id=CLIENT_ID&
client_secret=CLIENT_SECRET
```

### 2. Implicit Grant
Used for browser-based or mobile apps (now deprecated).

```
1. Client redirects to authorization server
2. User authenticates and grants permission
3. Authorization server redirects with access token in URL fragment
4. Client extracts token from URL
```

**Example Request:**
```
GET /authorize?
  response_type=token&
  client_id=CLIENT_ID&
  redirect_uri=REDIRECT_URI&
  scope=read HTTP/1.1
```

### 3. Resource Owner Password Credentials Grant
Used for first-party apps (user provides credentials directly).

**Example Request:**
```
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=password&
username=USER&
password=PASSWORD&
client_id=CLIENT_ID&
client_secret=CLIENT_SECRET&
scope=read
```

### 4. Client Credentials Grant
Used for service-to-service communication (no user involved).

**Example Request:**
```
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=CLIENT_ID&
client_secret=CLIENT_SECRET&
scope=read+write
```

### 5. Refresh Token Grant
Used to obtain new access tokens without user interaction.

**Example Request:**
```
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=REFRESH_TOKEN&
client_id=CLIENT_ID&
client_secret=CLIENT_SECRET
```

## OAuth 2.0 Endpoints

| ENDPOINT | DESCRIPTION |
| --- | --- |
| `/authorize` | Authorization endpoint |
| `/token` | Token endpoint |
| `/revoke` | Revoke token endpoint |
| `/userinfo` | User information endpoint |
| `/introspect` | Token introspection endpoint |

## Tokens

### Access Token
- Used to access protected resources
- Usually short-lived (e.g., 1 hour)
- Sent in Authorization header

```
Authorization: Bearer ACCESS_TOKEN
```

### Refresh Token
- Used to obtain new access tokens
- Long-lived (e.g., 30 days)
- Should be stored securely

### ID Token
- Contains user information
- Used for authentication
- JWT format

## Scopes

Scopes define what access is requested.

| SCOPE | DESCRIPTION |
| --- | --- |
| `read` | Read access |
| `write` | Write access |
| `email` | Access email |
| `profile` | Access profile |
| `admin` | Admin access |

**Example Request:**
```
scope=read write email
```

## PKCE (Proof Key for Code Exchange)

Enhanced security for public clients.

### Step 1: Generate Code Verifier
```javascript
// Generate random string (43-128 characters)
const verifier = crypto.randomBytes(32).toString('base64url');
```

### Step 2: Create Code Challenge
```javascript
// SHA-256 hash
const hash = crypto.createHash('sha256').update(verifier).digest();
const challenge = base64urlEncode(hash);
```

### Step 3: Authorization Request
```
GET /authorize?
  response_type=code&
  client_id=CLIENT_ID&
  code_challenge=CHALLENGE&
  code_challenge_method=S256 HTTP/1.1
```

### Step 4: Token Request
```
POST /token HTTP/1.1

grant_type=authorization_code&
code=CODE&
code_verifier=VERIFIER&
client_id=CLIENT_ID
```

## JWT (JSON Web Token)

### Structure
- **Header**: Algorithm and token type
- **Payload**: Claims (data)
- **Signature**: Cryptographic signature

### Example JWT
```json
// Header
{
  "alg": "RS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### Decode JWT
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.decode(token);
console.log(decoded);
```

### Verify JWT
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.verify(token, 'secret', (err, decoded) => {
  if (err) {
    console.log('Invalid token');
  } else {
    console.log('Valid token', decoded);
  }
});
```

## State Parameter

Prevents CSRF attacks.

**Example:**
```javascript
// Generate state
const state = crypto.randomBytes(16).toString('base64');

// Store in session
session.oauthState = state;

// Use in authorization request
const authUrl = `https://auth.com/authorize?
  response_type=code&
  client_id=${clientId}&
  redirect_uri=${redirectUri}&
  state=${state}`;
```

## Error Codes

| CODE | DESCRIPTION |
| --- | --- |
| `invalid_request` | Invalid request |
| `unauthorized_client` | Client not authorized |
| `access_denied` | User denied access |
| `unsupported_response_type` | Response type not supported |
| `invalid_scope` | Invalid scope |
| `server_error` | Server error |
| `temporarily_unavailable` | Service unavailable |
| `invalid_client` | Invalid client credentials |
| `invalid_grant` | Invalid grant type |
| `invalid_token` | Invalid token |

## Best Practices

- Use HTTPS for all OAuth requests
- Use authorization code flow with PKCE for public clients
- Use state parameter to prevent CSRF
- Validate redirect URIs
- Use short-lived access tokens
- Use refresh tokens with proper storage
- Implement token revocation
- Use proper scope management
- Validate tokens on resource server
- Log OAuth events for security
- Regularly rotate client secrets
- Implement rate limiting
- Use secure token storage

## OpenID Connect (OIDC)

### Authentication Protocol

```
GET /.well-known/openid-configuration HTTP/1.1

Response:
{
  "issuer": "https://auth.com",
  "authorization_endpoint": "https://auth.com/authorize",
  "token_endpoint": "https://auth.com/token",
  "userinfo_endpoint": "https://auth.com/userinfo",
  "jwks_uri": "https://auth.com/jwks"
}
```

### ID Token
```javascript
// Decode ID token
const decoded = jwt.decode(idToken);

// Verify issuer
if (decoded.iss !== 'https://auth.com') {
  throw new Error('Invalid issuer');
}

// Verify audience
if (decoded.aud !== clientId) {
  throw new Error('Invalid audience');
}
```

## Troubleshooting

### Common Issues
- **Invalid Client**: Check client ID and secret
- **Redirect URI Mismatch**: Ensure redirect URIs match
- **Expired Token**: Use refresh token
- **Invalid Scope**: Check requested scopes
- **State Mismatch**: Validate state parameter

### Debug Requests
```bash
# Test authorization endpoint
curl -v "https://auth.com/authorize?client_id=xxx&response_type=code"

# Test token endpoint
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=xxx&redirect_uri=xxx" \
  https://auth.com/token
```

::: tip
Use PKCE for mobile and single-page applications to enhance security.
:::
