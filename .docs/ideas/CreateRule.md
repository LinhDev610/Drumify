# AI Rules Generation Workflow

Tài liệu này mô tả quy trình từng bước để tạo file `rules.md`
giúp AI hiểu đúng dự án web của bạn.

---

# Phần bạn cần tự custom thật sự

Những phần dưới đây cần chỉnh sửa theo đúng dự án của bạn.

---

## 1. Architecture

Ví dụ:

Backend

controller -> service -> mapper -> repository

Frontend

routes -> pages -> components -> hooks -> services -> context

---

## 2. Response format

Ví dụ:

{
  "code": 200,
  "message": "OK",
  "result": {}
}

---

## 3. Security

Ví dụ:

ADMIN  
STAFF  
DIRECTOR  
CUSTOMER  

---

## 4. Forbidden AI actions

Ví dụ:

AI must not:
- change Keycloak roles
- rename API fields
- modify DB migration files automatically

---

# PROMPT 1 — Phân tích dự án hiện tại

## Mục tiêu

AI hiểu project đang có gì.

## Prompt

You are a senior software architect.

I want you to analyze my existing web project and help me create a project-specific AI coding rules file.

First, analyze the project and identify:

1. Project structure  
2. Tech stack  
3. Architecture pattern  
4. Naming conventions  
5. Folder organization  
6. Coding style  
7. API design style  
8. State management approach  
9. Reusable patterns  
10. Common mistakes AI should avoid  

Do not generate rules yet.  
Only analyze and summarize the project.

## Bạn gửi

- backend source
- frontend source
- folder tree
- sample files

---

# PROMPT 2 — Phân tích backend riêng

## Mục tiêu

AI hiểu Spring Boot convention.

## Prompt

Analyze only the backend part of this project.

Focus on:

1. controller patterns  
2. service patterns  
3. repository usage  
4. DTO structure  
5. exception handling  
6. response format  
7. security style  
8. database mapping  
9. validation style  
10. logging style  

Extract all coding conventions used by the team.

Do not generate code.  
Only produce backend development rules notes.

---

# PROMPT 3 — Phân tích frontend riêng

## Mục tiêu

AI hiểu React pattern.

## Prompt

Analyze only the frontend part of this project.

Focus on:

1. component structure  
2. page layout  
3. routing  
4. API calling pattern  
5. state management  
6. styling approach  
7. form handling  
8. naming conventions  
9. reusable hooks  
10. folder organization  

Extract frontend coding conventions for AI assistance.

Do not create final rules yet.

---

# PROMPT 4 — Trích xuất coding patterns

## Mục tiêu

AI rút ra pattern thật sự.

## Prompt

From the project analysis, identify repeated development patterns that should become AI rules.

Examples:
- CRUD pattern
- API response pattern
- Error handling pattern
- Form validation pattern
- Table rendering pattern
- Authentication flow

Return the patterns as:

Pattern name  
Purpose  
Implementation rule  
Example  

## Ý nghĩa

Prompt này giúp AI nhìn ra:

👉 team đang code theo "template" nào.

---

# PROMPT 5 — Sinh rules.md bản đầu tiên

## Mục tiêu

Sau khi AI hiểu rồi mới generate.

## Prompt

Now generate a project-specific rules.md file for this web project.

Requirements:
- personalized to this project
- based on actual project structure
- backend + frontend
- easy for AI to follow
- prevent inconsistent code
- maintain team style
- production ready

Format:
1. general rules  
2. backend rules  
3. frontend rules  
4. naming rules  
5. API rules  
6. forbidden actions for AI  

---

# PROMPT 6 — Làm rules mang tính cá nhân hóa

## Mục tiêu

Gắn theo cách bạn code.

## Prompt

Refine the rules.md so it matches my personal coding style.

My preferences:
- clean architecture
- readable code
- minimal duplication
- strongly typed DTO
- scalable folder structure
- simple React components
- reusable hooks
- clear naming
- enterprise style code

Update the rules to reflect my development style.

## Ý nghĩa

Prompt này cực kỳ quan trọng vì:

AI sẽ từ team style  
→ thành style của riêng bạn.

---

# PROMPT 7 — Tạo AI behavior rules

## Mục tiêu

Quy định AI phải hành xử thế nào.

## Prompt

Add a section called AI Behavior Rules.

The AI must:
- ask before changing architecture
- reuse existing components first
- never generate duplicate files
- follow existing naming conventions
- preserve project style
- explain major changes before coding
- avoid unnecessary dependencies
- generate only requested files

Make these rules strict.

## Ý nghĩa

Rất mạnh vì AI sẽ ít "phá dự án".

---

# PROMPT 8 — Kiểm tra rules

## Mục tiêu

Tìm thiếu sót.

## Prompt

Review the generated rules.md.

Check:
1. missing rules  
2. ambiguous rules  
3. conflicting rules  
4. weak instructions  
5. anything that could make AI generate wrong code  

Improve the file to make it safer for long-term project usage.

---

# PROMPT 9 — Tối ưu cho AI coding

## Mục tiêu

Để AI hiểu nhanh hơn.

## Prompt

Rewrite rules.md specifically for AI-assisted coding.

Requirements:
- concise
- strict
- deterministic
- easy for AI to parse
- no vague wording
- optimized for Cursor / Copilot / ChatGPT

Keep the meaning unchanged.

---

# PROMPT 10 — Tạo prompt khởi động chuẩn

## Mục tiêu

Tạo prompt tái sử dụng hằng ngày.

## Prompt

Create a reusable starter prompt that I can use before asking AI to generate code for this project.

The starter prompt should:
- instruct AI to read rules.md
- inspect related files
- preserve architecture
- follow coding standards
- avoid duplicate logic

## AI sẽ tạo ra prompt kiểu

Read rules.md first.  
Inspect related files before coding.  
Follow existing architecture.  
Reuse existing patterns.  
Do not generate duplicate logic.  
Explain your plan before writing code.