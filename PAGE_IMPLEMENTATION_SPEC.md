# Page Implementation Specification

> **Purpose:**  
> This file is intended to be given directly to an AI coding agent (Codex / Cursor / Claude Code / Copilot Agent, etc.) so it can implement the requested page correctly inside the existing project without guessing the business logic.

---

# 1. Main Goal

Implement the target page completely, including:

- UI layout
- Data models
- API integration
- Forms
- Validation
- Loading states
- Error handling
- Empty states
- Permissions
- CRUD operations
- Pagination / filtering / search when applicable
- Create / Edit / Delete flows
- Backend data mapping
- Frontend state management
- TypeScript types
- Reusable components

The implementation must follow the **existing project architecture and coding style**.

Do not redesign unrelated parts of the project.

---

# 2. Before Starting

The AI agent must inspect the existing codebase first and identify:

- Framework and version
- Folder structure
- Existing API service
- Axios/fetch configuration
- Authentication implementation
- Access token storage
- Existing interceptors
- Existing form library
- Existing validation library
- Existing table component
- Existing modal/dialog component
- Existing select/dropdown component
- Existing loading component
- Existing toast/notification system
- Existing permission helper
- Existing pagination implementation
- Existing translation/i18n implementation
- Existing naming conventions

Reuse existing infrastructure whenever possible.

Do **not** introduce a new library if an existing project dependency already solves the same problem.

---

# 3. Page Information

## Page Name

`[TARGET_PAGE_NAME]`

## Route

```text
[TARGET_ROUTE]
```

Example:

```text
/products
```

## Purpose

Describe what the page is responsible for:

```text
[PAGE_PURPOSE]
```

Example:

```text
This page allows administrators to view, search, create, update and delete products.
```

---

# 4. Main UI Sections

The page should contain the following logical sections.

## 4.1 Header

Possible elements:

- Page title
- Breadcrumb
- Add/Create button
- Search
- Filters
- Export
- Refresh

Expected structure:

```text
Page Header
├── Title
├── Breadcrumb
└── Actions
```

---

## 4.2 Filters

If filters exist, document each filter here.

| Field | Type | API Parameter | Required | Notes |
|---|---|---|---|---|
| `[filter]` | select/text/date | `[param]` | No | `[description]` |

Example:

| Field | Type | API Parameter | Required | Notes |
|---|---|---|---|---|
| Status | Select | status | No | Filter active/inactive records |
| Search | Text | search | No | Search by name |

Filters should update the list using API parameters instead of filtering only on the frontend unless the backend API explicitly returns the entire dataset.

---

# 5. Data Model

Define the full TypeScript interface based on the real backend response.

```ts
export interface TargetEntity {
  id: number;

  // Add exact fields here.
}
```

Do not use `any`.

Nullable backend fields must be represented correctly:

```ts
description: string | null;
```

Optional frontend-only fields must use:

```ts
imagePreview?: string;
```

---

# 6. List API

## Endpoint

```http
GET [LIST_ENDPOINT]
```

Example:

```http
GET /api/products
```

## Query Parameters

```ts
{
  page?: number;
  per_page?: number;
  search?: string;
  status?: number | string;
}
```

Use only parameters supported by the backend.

## Example Request

```http
GET /api/[resource]?page=1&per_page=10&search=test
```

## Expected Response

Adapt this structure to the real API:

```json
{
  "success": true,
  "data": {
    "result": [],
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 0
  }
}
```

If the actual backend structure is different, the frontend must follow the real response and must not invent a new response format.

---

# 7. Single Item API

Used when opening an edit/details page.

```http
GET [SHOW_ENDPOINT]/{id}
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

Populate the form only after the API request succeeds.

Show a loading state while fetching.

---

# 8. Create API

## Endpoint

```http
POST [CREATE_ENDPOINT]
```

## Payload

Document every field exactly.

```ts
{
  field_1: string;
  field_2: number;
}
```

## JSON Request

When the endpoint accepts JSON:

```ts
await api.post(endpoint, payload);
```

## Multipart Request

When images/files exist:

```ts
const formData = new FormData();

