# 🔐 Drumify — Hệ Thống Phân Quyền (Role & Group)

Drumify áp dụng mô hình phân quyền kết hợp **Role-Based Access Control (RBAC)** và **Group-Based Access Control (GBAC)**. Role xác định **mức độ quyền hạn**, Group xác định **phạm vi nghiệp vụ**.

---

## Roles & Groups

| Role | Mô tả | Phạm vi |
|:-----|:-------|:--------|
| **CUSTOMER** | Khách hàng | Mua sắm, quản lý tài khoản cá nhân |
| **STAFF** | Nhân viên | Vận hành theo nghiệp vụ của Group được phân |
| **ADMIN** | Quản trị viên | Toàn quyền hệ thống |
| **DIRECTOR** | Giám đốc / Ban điều hành | Xem báo cáo chiến lược, không can thiệp vận hành |

| Group | Mô tả | Nghiệp vụ chính |
|:------|:-------|:-----------------|
| **CS** | Customer Support | Hỗ trợ khách, ticket, live chat, khiếu nại, hoàn tiền |
| **HR** | Human Resources | Quản lý nhân sự, chấm công, hợp đồng, tuyển dụng |
| **WAREHOUSE** | Kho hàng | Tồn kho, nhập/xuất, đóng gói, vận chuyển |
| **MARKETING** | Marketing | Voucher, nội dung, banner, email campaign |
| **CASHIER** | Thu ngân / Tài chính | Thanh toán, hóa đơn, quản lý dòng tiền, báo cáo doanh thu |


---

## Ma Trận Quyền Hạn Sidebar

| Module | ADMIN | DIRECTOR | STAFF+CS | STAFF+HR | STAFF+WH | STAFF+MKT | STAFF+CASHIER |
|:-------|:-----:|:--------:|:--------:|:--------:|:--------:|:---------:|:-------------:|
| Dashboard | ✅ Full | ✅ KPI | ✅ CS | ✅ HR | ✅ Kho | ✅ Mkt | ✅ Cashier |
| Quản lý Khách hàng | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý Nhân sự | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Sản phẩm / Danh mục | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (Xem/Giá) |
| Đơn hàng | ✅ | ❌ | ✅ (hỗ trợ) | ❌ | ✅ (đóng gói) | ❌ | ✅ (Thanh toán) |
| Kho hàng | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Marketing / Voucher | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ (Áp dụng) |
| Nội dung / Blog | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Hỗ trợ KH / Ticket | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Báo cáo / Phân tích | ✅ | ✅ | ❌ | ✅ (HR) | ✅ (Kho) | ✅ (Mkt) | ✅ (Ca làm) |
| Tài chính | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (Giao dịch) |
| Cấu hình hệ thống | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |


---

## 🔑 ADMIN — Sidebar (Toàn quyền)

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 📊 Dashboard | `/admin` | Tổng quan: doanh thu, đơn hàng, người dùng, cảnh báo |
| 2 | 👥 Quản lý Khách hàng | `/admin/users` | Xem, khóa, tìm kiếm tài khoản CUSTOMER |
| 3 | 🪪 Quản lý Nhân sự | `/admin/hr` | CRUD tài khoản STAFF, phân group & role |
| 4 | 📦 Quản lý Sản phẩm | `/admin/products` | CRUD sản phẩm, danh mục, thuộc tính |
| 5 | 🗂️ Danh mục | `/admin/categories` | Quản lý cây danh mục sản phẩm |
| 6 | 🛒 Đơn hàng | `/admin/orders` | Toàn bộ đơn, chỉnh trạng thái |
| 7 | 🏪 Kho hàng | `/admin/inventory` | Tồn kho, nhập/xuất, cảnh báo hàng thấp |
| 8 | 🎟️ Marketing & Voucher | `/admin/marketing` | Voucher, chiến dịch, banner |
| 9 | 🎧 Hỗ trợ KH | `/admin/support` | Ticket, khiếu nại, đánh giá |
| 10 | 📈 Báo cáo & Phân tích | `/admin/reports` | Doanh thu, xu hướng, hiệu quả |
| 11 | 💰 Tài chính | `/admin/finance` | Chi phí, doanh thu, hoàn tiền |
| 12 | ⚙️ Cấu hình hệ thống | `/admin/settings` | Payment gateway, email, cấu hình chung |
| 13 | 👤 Hồ sơ của tôi | `/admin/profile` | Thông tin cá nhân |

---

## 👔 DIRECTOR — Sidebar (Chỉ xem báo cáo chiến lược)

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 📊 Dashboard Tổng Quan | `/admin` | KPI toàn công ty, so sánh kỳ |
| 2 | 📈 Báo cáo & Phân tích | `/admin/reports` | Doanh thu, kênh bán, nhân sự |
| 3 | 💰 Tài chính | `/admin/finance` | P&L, dòng tiền, chi phí vận hành |
| 4 | 🎯 Hiệu quả Marketing | `/admin/reports/marketing` | ROI chiến dịch, traffic, conversion |
| 5 | 👥 Hiệu suất Nhân viên | `/admin/reports/staff` | KPI nhân viên theo nhóm |
| 6 | 👤 Hồ sơ của tôi | `/admin/profile` | Thông tin cá nhân |

