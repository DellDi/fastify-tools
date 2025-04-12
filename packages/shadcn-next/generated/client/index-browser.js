
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.SeedVersionScalarFieldEnum = {
  id: 'id',
  version: 'version',
  appliedAt: 'appliedAt'
};

exports.Prisma.AuditLogEntryScalarFieldEnum = {
  id: 'id',
  instanceId: 'instanceId',
  payload: 'payload',
  createdAt: 'createdAt',
  ipAddress: 'ipAddress'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  instanceId: 'instanceId',
  aud: 'aud',
  role: 'role',
  email: 'email',
  encryptedPassword: 'encryptedPassword',
  emailConfirmedAt: 'emailConfirmedAt',
  invitedAt: 'invitedAt',
  confirmationToken: 'confirmationToken',
  confirmationSentAt: 'confirmationSentAt',
  recoveryToken: 'recoveryToken',
  recoverySentAt: 'recoverySentAt',
  emailChangeTokenNew: 'emailChangeTokenNew',
  emailChange: 'emailChange',
  emailChangeSentAt: 'emailChangeSentAt',
  lastSignInAt: 'lastSignInAt',
  rawAppMetaData: 'rawAppMetaData',
  rawUserMetaData: 'rawUserMetaData',
  isSuperAdmin: 'isSuperAdmin',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  phone: 'phone',
  phoneConfirmedAt: 'phoneConfirmedAt',
  phoneChange: 'phoneChange',
  phoneChangeToken: 'phoneChangeToken',
  phoneChangeSentAt: 'phoneChangeSentAt',
  emailChangeTokenCurrent: 'emailChangeTokenCurrent',
  emailChangeConfirmStatus: 'emailChangeConfirmStatus',
  bannedUntil: 'bannedUntil',
  reauthenticationToken: 'reauthenticationToken',
  reauthenticationSentAt: 'reauthenticationSentAt',
  isSsoUser: 'isSsoUser',
  deletedAt: 'deletedAt',
  isAnonymous: 'isAnonymous',
  username: 'username',
  phoneNumber: 'phoneNumber',
  avatarUrl: 'avatarUrl',
  roleId: 'roleId',
  status: 'status'
};

exports.Prisma.LoginLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  loginTime: 'loginTime',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent'
};

exports.Prisma.VerificationCodeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  code: 'code',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  status: 'status',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  groupName: 'groupName',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  roleId: 'roleId',
  permissionId: 'permissionId',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.MenuScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  parentId: 'parentId',
  sortOrder: 'sortOrder',
  icon: 'icon',
  description: 'description',
  component: 'component',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.RoleMenuScalarFieldEnum = {
  roleId: 'roleId',
  menuId: 'menuId',
  createdAt: 'createdAt'
};

exports.Prisma.HomeSectionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  linkText: 'linkText',
  linkHref: 'linkHref',
  gradient: 'gradient',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  status: 'status'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  SeedVersion: 'SeedVersion',
  AuditLogEntry: 'AuditLogEntry',
  User: 'User',
  LoginLog: 'LoginLog',
  VerificationCode: 'VerificationCode',
  Role: 'Role',
  Permission: 'Permission',
  RolePermission: 'RolePermission',
  Menu: 'Menu',
  RoleMenu: 'RoleMenu',
  HomeSection: 'HomeSection'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