formData.append("field_1", values.field_1);

if (values.image instanceof File) {
  formData.append("image", values.image);
}

await api.post(endpoint, formData);
```

Do not manually set a multipart boundary.

---

# 9. Update API

## Endpoint

Possible patterns:

```http
PUT [UPDATE_ENDPOINT]/{id}
```

or:

```http
POST [UPDATE_ENDPOINT]/{id}
```

with:

```text
_method=PUT
```

Use the pattern already used by the backend/project.

Example:

```ts
await api.put(`${endpoint}/${id}`, payload);
```

For multipart Laravel APIs, if required:

```ts
const formData = new FormData();

formData.append("_method", "PUT");
formData.append("name", values.name);

await api.post(`${endpoint}/${id}`, formData);
```

Do not assume which method is correct. Match the actual API.

---

# 10. Delete API

```http
DELETE [DELETE_ENDPOINT]/{id}
```

Flow:

1. User clicks Delete.
2. Open confirmation dialog.
3. Do not delete before confirmation.
4. Disable confirm button while deleting.
5. Call API.
6. Close modal on success.
7. Show success message.
8. Refetch list.
9. Preserve current filters/page where possible.
10. Show backend error if deletion fails.

---

# 11. Status Toggle API

If the page has an active/inactive switch:

```http
PATCH [STATUS_ENDPOINT]/{id}
```

Payload example:

```json
{
  "status": 1
}
```

Use optimistic UI only if the project already follows that pattern.

Otherwise:

1. Call API.
2. Wait for success.
3. Refetch or update cache.
4. Restore old state on failure.

---

# 12. Form Fields

Document every field visible on the page.

| Frontend Field | API Key | Component | Type | Required | Default | Validation |
|---|---|---|---|---|---|---|
| `[label]` | `[api_key]` | Input | string | Yes | `""` | Required |
| `[label]` | `[api_key]` | Select | number | Yes | `null` | Required |
| `[label]` | `[api_key]` | File | File | No | `null` | Image |

Example:

| Frontend Field | API Key | Component | Type | Required | Default | Validation |
|---|---|---|---|---|---|---|
| Name | name | Input | string | Yes | `""` | min 2 chars |
| Status | status | Select | number | Yes | `1` | 0 or 1 |
| Image | image | File | File | No | `null` | image only |

---

# 13. Validation

Use the project's existing validation solution.

For React Hook Form + Yup:

```ts
const schema = yup.object({
  name: yup
    .string()
    .required("Name is required"),

  status: yup
    .number()
    .required("Status is required"),
});
```

Frontend validation must not conflict with backend rules.

Backend validation errors should also be mapped into the form.

Example backend response:

```json
{
  "errors": {
    "name": [
      "The name has already been taken."
    ]
  }
}
```

Mapping example:

```ts
Object.entries(errors).forEach(([field, messages]) => {
  setError(field as keyof FormValues, {
    type: "server",
    message: Array.isArray(messages)
      ? messages[0]
      : String(messages),
  });
});
```

---

# 14. Form Mode

Prefer one reusable form for both Create and Edit.

Example:

```ts
const isEditMode = Boolean(id);
```

Create:

```text
No ID
→ empty form
→ POST
```

Edit:

```text
ID exists
→ fetch record
→ reset form
→ PUT/PATCH/POST
```

Example:

```ts
useEffect(() => {
  if (!id) return;

  getItem(id).then((item) => {
    reset({
      name: item.name ?? "",
      status: item.status ?? 1,
    });
  });
}, [id, reset]);
```

---

# 15. Select Mapping

Backend data:

```json
{
  "id": 4,
  "title": "Example"
}
```

React Select format:

```ts
{
  value: item.id,
  label: item.title
}
```

Store the API ID in the form, not the entire option object, unless the existing project follows another convention.

---

# 16. Table

Expected columns:

| Column | Source |
|---|---|
| # | frontend index |
| `[column]` | `[api field]` |
| Actions | frontend |

Index should respect pagination:

```ts
const rowNumber =
  (currentPage - 1) * perPage + rowIndex + 1;
