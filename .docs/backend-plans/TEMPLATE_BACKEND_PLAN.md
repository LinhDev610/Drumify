# 🔧 Backend Implementation Plan: [Feature Name]

## 🎯 Goal
Mô tả ngắn gọn về mục tiêu của tính năng này.

## 🗄️ Database Changes
- **Entity Name**: `[Name]`
- **Fields**:
  - `id`: UUID (Primary Key)
  - `field_name`: Type (Constraints)
- **Relationships**:
  - [Entity A] (1) <-> (N) [Entity B]

## 📡 API Design
- **Endpoint**: `POST /module/resource`
- **Request Body**:
```json
{
  "field": "value"
}
```
- **Response**: `ApiResponse<ResultDTO>`

## 🛠️ Components to Create/Update
- [ ] `entity/EntityName.java`
- [ ] `repository/EntityNameRepository.java`
- [ ] `dto/module/EntityNameRequest.java`
- [ ] `dto/module/EntityNameResponse.java`
- [ ] `mapper/EntityNameMapper.java`
- [ ] `service/EntityNameService.java`
- [ ] `controller/EntityNameController.java`

## 🛡️ Security
- Required Role: `ADMIN` / `STAFF`
- Required Group: `WAREHOUSE` / `HR`
- **Note**: Chú thích `@PreAuthorize` PHẢI đặt tại `Service`, KHÔNG đặt tại `Controller`.