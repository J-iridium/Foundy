// AUTO-GENERATED FILE - DO NOT EDIT
export const Modals = {
  "homepage": {
    "hero": {
      "title": "string",
      "subtitle": "string",
      "logo": "base64"
    },
    "featured": [
      {
        "companyName": "string",
        "link": "string",
        "logo": "base64"
      }
    ],
    "pricing": [
      {
        "name": "string",
        "price": "number",
        "currency": "string",
        "country": "string",
        "features": "string[]"
      }
    ],
    "faq": [
      {
        "question": "string",
        "answer": "string"
      }
    ],
    "references": [
      {
        "uri": "string",
        "label": "string",
        "accessedAt": "string",
        "type": "enum_ReferenceType"
      }
    ]
  },
  "image": {
    "title": "string",
    "image": "base64",
    "descriptionHtml": "string"
  },
  "post": {
    "title": "string",
    "description": "string",
    "contentHtml": "string",
    "coverImage": "base64",
    "tags": "string[]"
  },
  "product": {
    "title": "string",
    "price": "number",
    "images": "base64",
    "descriptionHtml": "string",
    "stock": "number"
  }
} as const;
