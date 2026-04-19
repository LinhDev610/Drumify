---
name: save-context
description: >-
  Session state management and handoff for Drumify.
  Use this skill to save the current progress of a task, pending TODOs, 
  and critical context needed for the next session.
  Trigger on: "lưu context", "dừng task", "nghỉ tay", "save progress", "handoff".
---

# 💾 Save Context

Kỹ năng giúp bảo toàn trạng thái công việc khi chuyển giao session hoặc tạm dừng.

## 🎯 Khi nào cần sử dụng?
-   Khi bạn sắp hết hạn mức tin nhắn/token.
-   Khi bạn cần tạm dừng công việc và quay lại sau.
-   Khi bạn muốn tóm tắt những gì đã làm và những gì chưa xong cho một AI session mới.

## 📝 Nội dung cần lưu
-   **Current Task**: Task hiện tại đang làm là gì?
-   **Done**: Các bước đã hoàn thành.
-   **Pending**: Các bước tiếp theo cần thực hiện.
-   **Known Issues**: Các lỗi đang gặp phải hoặc các điểm cần lưu ý.
-   **Relevant Files**: Các file đang được sửa đổi hoặc liên quan trực tiếp.

## 📄 Output
Skill này sẽ tạo hoặc cập nhật file `.agent/docs/ideas/SESSION_CONTEXT.md`.

## 📋 Mẫu Context
```markdown
# Session Handoff - [Date]

## 🎯 Objective
[Mục tiêu của session]

## ✅ Completed
- [x] Step 1...

## ⏳ Pending
- [ ] Step 2...

## ⚠️ Notes
- Cẩn thận với class X vì đang refactor dở.
```
