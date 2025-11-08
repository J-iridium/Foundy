import type { Role } from '../types/db/Enums/Roles.type'

const RolePermissions = {
  owner: ['create', 'edit', 'delete', 'publish', 'settings'],
  editor: ['create', 'edit', 'publish'],
  viewer: ['view']
};

export const can : (role : Role, action : string) => boolean = 
  (role: Role, action: string) : boolean => RolePermissions[role].includes(action);
