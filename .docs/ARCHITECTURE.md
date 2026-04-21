# 🏛️ Architecture — Drumify

Tài liệu này mô tả kiến trúc tổng thể của dự án Drumify.

## 🛠️ Technology Stack
- **Backend**: Spring Boot 4 (Java 21)
- **Frontend**: React 19 (MUI 7)
- **Database**: MySQL
- **Identity**: Keycloak (OIDC/JWT)
- **Storage**: Cloudinary
- **Shipment**: GHN (Giao Hàng Nhanh)

## 📂 Project Structure

### Backend (6-Layer Architecture)
Chúng tôi sử dụng kiến trúc phân lớp (Layer-first) để đảm bảo tính module và dễ bảo trì.
- `controller/`: Giao tiếp với Client, bọc response trong `ApiResponse`.
- `service/`: Xử lý nghiệp vụ chính.
- `mapper/`: Chuyển đổi dữ liệu (MapStruct).
- `repository/`: Tương tác với DB (Spring Data JPA).
- `entity/`: Cấu trúc Database.
- `dto/`: Định nghĩa dữ liệu truyền tải (Request/Response).

### Frontend (Module-based)
Frontend được chia theo module và các thành phần dùng chung.
- `pages/`: Các trang tính năng (Admin, Home, Checkout...).
- `components/Common/`: Các UI components có thể tái sử dụng.
- `services/`: Lớp gọi API tập trung.
- `hooks/`: Logic UI dùng chung.
- `context/`: Quản lý trạng thái toàn cục (Auth, Theme).

## 🛡️ Security Flow
1. **Authentication**: Keycloak quản lý login và cấp JWT.
2. **Authorization**: 
   - Backend sử dụng `@PreAuthorize` **tại tầng Service** để kiểm soát quyền dựa trên Roles/Groups từ JWT.
   - Frontend sử dụng `RoleProtectedRoute` để bảo vệ các tuyến đường (Routes).