```

Do not use array index as the React key when an ID exists.

Use:

```tsx
key={item.id}
```

---

# 17. Actions

Possible row actions:

```text
View
Edit
Delete
Status
```

Visibility must respect:

- permissions
- backend flags
- record status
- `can_delete`
- `can_edit`
- business rules

Never show an action the current user cannot perform.

---

# 18. Permissions

Reuse the existing permission helper.

Example:

```ts
const canCreate = hasPermission("[resource].create");
const canEdit = hasPermission("[resource].update");
const canDelete = hasPermission("[resource].delete");
```

Example rendering:

```tsx
{canCreate && (
  <Button onClick={handleCreate}>
    Add
  </Button>
)}
```

Do not create a second permission system.

---

# 19. API Service Layer

Keep API calls outside presentation components if the project already uses service files.

Example:

```ts
export const getItems = (params?: Record<string, unknown>) =>
  ApiInstance.get(API_ROUTES.ITEMS, { params });

export const getItem = (id: number) =>
  ApiInstance.get(`${API_ROUTES.ITEMS}/${id}`);

export const createItem = (payload: CreateItemPayload) =>
  ApiInstance.post(API_ROUTES.ITEMS, payload);

export const updateItem = (
  id: number,
  payload: UpdateItemPayload,
) =>
  ApiInstance.put(`${API_ROUTES.ITEMS}/${id}`, payload);

export const deleteItem = (id: number) =>
  ApiInstance.delete(`${API_ROUTES.ITEMS}/${id}`);
```

---

# 20. API Routes

Centralize routes if the project already has an API route constants file.

```ts
export const TARGET_ROUTES = {
  LIST: "/api/[resource]",
  CREATE: "/api/[resource]",
  SHOW: "/api/[resource]",
  UPDATE: "/api/[resource]",
  DELETE: "/api/[resource]",
};
```

Avoid hardcoded endpoint strings across multiple components.

---

# 21. Authentication

Use the project's existing Axios interceptor/auth layer.

Typical request:

```http
Authorization: Bearer <access_token>
Accept: application/json
```

Do not manually inject the access token inside every page if the Axios instance already handles it.

On HTTP `401`, follow the existing application behavior.

---

# 22. Error Handling

Handle at least:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Validation Error
500 Server Error
Network Error
```

Example:

```ts
try {
  await createItem(payload);
  showSuccess();
} catch (error) {
  handleApiError(error);
}
```

Do not silently swallow errors.

---

# 23. Loading States

Provide separate loading states for:

- initial page load
- table fetching
- form submit
- delete operation
- edit-data fetching
- select options fetching

Do not block the entire application for a small local operation unless existing UX does so.

---

# 24. Empty State

When API returns no records:

```text
No records found.
```

If filters are active, preferably indicate that no results match the filters.

Do not display an application error for a valid empty response.

---

# 25. Search

If server-side search exists:

```ts
{
  search: searchValue
}
```

Debounce text search when appropriate.

Recommended:

```text
300–500 ms
```

Do not send an API request on every keystroke if the existing project uses debounce.

---

# 26. Pagination

Use backend pagination whenever available.

State example:

```ts
const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(10);
```

Request:

```ts
getItems({
  page,
  per_page: perPage,
  search,
});
```

Changing a filter should usually reset:

```ts
setPage(1);
```

---

# 27. React Query

If the project uses TanStack React Query, prefer it.

Example:

```ts
const query = useQuery({
  queryKey: ["target-items", params],
  queryFn: () => getItems(params),
});
```

