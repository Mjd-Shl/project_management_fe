# Aforium Projects

Responsive workspace project management frontend built with React, TypeScript, and Vite.

## Run locally

```sh
npm install
npm run dev
```

The Projects interface uses Tailwind CSS v4 through its Vite plugin. Run `npm run build` to type-check and create a production build.

## Backend integration required

This repository did not include backend services, API documentation, or an authentication client. The app deliberately does not fabricate project data or assume API routes. Copy `.env.example` to `.env.local` and set each URL and HTTP method to the actual backend contract. Relative URLs can use `VITE_API_BASE_URL`; project-specific URLs must contain `{projectId}`. Requests include browser cookies (`credentials: include`).

Expected JSON response shapes:

```json
{
  "projects": [
    {
      "id": "project-id",
      "name": "Project name",
      "key": "PROJECT",
      "color": "#6965db",
      "description": "",
      "openTaskCount": 0,
      "progress": 0,
      "archived": false,
      "members": [
        { "id": "member-id", "name": "Member name", "avatarUrl": null }
      ]
    }
  ],
  "permissions": {
    "canCreate": true,
    "canEdit": true,
    "canArchive": true,
    "canViewArchived": true
  }
}
```

The members response must be `{ "members": [...] }`. Create and update responses must be a project object matching the project shape above. Backend authorization remains mandatory; the UI only uses server-provided capability flags to decide which actions to show. The backend must enforce the same permissions for every mutation.
