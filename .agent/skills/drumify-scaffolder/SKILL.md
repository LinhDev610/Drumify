---
name: drumify-scaffolder
description: Universal Full-stack CRUD Generator for Drumify. Dynamically discovers paths and enforces project-wide standards (RBAC, Reuse-first, MUI tokens).
---

# Drumify Scaffolder (Universal)

This skill generates a complete CRUD feature for any business entity in the Drumify project by dynamically discovering the correct project structure.

## 🛑 Security & Identity Policy
- **NO SCAFFOLDING** of Roles, Groups, or Job Roles. 
- Identity and Access Management is handled exclusively via **Keycloak**.
- Use existing Keycloak roles (e.g., `ADMIN`, `WAREHOUSE_STAFF`, `HR_MANAGER`) in `@PreAuthorize` annotations.
- Do not create database tables for security entities.

## 📥 Inputs
- **Entity**: (e.g., `Brand`)
- **Fields**: (e.g., `name:String`, `description:String`, `active:boolean`)
- **Context Hint**: (e.g., "Part of Warehouse module")

---

## 🔍 Phase 1: Context Discovery (MANDATORY)
Before generating code, the agent MUST run these commands to locate targets:

1.  **Backend Package**: 
    - `find backend/src/main/java -name "*Application.java"` to find the root package.
    - `find backend/src/main/java -name "dto" -type d` to find the DTO root.
2.  **Target Module**:
    - Search for existing entities or DTOs related to the context to find the `{module}` name and corresponding package.
3.  **Frontend Entry Point**:
    - `find frontend/src/pages/Admin -name "*Workspace.jsx"` to find the management page for this domain.

---

## 🏗️ Phase 2: Generation Standards

### 1. Backend (6-Layer Pattern)
- **Entity**: `backend/src/main/java/{root}/entity/{Entity}.java`
- **Repo**: `backend/src/main/java/{root}/repository/{Entity}Repository.java`
- **DTOs**: `backend/src/main/java/{root}/dto/{module}/{Entity}Request.java` and `{Entity}Response.java`.
- **Mapper**: `backend/src/main/java/{root}/mapper/{Entity}Mapper.java` (Mapstruct).
- **Service**: `backend/src/main/java/{root}/service/{Entity}Service.java`.
- **Controller**: `backend/src/main/java/{root}/controller/{Entity}Controller.java`.
    - **MANDATORY**: Use `@PreAuthorize("hasRole('...')")` on all endpoints.

### 2. Frontend (Tabs Pattern)
- **Service API**: `frontend/src/services/{module}Service.js`.
- **UI Tab**: `frontend/src/pages/Admin/{Workspace}/{Entity}Tab.jsx`.
- **Integration**:
    - Locate `{Module}Workspace.jsx`.
    - Register tab in `*_TAB_CONFIG`.
    - Add case in `renderContent`.

### 🛡️ Reuse-first Policy
- **ErrorCodes**: Always check `backend/src/main/java/{root}/exception/ErrorCode.java` before adding new ones.
- **Common Components**: Use `frontend/src/components/Common/` (`ConfirmDialog`, `StatusBadge`, `Pagination`, `LoadingBar`).
- **Styling**: Always use the project's glassmorphism tokens and Material UI (MUI).
