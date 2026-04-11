# 🥁 DRUMIFY - FRONTEND PORTAL

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.4-61dafb.svg" alt="React">
  <img src="https://img.shields.io/badge/Material%20UI-7.x-0081CB.svg" alt="MUI">
  <img src="https://img.shields.io/badge/Status-Migration%20In%20Progress-orange.svg" alt="Status">
</p>

## 🎯 Giới thiệu

Đây là thành phần giao diện người dùng của **Drumify** - Nền tảng thương mại điện tử nhạc cụ hàng đầu. Portal được xây dựng dựa trên triết lý thiết kế hiện đại, tinh gọn (Clean Design).

## 🚀 Tính năng vượt trội

-   ✅ **Home Page Dynamic Architecture**:
    -   ⚡ **Flash Sale Tracker**: Theo dõi các đợt giảm giá nhạc cụ thời gian thực.
    -   🥁 **Instrument Showcase**: Trình diễn các sản phẩm trống và percussion theo bộ sưu tập.
    -   🛍️ **Brand Ecosystem**: Tích hợp danh mục từ các nhà sản xuất nhạc cụ uy tín (Roland, Pearl, Sabian...).
-   ✅ **Smart Instrumentation Categories**: Phân loại thông minh (Acoustic, Electronic, Percussion, Hardware).
-   ✅ **Enterprise Security**: Xác thực đa yếu tố và SSO thông qua Keycloak.
-   ✅ **Ultra-Responsive**: Trải nghiệm nhất quán trên mọi kích cỡ màn hình.

## 🛠️ Công nghệ chủ đạo (Core Stack)

### Giao diện & Trải nghiệm
-   **Framework**: [ReactJS 19.x](https://reactjs.org/)
-   **UI Library**: [Material UI (MUI) 7.x](https://mui.com/) - Thiết kế dựa trên chuẩn Material Design.
-   **Animation**: [Framer Motion](https://www.framer.com/motion/) cho các hiệu ứng chuyển cảnh mượt mà.
-   **Styling**: SCSS Modules giúp cô lập style và tránh xung đột CSS.

### Xử lý logic & Bảo mật
-   **Routing**: [React Router DOM 7.x](https://reactrouter.com/)
-   **Security**: [Keycloak JS](https://www.keycloak.org/) cho quản lý phiên làm việc và bảo vệ routes.
-   **API Handling**: [Axios](https://axios-http.com/) tích hợp interceptors cho JWT.

## 🛠️ Cấu trúc thư mục (Folder Map)

```text
frontend/
├── src/
│   ├── assets/          # Đa phương tiện, icons nhạc cụ, fonts
│   ├── components/      # Các hạt nhân UI (ProductCard, Countdown, Newsletter)
│   ├── config/          # Cấu hình hệ thống (Endpoints, Keycloak settings)
│   ├── layouts/         # Khung giao diện (Default, Auth, FullWidth)
│   ├── pages/           # Các trang nghiệp vụ (Home, Shop, Blog tay trống)
│   ├── services/        # Tầng giao tiếp dữ liệu (API definitions)
│   └── hooks/           # Các logic tái sử dụng (Auth hooks, LocalStorage hooks)
└── public/              # Tài sản tĩnh
```

## 🚀 Hướng dẫn cài đặt

### 1. Chuẩn bị
Đảm bảo bạn đã cài đặt Node.js LTS.

### 2. Cài đặt & Chạy
```bash
cd frontend
npm install
npm start
```
Ứng dụng sẽ chạy tại địa chỉ: [http://localhost:3000](http://localhost:3000).
Trang web sẽ tự động reload lại nếu bạn thực hiện thay đổi vào mã nguồn.

### Đóng gói ứng dụng để đưa lên Production

Khi muốn triển khai thực tế, bạn có thể build dự án với lệnh:

```bash
npm run build
```
Quá trình này sẽ đóng gói ứng dụng một cách tối ưu cùng file tĩnh nhúng trong thư mục `build`, sẵn sàng để deploy.

## 🔑 Cấu hình Keycloak

Do ứng dụng có sử dụng **Keycloak** để quản lý danh tính (IAM), hãy đảm bảo rằng:
1. Server Keycloak của dự án đang chạy phía nền (trên backend hoặc qua Docker).
2. Các thông số cấu hình về `realm`, `clientId`, và `url` của Keycloak đã được trỏ đúng ở trong dự án React để người dùng có thể thực hiện đăng nhập và đăng xuất thành công.
