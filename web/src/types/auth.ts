export type Permission =
  | 'SUPER_GRANT'
  | 'UPLOAD_STATEMENTS'
  | 'VIEW_STATEMENTS'
  | 'VIEW_ANALYTICS'
  | 'VIEW_SUPPORT_USERS'
  | 'CREATE_SUPPORT_USERS'
  | 'UPDATE_SUPPORT_USERS'
  | 'DELETE_SUPPORT_USERS'

export type UserRole = 'admin' | 'user'

export type User = {
  id: string
  username: string
  name: string
  email: string
  role: UserRole
  permissions: Permission[]
  isActive: boolean
}
