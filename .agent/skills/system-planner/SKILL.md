---
name: system-planner
description: >-
  Architectural planning, feature decomposition, and project conventions for Drumify.
  Use this skill to design new features, break down tasks, and ensure compliance with naming and folder standards.
  Trigger on: "lên kế hoạch", "thiết kế feature", "plan feature", "kiến trúc", "breakdown task", "conventions", "naming", "folder structure".
---

# 🧠 System Planner & Architect

Kỹ năng này chịu trách nhiệm lập kế hoạch, thiết kế kiến trúc và đảm bảo tính nhất quán của toàn bộ dự án.

## 0. Thứ tự ưu tiên (Priority Order)
1. **Chỉ dẫn trực tiếp từ User**.
2. **AI Behavior Rules** (trong skill này).
3. **Forbidden Actions** (trong skill này).
4. **Các tiêu chuẩn kỹ thuật khác**.

## 🛡️ AI Behavior Rules
- **Architecture changes**: PHẢI hỏi ý kiến trước khi thay đổi ranh giới layer, cấu trúc API contract, DTO schema.
- **Reuse-first**: PHẢI tìm kiếm và tái sử dụng components, hooks, services, DTOs có sẵn.
- **Quality Gates**: Tự kiểm tra Scope, Contract, Runtime, và Error-path trước khi hoàn tất.

## 📁 Folder Structure (The Core)
- **Backend (6-Layer)**: `controller`, `service`, `mapper`, `repository`, `entity`, `dto`, `exception`, `configuration`.
- **Frontend (Module-based)**: `pages`, `components/Common`, `services`, `hooks`, `configurations`, `context`.

## 🏷️ Naming Conventions
- **Backend**: `PascalCase` cho Class, `camelCase` cho Method/Var. Suffixes: `Controller`, `Service`, `Repository`, `Mapper`, `Request`, `Response`.
- **Frontend**: `PascalCase` cho Component/Page, `useXxx` cho Hook, `verb+Noun` cho Service function.
- **API**: Resource-oriented, sử dụng số nhiều (ví dụ: `/products`).

## 🏗️ Development & Documentation Workflow

Khi thực hiện bất kỳ thay đổi nào (thêm feature, sửa logic, refactor), PHẢI tuân thủ:

1.  **Phân tích & Lên kế hoạch**: Sử dụng các file `.docs/*.md` tương ứng để hiểu yêu cầu.
2.  **Thực thi Code**: 
    - Backend: Entity -> Repo -> DTO -> Mapper -> Service -> Controller.
    - Frontend: Service API -> UI Components -> Page Integration.
3.  **Cập nhật Tài liệu (MANDATORY)**:
    - Cập nhật `FEATURES_DONE.md` khi tính năng hoàn thành.
    - Cập nhật các file `-plan.md` hoặc `-brief.md` nếu logic hoặc UI thay đổi.
    - Ghi lại các quyết định quan trọng vào `archive-memory`.
4.  **Kiểm tra**: Đảm bảo app chạy đúng và không vi phạm Forbidden Actions.

## 🚫 Forbidden Actions
- Đưa logic nghiệp vụ vào Controller.
- Expose Entity JPA trực tiếp ra API.
- Bỏ qua `ApiResponse<T>` wrapper.
- Gọi `axios` trực tiếp từ Component.
- Hardcode secrets (tokens, credentials, API keys).
- Tự ý đổi tên/di chuyển file legacy (như `httpCient.js`).

## 💡 SRP Summary
- **Entity**: "Cấu trúc Database".
- **DTO**: "Dữ liệu vận chuyển (I/O)".
- **Service**: "Logic và luật chơi".
- **Controller**: "Tiếp nhận và điều phối".
- **Component**: "Hiển thị và tương tác".
