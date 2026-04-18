# File Tree: Drumify

**Generated:** 4/17/2026, 5:25:30 PM
**Root Path:** `/home/linhdev/Desktop/projects/Drumify`

```
├── backend
│   ├── .mvn
│   │   └── wrapper
│   │       └── maven-wrapper.properties
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── linhdev
│   │   │   │           └── drumify
│   │   │   │               ├── backend
│   │   │   │               │   └── src
│   │   │   │               │       └── main
│   │   │   │               ├── client
│   │   │   │               │   ├── IdentityClient.java
│   │   │   │               │   └── ShipmentClient.java
│   │   │   │               ├── configuration
│   │   │   │               │   ├── CloudinaryConfig.java
│   │   │   │               │   ├── CorsConfiguration.java
│   │   │   │               │   ├── CustomAuthoritiesConverter.java
│   │   │   │               │   ├── JwtAuthenticationEntryPoint.java
│   │   │   │               │   └── SecurityConfig.java
│   │   │   │               ├── configurations
│   │   │   │               ├── constant
│   │   │   │               │   └── CloudinaryFolderConstants.java
│   │   │   │               ├── controller
│   │   │   │               │   ├── AddressController.java
│   │   │   │               │   ├── CartController.java
│   │   │   │               │   ├── CategoryController.java
│   │   │   │               │   ├── DashboardController.java
│   │   │   │               │   ├── InventoryController.java
│   │   │   │               │   ├── MediaController.java
│   │   │   │               │   ├── OrderController.java
│   │   │   │               │   ├── ProductController.java
│   │   │   │               │   ├── ProfileController.java
│   │   │   │               │   ├── ReportController.java
│   │   │   │               │   ├── ShipmentController.java
│   │   │   │               │   ├── StoreController.java
│   │   │   │               │   └── SupplierController.java
│   │   │   │               ├── dto
│   │   │   │               │   ├── identity
│   │   │   │               │   │   ├── Credential.java
│   │   │   │               │   │   ├── GroupRepresentation.java
│   │   │   │               │   │   ├── KeycloakError.java
│   │   │   │               │   │   ├── RoleRepresentation.java
│   │   │   │               │   │   ├── TokenExchangeParam.java
│   │   │   │               │   │   ├── TokenExchangeResponse.java
│   │   │   │               │   │   ├── UserCreationParam.java
│   │   │   │               │   │   └── UserRepresentation.java
│   │   │   │               │   ├── payment
│   │   │   │               │   ├── request
│   │   │   │               │   │   ├── AddressRequest.java
│   │   │   │               │   │   ├── CreateOrderRequest.java
│   │   │   │               │   │   ├── PasswordChangeRequest.java
│   │   │   │               │   │   ├── ProductMediaRequest.java
│   │   │   │               │   │   ├── ProfileUpdateRequest.java
│   │   │   │               │   │   ├── RegistrationRequest.java
│   │   │   │               │   │   └── StaffCreationRequest.java
│   │   │   │               │   ├── response
│   │   │   │               │   │   ├── AddressResponse.java
│   │   │   │               │   │   ├── CartItemResponse.java
│   │   │   │               │   │   ├── CartResponse.java
│   │   │   │               │   │   ├── ProductMediaResponse.java
│   │   │   │               │   │   └── ProfileResponse.java
│   │   │   │               │   ├── shipment
│   │   │   │               │   │   ├── GhnApiResponse.java
│   │   │   │               │   │   ├── GhnCreateOrderDataResponse.java
│   │   │   │               │   │   ├── GhnCreateOrderRequest.java
│   │   │   │               │   │   ├── GhnDistrictResponse.java
│   │   │   │               │   │   ├── GhnOrderDetailResponse.java
│   │   │   │               │   │   ├── GhnOrderItemRequest.java
│   │   │   │               │   │   ├── GhnProvinceResponse.java
│   │   │   │               │   │   └── GhnWardResponse.java
│   │   │   │               │   ├── warehouse
│   │   │   │               │   │   ├── CategoryRequest.java
│   │   │   │               │   │   ├── CategoryResponse.java
│   │   │   │               │   │   ├── DashboardResponse.java
│   │   │   │               │   │   ├── InventoryRowResponse.java
│   │   │   │               │   │   ├── InventoryThresholdRequest.java
│   │   │   │               │   │   ├── OrderItemResponse.java
│   │   │   │               │   │   ├── OrderResponse.java
│   │   │   │               │   │   ├── ProductRequest.java
│   │   │   │               │   │   ├── ProductResponse.java
│   │   │   │               │   │   ├── ProductVariantRequest.java
│   │   │   │               │   │   ├── ProductVariantResponse.java
│   │   │   │               │   │   ├── ReportResponse.java
│   │   │   │               │   │   ├── ShipmentResponse.java
│   │   │   │               │   │   ├── ShipmentUpdateRequest.java
│   │   │   │               │   │   ├── StockAdjustmentRequest.java
│   │   │   │               │   │   ├── StockExportRequest.java
│   │   │   │               │   │   ├── StockImportRequest.java
│   │   │   │               │   │   ├── StockMovementResponse.java
│   │   │   │               │   │   ├── SupplierRequest.java
│   │   │   │               │   │   └── SupplierResponse.java
│   │   │   │               │   └── ApiResponse.java
│   │   │   │               ├── entity
│   │   │   │               │   ├── Address.java
│   │   │   │               │   ├── Banner.java
│   │   │   │               │   ├── Brand.java
│   │   │   │               │   ├── Cart.java
│   │   │   │               │   ├── CartItem.java
│   │   │   │               │   ├── Category.java
│   │   │   │               │   ├── FinancialRecord.java
│   │   │   │               │   ├── Inventory.java
│   │   │   │               │   ├── Order.java
│   │   │   │               │   ├── OrderItem.java
│   │   │   │               │   ├── Payment.java
│   │   │   │               │   ├── Product.java
│   │   │   │               │   ├── ProductMedia.java
│   │   │   │               │   ├── ProductVariant.java
│   │   │   │               │   ├── Profile.java
│   │   │   │               │   ├── Promotion.java
│   │   │   │               │   ├── Refund.java
│   │   │   │               │   ├── RefundMedia.java
│   │   │   │               │   ├── Review.java
│   │   │   │               │   ├── Shipment.java
│   │   │   │               │   ├── StockMovement.java
│   │   │   │               │   ├── Supplier.java
│   │   │   │               │   └── Voucher.java
│   │   │   │               ├── enums
│   │   │   │               │   ├── ContentType.java
│   │   │   │               │   ├── DiscountScope.java
│   │   │   │               │   ├── DiscountStatus.java
│   │   │   │               │   ├── DiscountType.java
│   │   │   │               │   ├── FinancialRecordType.java
│   │   │   │               │   ├── MediaType.java
│   │   │   │               │   ├── OrderStatus.java
│   │   │   │               │   ├── PaymentMethod.java
│   │   │   │               │   ├── ProductStatus.java
│   │   │   │               │   ├── RefundReason.java
│   │   │   │               │   ├── RefundStatus.java
│   │   │   │               │   ├── ShipmentProvider.java
│   │   │   │               │   ├── ShipmentStatus.java
│   │   │   │               │   └── StockMovementType.java
│   │   │   │               ├── exception
│   │   │   │               │   ├── AppException.java
│   │   │   │               │   ├── ErrorCode.java
│   │   │   │               │   ├── ErrorNormalizer.java
│   │   │   │               │   └── GlobalExceptionHandler.java
│   │   │   │               ├── mapper
│   │   │   │               │   ├── AddressMapper.java
│   │   │   │               │   ├── InventoryMapper.java
│   │   │   │               │   ├── OrderMapper.java
│   │   │   │               │   ├── ProfileMapper.java
│   │   │   │               │   ├── ShipmentMapper.java
│   │   │   │               │   └── SupplierMapper.java
│   │   │   │               ├── repository
│   │   │   │               │   ├── AddressRepository.java
│   │   │   │               │   ├── BannerRepository.java
│   │   │   │               │   ├── BrandRepository.java
│   │   │   │               │   ├── CartItemRepository.java
│   │   │   │               │   ├── CartRepository.java
│   │   │   │               │   ├── CategoryRepository.java
│   │   │   │               │   ├── FinancialRecordRepository.java
│   │   │   │               │   ├── InventoryRepository.java
│   │   │   │               │   ├── OrderItemRepository.java
│   │   │   │               │   ├── OrderRepository.java
│   │   │   │               │   ├── PaymentRepository.java
│   │   │   │               │   ├── ProductMediaRepository.java
│   │   │   │               │   ├── ProductRepository.java
│   │   │   │               │   ├── ProductVariantRepository.java
│   │   │   │               │   ├── ProfileRepository.java
│   │   │   │               │   ├── PromotionRepository.java
│   │   │   │               │   ├── RefundMediaRepository.java
│   │   │   │               │   ├── RefundRepository.java
│   │   │   │               │   ├── ReviewRepository.java
│   │   │   │               │   ├── ShipmentRepository.java
│   │   │   │               │   ├── StockMovementRepository.java
│   │   │   │               │   ├── SupplierRepository.java
│   │   │   │               │   └── VoucherRepository.java
│   │   │   │               ├── service
│   │   │   │               │   ├── CartService.java
│   │   │   │               │   ├── CategoryService.java
│   │   │   │               │   ├── InventoryService.java
│   │   │   │               │   ├── MediaService.java
│   │   │   │               │   ├── OrderService.java
│   │   │   │               │   ├── ProductService.java
│   │   │   │               │   ├── ProfileService.java
│   │   │   │               │   ├── ReportService.java
│   │   │   │               │   ├── ShipmentService.java
│   │   │   │               │   └── SupplierService.java
│   │   │   │               └── DrumifyApplication.java
│   │   │   └── resources
│   │   │       ├── static
│   │   │       ├── templates
│   │   │       └── application.yaml
│   │   └── test
│   │       └── java
│   │           └── com
│   │               └── linhdev
│   │                   └── drumify
│   │                       ├── exception
│   │                       └── DrumifyApplicationTests.java
│   ├── KEYCLOAK.md
│   ├── MYSQL.md
│   ├── README.md
│   ├── backend-rules.md
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
├── frontend
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── assets
│   │   │   ├── icons
│   │   │   ├── images
│   │   │   │   ├── default-avatar.png
│   │   │   │   └── drumify.png
│   │   │   └── styles
│   │   │       └── GlobalStyles
│   │   ├── component
│   │   │   ├── CategoryGrid
│   │   │   │   ├── CategoryGrid.jsx
│   │   │   │   └── CategoryGrid.module.scss
│   │   │   ├── Common
│   │   │   │   └── CloudinaryImage.jsx
│   │   │   ├── Profile
│   │   │   │   ├── SetAvatarDialog.jsx
│   │   │   │   └── SetAvatarDialog.module.scss
│   │   │   ├── Header.jsx
│   │   │   ├── LineItem.jsx
│   │   │   └── SideMenu.jsx
│   │   ├── components
│   │   │   ├── Auth
│   │   │   │   ├── ForgotPassword
│   │   │   │   ├── Login
│   │   │   │   ├── Register
│   │   │   │   ├── VerifyCode
│   │   │   │   └── AuthRedirectHandler.jsx
│   │   │   ├── Common
│   │   │   │   ├── AddressModal
│   │   │   │   │   ├── AddressDetailModal
│   │   │   │   │   ├── AddressListModal
│   │   │   │   │   └── NewAddressModal
│   │   │   │   ├── Banner
│   │   │   │   │   ├── Banner1
│   │   │   │   │   └── Banner2
│   │   │   │   ├── Button
│   │   │   │   ├── CategoryGrid
│   │   │   │   ├── Chat
│   │   │   │   ├── CollectionDetail
│   │   │   │   ├── ConfirmDialog
│   │   │   │   │   ├── CancelOrderDialog
│   │   │   │   │   ├── DeleteAccountDialog
│   │   │   │   │   ├── DeleteAddresssDialog
│   │   │   │   │   ├── DeleteCategoryDialog
│   │   │   │   │   ├── RejectOrderRefundDialog
│   │   │   │   │   ├── RestockDialog
│   │   │   │   │   ├── SetAvatarDialog
│   │   │   │   │   └── SetStatusCategoryDialog
│   │   │   │   ├── CustomerReviews
│   │   │   │   ├── FeaturedBrands
│   │   │   │   ├── FlashSale
│   │   │   │   ├── Input
│   │   │   │   ├── Lightbox
│   │   │   │   ├── LoadingBar
│   │   │   │   ├── MusicCorner
│   │   │   │   ├── MusicalTrends
│   │   │   │   ├── Newsletter
│   │   │   │   ├── Notification
│   │   │   │   ├── Pagination
│   │   │   │   ├── ProductCard
│   │   │   │   ├── ProductDetail
│   │   │   │   ├── ProductList
│   │   │   │   ├── ProductTabs
│   │   │   │   ├── RestockProductDialog
│   │   │   │   ├── RichTextEditor
│   │   │   │   ├── SearchFilterBar
│   │   │   │   ├── SeasonalBanner
│   │   │   │   ├── StatusBadge
│   │   │   │   └── VoucherPromotionCard
│   │   │   └── Home
│   │   ├── config
│   │   │   └── adminSidebarConfig.js
│   │   ├── configurations
│   │   │   ├── apiEndpoints.js
│   │   │   ├── configuration.js
│   │   │   └── httpCient.js
│   │   ├── constants
│   │   │   └── catalog.js
│   │   ├── context
│   │   │   ├── KeycloakAuthContext.jsx
│   │   │   ├── ProfileContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks
│   │   │   ├── utils
│   │   │   │   ├── authHeaders.js
│   │   │   │   ├── mapProductToCard.js
│   │   │   │   ├── normalizeMediaUrl.js
│   │   │   │   ├── sortAndSlice.js
│   │   │   │   └── unwrapApiResponse.js
│   │   │   ├── index.js
│   │   │   ├── useActiveCategories.js
│   │   │   ├── useBanners.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useHomeProducts.js
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useProducts.js
│   │   │   ├── useSearchAndFilter.js
│   │   │   └── useVouchers.js
│   │   ├── layouts
│   │   │   ├── AdminLayout
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── TopNav.jsx
│   │   │   ├── CustomerAccountLayout
│   │   │   ├── CustomerSupportLayout
│   │   │   ├── DefaultLayout
│   │   │   ├── StaffLayout
│   │   │   ├── components
│   │   │   │   ├── Footer
│   │   │   │   ├── Header
│   │   │   │   │   ├── Admin
│   │   │   │   │   ├── CustomerSupport
│   │   │   │   │   ├── Default
│   │   │   │   │   └── Staff
│   │   │   │   ├── NavBar
│   │   │   │   ├── SearchAndSort
│   │   │   │   └── SideBar
│   │   │   │       ├── Admin
│   │   │   │       ├── Customer
│   │   │   │       └── Employees
│   │   │   │           ├── CustomerSupport
│   │   │   │           └── Staff
│   │   │   └── MainLayout.jsx
│   │   ├── pages
│   │   │   ├── Admin
│   │   │   │   ├── Dashboard
│   │   │   │   │   └── AdminDashboard.jsx
│   │   │   │   ├── ManageCategories
│   │   │   │   │   ├── AddCategory
│   │   │   │   │   ├── CategoryDetail
│   │   │   │   │   └── UpdateCategory
│   │   │   │   ├── ManageComplaints
│   │   │   │   │   └── ComplaintsDetail
│   │   │   │   ├── ManageContent
│   │   │   │   │   ├── ContentDetail
│   │   │   │   │   └── ReviewAndComment
│   │   │   │   ├── ManageCustomerAccounts
│   │   │   │   │   ├── CustomerDetail
│   │   │   │   │   └── CustomerManagement.jsx
│   │   │   │   ├── ManageOrders
│   │   │   │   │   ├── ManageOrderDetail
│   │   │   │   │   └── OrderReturn
│   │   │   │   ├── ManageProduct
│   │   │   │   │   ├── ProductDetail
│   │   │   │   │   └── UpdateProduct
│   │   │   │   ├── ManageStaffAccounts
│   │   │   │   │   ├── AddEmployee
│   │   │   │   │   ├── StaffDetail
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── UserCreationModal.jsx
│   │   │   │   │   │   └── UserEditModal.jsx
│   │   │   │   │   ├── HRManagement.jsx
│   │   │   │   │   └── HRWorkspace.jsx
│   │   │   │   ├── ManageVouchersPromotions
│   │   │   │   │   ├── PromotionDetail
│   │   │   │   │   └── VoucherDetail
│   │   │   │   ├── ProfileAdmin
│   │   │   │   ├── ReportsAnalytics
│   │   │   │   │   ├── BestSeller
│   │   │   │   │   ├── FinancialReport
│   │   │   │   │   ├── OrderReport
│   │   │   │   │   └── RevenueReport
│   │   │   │   └── Warehouse
│   │   │   │       ├── WarehouseDashboard.jsx
│   │   │   │       └── WarehouseWorkspace.jsx
│   │   │   ├── Articles
│   │   │   ├── Blog
│   │   │   │   └── BlogDetail
│   │   │   ├── Cart
│   │   │   │   ├── Cart.jsx
│   │   │   │   └── index.js
│   │   │   ├── Category
│   │   │   ├── Checkout
│   │   │   │   ├── CheckoutDetails
│   │   │   │   ├── ConfirmCheckout
│   │   │   │   ├── OrderSuccess
│   │   │   │   ├── Checkout.jsx
│   │   │   │   └── index.js
│   │   │   ├── Contact
│   │   │   ├── CustomerAccount
│   │   │   │   ├── CustomerChangePassword
│   │   │   │   ├── CustomerComplaint
│   │   │   │   ├── CustomerOrderHistory
│   │   │   │   │   ├── CustomerOrderDetailPage
│   │   │   │   │   ├── RefundDetail
│   │   │   │   │   └── RefundRequest
│   │   │   │   ├── CustomerProfile
│   │   │   │   └── CustomerVoucherPromotion
│   │   │   ├── Dashboards
│   │   │   ├── Employees
│   │   │   │   ├── CustomerSupport
│   │   │   │   │   ├── ChatManagement
│   │   │   │   │   ├── ChatRequests
│   │   │   │   │   ├── ComplaintManagement
│   │   │   │   │   ├── CustomerSupportMain
│   │   │   │   │   ├── CustomerSupportNotification
│   │   │   │   │   ├── ProfileCustomerSupport
│   │   │   │   │   ├── RefundManagement
│   │   │   │   │   │   └── RefundDetail
│   │   │   │   │   └── ReviewCommentManagement
│   │   │   │   └── Staff
│   │   │   │       ├── ContentManagement
│   │   │   │       │   ├── AddBanner
│   │   │   │       │   ├── BannerDetail
│   │   │   │       │   │   └── BannerList
│   │   │   │       │   └── UpdateContent
│   │   │   │       ├── OrderManagement
│   │   │   │       │   ├── OrderDetail
│   │   │   │       │   └── RefundOrderDetail
│   │   │   │       ├── ProductManagement
│   │   │   │       │   ├── AddProduct
│   │   │   │       │   ├── ProductDetail
│   │   │   │       │   └── UpdateProduct
│   │   │   │       ├── ProfileStaff
│   │   │   │       ├── StaffMain
│   │   │   │       ├── StaffNotification
│   │   │   │       └── VouchersPromotionsPage
│   │   │   │           ├── Promotion
│   │   │   │           │   ├── AddPromotion
│   │   │   │           │   ├── PromotionDetail
│   │   │   │           │   └── UpdatePromotion
│   │   │   │           └── Voucher
│   │   │   │               ├── AddVoucher
│   │   │   │               ├── UpdateVoucher
│   │   │   │               └── VoucherDetail
│   │   │   ├── Home
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Home.module.scss
│   │   │   │   ├── _variables.scss
│   │   │   │   └── index.js
│   │   │   ├── OrderSuccess
│   │   │   │   └── OrderSuccess.jsx
│   │   │   ├── ProductDetail
│   │   │   │   └── ProductDetail.jsx
│   │   │   ├── Products
│   │   │   │   ├── Products.jsx
│   │   │   │   └── index.js
│   │   │   ├── Profile
│   │   │   │   ├── components
│   │   │   │   │   ├── AddressManager.jsx
│   │   │   │   │   ├── FormInput.jsx
│   │   │   │   │   ├── OrdersTab.jsx
│   │   │   │   │   ├── ProfileTab.jsx
│   │   │   │   │   ├── SecurityTab.jsx
│   │   │   │   │   └── VoucherTab.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Profile.module.scss
│   │   │   │   └── index.js
│   │   │   ├── Promotion
│   │   │   ├── Registration
│   │   │   ├── SearchResults
│   │   │   ├── SupportUser
│   │   │   │   ├── PaymentPolicy
│   │   │   │   ├── ReturnPolicy
│   │   │   │   ├── ShippingPolicy
│   │   │   │   └── ShoppingGuide
│   │   │   └── Scene.jsx
│   │   ├── routes
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleProtectedRoute.jsx
│   │   │   └── routes.js
│   │   ├── services
│   │   │   ├── authenticationService.js
│   │   │   ├── cartService.js
│   │   │   ├── imageService.js
│   │   │   ├── orderService.js
│   │   │   ├── storeService.js
│   │   │   ├── userService.js
│   │   │   └── warehouseService.js
│   │   ├── utils
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── i18n.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── keycloak.js
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── .prettierrc
│   ├── README.md
│   ├── package-lock.json
│   └── package.json
├── keycloak
│   ├── custom_event_listener_provider
│   │   ├── custom_event_listener_provider
│   │   ├── src
│   │   │   └── main
│   │   │       ├── java
│   │   │       │   └── com
│   │   │       │       └── drumify
│   │   │       │           └── keycloak
│   │   │       │               └── events
│   │   │       │                   ├── RegistrationEventListener.java
│   │   │       │                   └── RegistrationEventListenerFactory.java
│   │   │       └── resources
│   │   │           └── META-INF
│   │   │               └── services
│   │   │                   └── org.keycloak.events.EventListenerProviderFactory
│   │   └── pom.xml
│   └── EVENT_LISTENER_FLOW.md
├── .gitattributes
├── .gitignore
├── README.md
├── ROLES_AND_PERMISSIONS.md
└── anhThanh
```

---

_Generated by FileTree Pro Extension_
