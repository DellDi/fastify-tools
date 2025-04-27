
type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

export type User = { roles: Role[]; id: string };

const ROLES = {
  admin: [
    "password:view",
    "password:create",
    "file:manage",
    "file:upload",
    "file:big_upload", // 更规范的命名
    "jira:view",
    "jira:create",
    "aigc:chat",
    "aigc:model_tuning", // 更清晰的命名
    "settings:view",
    "role:view",
    "role:create",
    "role:update",
    "role:delete",
  ],
  moderator: [
    "password:view",
    "file:manage",
    "file:upload",
    "jira:view",
    "aigc:chat",
    "settings:view",
  ],
  user: [
    "password:view",
    "file:upload",
    "jira:view",
    "aigc:chat",
    "settings:view",
  ],
} as const;

// 权限分组数据，与数据库 group_name 对应，使用英文
export const PERMISSION_GROUPS: Record<string, Permission[]> = {
  "password": ["password:view", "password:create"],
  "file": ["file:manage", "file:upload", "file:big_upload"],
  "jira": ["jira:view", "jira:create"],
  "aigc": ["aigc:chat", "aigc:model_tuning"],
  "settings": ["settings:view"],
  "role": ["role:view", "role:create", "role:update", "role:delete"],
};

export function hasRabcPermission(user: User, permission: Permission) {
  return user.roles.some((role) => (ROLES[role] as readonly Permission[]).includes(permission));
}

// USAGE:
const user: User = { id: "1", roles: ["user"] };
const moderatorUser: User = { id: "2", roles: ["moderator"] };
const adminUser: User = { id: "3", roles: ["admin"] };

console.log(hasRabcPermission(user, "password:view")); // true
console.log(hasRabcPermission(user, "file:manage")); // false
console.log(hasRabcPermission(moderatorUser, "file:manage")); // true
console.log(hasRabcPermission(adminUser, "role:delete")); // true

// 在前端进行权限分组展示，使用英文
const userPermissions = user.roles.flatMap(role => ROLES[role]);

for (const groupName in PERMISSION_GROUPS) {
  const permissionsInGroup: Permission[] = PERMISSION_GROUPS[groupName];
  const hasRabcPermissionInGroup = permissionsInGroup.some(permission => userPermissions.includes(permission));
  console.log(`User has ${hasRabcPermissionInGroup ? 'access' : 'no access'} in ${groupName}`);
}
