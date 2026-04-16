import type { DemoAccount } from '../model/demoAccount'

export const demoAccounts: DemoAccount[] = [
  {
    user: {
      id: 'user-admin-01',
      username: 'drios',
      name: 'Daniel Rios',
      email: 'danielriosproduccion@gmail.com',
      role: 'admin',
      permissions: [
        'SUPER_GRANT',
        'UPLOAD_STATEMENTS',
        'VIEW_STATEMENTS',
        'VIEW_ANALYTICS',
        'VIEW_SUPPORT_USERS',
        'CREATE_SUPPORT_USERS',
        'UPDATE_SUPPORT_USERS',
        'DELETE_SUPPORT_USERS',
      ],
      isActive: true,
    },
    password: 'Password123',
  },
  {
    user: {
      id: 'user-standard-01',
      username: 'Daniel_Rios',
      name: 'Daniel Rios Usuario',
      email: 'danielriosproduccion@gmail.com',
      role: 'user',
      permissions: ['UPLOAD_STATEMENTS', 'VIEW_STATEMENTS', 'VIEW_ANALYTICS'],
      isActive: true,
    },
    password: 'Password123',
  },
]
