# Development Rules

**IMPORTANT:** Follow these principles: **YAGNI - KISS - DRY**

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | ReactJS with TypeScript |
| Backend | ExpressJS with TypeScript |
| Storage | File-based (no database) |
| PDF Parsing | pdf-parse |
| Styling | Tailwind CSS + shadcn/ui |

## Project Structure

| Type | Location | Naming |
|------|----------|--------|
| Pages | `client/src/pages/{name}.tsx` | PascalCase |
| Components | `client/src/components/{name}.tsx` | PascalCase |
| Hooks | `client/src/hooks/use{Name}.ts` | camelCase |
| Utils | `client/src/utils/{name}.ts` | camelCase |
| API Routes | `server/routes/{resource}.ts` | kebab-case |
| Services | `server/services/{name}Service.ts` | PascalCase |

## Code Standards

### Express API Routes (File-based)

```typescript
// server/routes/{module}.ts
import { Router } from 'express'
import { {Name}Service } from '../services/{Name}Service'

const router = Router()

router.get('/', async (req, res) => {
  const items = await {Name}Service.getAll()
  res.json(items)
})

router.post('/', async (req, res) => {
  const item = await {Name}Service.create(req.body)
  res.json(item)
})

export default router
```

### File-based Service

```typescript
// server/services/{Name}Service.ts
import fs from 'fs/promises'
import path from 'path'

const SOURCE_DIR = 'source/{module}'

export class {Name}Service {
  static async getAll() {
    const files = await fs.readdir(SOURCE_DIR)
    return files.filter(f => f.endsWith('.md'))
  }

  static async getByName(name: string) {
    const filePath = path.join(SOURCE_DIR, `${name}.md`)
    return fs.readFile(filePath, 'utf-8')
  }

  static async create(data: { name: string; content: string }) {
    const filePath = path.join(SOURCE_DIR, `${data.name}.md`)
    await fs.writeFile(filePath, data.content)
    return { name: data.name, path: filePath }
  }
}
```

### React Components

```typescript
// client/src/components/ComponentCard.tsx
interface Props {
  name: string
  code: string
  variants?: string[]
}

export function ComponentCard({ name, code, variants }: Props) {
  return (/* JSX */)
}
```

## Quality Standards

| DO | DON'T |
|----|-------|
| Use TypeScript strictly | Use `any` type |
| Use functional components + hooks | Use class components |
| Store secrets in `.env` | Commit credentials |
| Use shadcn/ui components | Write custom UI from scratch |
| Handle errors with try/catch | Let errors crash silently |
| Use file-based storage | Use database |

## File Storage Patterns

### Reading Markdown Files
```typescript
import fs from 'fs/promises'
import matter from 'gray-matter'

async function readMarkdown(filePath: string) {
  const content = await fs.readFile(filePath, 'utf-8')
  const { data, content: body } = matter(content)
  return { frontmatter: data, content: body }
}
```

### Writing Markdown Files
```typescript
import fs from 'fs/promises'

async function writeMarkdown(filePath: string, frontmatter: object, content: string) {
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  const output = `---\n${yaml}\n---\n\n${content}`
  await fs.writeFile(filePath, output)
}
```

## Commit Format

```
feat({module}): {description}
fix({module}): {description}
```
