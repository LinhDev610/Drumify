---
name: archive-memory
description: >-
  Long-term project memory and decision tracking for Drumify.
  Use this skill to record significant architectural decisions, reasons for specific implementation patterns,
  and lessons learned from past tasks.
  Trigger on: "lưu ghi chú dự án", "ghi lại quyết định", "project memory", "archive decision", "tổng kết task".
---

# 📚 Archive Memory

Kỹ năng giúp lưu trữ và truy xuất các quyết định quan trọng trong dự án.

## 🎯 Mục tiêu
-   Lưu giữ "tại sao" một thứ được làm theo cách này.
-   Theo dõi quá trình tiến hóa của hệ thống.
-   Giảm thiểu việc lặp lại các câu hỏi hoặc sai lầm cũ.

## 📝 Nội dung cần Archive
-   **Architectural Decisions (ADRs)**: Tại sao dùng Keycloak thay vì tự build Auth? Tại sao dùng Spring Boot 4?
-   **Bug Fixes Lessons**: Các lỗi khó nhằn và cách giải quyết để không tái diễn.
-   **Feature Logic**: Các quy tắc nghiệp vụ phức tạp (ví dụ: cách tính phí ship GHN).

## 🗂️ Cấu trúc lưu trữ
Mọi ghi chú sẽ được lưu trong `.agent/docs/ideas/` hoặc các file `.md` liên quan trong `docs/`.

## 📋 Cách sử dụng
Khi hoàn thành một task lớn hoặc đưa ra một quyết định kiến trúc:
1.  Tổng hợp lại các điểm chính.
2.  Viết vào file memory tương ứng.
3.  Cập nhật `ARCHITECTURE.md` nếu cần.
