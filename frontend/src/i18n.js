import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: {
            home: "Home",
            products: "Products",
            cart: "Cart",
            profile: "Account",
            login: "Login",
            logout: "Logout"
          },
          home: {
            hero_overline: "PROFESSIONAL GEAR",
            hero_btn_shop: "Explore Shop",
            hero_btn_custom: "Custom Kits",
            flash_sales: "Flash Sales",
            featured_gear: "Featured Gear",
            academy: "Rhythm Academy",
            newsletter_title: "The Drumify Newsletter",
            newsletter_btn: "Join Now"
          },
          cart: {
             title: "Your Shopping Bag",
             continue_shopping: "Continue Shopping",
             summary: "Order Summary",
             checkout: "Checkout Now"
          },
          profile: {
            tabs: {
              profile: "My Profile",
              orders: "My Orders",
              vouchers: "Wallet Voucher",
              security: "Change Password"
            },
            general: {
              save: "Save Changes",
              saving: "Saving...",
              cancel: "Cancel",
              edit: "Edit",
              delete: "Delete",
              confirm: "Confirm",
              confirming: "Confirming...",
              update: "Update",
              success_update: "Update successful!",
              success_password: "Password changed successfully!",
              failed: "Operation failed: ",
              member_since: "Member Since"
            },
            info: {
              title: "My Profile",
              subtitle: "Manage your profile information for account security",
              account_title: "Account",
              personal_title: "Personal Information",
              username: "Username",
              email: "Email",
              firstName: "First Name",
              lastName: "Last Name",
              phone: "Phone Number",
              dob: "Date of Birth",
              gender: "Gender",
              male: "Male",
              female: "Female"
            },
            orders: {
              title: "My Orders",
              empty: "No orders found in this section",
              tab_all: "All",
              tab_pending: "Wait for Confirmation",
              tab_confirmed: "Wait for Pickup",
              tab_shipping: "Shipping",
              tab_delivered: "Delivered",
              tab_cancelled: "Cancelled"
            },
            vouchers: {
              title: "Voucher Wallet",
              tab_mine: "My Vouchers",
              tab_promotions: "Promotions",
              empty_mine: "You don't have any vouchers yet",
              empty_promotions: "No active promotions at the moment"
            },
            security: {
              title: "Change Password",
              subtitle: "For account security, please do not share your password with others",
              current_password: "Current Password",
              new_password: "New Password",
              confirm_new_password: "Confirm New Password",
              err_old: "Please enter your old password",
              err_min: "New password must be at least 6 characters",
              err_match: "Passwords do not match"
            },
            address: {
              title: "Address Management",
              add_new: "+ Add New Address",
              edit_title: "Edit Address",
              new_title: "New Address",
              recipient_name: "Recipient Name",
              recipient_phone: "Phone Number",
              province: "Province/City",
              select_province: "Select Province/City",
              district: "District",
              select_district: "Select District",
              ward: "Ward/Commune",
              select_ward: "Select Ward/Commune",
              specific: "Specific Address",
              set_default: "Set as default address",
              default_badge: "Default",
              empty: "No saved addresses yet.",
              confirm_delete: "Delete this address?",
              save_address: "Save Address"
            }
          },
          sidebar: {
            dashboard: "Dashboard Overview",
            user_management: "User Accounts",
            hr_management: "Human Resources",
            inventory: "Warehouse Management",
            orders: "Order Operations",
            marketing: "Marketing & Ads",
            customer_support: "Support Center",
            reports: "Business Analytics",
            finance: "Financial Statements"
          },
          dashboard: {
            welcome: "Welcome back"
          },
          hr: {
            title: "HR Management",
            staff_directory: "Staff Directory",
            permissions_manager: "Permissions Manager",
            table: {
              user: "Employee",
              email: "Email",
              roles: "Roles",
              groups: "Groups",
              last_login: "Last Login",
              actions: "Actions"
            },
            edit_permissions: "Edit Permissions",
            roles_title: "Assigned Roles",
            groups_title: "Assigned Groups",
            save_permissions: "Save Permissions",
            assign_roles_desc: "Select roles that define the user's base level access.",
            assign_groups_desc: "Select groups that define the user's departmental duties.",
            success_update: "Permissions updated successfully!"
          },
          customers: {
            title: "Customer Management",
            subtitle: "Manage customer accounts and viewing history",
            table: {
              customer: "Customer",
              status: "Status",
              total_orders: "Orders",
              total_spent: "Total Spent",
              actions: "Actions"
            },
            search_placeholder: "Search customers...",
            no_customers: "No customers found."
          }
        }
      },
      vi: {
        translation: {
          nav: {
            home: "Trang chủ",
            products: "Sản phẩm",
            cart: "Giỏ hàng",
            profile: "Tài khoản",
            login: "Đăng nhập",
            logout: "Đăng xuất"
          },
          home: {
            hero_overline: "THIẾT BỊ CHUYÊN NGHIỆP",
            hero_btn_shop: "Khám phá cửa hàng",
            hero_btn_custom: "Bộ trống tùy chỉnh",
            flash_sales: "Khuyến mãi cực sốc",
            featured_gear: "Thiết bị nổi bật",
            academy: "Học viện Nhịp điệu",
            newsletter_title: "Bản tin Drumify",
            newsletter_btn: "Tham gia ngay"
          },
          cart: {
             title: "Giỏ hàng của bạn",
             continue_shopping: "Tiếp tục mua sắm",
             summary: "Tổng thanh toán",
             checkout: "Thanh toán ngay"
          },
          profile: {
            tabs: {
              profile: "Hồ sơ của tôi",
              orders: "Đơn hàng của tôi",
              vouchers: "Ví Voucher",
              security: "Đổi mật khẩu"
            },
            general: {
              save: "Lưu thay đổi",
              saving: "Đang lưu...",
              cancel: "Hủy",
              edit: "Sửa",
              delete: "Xóa",
              confirm: "Xác nhận",
              confirming: "Đang xác nhận...",
              update: "Cập nhật",
              success_update: "Đã cập nhật thành công!",
              success_password: "Đổi mật khẩu thành công!",
              failed: "Thất bại: ",
              member_since: "Thành viên từ"
            },
            info: {
              title: "Hồ sơ của tôi",
              subtitle: "Quản lý thông tin hồ sơ để bảo mật tài khoản",
              account_title: "Tài khoản",
              personal_title: "Thông tin cá nhân",
              username: "Tên đăng nhập",
              email: "Email",
              firstName: "Họ",
              lastName: "Tên",
              phone: "Số điện thoại",
              dob: "Ngày sinh",
              gender: "Giới tính",
              male: "Nam",
              female: "Nữ"
            },
            orders: {
              title: "Đơn hàng của tôi",
              empty: "Chưa có đơn hàng nào trong mục này",
              tab_all: "Tất cả",
              tab_pending: "Chờ xác nhận",
              tab_confirmed: "Chờ lấy hàng",
              tab_shipping: "Đang giao",
              tab_delivered: "Đã giao",
              tab_cancelled: "Đã hủy"
            },
            vouchers: {
              title: "Ví Voucher",
              tab_mine: "Voucher của tôi",
              tab_promotions: "Chương trình khuyến mãi",
              empty_mine: "Bạn chưa có voucher nào",
              empty_promotions: "Hiện không có chương trình khuyến mãi nào"
            },
            security: {
              title: "Đổi mật khẩu",
              subtitle: "Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác",
              current_password: "Mật khẩu hiện tại",
              new_password: "Mật khẩu mới",
              confirm_new_password: "Xác nhận mật khẩu mới",
              err_old: "Vui lòng nhập mật khẩu cũ",
              err_min: "Mật khẩu mới ít nhất 6 ký tự",
              err_match: "Mật khẩu không khớp"
            },
            address: {
              title: "Quản lý địa chỉ",
              add_new: "+ Thêm địa chỉ mới",
              edit_title: "Sửa địa chỉ",
              new_title: "Địa chỉ mới",
              recipient_name: "Tên người nhận",
              recipient_phone: "Số điện thoại",
              province: "Tỉnh/Thành",
              select_province: "Chọn Tỉnh/Thành",
              district: "Quận/Huyện",
              select_district: "Chọn Quận/Huyện",
              ward: "Phường/Xã",
              select_ward: "Chọn Phường/Xã",
              specific: "Địa chỉ cụ thể",
              set_default: "Đặt làm địa chỉ mặc định",
              default_badge: "Mặc định",
              empty: "Chưa có địa chỉ nào được lưu.",
              confirm_delete: "Xóa địa chỉ này?",
              save_address: "Lưu địa chỉ"
            }
          },
          sidebar: {
            dashboard: "Tổng quan Dashboard",
            user_management: "Quản lý người dùng",
            hr_management: "Quản lý nhân sự",
            inventory: "Quản lý kho",
            orders: "Vận hành đơn hàng",
            marketing: "Tiếp thị & Quảng cáo",
            customer_support: "Trung tâm hỗ trợ",
            reports: "Phân tích kinh doanh",
            finance: "Báo cáo tài chính"
          },
          dashboard: {
            welcome: "Chào mừng trở lại"
          },
          hr: {
            title: "Quản lý nhân sự",
            staff_directory: "Danh bạ nhân viên",
            permissions_manager: "Quản lý phân quyền",
            table: {
              user: "Nhân viên",
              email: "Email",
              roles: "Vai trò",
              groups: "Phòng ban / Nhóm",
              last_login: "Lần cuối đăng nhập",
              actions: "Hành động"
            },
            edit_permissions: "Chỉnh sửa phân quyền",
            roles_title: "Vai trò được gán",
            groups_title: "Phòng ban được gán",
            save_permissions: "Lưu phân quyền",
            assign_roles_desc: "Chọn các vai trò cơ bản (Roles) cho người dùng.",
            assign_groups_desc: "Chọn các phòng ban hoặc nhóm chức năng (Groups).",
            success_update: "Cập nhật phân quyền thành công!"
          },
          customers: {
            title: "Quản lý khách hàng",
            subtitle: "Quản lý tài khoản khách hàng và lịch sử mua hàng",
            table: {
              customer: "Khách hàng",
              status: "Trạng thái",
              total_orders: "Đơn hàng",
              total_spent: "Đã chi",
              actions: "Hành động"
            },
            search_placeholder: "Tìm kiếm khách hàng...",
            no_customers: "Không tìm thấy khách hàng nào."
          }
        }
      }
    },
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
