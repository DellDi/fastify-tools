// /lib/auth/shared/permission-types.ts
export interface UserPermissions {
    routes: RoutePermission[];
    actions: ActionPermission[];
    role: string;
}

export interface RoutePermission {
    path: string;
    accessible: boolean;
    children?: RoutePermission[];
}

export interface ActionPermission {
    key: string;
    allowed: boolean;
}