After create/update/delete:

```ts
queryClient.invalidateQueries({
  queryKey: ["target-items"],
});
```

Do not create duplicate manual cache state unless needed.

---

# 28. Component Structure

Recommended structure:

```text
src/
├── pages/
│   └── Target/
│       ├── index.tsx
│       ├── TargetTable.tsx
│       ├── TargetForm.tsx
│       ├── TargetFilters.tsx
│       └── types.ts
│
├── services/
│   └── target.service.ts
│
├── constants/
│   └── apiRoutes.ts
│
└── validations/
    └── target.schema.ts
```

Follow the actual project structure if different.

---

# 29. Create Flow

Expected behavior:

```text
User clicks Add
↓
Navigate/Open modal
↓
Show empty form
↓
User fills fields
↓
Frontend validation
↓
Submit button enters loading state
↓
POST API
↓
Success
↓
Toast
↓
Close / Navigate back
↓
Refresh list
```

---

# 30. Edit Flow

```text
User clicks Edit
↓
Open edit route/modal
↓
Fetch item by ID
↓
Show loading
↓
Map API data to form
↓
User edits fields
↓
Validate
↓
Call update API
↓
Success toast
↓
Return to list
↓
Refresh data
```

---

# 31. Delete Flow

```text
Delete button
↓
Confirmation modal
↓
Confirm
↓
DELETE API
↓
Success toast
↓
Refresh list
```

---

# 32. File/Image Handling

If the page includes an image:

Existing remote image:

```ts
imageUrl: string | null
```

New file:

```ts
image: File | null
```

Do not convert the remote URL into a File.

Preview example:

```ts
const preview = file
  ? URL.createObjectURL(file)
  : existingImageUrl;
```

Clean blob URL:

```ts
useEffect(() => {
  return () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  };
}, [preview]);
```

---

# 33. Dates

Do not send formatted UI dates unless the backend expects them.

Prefer API format:

```text
YYYY-MM-DD
```

or:

```text
YYYY-MM-DDTHH:mm:ss
```

depending on the backend contract.

Display formatting is separate from API serialization.

---

# 34. Boolean Mapping

Check how the backend represents booleans.

Possible formats:

```json
true
```

or:

```json
1
```

Do not automatically assume they are equivalent.

Example:

```ts
status: values.status ? 1 : 0
```

only when the API explicitly expects `0/1`.

---

# 35. Null Handling

Avoid:

```ts
value || ""
```

when `0` is valid.

Prefer:

```ts
value ?? ""
```

Example:

```ts
quantity: item.quantity ?? 0
```

---

# 36. Backend Response Normalization

If APIs return nested data:

```json
{
  "data": {
    "result": []
  }
}
```

create a single mapping layer instead of repeatedly writing:

```ts
response.data.data.result
```

inside components.

Example:

```ts
const response = await ApiInstance.get(...);

return response.data.data;
```

---

# 37. Localization

If the project supports Arabic/English:

Do not hardcode UI strings where translation keys are expected.

Example:

```tsx
t("products.name")
```

For multilingual backend fields:

```ts
name_en
name_ar
```

or nested format:

```ts
name: {
  en: "",
  ar: ""
}
```

Follow the actual API contract.

---

# 38. RTL

Arabic mode must work correctly.

Check:

- alignment
- icons
- select menus
- dropdown position
- modal layout
- breadcrumbs
- table actions

Do not introduce fixed LTR-only CSS.

---

# 39. Responsive Design

The page should remain usable at:

```text
Desktop
Tablet
Mobile
```

On small screens:

- avoid horizontal layout overflow
- allow tables to scroll if necessary
- stack form fields where appropriate
- keep actions accessible

Follow existing responsive patterns.

---

# 40. Accessibility

At minimum:

