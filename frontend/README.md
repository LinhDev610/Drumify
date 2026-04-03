# Drumify Frontend

Chào mừng đến với mã nguồn Frontend của **Drumify** - Ứng dụng thương mại điện tử chuyên cung cấp các mặt hàng nhạc cụ đa dạng như trống, guitar, phụ kiện và nhiều thiết bị âm nhạc khác.

## 🚀 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng với các công nghệ và thư viện hiện đại để đảm bảo hiệu năng và trải nghiệm người dùng tối ưu:

- **Framework**: [ReactJS](https://reactjs.org/) (Khởi tạo qua Create React App)
- **Giao diện (UI)**: [Material UI (MUI)](https://mui.com/) - Cung cấp kho component đa dạng, thiết kế theo chuẩn Material Design.
- **Xác thực (Authentication)**: [Keycloak](https://www.keycloak.org/) kết hợp `keycloak-js` để xử lý đăng nhập, bảo mật ứng dụng và bảo vệ các routes.

## 🛠️ Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống

Hãy chắc chắn rằng bạn đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị bản LTS) trên máy.

### Các bước cài đặt

1. **Clone dự án & truy cập vào thư mục frontend:**
   ```bash
   # Nếu bạn đang ở thư mục gốc của project
   cd frontend
   ```

2. **Cài đặt các thư viện phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```

### Chạy ứng dụng trong môi trường phát triển (Development)

Để khởi động ứng dụng, bạn chạy lệnh sau:

```bash
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
