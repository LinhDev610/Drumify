---
name: drumify-integrator
description: Universal Configurator for 3rd-party service integrations (GHN, Stripe, Mailchimp, Cloudinary). Enforces strict authentication patterns and global error mapping.
---

# Drumify Integrator (Universal)

Automates the integration of any 3rd-party service into the Drumify backend using the `RestClient` pattern.

## 🛑 MANDATORY STEP: The Interview
Before writing any code, you MUST interview the user to collect:
1.  **Service Type**: (e.g., Payment, Storage, Delivery, CRM)
2.  **Auth Strategy**:
    - `Bearer Token`? (Passed in Header)
    - `API Key`? (Header vs Query Param)
    - `Basic Auth`? (Username/Password)
3.  **Credentials**: Ask for property keys, not values (e.g., "What is the key for your API secret?").
4.  **Module Target**: Where should this integration live?

## 🏗️ 1. Backend Standards

### 🔐 Authentication Patterns
- **Header-based (Standard)**:
  `.header("Authorization", "Bearer " + token)` or `.header("X-API-Key", apiKey)`
- **Query-based**:
  `.uri(uriBuilder -> uriBuilder.queryParam("api_key", apiKey).build())`

### 📦 Client Layer (`com.linhdev.drumify.client`)
- **Type Safety**: Methods MUST return `ParameterizedTypeReference` for complex JSON responses.
- **Normalization**: If the external API uses an envelope (like `{"data": ..., "status": ...}`), create a generic `DTO` to unwrap it (refer to `GhnApiResponse`).

### ⚙️ Config Layer (`com.linhdev.drumify.configuration`)
- Use `@ConfigurationProperties` for all 3rd-party settings.
- **NEVER** hardcode URLs or Keys. Use `application.yml` placeholders.

### 📝 App Config (`application.yml`)
```yaml
{service-prefix}:
  url: ${EXTERNAL_URL:https://api.example.com}
  api-key: ${EXTERNAL_KEY:placeholder}
```

## 🛡️ 2. Reliability & Error Mapping
- **Error Mapping**: Map external status codes (400, 401, 404, 500) to project-specific `ErrorCode` values in `ErrorCode.java`.
- **Validation**: Validate external responses before passing them to the Service layer.

## ⚠️ Constraints
- Use `RestClient` exclusively (preferred over Feign for simple business integrations).
- Follow the **6-layer pattern** (Client -> DTO -> Service -> Controller).
- Controller endpoints for 3rd-party triggers MUST have `@PreAuthorize`.