> **Lưu ý**: DIRECTOR chỉ có quyền **đọc (read-only)** — không có nút tạo/sửa/xóa.

---

## 🎧 STAFF + CS (Customer Support) — Sidebar

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 🏠 Dashboard CS | `/admin` | Ticket mở, SLA hôm nay, chat đang chờ |
| 2 | 🎫 Yêu cầu Hỗ trợ | `/admin/support/tickets` | Danh sách ticket, filter theo trạng thái/ưu tiên |
| 3 | 💬 Live Chat | `/admin/support/chat` | Chat realtime với khách, assign, chuyển tiếp |
| 4 | ⚠️ Khiếu nại | `/admin/support/complaints` | Xử lý khiếu nại, leo thang cấp |
| 5 | 🔄 Hoàn tiền / Đổi trả | `/admin/support/refunds` | Xem đơn refund, phê duyệt hoàn tiền |
| 6 | ⭐ Đánh giá & Bình luận | `/admin/support/reviews` | Duyệt review sản phẩm, phản hồi |
| 7 | 📢 Thông báo | `/admin/support/notifications` | Gửi thông báo hệ thống tới khách |
| 8 | 👤 Hồ sơ của tôi | `/admin/profile` | Thông tin cá nhân |

---

## 👨‍💼 STAFF + HR (Human Resources) — Sidebar

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 🏠 Dashboard HR | `/admin` | Nhân viên mới, nghỉ phép hôm nay, việc cần duyệt |
| 2 | 🪪 Quản lý Nhân viên | `/admin/hr` | Danh sách staff, CRUD tài khoản, gán group/role |
| 3 | 📋 Tuyển dụng | `/admin/hr/recruitment` | Tin tuyển dụng, ứng viên, lịch phỏng vấn |
| 4 | 📅 Chấm công & Nghỉ phép | `/admin/hr/attendance` | Bảng chấm công, đơn xin nghỉ, duyệt phép |
| 5 | 📄 Hợp đồng | `/admin/hr/contracts` | Quản lý hợp đồng nhân viên, gia hạn |
| 6 | 💵 Lương & Thưởng | `/admin/hr/payroll` | Bảng lương, thưởng KPI, khấu trừ |
| 7 | 📊 Báo cáo Nhân sự | `/admin/hr/reports` | Biến động nhân sự, turnover rate |
| 8 | 👤 Hồ sơ của tôi | `/admin/profile` | Thông tin cá nhân |

---

## 📦 STAFF + WAREHOUSE (Kho hàng) — Sidebar

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 🏠 Dashboard Kho | `/admin` | Tồn kho, hàng sắp hết, đơn cần xử lý |
| 2 | 📦 Quản lý Sản phẩm | `/admin/products` | Tạo mới/cập nhật sản phẩm, cấu hình biến thể giá |
| 3 | 🗂️ Danh mục | `/admin/categories` | Tạo/gán cây danh mục cho sản phẩm |
| 4 | 📦 Tồn kho | `/admin/inventory` | Danh sách SP, tồn kho, cảnh báo mức thấp |
| 5 | 📥 Nhập hàng | `/admin/inventory/import` | Phiếu nhập kho, nhà cung cấp |
| 6 | 📤 Xuất hàng / Giao | `/admin/inventory/export` | Xử lý đơn xuất, xác nhận giao hàng |
| 7 | 🛒 Đơn hàng cần xử lý | `/admin/orders` | Xác nhận đơn, tạo vận đơn GHN, chuẩn bị hàng |
| 8 | 🚚 Vận chuyển | `/admin/shipping` | Theo dõi lô hàng, đồng bộ trạng thái GHN |
| 9 | 🏭 Nhà cung cấp | `/admin/inventory/suppliers` | Danh sách nhà cung cấp, liên hệ |
| 10 | 📊 Báo cáo Kho | `/admin/inventory/reports` | Báo cáo nhập/xuất/tồn theo kỳ |
| 11 | 👤 Hồ sơ của tôi | `/admin/profile` | Thông tin cá nhân |

---

## 📣 STAFF + MARKETING — Sidebar

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 🏠 Dashboard Marketing | `/admin` | CTR, conversion, voucher đang chạy |
| 2 | 🎟️ Voucher & Khuyến mãi | `/admin/marketing` | CRUD voucher, flash sale, bundle |
| 3 | 📝 Nội dung & Blog | `/admin/content` | Bài viết, banner, landing page |
| 4 | 🖼️ Banner & Quảng cáo | `/admin/marketing/banners` | Upload banner homepage, slider |
| 5 | 💌 Email Campaign | `/admin/marketing/email` | Tạo email blast, newsletter, thống kê |
| 6 | 🌟 Sản phẩm nổi bật | `/admin/marketing/featured` | Chọn SP nổi bật, hiển thị homepage |
| 7 | 📊 Phân tích Marketing | `/admin/marketing/analytics` | Traffic, CTR, conversion, ROI |
| 8 | 👤 Hồ sơ của tôi | `/admin/profile` | Thông tin cá nhân |

