---
name: drumify-convention
description: >-
  Project-wide coding convention and architecture reference for Drumify.
  Enforces folder structure, naming rules, design system tokens, security patterns (Keycloak RBAC/GBAC),
  API contract, error handling, and frontend/backend layer responsibilities.
  Use this skill whenever writing new code, reviewing code, refactoring, debugging, 
  or asking architectural questions about the Drumify project.
  Trigger on any mention of conventions, standards, architecture, naming, structure,
  design system, styling, error handling, security, or "how should I..." questions.
---

# 🥁 Drumify — Project Convention

> **Tech Stack**: Spring Boot 4 (Java 21) · React 19 · Keycloak · MySQL · MUI 7 · Cloudinary · GHN · MapStruct · Lombok

Tài liệu này là nguồn chân lý duy nhất cho mọi quy ước viết code trong Drumify.
Mọi code mới **PHẢI** tuân thủ tuyệt đối các quy tắc bên dưới.

---

## 📚 Mục lục

| # | Section | Nội dung |
|---|---------|----------|
| 1 | [Cấu trúc thư mục](#1-cấu-trúc-thư-mục) | Backend 6-layer, Frontend module layout |
| 2 | [Design System](#2-design-system) | MUI tokens, CSS variables, glassmorphism |
| 3 | [Utilities & Helpers](#3-utilities--helpers) | `unwrapResult`, `getErrorMessage`, `httpClient` |
| 4 | [Security & Auth](#4-security--auth) | Keycloak JWT, RBAC/GBAC, route guards |
| 5 | [Thêm Feature mới](#5-thêm-feature-mới) | Checklist 8 bước backend + frontend |
| 6 | [Naming Conventions](#6-naming-conventions) | Backend, Frontend, File, API |
| 7 | [AI Behavior Rules](#7-ai-behavior-rules) | Reuse-first, forbidden actions, quality gates |

---

## 1. Cấu trúc thư mục

### Backend — 6-Layer Architecture (Layer-first)

```
backend/src/main/java/com/linhdev/drumify/
├── DrumifyApplication.java           # Entry point
│
├── client/                            # 3rd-party API clients (RestClient/Feign)
│   ├── IdentityClient.java           # Keycloak admin API
│   └── ShipmentClient.java           # GHN API
│
├── configuration/                     # Spring config + Security
│   ├── SecurityConfig.java           # OAuth2 Resource Server + JWT
│   ├── CustomAuthoritiesConverter.java # Map Keycloak roles → Spring authorities
│   ├── CorsConfiguration.java
│   ├── CloudinaryConfig.java
│   └── JwtAuthenticationEntryPoint.java
│
├── constant/                          # Application-wide constants
│   └── CloudinaryFolderConstants.java
│
├── controller/                        # REST endpoints — transport only
│   ├── ProductController.java
│   ├── OrderController.java
│   ├── ShipmentController.java
│   └── ...
│
├── dto/                               # Data Transfer Objects (I/O boundary)
│   ├── ApiResponse.java              # Universal response envelope
│   ├── request/                       # Client → Server
│   │   ├── AddressRequest.java
│   │   └── ...
│   ├── response/                      # Server → Client (general)
│   │   ├── ProfileResponse.java
│   │   └── ...
│   ├── warehouse/                     # Warehouse-domain DTOs
│   │   ├── ProductRequest.java
│   │   ├── ProductResponse.java
│   │   └── ...
│   ├── shipment/                      # GHN-related DTOs
│   │   ├── GhnCreateOrderRequest.java
│   │   └── ...
│   └── identity/                      # Keycloak-related DTOs
│       ├── TokenExchangeParam.java
│       └── ...
│
├── entity/                            # JPA entities — database schema
│   ├── Product.java
│   ├── Order.java
│   └── ...
│
├── enums/                             # Business enums
│   ├── OrderStatus.java
│   ├── ShipmentStatus.java
│   └── ...
│
├── exception/                         # Centralized error handling
│   ├── ErrorCode.java                # Enum: code + message + HttpStatus
│   ├── AppException.java             # throw new AppException(ErrorCode.X)
│   ├── ErrorNormalizer.java          # External error → ErrorCode mapping
│   └── GlobalExceptionHandler.java   # @ControllerAdvice
│
├── mapper/                            # MapStruct mappers (Entity ↔ DTO)
│   ├── OrderMapper.java
│   └── ...
│
├── repository/                        # Spring Data JPA repositories
│   ├── ProductRepository.java
│   └── ...
│
└── service/                           # Business logic + transaction
    ├── OrderService.java
    └── ...
```

#### Quy tắc import giữa các layer

| Từ layer | Được import |
|----------|-------------|
| **Controller** | → Service, DTO (Request/Response), ApiResponse |
| **Service** | → Repository, Entity, Mapper, DTO, Exception, Client |
| **Repository** | → Entity only |
| **Mapper** | → Entity, DTO |
| **Client** | → DTO (external), Configuration |
| **Entity** | → Enums only (không import layer khác) |

> ⚠️ **Controller KHÔNG ĐƯỢC import Entity trực tiếp**. Luôn dùng DTO.

---

### Frontend — React Module Layout

```
frontend/src/
├── assets/
│   ├── icons/
│   ├── images/
│   └── styles/GlobalStyles/
│
├── components/                        # Shared UI components
│   ├── Auth/                          # Login, Register, ForgotPassword
│   ├── Common/                        # Reusable across features
│   │   ├── ConfirmDialog/
│   │   ├── StatusBadge/
│   │   ├── Pagination/
│   │   ├── LoadingBar/
│   │   ├── ProductCard/
│   │   └── ...
│   └── Home/
│
├── config/
│   └── adminSidebarConfig.js
│
├── configurations/                    # App-level config
│   ├── configuration.js              # CONFIG.API_GATEWAY
│   ├── httpCient.js                  # ⚠️ Legacy typo — DO NOT RENAME
│   └── apiEndpoints.js              # API path constants
│
├── context/                           # React Context providers
│   ├── KeycloakAuthContext.jsx       # Auth state, roles, groups
│   ├── ProfileContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/                             # Custom hooks
│   ├── utils/
│   │   ├── unwrapApiResponse.js     # unwrapResult, unwrapList, getErrorMessage
│   │   ├── normalizeMediaUrl.js
│   │   └── ...
│   ├── useProducts.js
│   ├── useDebounce.js
│   └── ...
│
├── layouts/                           # Layout wrappers
│   ├── MainLayout.jsx               # Public pages
│   ├── AdminLayout/                  # Admin panel
│   │   ├── AdminLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── TopNav.jsx
│   ├── StaffLayout/
│   └── components/
│       ├── Header/
│       ├── Footer/
│       ├── NavBar/
│       └── SideBar/
│
├── pages/                             # Page-level components
│   ├── Admin/
│   │   ├── Dashboard/
│   │   ├── Warehouse/
│   │   │   ├── WarehouseWorkspace.jsx  # Tab-based workspace pattern
│   │   │   └── WarehouseDashboard.jsx
│   │   ├── ManageStaffAccounts/
│   │   │   └── HRWorkspace.jsx         # Tab-based workspace pattern
│   │   └── ...
│   ├── Home/
│   ├── Products/
│   ├── Cart/
│   ├── Checkout/
│   ├── Profile/
│   └── Employees/
│       ├── Staff/
│       └── CustomerSupport/
│
├── routes/
│   ├── routes.js                     # BrowserRouter + Route definitions
│   ├── ProtectedRoute.jsx           # Requires authentication
│   └── RoleProtectedRoute.jsx       # Requires specific roles/groups
│
├── services/                          # API call layer
│   ├── warehouseService.js
│   ├── orderService.js
│   ├── cartService.js
│   ├── userService.js
│   ├── authenticationService.js
│   ├── storeService.js
│   └── imageService.js
│
├── App.jsx
├── keycloak.js                       # Keycloak instance
└── i18n.js                           # i18next config
```

---

## 2. Design System

### Styling Stack

| Công nghệ | Vai trò |
|-----------|---------|
| **MUI 7** (`@mui/material`) | Component library chính |
| **`sx` prop** | Inline styling cho MUI components |
| **CSS Variables** (`--color-*`) | Custom tokens (glassmorphism, brand) |
| **SCSS Modules** (`.module.scss`) | Page/component-specific styles |
| **Framer Motion** | Animations |

### CSS Variable Tokens (Glassmorphism theme)

```css
/* Sử dụng trong sx prop hoặc SCSS */
--color-border         /* Border color cho cards, tables */
--color-accent-gold    /* Accent highlight (badges, featured) */
```

### Cách dùng MUI + tokens:

```jsx
// ✅ Đúng — Dùng MUI sx + CSS variable
<Paper sx={{
  p: 2,
  bgcolor: "rgba(255,255,255,0.03)",
  border: "1px solid var(--color-border)"
}}>

// ✅ Đúng — Dùng MUI theme colors
<Chip color="success" label="Active" />
<Typography variant="body2" color="text.secondary">

// ❌ Sai — Hardcode color
<Box style={{ backgroundColor: "#1E293B" }}>

// ❌ Sai — Dùng CSS-in-JS ngoài sx
const StyledBox = styled('div')({ ... })
```

### Card/Paper Pattern (Glassmorphism)

```jsx
<Card variant="outlined" sx={{
  bgcolor: "rgba(255,255,255,0.02)",
  borderColor: "var(--color-border)"
}}>
```

### Common UI Components (Reuse-first)

Trước khi tạo component mới, **PHẢI** kiểm tra `frontend/src/components/Common/`:

| Component | File | Dùng khi |
|-----------|------|----------|
| `ConfirmDialog` | `Common/ConfirmDialog/` | Modal xác nhận (delete, cancel, status change) |
| `StatusBadge` | `Common/StatusBadge/` | Hiển thị trạng thái entity |
| `Pagination` | `Common/Pagination/` | Phân trang danh sách |
| `LoadingBar` | `Common/LoadingBar/` | Linear progress indicator |
| `CloudinaryImage` | `Common/CloudinaryImage.jsx` | Render Cloudinary-hosted images |
| `ProductCard` | `Common/ProductCard/` | Card sản phẩm trong grid |
| `SearchFilterBar` | `Common/SearchFilterBar/` | Thanh tìm kiếm + filter |

---

## 3. Utilities & Helpers

### Backend

#### ApiResponse — Response Envelope

```java
// Mọi API response PHẢI bọc trong ApiResponse<T>
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    int code = 1000;       // 1000 = success
    String message;
    T result;
}
```

**Cách dùng trong Controller:**
```java
@GetMapping("/suppliers")
ApiResponse<List<SupplierResponse>> showSuppliers() {
    return ApiResponse.<List<SupplierResponse>>builder()
            .result(supplierService.listSuppliers())
            .build();
}
```

#### ErrorCode — Centralized Error Codes

```java
// Luôn kiểm tra ErrorCode.java trước khi thêm mới
// Format: DOMAIN_ERROR_NAME(code, "message", HttpStatus)
// Code ranges:
//   10xx — User/Auth
//   20xx — Promotion
//   30xx — Voucher
//   40xx — Banner
//   50xx — Review
//   60xx — Product & Category
//   70xx — Order, Cart, Address, Shipment
//   80xx — File Upload
//   90xx — Ticket & Notification

// Ví dụ thêm mới:
BRAND_NOT_EXISTED(6010, "Brand does not exist", HttpStatus.NOT_FOUND),
BRAND_ALREADY_EXISTS(6011, "Brand name already exists", HttpStatus.BAD_REQUEST),
```

#### AppException — Business Error Throwing

```java
// ✅ Đúng — throw AppException với ErrorCode
if (!inventoryService.isAvailable(productId)) {
    throw new AppException(ErrorCode.OUT_OF_STOCK);
}

// ❌ Sai — throw raw exception
throw new RuntimeException("Out of stock");
```

#### Entity Pattern (Lombok + JPA)

```java
@Getter @Setter @Builder 
@NoArgsConstructor @AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String name;

    // Timestamps
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
```

#### MapStruct Mapper

```java
@Mapper(componentModel = "spring")
public interface SupplierMapper {
    SupplierResponse toSupplierResponse(Supplier supplier);
}
```

---

### Frontend

#### httpClient (Axios + Keycloak)

```javascript
// File: frontend/src/configurations/httpCient.js ⚠️ (legacy typo — giữ nguyên)
// Auto-attach Bearer token từ Keycloak, auto-refresh khi sắp hết hạn
import httpClient from "../configurations/httpCient";
```

#### unwrapApiResponse — Bóc tách response

```javascript
import { unwrapResult, unwrapList, getErrorMessage } from "../hooks/utils/unwrapApiResponse";

// Single object
const profile = unwrapResult(data);       // data.result || data.data

// List/Array
const products = unwrapList(data);        // data.result (array) || data.data || data.content

// Error message
const msg = getErrorMessage(err, "Lỗi mặc định");
```

#### Service Pattern

```javascript
// File: frontend/src/services/{module}Service.js
import httpClient from "../configurations/httpCient";
import { CONFIG } from "../configurations/configuration";
import { unwrapList, unwrapResult } from "../hooks/utils/unwrapApiResponse";

const BASE = `${CONFIG.API_GATEWAY}/warehouse`;

// ✅ Đúng — Mọi API call nằm trong service
export async function fetchSuppliers() {
  const { data } = await httpClient.get(`${BASE}/suppliers`);
  return unwrapList(data);
}

export async function createSupplier(payload) {
  const { data } = await httpClient.post(`${BASE}/suppliers`, payload);
  return unwrapResult(data);
}

// ❌ Sai — Gọi axios trực tiếp trong component
// axios.get("/warehouse/suppliers")
```

---

## 4. Security & Auth

### Keycloak Integration

| Layer | Cơ chế |
|-------|--------|
| **Backend** | OAuth2 Resource Server + JWT validation |
| **Frontend** | `keycloak-js` SDK + `KeycloakAuthContext` |

### Roles & Groups (RBAC + GBAC)

| Role | Mô tả |
|------|--------|
| `CUSTOMER` | Khách hàng |
| `STAFF` | Nhân viên (kết hợp với Group) |
| `ADMIN` | Toàn quyền |
| `DIRECTOR` | Xem báo cáo (read-only) |

| Group | Nghiệp vụ |
|-------|-----------|
| `CS` | Customer Support |
| `HR` | Human Resources |
| `WAREHOUSE` | Kho hàng |
| `MARKETING` | Marketing |

### Backend — @PreAuthorize

```java
// ✅ Class-level (tất cả endpoints trong controller)
@RestController
@RequestMapping("/warehouse")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
public class SupplierController { ... }

// ✅ Method-level (endpoint cụ thể)
@DeleteMapping("/{id}")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public ApiResponse<Void> delete(@PathVariable String id) { ... }
```

### Frontend — Route Guards

```jsx
// Public route — MainLayout
<Route path="/" element={<MainLayout />}>
  <Route index element={<Home />} />
</Route>

// Authenticated route — ProtectedRoute
<Route element={<ProtectedRoute />}>
  <Route path="checkout" element={<Checkout />} />
</Route>

// Role-based route — RoleProtectedRoute
<Route path="/admin" element={
  <RoleProtectedRoute 
    requiredRoles={["ADMIN", "DIRECTOR", "STAFF"]} 
    requiredGroups={["HR", "WAREHOUSE", "CS", "MARKETING"]}
  />
}>
```

### Frontend — useKeycloakAuth Hook

```jsx
import { useKeycloakAuth } from "../context/KeycloakAuthContext";

function MyComponent() {
  const { authenticated, roles, groups, hasRole, hasGroup, login, logout } = useKeycloakAuth();

  if (hasRole("ADMIN") || hasGroup("WAREHOUSE")) {
    // Show admin UI
  }
}
```

> 🛑 **TUYỆT ĐỐI KHÔNG** tạo bảng Role/Group/Permission trong database.
> Identity & Access Management do Keycloak quản lý hoàn toàn.

---

## 5. Thêm Feature mới

### Checklist 8 bước (Backend + Frontend)

Ví dụ: thêm feature **Brand Management**

#### Bước 1: Entity

```java
// backend/src/main/java/com/linhdev/drumify/entity/Brand.java
@Entity @Table(name = "brands")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Brand {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(unique = true, nullable = false)
    String name;
    
    String description;
    Boolean active;
}
```

#### Bước 2: Repository

```java
// backend/.../repository/BrandRepository.java
public interface BrandRepository extends JpaRepository<Brand, String> {
    boolean existsByName(String name);
}
```

#### Bước 3: DTOs (Request + Response)

```java
// backend/.../dto/warehouse/BrandRequest.java  (tùy module)
// backend/.../dto/warehouse/BrandResponse.java
```

> ⚠️ DTOs được nhóm theo **module** (`warehouse/`, `shipment/`, `identity/`), không theo entity.

#### Bước 4: Mapper (MapStruct)

```java
// backend/.../mapper/BrandMapper.java
@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toBrandResponse(Brand brand);
    Brand toBrand(BrandRequest request);
}
```

#### Bước 5: Service

```java
// backend/.../service/BrandService.java
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandService {
    BrandRepository brandRepository;
    BrandMapper brandMapper;

    public List<BrandResponse> listBrands() { ... }

    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.BRAND_ALREADY_EXISTS);
        }
        // ...
    }
}
```

#### Bước 6: Controller

```java
// backend/.../controller/BrandController.java
@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
public class BrandController {
    BrandService brandService;

    @GetMapping("/brands")
    ApiResponse<List<BrandResponse>> list() {
        return ApiResponse.<List<BrandResponse>>builder()
                .result(brandService.listBrands())
                .build();
    }

    @PostMapping("/brands")
    ApiResponse<BrandResponse> create(@RequestBody @Valid BrandRequest request) {
        return ApiResponse.<BrandResponse>builder()
                .result(brandService.createBrand(request))
                .build();
    }
}
```

#### Bước 7: Frontend — Service API

```javascript
// frontend/src/services/warehouseService.js (thêm vào file có sẵn)
export async function fetchBrands() {
  const { data } = await httpClient.get(`${BASE}/brands`);
  return unwrapList(data);
}

export async function createBrand(payload) {
  const { data } = await httpClient.post(`${BASE}/brands`, payload);
  return unwrapResult(data);
}
```

#### Bước 8: Frontend — UI Tab (Workspace Pattern)

```jsx
// Trong WarehouseWorkspace.jsx:
// 1. Thêm tab vào WH_TAB_CONFIG
const WH_TAB_CONFIG = [
  // ...existing tabs...
  { label: "Nhãn hiệu", path: "/admin/brands" },
];

// 2. Tạo function component BrandsTab()
function BrandsTab() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  // ... CRUD logic using service functions ...
}

// 3. Thêm case trong renderContent()
// 4. Thêm Route trong routes.js
```

### ✅ Checklist tổng hợp

- [ ] Entity trong `entity/`
- [ ] Repository interface trong `repository/`
- [ ] DTOs (Request + Response) trong `dto/{module}/`
- [ ] Mapper (MapStruct) trong `mapper/`
- [ ] Service (business logic) trong `service/`
- [ ] Controller (`@PreAuthorize` bắt buộc) trong `controller/`
- [ ] ErrorCode mới trong `exception/ErrorCode.java` (nếu cần, check trùng trước)
- [ ] Frontend Service functions trong `services/{module}Service.js`
- [ ] UI Tab/Page component
- [ ] Route registration trong `routes/routes.js`

---

## 6. Naming Conventions

### Backend (Java)

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Entity | `PascalCase` | `Product`, `OrderItem` |
| Repository | `{Entity}Repository` | `ProductRepository` |
| Service | `{Entity/Domain}Service` | `ProductService`, `MediaService` |
| Controller | `{Entity/Domain}Controller` | `ProductController` |
| Mapper | `{Entity}Mapper` | `ProductMapper` |
| DTO Request | `{Action}{Entity}Request` or `{Entity}Request` | `CreateOrderRequest`, `ProductRequest` |
| DTO Response | `{Entity}Response` or `{Context}Response` | `ProductResponse`, `DashboardResponse` |
| Enum | `PascalCase` | `OrderStatus`, `PaymentMethod` |
| Exception | `AppException` (singleton) + `ErrorCode` enum | `ErrorCode.PRODUCT_NOT_EXISTED` |
| Constant | `UPPER_SNAKE_CASE` | `PROFILE_MEDIA_FOLDER` |

> **Annotations bắt buộc cho mọi class:**
> - `@RequiredArgsConstructor` (thay vì `@Autowired`)
> - `@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)` (cho DI classes)

### Frontend (JavaScript/React)

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Component / Page | `PascalCase.jsx` | `ProductCard.jsx`, `WarehouseWorkspace.jsx` |
| Hook | `use{Name}.js` | `useProducts.js`, `useDebounce.js` |
| Service | `{module}Service.js` | `warehouseService.js`, `orderService.js` |
| Context | `{Name}Context.jsx` | `KeycloakAuthContext.jsx` |
| Config | `camelCase.js` | `apiEndpoints.js`, `configuration.js` |
| Constant | `UPPER_SNAKE_CASE` | `WH_TAB_CONFIG`, `STATUS_LABELS` |
| CSS Module | `{Component}.module.scss` | `Home.module.scss` |
| Service function | `verb + Noun` | `fetchProducts`, `createBrand`, `updateSupplier` |
| Workspace tab config | `{PREFIX}_TAB_CONFIG` | `WH_TAB_CONFIG` |

### API Endpoint

| Convention | Pattern | Ví dụ |
|-----------|---------|-------|
| Resource-oriented | `/{domain}/{resource}` | `/warehouse/products` |
| CRUD | `GET/POST/PUT/PATCH/DELETE` | `POST /warehouse/brands` |
| Nested resource | `/{parent}/{id}/{child}` | `/orders/{id}/shipments` |
| Action endpoint | `POST /{resource}/{id}/{action}` | `POST /orders/{id}/confirm` |

### Legacy — Giữ nguyên tên cũ

| File | Lý do |
|------|-------|
| `httpCient.js` | Typo gốc, nhiều file import → KHÔNG ĐỔI TÊN |

---

## 7. AI Behavior Rules

### Thứ tự ưu tiên khi có xung đột

1. Chỉ dẫn trực tiếp từ User
2. AI Behavior Rules (section này)
3. Forbidden Actions
4. Các section còn lại
5. Style preferences

### Quy tắc bắt buộc

| # | Quy tắc | Chi tiết |
|---|---------|---------|
| 1 | **Reuse-first** | Tìm component/service/DTO/ErrorCode có sẵn trước khi tạo mới |
| 2 | **Hỏi trước khi đổi kiến trúc** | Layer boundary, security flow, DTO schema, thêm thư viện |
| 3 | **Không trùng lặp** | Không `*Copy`, `*New`, `*Temp`. Không logic song song |
| 4 | **Bảo tồn naming** | Code mới phải hoà hợp với pattern hiện tại của module |
| 5 | **Giải thích thay đổi lớn** | Refactor liên module, thay đổi contract, auth/security |

### 🚫 Forbidden Actions

AI **TUYỆT ĐỐI KHÔNG ĐƯỢC**:
- Đưa logic nghiệp vụ vào Controller
- Expose Entity JPA trực tiếp ra API (luôn dùng DTO)
- Bỏ qua `ApiResponse<T>` wrapper
- Gọi `axios` trực tiếp từ Component (dùng service layer)
- Thêm state management library mới mà không hỏi
- Bỏ qua route guard / xóa `@PreAuthorize`
- Hardcode secrets (tokens, credentials, API keys)
- Đổi tên/di chuyển file legacy mà không hỏi
- Để lại `TODO` trong production code
- Tạo bảng database cho Role/Group/Permission (Keycloak only)

### Quality Gates — Tự kiểm tra trước khi hoàn tất

1. **Scope gate**: Chỉ thay đổi file cần thiết
2. **Contract gate**: Đồng bộ DTO/Response giữa Backend ↔ Frontend
3. **Runtime gate**: App vẫn chạy (import, route, DI đúng)
4. **Error-path gate**: Mọi lỗi xử lý tường minh, không crash

### 💡 SRP Tóm tắt

| Component | Trách nhiệm DUY NHẤT |
|-----------|----------------------|
| **Entity** | Cấu trúc Database |
| **DTO** | Hình dạng dữ liệu khi truyền tải (I/O) |
| **Mapper** | Phiên dịch Entity ↔ DTO |
| **Repository** | Nói chuyện với Database |
| **Service** | Logic nghiệp vụ và luật chơi |
| **Controller** | Nhận request, gửi cho Service, trả response |
| **Hook** | Gom dữ liệu và trạng thái cho UI |
| **Component** | Hiển thị UI và lắng nghe user interaction |

---

> [!IMPORTANT]
> TUÂN THỦ TUYỆT ĐỐI CÁC QUY TẮC TRÊN. MỌI SAI PHẠM SẼ ĐƯỢC COI LÀ LRI (LOGIC REFACTORING ISSUE).
