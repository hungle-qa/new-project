---
title: "Import Product Ideas from PDF/Markdown"
status: pending
module: product-ideas
target: existing file (ProductIdeasPage.tsx)
created: 2026-02-05
---

# Implementation Plan: Import Product Ideas from PDF/Markdown

## Reference Code (from scout)
| File | Patterns to Reuse |
|------|-------------------|
| server/src/services/ProductIdeaService.ts | gray-matter parsing, create() method, file writing pattern |
| server/src/routes/product-idea.ts | Express router structure, POST /api/product-idea endpoint |
| client/src/pages/ProductIdeasPage.tsx | fetch() pattern, state management, list refresh |

## Implementation Steps
| Step | Layer | Action | File |
|------|-------|--------|------|
| 1 | Service | Add importFromFile() method with PDF/MD parsing + AI structuring | server/src/services/ProductIdeaService.ts |
| 2 | Route | Add POST /api/product-idea/import with multer file upload | server/src/routes/product-idea.ts |
| 3 | Component | Add FileUploadDialog with file picker (PDF or MD) | client/src/components/FileUploadDialog.tsx |
| 4 | Page | Add import button and upload handler | client/src/pages/ProductIdeasPage.tsx |
| 5 | Util | Add AI service for free-form content structuring | server/src/services/AIService.ts |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/product-idea/import | Upload PDF/MD file, parse, AI-structure, save to source/product-idea/ |

## Dependencies
- **Services**: [x] ProductIdeaService exists / [ ] AIService needs creation
- **Routes**: [x] product-idea.ts exists / [ ] needs import endpoint
- **Components**: [ ] FileUploadDialog needs creation
- **Source files**: [x] source/product-idea/ exists
- **NPM Packages**: [ ] multer (file upload), [ ] pdf-parse (PDF extraction), [ ] @anthropic-ai/sdk (AI)

## Implementation Details

### Backend Changes

#### 1. Install Dependencies
```bash
npm install multer pdf-parse @anthropic-ai/sdk
npm install -D @types/multer @types/pdf-parse
```

#### 2. AIService (NEW FILE)
**File:** server/src/services/AIService.ts

**Purpose:** Use Claude to structure free-form content into product idea format

**Key functions:**
- `structureProductIdea(rawContent: string): Promise<IProductIdea>`
  - Takes raw PDF/MD content
  - Sends to Claude with prompt to extract: name, category, status, priority, structured content
  - Returns structured IProductIdea object

**Pattern:** Similar to existing Anthropic SDK usage if exists, else new implementation

#### 3. ProductIdeaService Enhancement
**File:** server/src/services/ProductIdeaService.ts

**New method:** `importFromFile(file: Express.Multer.File): Promise<{ name: string; path: string }>`

**Logic:**
1. Check file type (PDF vs MD)
2. Extract content:
   - PDF: Use `pdf-parse` to extract text
   - MD: Read file directly
3. Call AIService.structureProductIdea(content)
4. Call existing create() method with structured data
5. Return result

#### 4. Route Enhancement
**File:** server/src/routes/product-idea.ts

**New endpoint:**
```typescript
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/markdown') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and Markdown files allowed'))
    }
  }
})

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const result = await ProductIdeaService.importFromFile(req.file)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to import product idea' })
  }
})
```

### Frontend Changes

#### 1. FileUploadDialog Component (NEW FILE)
**File:** client/src/components/FileUploadDialog.tsx

**Purpose:** Reusable file upload dialog with drag-and-drop

**Props:**
- `accept: string` (e.g., ".pdf,.md")
- `onUpload: (file: File) => Promise<void>`
- `open: boolean`
- `onClose: () => void`

**Features:**
- File input with accept filter
- Drag-and-drop zone
- Upload progress indicator
- Error handling
- Close on success

**Pattern:** Use shadcn/ui Dialog + Button + Input components

#### 2. ProductIdeasPage Enhancement
**File:** client/src/pages/ProductIdeasPage.tsx

**Changes:**
1. Add state: `const [uploadOpen, setUploadOpen] = useState(false)`
2. Add import button next to title:
   ```tsx
   <Button onClick={() => setUploadOpen(true)}>Import Idea</Button>
   ```
3. Add upload handler:
   ```typescript
   const handleImport = async (file: File) => {
     const formData = new FormData()
     formData.append('file', file)
     await fetch('/api/product-idea/import', {
       method: 'POST',
       body: formData
     })
     // Refresh list
     const res = await fetch('/api/product-idea')
     const data = await res.json()
     setIdeas(data)
     setUploadOpen(false)
   }
   ```
4. Render FileUploadDialog:
   ```tsx
   <FileUploadDialog
     accept=".pdf,.md"
     open={uploadOpen}
     onClose={() => setUploadOpen(false)}
     onUpload={handleImport}
   />
   ```

## AI Prompt for Structuring

The AIService will use this prompt template:
```
You are a business analyst assistant. Extract the following from this product idea content:

1. name: A kebab-case identifier (e.g., "fitness-tracker")
2. category: One of [demo-pages, web-app, mobile-app, api, uncategorized]
3. priority: One of [low, medium, high]
4. status: Always "draft" for imports
5. content: Structured markdown with sections:
   - Overview
   - Problem Statement
   - User Story
   - Requirements (Functional and Non-Functional tables)

Input content:
{rawContent}

Return valid JSON:
{
  "name": "kebab-case-name",
  "category": "category",
  "priority": "medium",
  "status": "draft",
  "content": "# Title\n\n## Overview\n..."
}
```

## File Structure

### New Files
- `server/src/services/AIService.ts`
- `client/src/components/FileUploadDialog.tsx`

### Modified Files
- `server/src/services/ProductIdeaService.ts`
- `server/src/routes/product-idea.ts`
- `client/src/pages/ProductIdeasPage.tsx`

## Next Agents
| Agent | Task |
|-------|------|
| implementer | Create AIService, FileUploadDialog; Update ProductIdeaService, product-idea route, ProductIdeasPage |

## Unresolved Questions
- Should we validate duplicate names before import?
- Should we support batch imports (multiple files)?
- Should uploaded files be stored in temp folder or processed in-memory only?
- What's the max file size limit for uploads?