---

## 💰 STAFF + CASHIER (Thu ngân) — Sidebar

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 🏠 Dashboard Thu Ngân | `/admin` | Doanh số ca, số đơn đã thanh toán, tiền mặt hiện tại |
| 2 | 🛒 Điểm bán hàng (POS) | `/admin/pos` | Giao diện bán hàng nhanh, quét mã vạch |
| 3 | 🧾 Quản lý Đơn hàng | `/admin/orders` | Danh sách đơn, xác nhận thanh toán, in hóa đơn |
| 4 | 💸 Giao dịch & Thu chi | `/admin/finance/transactions` | Nhật ký thu chi, nộp tiền về quỹ |
| 5 | 🎟️ Áp dụng Voucher | `/admin/marketing/vouchers` | Kiểm tra và áp dụng mã giảm giá cho khách |
| 6 | 📦 Kiểm tra giá/tồn | `/admin/products/lookup` | Tra cứu nhanh giá và tồn kho sản phẩm |
| 7 | 📊 Báo cáo ca làm | `/admin/finance/reports/shift` | Tổng kết doanh thu theo ca, chênh lệch tiền mặt |
| 8 | 👤 Hồ sơ của tôi | `/admin/profile` | Thông tin cá nhân |


---

## 🛍️ CUSTOMER — Menu tài khoản cá nhân

> Customer không truy cập `/admin`. Portal riêng trong trang người dùng.

| # | Tab | Path | Mô tả |
|---|-----|------|-------|
| 1 | 👤 Hồ sơ cá nhân | `/profile` | Cập nhật thông tin, avatar |
| 2 | 🛒 Đơn hàng của tôi | `/profile/orders` | Lịch sử đặt hàng, theo dõi |
| 3 | ❤️ Yêu thích | `/profile/wishlist` | Sản phẩm đã lưu |
| 4 | 🏠 Địa chỉ | `/profile/addresses` | Quản lý địa chỉ giao hàng |
| 5 | 🎟️ Voucher của tôi | `/profile/vouchers` | Voucher đang có, đã dùng |
| 6 | 🔔 Thông báo | `/profile/notifications` | Cập nhật đơn hàng, khuyến mãi |
| 7 | ⭐ Đánh giá của tôi | `/profile/reviews` | Xem lại các review đã viết |
| 8 | 🔒 Bảo mật | `/profile/security` | Đổi mật khẩu, 2FA |

---

## 🏗️ Kiến Trúc Dashboard Đa Vai Trò

Dashboard tại `/admin` tự động hiển thị nội dung khác nhau dựa trên role/group:

```
/admin (dashboard)
│
├── ADMIN      → AdminDashboard (full widgets: doanh thu, đơn, kho, nhân sự)
├── DIRECTOR   → DirectorDashboard (KPI tổng hợp + biểu đồ so sánh kỳ)
├── STAFF + CS → CSDashboard (ticket mở, SLA, chat queue)
├── STAFF + HR → HRDashboard (headcount, nghỉ phép, việc cần duyệt)
├── STAFF + WH → WarehouseDashboard (tồn kho, hàng sắp hết, đơn cần xử lý)
├── STAFF + MKT→ MarketingDashboard (voucher đang chạy, CTR, conversion)
└── STAFF + CASHIER → CashierDashboard (doanh số ca, tiền mặt, đơn POS)
```

---

## 🎨 Thiết Kế UI Sidebar

### Nguyên tắc
- **Section dividers**: Phân chia sidebar thành sections (Quản lý, Báo cáo, Cá nhân)
- **Badge counter**: Hiện số item cần xử lý (ticket mới, đơn chờ...)
- **Role badge**: Hiển thị group/role hiện tại ở top sidebar
- **Collapsed mode**: Thu gọn sidebar khi màn nhỏ (chỉ icon)
- **Active highlight**: Gradient tím-xanh cho item đang active

### Minh họa layout

```
┌─────────────────────────┐
│ 🥁 DRUMIFY              │  ← Logo + tên hệ thống
│ [Avatar] Nguyễn Văn A   │  ← User info
│ CS Team • Online        │  ← Badge group + status
├─────────────────────────┤
│ ▸ Dashboard             │  ← Active state highlight
│   Yêu cầu Hỗ trợ  (12) │  ← Badge số lượng
│   Live Chat        (3)  │  ← Real-time count
│   Khiếu nại             │
│   Hoàn tiền / Đổi trả   │
│   Đánh giá              │
│   Thông báo             │
├─────────────────────────┤
│   Hồ sơ của tôi         │
│   Đăng xuất             │
└─────────────────────────┘
```

---
<p align="center">
  <i>Tài liệu này là phần mở rộng của <a href="./README.md">README.md</a></i>
</p>