- labels for inputs
- proper button types
- keyboard-accessible controls
- no clickable `<div>` when a `<button>` is appropriate
- descriptive alt text for meaningful images
- disabled states when actions are unavailable

---

# 41. Security

Never:

- trust permissions only on frontend
- store secret API credentials in frontend
- log access tokens
- inject raw HTML from API
- expose server secrets
- bypass backend validation

Frontend permission checks are for UX only.

Backend must enforce authorization.

---

# 42. Performance

Avoid:

- unnecessary API refetches
- duplicate requests
- large rerenders
- fetching all records when pagination exists
- recreating expensive objects on each render unnecessarily

Use memoization only where useful.

---

# 43. Acceptance Criteria

The task is complete only when all applicable items below are satisfied:

- [ ] Page route works.
- [ ] Page matches requested UI.
- [ ] List API is connected.
- [ ] Data is displayed correctly.
- [ ] Pagination works.
- [ ] Search works.
- [ ] Filters work.
- [ ] Create works.
- [ ] Edit works.
- [ ] Delete works.
- [ ] Status change works.
- [ ] Form validation works.
- [ ] Backend validation errors appear correctly.
- [ ] Loading states exist.
- [ ] Empty states exist.
- [ ] Error handling exists.
- [ ] Permissions are respected.
- [ ] Existing project authentication is reused.
- [ ] TypeScript has no `any` added unnecessarily.
- [ ] No unrelated project code was modified.
- [ ] No duplicate components/services were introduced.
- [ ] No console errors.
- [ ] No TypeScript errors.
- [ ] No ESLint errors introduced.
- [ ] Existing design system is respected.
- [ ] Arabic/RTL works if supported by the project.
- [ ] Mobile layout is usable.

---

# 44. AI Agent Instructions

## IMPORTANT

Before writing code:

1. Search the repository for similar pages.
2. Identify the closest existing CRUD implementation.
3. Reuse its architecture.
4. Identify the existing API instance.
5. Identify route conventions.
6. Identify form conventions.
7. Identify permission conventions.
8. Identify table/pagination conventions.
9. Identify toast/error conventions.
10. Then implement the requested page.

Do not blindly create a new architecture.

---

# 45. Do Not Guess

If the API contract is available in:

- Swagger
- Postman
- backend routes
- controller
- API resource
- existing frontend page
- API types
- README

read those sources first.

The implementation should be based on the actual backend.

If a field is unclear, inspect usage in the repository before choosing a type.

---

# 46. Expected Final AI Output

After implementation, the coding agent should provide:

```text
1. Files created
2. Files modified
3. APIs connected
4. Main implementation decisions
5. Any assumptions
6. Anything still blocked by missing backend/API information
```

The agent should also run, when available:

```bash
npm run build
```

and/or:

```bash
npm run lint
```

and/or:

```bash
npm run typecheck
```

Fix errors introduced by the implementation before declaring the task finished.

---

# 47. PAGE-SPECIFIC DATA TO COMPLETE

Replace this section after inspecting the target page.

## Exact visible fields

```text
[ADD ALL PAGE FIELDS HERE]
```

## Exact table columns

```text
[ADD ALL TABLE COLUMNS HERE]
```

## Exact filters

```text
[ADD ALL FILTERS HERE]
```

## Exact actions

```text
[ADD ALL ACTIONS HERE]
```

## Exact APIs

```text
GET    [...]
GET    [...]/:id
POST   [...]
PUT    [...]/:id
DELETE [...]/:id
```

## Exact request payloads

```json
{}
```

## Exact responses

```json
{}
```

## Exact validation rules

```text
[ADD RULES HERE]
```

## Business rules

```text
[ADD BUSINESS RULES HERE]
```

---

# 48. Final Rule

Implement the page **end-to-end**, not only the visual UI.

A page is not considered complete if it contains mocked/static data while an API is available.

The final result must be functional, integrated with the backend, consistent with the rest of the project, and ready for production review.
