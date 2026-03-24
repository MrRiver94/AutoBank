export type Permission =
  | 'SUPER_GRANT'
  | 'UPLOAD_STATEMENTS'
  | 'VIEW_STATEMENTS'
  | 'VIEW_ANALYTICS'

export type UserRole = 'admin' | 'user'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: Permission[]
  isActive: boolean
}
