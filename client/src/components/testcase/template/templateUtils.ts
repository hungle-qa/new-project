export interface TemplateColumn {
  id: string
  name: string
  width: string
  style: string
  columnRules: string
}

export const STYLE_OPTIONS = ['normal', 'bold', 'mono', 'center', 'bold center', 'bold mono']

export const DEFAULT_COLUMNS: TemplateColumn[] = [
  { id: '1', name: 'ID', width: '80px', style: 'bold mono', columnRules: 'Auto-increment ID, e.g. TC-001' },
  { id: '2', name: 'Module', width: '120px', style: 'normal', columnRules: 'Feature module name' },
  { id: '3', name: 'Test Type', width: '100px', style: 'normal', columnRules: 'Functional, UI, API, Security, or Performance' },
  { id: '4', name: 'Scope', width: '80px', style: 'normal', columnRules: 'Unit, Integration, or E2E' },
  { id: '5', name: 'Title', width: '200px', style: 'bold', columnRules: 'Short descriptive title' },
  { id: '6', name: 'Preconditions', width: '180px', style: 'normal', columnRules: 'Setup required before execution' },
  { id: '7', name: 'Steps', width: '300px', style: 'mono', columnRules: 'Numbered list, one step per line' },
  { id: '8', name: 'Expected Result', width: '200px', style: 'normal', columnRules: 'Always start with SHOULD or SHOULD NOT.\nBreak new line if many expected results in one testcase.' },
  { id: '9', name: 'Priority', width: '80px', style: 'bold center', columnRules: 'Critical, High, Medium, or Low' },
  { id: '10', name: 'Status', width: '80px', style: 'center', columnRules: 'Not Executed' },
]

export function getStyleClasses(style: string): string {
  const classes: string[] = []
  if (style.includes('bold')) classes.push('font-bold')
  if (style.includes('mono')) classes.push('font-mono')
  if (style.includes('center')) classes.push('text-center')
  return classes.join(' ')
}

export function getSampleData(columnName: string): string {
  const name = columnName.toLowerCase()
  if (name.includes('id')) return 'TC-001'
  if (name.includes('module')) return 'Login'
  if (name.includes('type')) return 'Functional'
  if (name.includes('scope')) return 'E2E'
  if (name.includes('title')) return 'Verify login with valid credentials'
  if (name.includes('precondition')) return 'User is on login page'
  if (name.includes('step')) return '1. Enter email\n2. Enter password\n3. Click login'
  if (name.includes('expected') || name.includes('result')) return 'User is redirected to dashboard'
  if (name.includes('priority')) return 'High'
  if (name.includes('status')) return 'Not Executed'
  return 'Sample'
}
