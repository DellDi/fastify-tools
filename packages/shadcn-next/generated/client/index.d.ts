
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SeedVersion
 * 
 */
export type SeedVersion = $Result.DefaultSelection<Prisma.$SeedVersionPayload>
/**
 * Model AuditLogEntry
 * 
 */
export type AuditLogEntry = $Result.DefaultSelection<Prisma.$AuditLogEntryPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model LoginLog
 * 
 */
export type LoginLog = $Result.DefaultSelection<Prisma.$LoginLogPayload>
/**
 * Model VerificationCode
 * 
 */
export type VerificationCode = $Result.DefaultSelection<Prisma.$VerificationCodePayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Permission
 * 
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>
/**
 * Model RolePermission
 * 
 */
export type RolePermission = $Result.DefaultSelection<Prisma.$RolePermissionPayload>
/**
 * Model Menu
 * 
 */
export type Menu = $Result.DefaultSelection<Prisma.$MenuPayload>
/**
 * Model RoleMenu
 * 
 */
export type RoleMenu = $Result.DefaultSelection<Prisma.$RoleMenuPayload>
/**
 * Model HomeSection
 * 
 */
export type HomeSection = $Result.DefaultSelection<Prisma.$HomeSectionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SeedVersions
 * const seedVersions = await prisma.seedVersion.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more SeedVersions
   * const seedVersions = await prisma.seedVersion.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.seedVersion`: Exposes CRUD operations for the **SeedVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeedVersions
    * const seedVersions = await prisma.seedVersion.findMany()
    * ```
    */
  get seedVersion(): Prisma.SeedVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLogEntry`: Exposes CRUD operations for the **AuditLogEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogEntries
    * const auditLogEntries = await prisma.auditLogEntry.findMany()
    * ```
    */
  get auditLogEntry(): Prisma.AuditLogEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginLog`: Exposes CRUD operations for the **LoginLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginLogs
    * const loginLogs = await prisma.loginLog.findMany()
    * ```
    */
  get loginLog(): Prisma.LoginLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationCode`: Exposes CRUD operations for the **VerificationCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationCodes
    * const verificationCodes = await prisma.verificationCode.findMany()
    * ```
    */
  get verificationCode(): Prisma.VerificationCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permission.findMany()
    * ```
    */
  get permission(): Prisma.PermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rolePermission`: Exposes CRUD operations for the **RolePermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RolePermissions
    * const rolePermissions = await prisma.rolePermission.findMany()
    * ```
    */
  get rolePermission(): Prisma.RolePermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.menu`: Exposes CRUD operations for the **Menu** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Menus
    * const menus = await prisma.menu.findMany()
    * ```
    */
  get menu(): Prisma.MenuDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roleMenu`: Exposes CRUD operations for the **RoleMenu** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoleMenus
    * const roleMenus = await prisma.roleMenu.findMany()
    * ```
    */
  get roleMenu(): Prisma.RoleMenuDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.homeSection`: Exposes CRUD operations for the **HomeSection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HomeSections
    * const homeSections = await prisma.homeSection.findMany()
    * ```
    */
  get homeSection(): Prisma.HomeSectionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "seedVersion" | "auditLogEntry" | "user" | "loginLog" | "verificationCode" | "role" | "permission" | "rolePermission" | "menu" | "roleMenu" | "homeSection"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SeedVersion: {
        payload: Prisma.$SeedVersionPayload<ExtArgs>
        fields: Prisma.SeedVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeedVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeedVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>
          }
          findFirst: {
            args: Prisma.SeedVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeedVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>
          }
          findMany: {
            args: Prisma.SeedVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>[]
          }
          create: {
            args: Prisma.SeedVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>
          }
          createMany: {
            args: Prisma.SeedVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SeedVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>[]
          }
          delete: {
            args: Prisma.SeedVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>
          }
          update: {
            args: Prisma.SeedVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>
          }
          deleteMany: {
            args: Prisma.SeedVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeedVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SeedVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>[]
          }
          upsert: {
            args: Prisma.SeedVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeedVersionPayload>
          }
          aggregate: {
            args: Prisma.SeedVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeedVersion>
          }
          groupBy: {
            args: Prisma.SeedVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeedVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeedVersionCountArgs<ExtArgs>
            result: $Utils.Optional<SeedVersionCountAggregateOutputType> | number
          }
        }
      }
      AuditLogEntry: {
        payload: Prisma.$AuditLogEntryPayload<ExtArgs>
        fields: Prisma.AuditLogEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          findFirst: {
            args: Prisma.AuditLogEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          findMany: {
            args: Prisma.AuditLogEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>[]
          }
          create: {
            args: Prisma.AuditLogEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          createMany: {
            args: Prisma.AuditLogEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>[]
          }
          delete: {
            args: Prisma.AuditLogEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          update: {
            args: Prisma.AuditLogEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          aggregate: {
            args: Prisma.AuditLogEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLogEntry>
          }
          groupBy: {
            args: Prisma.AuditLogEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogEntryCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogEntryCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      LoginLog: {
        payload: Prisma.$LoginLogPayload<ExtArgs>
        fields: Prisma.LoginLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>
          }
          findFirst: {
            args: Prisma.LoginLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>
          }
          findMany: {
            args: Prisma.LoginLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>[]
          }
          create: {
            args: Prisma.LoginLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>
          }
          createMany: {
            args: Prisma.LoginLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoginLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>[]
          }
          delete: {
            args: Prisma.LoginLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>
          }
          update: {
            args: Prisma.LoginLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>
          }
          deleteMany: {
            args: Prisma.LoginLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoginLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>[]
          }
          upsert: {
            args: Prisma.LoginLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginLogPayload>
          }
          aggregate: {
            args: Prisma.LoginLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginLog>
          }
          groupBy: {
            args: Prisma.LoginLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoginLogCountArgs<ExtArgs>
            result: $Utils.Optional<LoginLogCountAggregateOutputType> | number
          }
        }
      }
      VerificationCode: {
        payload: Prisma.$VerificationCodePayload<ExtArgs>
        fields: Prisma.VerificationCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>
          }
          findFirst: {
            args: Prisma.VerificationCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>
          }
          findMany: {
            args: Prisma.VerificationCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>[]
          }
          create: {
            args: Prisma.VerificationCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>
          }
          createMany: {
            args: Prisma.VerificationCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>[]
          }
          delete: {
            args: Prisma.VerificationCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>
          }
          update: {
            args: Prisma.VerificationCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>
          }
          deleteMany: {
            args: Prisma.VerificationCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationCodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>[]
          }
          upsert: {
            args: Prisma.VerificationCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationCodePayload>
          }
          aggregate: {
            args: Prisma.VerificationCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationCode>
          }
          groupBy: {
            args: Prisma.VerificationCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCodeCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCodeCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>
        fields: Prisma.PermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermission>
          }
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number
          }
        }
      }
      RolePermission: {
        payload: Prisma.$RolePermissionPayload<ExtArgs>
        fields: Prisma.RolePermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RolePermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RolePermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findFirst: {
            args: Prisma.RolePermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RolePermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findMany: {
            args: Prisma.RolePermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          create: {
            args: Prisma.RolePermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          createMany: {
            args: Prisma.RolePermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RolePermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          delete: {
            args: Prisma.RolePermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          update: {
            args: Prisma.RolePermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          deleteMany: {
            args: Prisma.RolePermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RolePermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RolePermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          upsert: {
            args: Prisma.RolePermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          aggregate: {
            args: Prisma.RolePermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRolePermission>
          }
          groupBy: {
            args: Prisma.RolePermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RolePermissionCountArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionCountAggregateOutputType> | number
          }
        }
      }
      Menu: {
        payload: Prisma.$MenuPayload<ExtArgs>
        fields: Prisma.MenuFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MenuFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MenuFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          findFirst: {
            args: Prisma.MenuFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MenuFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          findMany: {
            args: Prisma.MenuFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>[]
          }
          create: {
            args: Prisma.MenuCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          createMany: {
            args: Prisma.MenuCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MenuCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>[]
          }
          delete: {
            args: Prisma.MenuDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          update: {
            args: Prisma.MenuUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          deleteMany: {
            args: Prisma.MenuDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MenuUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MenuUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>[]
          }
          upsert: {
            args: Prisma.MenuUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          aggregate: {
            args: Prisma.MenuAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMenu>
          }
          groupBy: {
            args: Prisma.MenuGroupByArgs<ExtArgs>
            result: $Utils.Optional<MenuGroupByOutputType>[]
          }
          count: {
            args: Prisma.MenuCountArgs<ExtArgs>
            result: $Utils.Optional<MenuCountAggregateOutputType> | number
          }
        }
      }
      RoleMenu: {
        payload: Prisma.$RoleMenuPayload<ExtArgs>
        fields: Prisma.RoleMenuFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleMenuFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleMenuFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>
          }
          findFirst: {
            args: Prisma.RoleMenuFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleMenuFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>
          }
          findMany: {
            args: Prisma.RoleMenuFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>[]
          }
          create: {
            args: Prisma.RoleMenuCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>
          }
          createMany: {
            args: Prisma.RoleMenuCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleMenuCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>[]
          }
          delete: {
            args: Prisma.RoleMenuDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>
          }
          update: {
            args: Prisma.RoleMenuUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>
          }
          deleteMany: {
            args: Prisma.RoleMenuDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleMenuUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleMenuUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>[]
          }
          upsert: {
            args: Prisma.RoleMenuUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleMenuPayload>
          }
          aggregate: {
            args: Prisma.RoleMenuAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoleMenu>
          }
          groupBy: {
            args: Prisma.RoleMenuGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleMenuGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleMenuCountArgs<ExtArgs>
            result: $Utils.Optional<RoleMenuCountAggregateOutputType> | number
          }
        }
      }
      HomeSection: {
        payload: Prisma.$HomeSectionPayload<ExtArgs>
        fields: Prisma.HomeSectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HomeSectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HomeSectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>
          }
          findFirst: {
            args: Prisma.HomeSectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HomeSectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>
          }
          findMany: {
            args: Prisma.HomeSectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>[]
          }
          create: {
            args: Prisma.HomeSectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>
          }
          createMany: {
            args: Prisma.HomeSectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HomeSectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>[]
          }
          delete: {
            args: Prisma.HomeSectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>
          }
          update: {
            args: Prisma.HomeSectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>
          }
          deleteMany: {
            args: Prisma.HomeSectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HomeSectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HomeSectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>[]
          }
          upsert: {
            args: Prisma.HomeSectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HomeSectionPayload>
          }
          aggregate: {
            args: Prisma.HomeSectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHomeSection>
          }
          groupBy: {
            args: Prisma.HomeSectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<HomeSectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.HomeSectionCountArgs<ExtArgs>
            result: $Utils.Optional<HomeSectionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    seedVersion?: SeedVersionOmit
    auditLogEntry?: AuditLogEntryOmit
    user?: UserOmit
    loginLog?: LoginLogOmit
    verificationCode?: VerificationCodeOmit
    role?: RoleOmit
    permission?: PermissionOmit
    rolePermission?: RolePermissionOmit
    menu?: MenuOmit
    roleMenu?: RoleMenuOmit
    homeSection?: HomeSectionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    loginLogs: number
    verificationCodes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loginLogs?: boolean | UserCountOutputTypeCountLoginLogsArgs
    verificationCodes?: boolean | UserCountOutputTypeCountVerificationCodesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLoginLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVerificationCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationCodeWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    users: number
    rolePermissions: number
    roleMenus: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | RoleCountOutputTypeCountUsersArgs
    rolePermissions?: boolean | RoleCountOutputTypeCountRolePermissionsArgs
    roleMenus?: boolean | RoleCountOutputTypeCountRoleMenusArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountRolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountRoleMenusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleMenuWhereInput
  }


  /**
   * Count Type PermissionCountOutputType
   */

  export type PermissionCountOutputType = {
    rolePermissions: number
  }

  export type PermissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePermissions?: boolean | PermissionCountOutputTypeCountRolePermissionsArgs
  }

  // Custom InputTypes
  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PermissionCountOutputType
     */
    select?: PermissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeCountRolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }


  /**
   * Count Type MenuCountOutputType
   */

  export type MenuCountOutputType = {
    children: number
    roleMenus: number
  }

  export type MenuCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | MenuCountOutputTypeCountChildrenArgs
    roleMenus?: boolean | MenuCountOutputTypeCountRoleMenusArgs
  }

  // Custom InputTypes
  /**
   * MenuCountOutputType without action
   */
  export type MenuCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCountOutputType
     */
    select?: MenuCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MenuCountOutputType without action
   */
  export type MenuCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MenuWhereInput
  }

  /**
   * MenuCountOutputType without action
   */
  export type MenuCountOutputTypeCountRoleMenusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleMenuWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SeedVersion
   */

  export type AggregateSeedVersion = {
    _count: SeedVersionCountAggregateOutputType | null
    _min: SeedVersionMinAggregateOutputType | null
    _max: SeedVersionMaxAggregateOutputType | null
  }

  export type SeedVersionMinAggregateOutputType = {
    id: string | null
    version: string | null
    appliedAt: Date | null
  }

  export type SeedVersionMaxAggregateOutputType = {
    id: string | null
    version: string | null
    appliedAt: Date | null
  }

  export type SeedVersionCountAggregateOutputType = {
    id: number
    version: number
    appliedAt: number
    _all: number
  }


  export type SeedVersionMinAggregateInputType = {
    id?: true
    version?: true
    appliedAt?: true
  }

  export type SeedVersionMaxAggregateInputType = {
    id?: true
    version?: true
    appliedAt?: true
  }

  export type SeedVersionCountAggregateInputType = {
    id?: true
    version?: true
    appliedAt?: true
    _all?: true
  }

  export type SeedVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeedVersion to aggregate.
     */
    where?: SeedVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeedVersions to fetch.
     */
    orderBy?: SeedVersionOrderByWithRelationInput | SeedVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeedVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeedVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeedVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeedVersions
    **/
    _count?: true | SeedVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeedVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeedVersionMaxAggregateInputType
  }

  export type GetSeedVersionAggregateType<T extends SeedVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateSeedVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeedVersion[P]>
      : GetScalarType<T[P], AggregateSeedVersion[P]>
  }




  export type SeedVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeedVersionWhereInput
    orderBy?: SeedVersionOrderByWithAggregationInput | SeedVersionOrderByWithAggregationInput[]
    by: SeedVersionScalarFieldEnum[] | SeedVersionScalarFieldEnum
    having?: SeedVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeedVersionCountAggregateInputType | true
    _min?: SeedVersionMinAggregateInputType
    _max?: SeedVersionMaxAggregateInputType
  }

  export type SeedVersionGroupByOutputType = {
    id: string
    version: string
    appliedAt: Date
    _count: SeedVersionCountAggregateOutputType | null
    _min: SeedVersionMinAggregateOutputType | null
    _max: SeedVersionMaxAggregateOutputType | null
  }

  type GetSeedVersionGroupByPayload<T extends SeedVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeedVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeedVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeedVersionGroupByOutputType[P]>
            : GetScalarType<T[P], SeedVersionGroupByOutputType[P]>
        }
      >
    >


  export type SeedVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    appliedAt?: boolean
  }, ExtArgs["result"]["seedVersion"]>

  export type SeedVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    appliedAt?: boolean
  }, ExtArgs["result"]["seedVersion"]>

  export type SeedVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    appliedAt?: boolean
  }, ExtArgs["result"]["seedVersion"]>

  export type SeedVersionSelectScalar = {
    id?: boolean
    version?: boolean
    appliedAt?: boolean
  }

  export type SeedVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "version" | "appliedAt", ExtArgs["result"]["seedVersion"]>

  export type $SeedVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeedVersion"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      version: string
      appliedAt: Date
    }, ExtArgs["result"]["seedVersion"]>
    composites: {}
  }

  type SeedVersionGetPayload<S extends boolean | null | undefined | SeedVersionDefaultArgs> = $Result.GetResult<Prisma.$SeedVersionPayload, S>

  type SeedVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SeedVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeedVersionCountAggregateInputType | true
    }

  export interface SeedVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeedVersion'], meta: { name: 'SeedVersion' } }
    /**
     * Find zero or one SeedVersion that matches the filter.
     * @param {SeedVersionFindUniqueArgs} args - Arguments to find a SeedVersion
     * @example
     * // Get one SeedVersion
     * const seedVersion = await prisma.seedVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeedVersionFindUniqueArgs>(args: SelectSubset<T, SeedVersionFindUniqueArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SeedVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeedVersionFindUniqueOrThrowArgs} args - Arguments to find a SeedVersion
     * @example
     * // Get one SeedVersion
     * const seedVersion = await prisma.seedVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeedVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, SeedVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeedVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeedVersionFindFirstArgs} args - Arguments to find a SeedVersion
     * @example
     * // Get one SeedVersion
     * const seedVersion = await prisma.seedVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeedVersionFindFirstArgs>(args?: SelectSubset<T, SeedVersionFindFirstArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeedVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeedVersionFindFirstOrThrowArgs} args - Arguments to find a SeedVersion
     * @example
     * // Get one SeedVersion
     * const seedVersion = await prisma.seedVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeedVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, SeedVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SeedVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeedVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeedVersions
     * const seedVersions = await prisma.seedVersion.findMany()
     * 
     * // Get first 10 SeedVersions
     * const seedVersions = await prisma.seedVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seedVersionWithIdOnly = await prisma.seedVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeedVersionFindManyArgs>(args?: SelectSubset<T, SeedVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SeedVersion.
     * @param {SeedVersionCreateArgs} args - Arguments to create a SeedVersion.
     * @example
     * // Create one SeedVersion
     * const SeedVersion = await prisma.seedVersion.create({
     *   data: {
     *     // ... data to create a SeedVersion
     *   }
     * })
     * 
     */
    create<T extends SeedVersionCreateArgs>(args: SelectSubset<T, SeedVersionCreateArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SeedVersions.
     * @param {SeedVersionCreateManyArgs} args - Arguments to create many SeedVersions.
     * @example
     * // Create many SeedVersions
     * const seedVersion = await prisma.seedVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeedVersionCreateManyArgs>(args?: SelectSubset<T, SeedVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SeedVersions and returns the data saved in the database.
     * @param {SeedVersionCreateManyAndReturnArgs} args - Arguments to create many SeedVersions.
     * @example
     * // Create many SeedVersions
     * const seedVersion = await prisma.seedVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SeedVersions and only return the `id`
     * const seedVersionWithIdOnly = await prisma.seedVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SeedVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, SeedVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SeedVersion.
     * @param {SeedVersionDeleteArgs} args - Arguments to delete one SeedVersion.
     * @example
     * // Delete one SeedVersion
     * const SeedVersion = await prisma.seedVersion.delete({
     *   where: {
     *     // ... filter to delete one SeedVersion
     *   }
     * })
     * 
     */
    delete<T extends SeedVersionDeleteArgs>(args: SelectSubset<T, SeedVersionDeleteArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SeedVersion.
     * @param {SeedVersionUpdateArgs} args - Arguments to update one SeedVersion.
     * @example
     * // Update one SeedVersion
     * const seedVersion = await prisma.seedVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeedVersionUpdateArgs>(args: SelectSubset<T, SeedVersionUpdateArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SeedVersions.
     * @param {SeedVersionDeleteManyArgs} args - Arguments to filter SeedVersions to delete.
     * @example
     * // Delete a few SeedVersions
     * const { count } = await prisma.seedVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeedVersionDeleteManyArgs>(args?: SelectSubset<T, SeedVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeedVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeedVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeedVersions
     * const seedVersion = await prisma.seedVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeedVersionUpdateManyArgs>(args: SelectSubset<T, SeedVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeedVersions and returns the data updated in the database.
     * @param {SeedVersionUpdateManyAndReturnArgs} args - Arguments to update many SeedVersions.
     * @example
     * // Update many SeedVersions
     * const seedVersion = await prisma.seedVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SeedVersions and only return the `id`
     * const seedVersionWithIdOnly = await prisma.seedVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SeedVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, SeedVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SeedVersion.
     * @param {SeedVersionUpsertArgs} args - Arguments to update or create a SeedVersion.
     * @example
     * // Update or create a SeedVersion
     * const seedVersion = await prisma.seedVersion.upsert({
     *   create: {
     *     // ... data to create a SeedVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeedVersion we want to update
     *   }
     * })
     */
    upsert<T extends SeedVersionUpsertArgs>(args: SelectSubset<T, SeedVersionUpsertArgs<ExtArgs>>): Prisma__SeedVersionClient<$Result.GetResult<Prisma.$SeedVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SeedVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeedVersionCountArgs} args - Arguments to filter SeedVersions to count.
     * @example
     * // Count the number of SeedVersions
     * const count = await prisma.seedVersion.count({
     *   where: {
     *     // ... the filter for the SeedVersions we want to count
     *   }
     * })
    **/
    count<T extends SeedVersionCountArgs>(
      args?: Subset<T, SeedVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeedVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeedVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeedVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeedVersionAggregateArgs>(args: Subset<T, SeedVersionAggregateArgs>): Prisma.PrismaPromise<GetSeedVersionAggregateType<T>>

    /**
     * Group by SeedVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeedVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeedVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeedVersionGroupByArgs['orderBy'] }
        : { orderBy?: SeedVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeedVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeedVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeedVersion model
   */
  readonly fields: SeedVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeedVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeedVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SeedVersion model
   */
  interface SeedVersionFieldRefs {
    readonly id: FieldRef<"SeedVersion", 'String'>
    readonly version: FieldRef<"SeedVersion", 'String'>
    readonly appliedAt: FieldRef<"SeedVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SeedVersion findUnique
   */
  export type SeedVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * Filter, which SeedVersion to fetch.
     */
    where: SeedVersionWhereUniqueInput
  }

  /**
   * SeedVersion findUniqueOrThrow
   */
  export type SeedVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * Filter, which SeedVersion to fetch.
     */
    where: SeedVersionWhereUniqueInput
  }

  /**
   * SeedVersion findFirst
   */
  export type SeedVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * Filter, which SeedVersion to fetch.
     */
    where?: SeedVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeedVersions to fetch.
     */
    orderBy?: SeedVersionOrderByWithRelationInput | SeedVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeedVersions.
     */
    cursor?: SeedVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeedVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeedVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeedVersions.
     */
    distinct?: SeedVersionScalarFieldEnum | SeedVersionScalarFieldEnum[]
  }

  /**
   * SeedVersion findFirstOrThrow
   */
  export type SeedVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * Filter, which SeedVersion to fetch.
     */
    where?: SeedVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeedVersions to fetch.
     */
    orderBy?: SeedVersionOrderByWithRelationInput | SeedVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeedVersions.
     */
    cursor?: SeedVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeedVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeedVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeedVersions.
     */
    distinct?: SeedVersionScalarFieldEnum | SeedVersionScalarFieldEnum[]
  }

  /**
   * SeedVersion findMany
   */
  export type SeedVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * Filter, which SeedVersions to fetch.
     */
    where?: SeedVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeedVersions to fetch.
     */
    orderBy?: SeedVersionOrderByWithRelationInput | SeedVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeedVersions.
     */
    cursor?: SeedVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeedVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeedVersions.
     */
    skip?: number
    distinct?: SeedVersionScalarFieldEnum | SeedVersionScalarFieldEnum[]
  }

  /**
   * SeedVersion create
   */
  export type SeedVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * The data needed to create a SeedVersion.
     */
    data: XOR<SeedVersionCreateInput, SeedVersionUncheckedCreateInput>
  }

  /**
   * SeedVersion createMany
   */
  export type SeedVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeedVersions.
     */
    data: SeedVersionCreateManyInput | SeedVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeedVersion createManyAndReturn
   */
  export type SeedVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * The data used to create many SeedVersions.
     */
    data: SeedVersionCreateManyInput | SeedVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeedVersion update
   */
  export type SeedVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * The data needed to update a SeedVersion.
     */
    data: XOR<SeedVersionUpdateInput, SeedVersionUncheckedUpdateInput>
    /**
     * Choose, which SeedVersion to update.
     */
    where: SeedVersionWhereUniqueInput
  }

  /**
   * SeedVersion updateMany
   */
  export type SeedVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeedVersions.
     */
    data: XOR<SeedVersionUpdateManyMutationInput, SeedVersionUncheckedUpdateManyInput>
    /**
     * Filter which SeedVersions to update
     */
    where?: SeedVersionWhereInput
    /**
     * Limit how many SeedVersions to update.
     */
    limit?: number
  }

  /**
   * SeedVersion updateManyAndReturn
   */
  export type SeedVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * The data used to update SeedVersions.
     */
    data: XOR<SeedVersionUpdateManyMutationInput, SeedVersionUncheckedUpdateManyInput>
    /**
     * Filter which SeedVersions to update
     */
    where?: SeedVersionWhereInput
    /**
     * Limit how many SeedVersions to update.
     */
    limit?: number
  }

  /**
   * SeedVersion upsert
   */
  export type SeedVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * The filter to search for the SeedVersion to update in case it exists.
     */
    where: SeedVersionWhereUniqueInput
    /**
     * In case the SeedVersion found by the `where` argument doesn't exist, create a new SeedVersion with this data.
     */
    create: XOR<SeedVersionCreateInput, SeedVersionUncheckedCreateInput>
    /**
     * In case the SeedVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeedVersionUpdateInput, SeedVersionUncheckedUpdateInput>
  }

  /**
   * SeedVersion delete
   */
  export type SeedVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
    /**
     * Filter which SeedVersion to delete.
     */
    where: SeedVersionWhereUniqueInput
  }

  /**
   * SeedVersion deleteMany
   */
  export type SeedVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeedVersions to delete
     */
    where?: SeedVersionWhereInput
    /**
     * Limit how many SeedVersions to delete.
     */
    limit?: number
  }

  /**
   * SeedVersion without action
   */
  export type SeedVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeedVersion
     */
    select?: SeedVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeedVersion
     */
    omit?: SeedVersionOmit<ExtArgs> | null
  }


  /**
   * Model AuditLogEntry
   */

  export type AggregateAuditLogEntry = {
    _count: AuditLogEntryCountAggregateOutputType | null
    _min: AuditLogEntryMinAggregateOutputType | null
    _max: AuditLogEntryMaxAggregateOutputType | null
  }

  export type AuditLogEntryMinAggregateOutputType = {
    id: string | null
    instanceId: string | null
    createdAt: Date | null
    ipAddress: string | null
  }

  export type AuditLogEntryMaxAggregateOutputType = {
    id: string | null
    instanceId: string | null
    createdAt: Date | null
    ipAddress: string | null
  }

  export type AuditLogEntryCountAggregateOutputType = {
    id: number
    instanceId: number
    payload: number
    createdAt: number
    ipAddress: number
    _all: number
  }


  export type AuditLogEntryMinAggregateInputType = {
    id?: true
    instanceId?: true
    createdAt?: true
    ipAddress?: true
  }

  export type AuditLogEntryMaxAggregateInputType = {
    id?: true
    instanceId?: true
    createdAt?: true
    ipAddress?: true
  }

  export type AuditLogEntryCountAggregateInputType = {
    id?: true
    instanceId?: true
    payload?: true
    createdAt?: true
    ipAddress?: true
    _all?: true
  }

  export type AuditLogEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogEntry to aggregate.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogEntries
    **/
    _count?: true | AuditLogEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogEntryMaxAggregateInputType
  }

  export type GetAuditLogEntryAggregateType<T extends AuditLogEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLogEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLogEntry[P]>
      : GetScalarType<T[P], AggregateAuditLogEntry[P]>
  }




  export type AuditLogEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogEntryWhereInput
    orderBy?: AuditLogEntryOrderByWithAggregationInput | AuditLogEntryOrderByWithAggregationInput[]
    by: AuditLogEntryScalarFieldEnum[] | AuditLogEntryScalarFieldEnum
    having?: AuditLogEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogEntryCountAggregateInputType | true
    _min?: AuditLogEntryMinAggregateInputType
    _max?: AuditLogEntryMaxAggregateInputType
  }

  export type AuditLogEntryGroupByOutputType = {
    id: string
    instanceId: string | null
    payload: JsonValue | null
    createdAt: Date | null
    ipAddress: string
    _count: AuditLogEntryCountAggregateOutputType | null
    _min: AuditLogEntryMinAggregateOutputType | null
    _max: AuditLogEntryMaxAggregateOutputType | null
  }

  type GetAuditLogEntryGroupByPayload<T extends AuditLogEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogEntryGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogEntryGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    payload?: boolean
    createdAt?: boolean
    ipAddress?: boolean
  }, ExtArgs["result"]["auditLogEntry"]>

  export type AuditLogEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    payload?: boolean
    createdAt?: boolean
    ipAddress?: boolean
  }, ExtArgs["result"]["auditLogEntry"]>

  export type AuditLogEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    payload?: boolean
    createdAt?: boolean
    ipAddress?: boolean
  }, ExtArgs["result"]["auditLogEntry"]>

  export type AuditLogEntrySelectScalar = {
    id?: boolean
    instanceId?: boolean
    payload?: boolean
    createdAt?: boolean
    ipAddress?: boolean
  }

  export type AuditLogEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "instanceId" | "payload" | "createdAt" | "ipAddress", ExtArgs["result"]["auditLogEntry"]>

  export type $AuditLogEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLogEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      instanceId: string | null
      payload: Prisma.JsonValue | null
      createdAt: Date | null
      ipAddress: string
    }, ExtArgs["result"]["auditLogEntry"]>
    composites: {}
  }

  type AuditLogEntryGetPayload<S extends boolean | null | undefined | AuditLogEntryDefaultArgs> = $Result.GetResult<Prisma.$AuditLogEntryPayload, S>

  type AuditLogEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogEntryCountAggregateInputType | true
    }

  export interface AuditLogEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLogEntry'], meta: { name: 'AuditLogEntry' } }
    /**
     * Find zero or one AuditLogEntry that matches the filter.
     * @param {AuditLogEntryFindUniqueArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogEntryFindUniqueArgs>(args: SelectSubset<T, AuditLogEntryFindUniqueArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLogEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogEntryFindUniqueOrThrowArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLogEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryFindFirstArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogEntryFindFirstArgs>(args?: SelectSubset<T, AuditLogEntryFindFirstArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLogEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryFindFirstOrThrowArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogEntries
     * const auditLogEntries = await prisma.auditLogEntry.findMany()
     * 
     * // Get first 10 AuditLogEntries
     * const auditLogEntries = await prisma.auditLogEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogEntryWithIdOnly = await prisma.auditLogEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogEntryFindManyArgs>(args?: SelectSubset<T, AuditLogEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLogEntry.
     * @param {AuditLogEntryCreateArgs} args - Arguments to create a AuditLogEntry.
     * @example
     * // Create one AuditLogEntry
     * const AuditLogEntry = await prisma.auditLogEntry.create({
     *   data: {
     *     // ... data to create a AuditLogEntry
     *   }
     * })
     * 
     */
    create<T extends AuditLogEntryCreateArgs>(args: SelectSubset<T, AuditLogEntryCreateArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogEntries.
     * @param {AuditLogEntryCreateManyArgs} args - Arguments to create many AuditLogEntries.
     * @example
     * // Create many AuditLogEntries
     * const auditLogEntry = await prisma.auditLogEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogEntryCreateManyArgs>(args?: SelectSubset<T, AuditLogEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogEntries and returns the data saved in the database.
     * @param {AuditLogEntryCreateManyAndReturnArgs} args - Arguments to create many AuditLogEntries.
     * @example
     * // Create many AuditLogEntries
     * const auditLogEntry = await prisma.auditLogEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogEntries and only return the `id`
     * const auditLogEntryWithIdOnly = await prisma.auditLogEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLogEntry.
     * @param {AuditLogEntryDeleteArgs} args - Arguments to delete one AuditLogEntry.
     * @example
     * // Delete one AuditLogEntry
     * const AuditLogEntry = await prisma.auditLogEntry.delete({
     *   where: {
     *     // ... filter to delete one AuditLogEntry
     *   }
     * })
     * 
     */
    delete<T extends AuditLogEntryDeleteArgs>(args: SelectSubset<T, AuditLogEntryDeleteArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLogEntry.
     * @param {AuditLogEntryUpdateArgs} args - Arguments to update one AuditLogEntry.
     * @example
     * // Update one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogEntryUpdateArgs>(args: SelectSubset<T, AuditLogEntryUpdateArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogEntries.
     * @param {AuditLogEntryDeleteManyArgs} args - Arguments to filter AuditLogEntries to delete.
     * @example
     * // Delete a few AuditLogEntries
     * const { count } = await prisma.auditLogEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogEntryDeleteManyArgs>(args?: SelectSubset<T, AuditLogEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogEntries
     * const auditLogEntry = await prisma.auditLogEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogEntryUpdateManyArgs>(args: SelectSubset<T, AuditLogEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogEntries and returns the data updated in the database.
     * @param {AuditLogEntryUpdateManyAndReturnArgs} args - Arguments to update many AuditLogEntries.
     * @example
     * // Update many AuditLogEntries
     * const auditLogEntry = await prisma.auditLogEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogEntries and only return the `id`
     * const auditLogEntryWithIdOnly = await prisma.auditLogEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLogEntry.
     * @param {AuditLogEntryUpsertArgs} args - Arguments to update or create a AuditLogEntry.
     * @example
     * // Update or create a AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.upsert({
     *   create: {
     *     // ... data to create a AuditLogEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLogEntry we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogEntryUpsertArgs>(args: SelectSubset<T, AuditLogEntryUpsertArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryCountArgs} args - Arguments to filter AuditLogEntries to count.
     * @example
     * // Count the number of AuditLogEntries
     * const count = await prisma.auditLogEntry.count({
     *   where: {
     *     // ... the filter for the AuditLogEntries we want to count
     *   }
     * })
    **/
    count<T extends AuditLogEntryCountArgs>(
      args?: Subset<T, AuditLogEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLogEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogEntryAggregateArgs>(args: Subset<T, AuditLogEntryAggregateArgs>): Prisma.PrismaPromise<GetAuditLogEntryAggregateType<T>>

    /**
     * Group by AuditLogEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogEntryGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLogEntry model
   */
  readonly fields: AuditLogEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLogEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLogEntry model
   */
  interface AuditLogEntryFieldRefs {
    readonly id: FieldRef<"AuditLogEntry", 'String'>
    readonly instanceId: FieldRef<"AuditLogEntry", 'String'>
    readonly payload: FieldRef<"AuditLogEntry", 'Json'>
    readonly createdAt: FieldRef<"AuditLogEntry", 'DateTime'>
    readonly ipAddress: FieldRef<"AuditLogEntry", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuditLogEntry findUnique
   */
  export type AuditLogEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry findUniqueOrThrow
   */
  export type AuditLogEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry findFirst
   */
  export type AuditLogEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogEntries.
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogEntries.
     */
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * AuditLogEntry findFirstOrThrow
   */
  export type AuditLogEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogEntries.
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogEntries.
     */
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * AuditLogEntry findMany
   */
  export type AuditLogEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogEntries to fetch.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogEntries.
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * AuditLogEntry create
   */
  export type AuditLogEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLogEntry.
     */
    data?: XOR<AuditLogEntryCreateInput, AuditLogEntryUncheckedCreateInput>
  }

  /**
   * AuditLogEntry createMany
   */
  export type AuditLogEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogEntries.
     */
    data: AuditLogEntryCreateManyInput | AuditLogEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLogEntry createManyAndReturn
   */
  export type AuditLogEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogEntries.
     */
    data: AuditLogEntryCreateManyInput | AuditLogEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLogEntry update
   */
  export type AuditLogEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLogEntry.
     */
    data: XOR<AuditLogEntryUpdateInput, AuditLogEntryUncheckedUpdateInput>
    /**
     * Choose, which AuditLogEntry to update.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry updateMany
   */
  export type AuditLogEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogEntries.
     */
    data: XOR<AuditLogEntryUpdateManyMutationInput, AuditLogEntryUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogEntries to update
     */
    where?: AuditLogEntryWhereInput
    /**
     * Limit how many AuditLogEntries to update.
     */
    limit?: number
  }

  /**
   * AuditLogEntry updateManyAndReturn
   */
  export type AuditLogEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogEntries.
     */
    data: XOR<AuditLogEntryUpdateManyMutationInput, AuditLogEntryUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogEntries to update
     */
    where?: AuditLogEntryWhereInput
    /**
     * Limit how many AuditLogEntries to update.
     */
    limit?: number
  }

  /**
   * AuditLogEntry upsert
   */
  export type AuditLogEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLogEntry to update in case it exists.
     */
    where: AuditLogEntryWhereUniqueInput
    /**
     * In case the AuditLogEntry found by the `where` argument doesn't exist, create a new AuditLogEntry with this data.
     */
    create: XOR<AuditLogEntryCreateInput, AuditLogEntryUncheckedCreateInput>
    /**
     * In case the AuditLogEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogEntryUpdateInput, AuditLogEntryUncheckedUpdateInput>
  }

  /**
   * AuditLogEntry delete
   */
  export type AuditLogEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
    /**
     * Filter which AuditLogEntry to delete.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry deleteMany
   */
  export type AuditLogEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogEntries to delete
     */
    where?: AuditLogEntryWhereInput
    /**
     * Limit how many AuditLogEntries to delete.
     */
    limit?: number
  }

  /**
   * AuditLogEntry without action
   */
  export type AuditLogEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLogEntry
     */
    omit?: AuditLogEntryOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    emailChangeConfirmStatus: number | null
  }

  export type UserSumAggregateOutputType = {
    emailChangeConfirmStatus: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    instanceId: string | null
    aud: string | null
    role: string | null
    email: string | null
    encryptedPassword: string | null
    emailConfirmedAt: Date | null
    invitedAt: Date | null
    confirmationToken: string | null
    confirmationSentAt: Date | null
    recoveryToken: string | null
    recoverySentAt: Date | null
    emailChangeTokenNew: string | null
    emailChange: string | null
    emailChangeSentAt: Date | null
    lastSignInAt: Date | null
    isSuperAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    phone: string | null
    phoneConfirmedAt: Date | null
    phoneChange: string | null
    phoneChangeToken: string | null
    phoneChangeSentAt: Date | null
    emailChangeTokenCurrent: string | null
    emailChangeConfirmStatus: number | null
    bannedUntil: Date | null
    reauthenticationToken: string | null
    reauthenticationSentAt: Date | null
    isSsoUser: boolean | null
    deletedAt: Date | null
    isAnonymous: boolean | null
    username: string | null
    phoneNumber: string | null
    avatarUrl: string | null
    roleId: string | null
    status: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    instanceId: string | null
    aud: string | null
    role: string | null
    email: string | null
    encryptedPassword: string | null
    emailConfirmedAt: Date | null
    invitedAt: Date | null
    confirmationToken: string | null
    confirmationSentAt: Date | null
    recoveryToken: string | null
    recoverySentAt: Date | null
    emailChangeTokenNew: string | null
    emailChange: string | null
    emailChangeSentAt: Date | null
    lastSignInAt: Date | null
    isSuperAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    phone: string | null
    phoneConfirmedAt: Date | null
    phoneChange: string | null
    phoneChangeToken: string | null
    phoneChangeSentAt: Date | null
    emailChangeTokenCurrent: string | null
    emailChangeConfirmStatus: number | null
    bannedUntil: Date | null
    reauthenticationToken: string | null
    reauthenticationSentAt: Date | null
    isSsoUser: boolean | null
    deletedAt: Date | null
    isAnonymous: boolean | null
    username: string | null
    phoneNumber: string | null
    avatarUrl: string | null
    roleId: string | null
    status: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    instanceId: number
    aud: number
    role: number
    email: number
    encryptedPassword: number
    emailConfirmedAt: number
    invitedAt: number
    confirmationToken: number
    confirmationSentAt: number
    recoveryToken: number
    recoverySentAt: number
    emailChangeTokenNew: number
    emailChange: number
    emailChangeSentAt: number
    lastSignInAt: number
    rawAppMetaData: number
    rawUserMetaData: number
    isSuperAdmin: number
    createdAt: number
    updatedAt: number
    phone: number
    phoneConfirmedAt: number
    phoneChange: number
    phoneChangeToken: number
    phoneChangeSentAt: number
    emailChangeTokenCurrent: number
    emailChangeConfirmStatus: number
    bannedUntil: number
    reauthenticationToken: number
    reauthenticationSentAt: number
    isSsoUser: number
    deletedAt: number
    isAnonymous: number
    username: number
    phoneNumber: number
    avatarUrl: number
    roleId: number
    status: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    emailChangeConfirmStatus?: true
  }

  export type UserSumAggregateInputType = {
    emailChangeConfirmStatus?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    instanceId?: true
    aud?: true
    role?: true
    email?: true
    encryptedPassword?: true
    emailConfirmedAt?: true
    invitedAt?: true
    confirmationToken?: true
    confirmationSentAt?: true
    recoveryToken?: true
    recoverySentAt?: true
    emailChangeTokenNew?: true
    emailChange?: true
    emailChangeSentAt?: true
    lastSignInAt?: true
    isSuperAdmin?: true
    createdAt?: true
    updatedAt?: true
    phone?: true
    phoneConfirmedAt?: true
    phoneChange?: true
    phoneChangeToken?: true
    phoneChangeSentAt?: true
    emailChangeTokenCurrent?: true
    emailChangeConfirmStatus?: true
    bannedUntil?: true
    reauthenticationToken?: true
    reauthenticationSentAt?: true
    isSsoUser?: true
    deletedAt?: true
    isAnonymous?: true
    username?: true
    phoneNumber?: true
    avatarUrl?: true
    roleId?: true
    status?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    instanceId?: true
    aud?: true
    role?: true
    email?: true
    encryptedPassword?: true
    emailConfirmedAt?: true
    invitedAt?: true
    confirmationToken?: true
    confirmationSentAt?: true
    recoveryToken?: true
    recoverySentAt?: true
    emailChangeTokenNew?: true
    emailChange?: true
    emailChangeSentAt?: true
    lastSignInAt?: true
    isSuperAdmin?: true
    createdAt?: true
    updatedAt?: true
    phone?: true
    phoneConfirmedAt?: true
    phoneChange?: true
    phoneChangeToken?: true
    phoneChangeSentAt?: true
    emailChangeTokenCurrent?: true
    emailChangeConfirmStatus?: true
    bannedUntil?: true
    reauthenticationToken?: true
    reauthenticationSentAt?: true
    isSsoUser?: true
    deletedAt?: true
    isAnonymous?: true
    username?: true
    phoneNumber?: true
    avatarUrl?: true
    roleId?: true
    status?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    instanceId?: true
    aud?: true
    role?: true
    email?: true
    encryptedPassword?: true
    emailConfirmedAt?: true
    invitedAt?: true
    confirmationToken?: true
    confirmationSentAt?: true
    recoveryToken?: true
    recoverySentAt?: true
    emailChangeTokenNew?: true
    emailChange?: true
    emailChangeSentAt?: true
    lastSignInAt?: true
    rawAppMetaData?: true
    rawUserMetaData?: true
    isSuperAdmin?: true
    createdAt?: true
    updatedAt?: true
    phone?: true
    phoneConfirmedAt?: true
    phoneChange?: true
    phoneChangeToken?: true
    phoneChangeSentAt?: true
    emailChangeTokenCurrent?: true
    emailChangeConfirmStatus?: true
    bannedUntil?: true
    reauthenticationToken?: true
    reauthenticationSentAt?: true
    isSsoUser?: true
    deletedAt?: true
    isAnonymous?: true
    username?: true
    phoneNumber?: true
    avatarUrl?: true
    roleId?: true
    status?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    instanceId: string | null
    aud: string | null
    role: string | null
    email: string | null
    encryptedPassword: string | null
    emailConfirmedAt: Date | null
    invitedAt: Date | null
    confirmationToken: string | null
    confirmationSentAt: Date | null
    recoveryToken: string | null
    recoverySentAt: Date | null
    emailChangeTokenNew: string | null
    emailChange: string | null
    emailChangeSentAt: Date | null
    lastSignInAt: Date | null
    rawAppMetaData: JsonValue | null
    rawUserMetaData: JsonValue | null
    isSuperAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    phone: string | null
    phoneConfirmedAt: Date | null
    phoneChange: string | null
    phoneChangeToken: string | null
    phoneChangeSentAt: Date | null
    emailChangeTokenCurrent: string | null
    emailChangeConfirmStatus: number | null
    bannedUntil: Date | null
    reauthenticationToken: string | null
    reauthenticationSentAt: Date | null
    isSsoUser: boolean
    deletedAt: Date | null
    isAnonymous: boolean
    username: string | null
    phoneNumber: string | null
    avatarUrl: string | null
    roleId: string | null
    status: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    aud?: boolean
    role?: boolean
    email?: boolean
    encryptedPassword?: boolean
    emailConfirmedAt?: boolean
    invitedAt?: boolean
    confirmationToken?: boolean
    confirmationSentAt?: boolean
    recoveryToken?: boolean
    recoverySentAt?: boolean
    emailChangeTokenNew?: boolean
    emailChange?: boolean
    emailChangeSentAt?: boolean
    lastSignInAt?: boolean
    rawAppMetaData?: boolean
    rawUserMetaData?: boolean
    isSuperAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    phone?: boolean
    phoneConfirmedAt?: boolean
    phoneChange?: boolean
    phoneChangeToken?: boolean
    phoneChangeSentAt?: boolean
    emailChangeTokenCurrent?: boolean
    emailChangeConfirmStatus?: boolean
    bannedUntil?: boolean
    reauthenticationToken?: boolean
    reauthenticationSentAt?: boolean
    isSsoUser?: boolean
    deletedAt?: boolean
    isAnonymous?: boolean
    username?: boolean
    phoneNumber?: boolean
    avatarUrl?: boolean
    roleId?: boolean
    status?: boolean
    userRole?: boolean | User$userRoleArgs<ExtArgs>
    loginLogs?: boolean | User$loginLogsArgs<ExtArgs>
    verificationCodes?: boolean | User$verificationCodesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    aud?: boolean
    role?: boolean
    email?: boolean
    encryptedPassword?: boolean
    emailConfirmedAt?: boolean
    invitedAt?: boolean
    confirmationToken?: boolean
    confirmationSentAt?: boolean
    recoveryToken?: boolean
    recoverySentAt?: boolean
    emailChangeTokenNew?: boolean
    emailChange?: boolean
    emailChangeSentAt?: boolean
    lastSignInAt?: boolean
    rawAppMetaData?: boolean
    rawUserMetaData?: boolean
    isSuperAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    phone?: boolean
    phoneConfirmedAt?: boolean
    phoneChange?: boolean
    phoneChangeToken?: boolean
    phoneChangeSentAt?: boolean
    emailChangeTokenCurrent?: boolean
    emailChangeConfirmStatus?: boolean
    bannedUntil?: boolean
    reauthenticationToken?: boolean
    reauthenticationSentAt?: boolean
    isSsoUser?: boolean
    deletedAt?: boolean
    isAnonymous?: boolean
    username?: boolean
    phoneNumber?: boolean
    avatarUrl?: boolean
    roleId?: boolean
    status?: boolean
    userRole?: boolean | User$userRoleArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    instanceId?: boolean
    aud?: boolean
    role?: boolean
    email?: boolean
    encryptedPassword?: boolean
    emailConfirmedAt?: boolean
    invitedAt?: boolean
    confirmationToken?: boolean
    confirmationSentAt?: boolean
    recoveryToken?: boolean
    recoverySentAt?: boolean
    emailChangeTokenNew?: boolean
    emailChange?: boolean
    emailChangeSentAt?: boolean
    lastSignInAt?: boolean
    rawAppMetaData?: boolean
    rawUserMetaData?: boolean
    isSuperAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    phone?: boolean
    phoneConfirmedAt?: boolean
    phoneChange?: boolean
    phoneChangeToken?: boolean
    phoneChangeSentAt?: boolean
    emailChangeTokenCurrent?: boolean
    emailChangeConfirmStatus?: boolean
    bannedUntil?: boolean
    reauthenticationToken?: boolean
    reauthenticationSentAt?: boolean
    isSsoUser?: boolean
    deletedAt?: boolean
    isAnonymous?: boolean
    username?: boolean
    phoneNumber?: boolean
    avatarUrl?: boolean
    roleId?: boolean
    status?: boolean
    userRole?: boolean | User$userRoleArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    instanceId?: boolean
    aud?: boolean
    role?: boolean
    email?: boolean
    encryptedPassword?: boolean
    emailConfirmedAt?: boolean
    invitedAt?: boolean
    confirmationToken?: boolean
    confirmationSentAt?: boolean
    recoveryToken?: boolean
    recoverySentAt?: boolean
    emailChangeTokenNew?: boolean
    emailChange?: boolean
    emailChangeSentAt?: boolean
    lastSignInAt?: boolean
    rawAppMetaData?: boolean
    rawUserMetaData?: boolean
    isSuperAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    phone?: boolean
    phoneConfirmedAt?: boolean
    phoneChange?: boolean
    phoneChangeToken?: boolean
    phoneChangeSentAt?: boolean
    emailChangeTokenCurrent?: boolean
    emailChangeConfirmStatus?: boolean
    bannedUntil?: boolean
    reauthenticationToken?: boolean
    reauthenticationSentAt?: boolean
    isSsoUser?: boolean
    deletedAt?: boolean
    isAnonymous?: boolean
    username?: boolean
    phoneNumber?: boolean
    avatarUrl?: boolean
    roleId?: boolean
    status?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "instanceId" | "aud" | "role" | "email" | "encryptedPassword" | "emailConfirmedAt" | "invitedAt" | "confirmationToken" | "confirmationSentAt" | "recoveryToken" | "recoverySentAt" | "emailChangeTokenNew" | "emailChange" | "emailChangeSentAt" | "lastSignInAt" | "rawAppMetaData" | "rawUserMetaData" | "isSuperAdmin" | "createdAt" | "updatedAt" | "phone" | "phoneConfirmedAt" | "phoneChange" | "phoneChangeToken" | "phoneChangeSentAt" | "emailChangeTokenCurrent" | "emailChangeConfirmStatus" | "bannedUntil" | "reauthenticationToken" | "reauthenticationSentAt" | "isSsoUser" | "deletedAt" | "isAnonymous" | "username" | "phoneNumber" | "avatarUrl" | "roleId" | "status", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRole?: boolean | User$userRoleArgs<ExtArgs>
    loginLogs?: boolean | User$loginLogsArgs<ExtArgs>
    verificationCodes?: boolean | User$verificationCodesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRole?: boolean | User$userRoleArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRole?: boolean | User$userRoleArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      userRole: Prisma.$RolePayload<ExtArgs> | null
      loginLogs: Prisma.$LoginLogPayload<ExtArgs>[]
      verificationCodes: Prisma.$VerificationCodePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      instanceId: string | null
      aud: string | null
      role: string | null
      email: string | null
      encryptedPassword: string | null
      emailConfirmedAt: Date | null
      invitedAt: Date | null
      confirmationToken: string | null
      confirmationSentAt: Date | null
      recoveryToken: string | null
      recoverySentAt: Date | null
      emailChangeTokenNew: string | null
      emailChange: string | null
      emailChangeSentAt: Date | null
      lastSignInAt: Date | null
      rawAppMetaData: Prisma.JsonValue | null
      rawUserMetaData: Prisma.JsonValue | null
      isSuperAdmin: boolean | null
      createdAt: Date | null
      updatedAt: Date | null
      phone: string | null
      phoneConfirmedAt: Date | null
      phoneChange: string | null
      phoneChangeToken: string | null
      phoneChangeSentAt: Date | null
      emailChangeTokenCurrent: string | null
      emailChangeConfirmStatus: number | null
      bannedUntil: Date | null
      reauthenticationToken: string | null
      reauthenticationSentAt: Date | null
      isSsoUser: boolean
      deletedAt: Date | null
      isAnonymous: boolean
      username: string | null
      phoneNumber: string | null
      avatarUrl: string | null
      roleId: string | null
      status: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userRole<T extends User$userRoleArgs<ExtArgs> = {}>(args?: Subset<T, User$userRoleArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    loginLogs<T extends User$loginLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$loginLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    verificationCodes<T extends User$verificationCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$verificationCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly instanceId: FieldRef<"User", 'String'>
    readonly aud: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly encryptedPassword: FieldRef<"User", 'String'>
    readonly emailConfirmedAt: FieldRef<"User", 'DateTime'>
    readonly invitedAt: FieldRef<"User", 'DateTime'>
    readonly confirmationToken: FieldRef<"User", 'String'>
    readonly confirmationSentAt: FieldRef<"User", 'DateTime'>
    readonly recoveryToken: FieldRef<"User", 'String'>
    readonly recoverySentAt: FieldRef<"User", 'DateTime'>
    readonly emailChangeTokenNew: FieldRef<"User", 'String'>
    readonly emailChange: FieldRef<"User", 'String'>
    readonly emailChangeSentAt: FieldRef<"User", 'DateTime'>
    readonly lastSignInAt: FieldRef<"User", 'DateTime'>
    readonly rawAppMetaData: FieldRef<"User", 'Json'>
    readonly rawUserMetaData: FieldRef<"User", 'Json'>
    readonly isSuperAdmin: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly phone: FieldRef<"User", 'String'>
    readonly phoneConfirmedAt: FieldRef<"User", 'DateTime'>
    readonly phoneChange: FieldRef<"User", 'String'>
    readonly phoneChangeToken: FieldRef<"User", 'String'>
    readonly phoneChangeSentAt: FieldRef<"User", 'DateTime'>
    readonly emailChangeTokenCurrent: FieldRef<"User", 'String'>
    readonly emailChangeConfirmStatus: FieldRef<"User", 'Int'>
    readonly bannedUntil: FieldRef<"User", 'DateTime'>
    readonly reauthenticationToken: FieldRef<"User", 'String'>
    readonly reauthenticationSentAt: FieldRef<"User", 'DateTime'>
    readonly isSsoUser: FieldRef<"User", 'Boolean'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
    readonly isAnonymous: FieldRef<"User", 'Boolean'>
    readonly username: FieldRef<"User", 'String'>
    readonly phoneNumber: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly roleId: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.userRole
   */
  export type User$userRoleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    where?: RoleWhereInput
  }

  /**
   * User.loginLogs
   */
  export type User$loginLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    where?: LoginLogWhereInput
    orderBy?: LoginLogOrderByWithRelationInput | LoginLogOrderByWithRelationInput[]
    cursor?: LoginLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoginLogScalarFieldEnum | LoginLogScalarFieldEnum[]
  }

  /**
   * User.verificationCodes
   */
  export type User$verificationCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    where?: VerificationCodeWhereInput
    orderBy?: VerificationCodeOrderByWithRelationInput | VerificationCodeOrderByWithRelationInput[]
    cursor?: VerificationCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VerificationCodeScalarFieldEnum | VerificationCodeScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model LoginLog
   */

  export type AggregateLoginLog = {
    _count: LoginLogCountAggregateOutputType | null
    _min: LoginLogMinAggregateOutputType | null
    _max: LoginLogMaxAggregateOutputType | null
  }

  export type LoginLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    loginTime: Date | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type LoginLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    loginTime: Date | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type LoginLogCountAggregateOutputType = {
    id: number
    userId: number
    loginTime: number
    ipAddress: number
    userAgent: number
    _all: number
  }


  export type LoginLogMinAggregateInputType = {
    id?: true
    userId?: true
    loginTime?: true
    ipAddress?: true
    userAgent?: true
  }

  export type LoginLogMaxAggregateInputType = {
    id?: true
    userId?: true
    loginTime?: true
    ipAddress?: true
    userAgent?: true
  }

  export type LoginLogCountAggregateInputType = {
    id?: true
    userId?: true
    loginTime?: true
    ipAddress?: true
    userAgent?: true
    _all?: true
  }

  export type LoginLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginLog to aggregate.
     */
    where?: LoginLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginLogs to fetch.
     */
    orderBy?: LoginLogOrderByWithRelationInput | LoginLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginLogs
    **/
    _count?: true | LoginLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginLogMaxAggregateInputType
  }

  export type GetLoginLogAggregateType<T extends LoginLogAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginLog[P]>
      : GetScalarType<T[P], AggregateLoginLog[P]>
  }




  export type LoginLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginLogWhereInput
    orderBy?: LoginLogOrderByWithAggregationInput | LoginLogOrderByWithAggregationInput[]
    by: LoginLogScalarFieldEnum[] | LoginLogScalarFieldEnum
    having?: LoginLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginLogCountAggregateInputType | true
    _min?: LoginLogMinAggregateInputType
    _max?: LoginLogMaxAggregateInputType
  }

  export type LoginLogGroupByOutputType = {
    id: string
    userId: string
    loginTime: Date
    ipAddress: string | null
    userAgent: string | null
    _count: LoginLogCountAggregateOutputType | null
    _min: LoginLogMinAggregateOutputType | null
    _max: LoginLogMaxAggregateOutputType | null
  }

  type GetLoginLogGroupByPayload<T extends LoginLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginLogGroupByOutputType[P]>
            : GetScalarType<T[P], LoginLogGroupByOutputType[P]>
        }
      >
    >


  export type LoginLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    loginTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginLog"]>

  export type LoginLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    loginTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginLog"]>

  export type LoginLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    loginTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginLog"]>

  export type LoginLogSelectScalar = {
    id?: boolean
    userId?: boolean
    loginTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }

  export type LoginLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "loginTime" | "ipAddress" | "userAgent", ExtArgs["result"]["loginLog"]>
  export type LoginLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LoginLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LoginLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LoginLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      loginTime: Date
      ipAddress: string | null
      userAgent: string | null
    }, ExtArgs["result"]["loginLog"]>
    composites: {}
  }

  type LoginLogGetPayload<S extends boolean | null | undefined | LoginLogDefaultArgs> = $Result.GetResult<Prisma.$LoginLogPayload, S>

  type LoginLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginLogCountAggregateInputType | true
    }

  export interface LoginLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginLog'], meta: { name: 'LoginLog' } }
    /**
     * Find zero or one LoginLog that matches the filter.
     * @param {LoginLogFindUniqueArgs} args - Arguments to find a LoginLog
     * @example
     * // Get one LoginLog
     * const loginLog = await prisma.loginLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginLogFindUniqueArgs>(args: SelectSubset<T, LoginLogFindUniqueArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginLogFindUniqueOrThrowArgs} args - Arguments to find a LoginLog
     * @example
     * // Get one LoginLog
     * const loginLog = await prisma.loginLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginLogFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginLogFindFirstArgs} args - Arguments to find a LoginLog
     * @example
     * // Get one LoginLog
     * const loginLog = await prisma.loginLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginLogFindFirstArgs>(args?: SelectSubset<T, LoginLogFindFirstArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginLogFindFirstOrThrowArgs} args - Arguments to find a LoginLog
     * @example
     * // Get one LoginLog
     * const loginLog = await prisma.loginLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginLogFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginLogs
     * const loginLogs = await prisma.loginLog.findMany()
     * 
     * // Get first 10 LoginLogs
     * const loginLogs = await prisma.loginLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginLogWithIdOnly = await prisma.loginLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginLogFindManyArgs>(args?: SelectSubset<T, LoginLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginLog.
     * @param {LoginLogCreateArgs} args - Arguments to create a LoginLog.
     * @example
     * // Create one LoginLog
     * const LoginLog = await prisma.loginLog.create({
     *   data: {
     *     // ... data to create a LoginLog
     *   }
     * })
     * 
     */
    create<T extends LoginLogCreateArgs>(args: SelectSubset<T, LoginLogCreateArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginLogs.
     * @param {LoginLogCreateManyArgs} args - Arguments to create many LoginLogs.
     * @example
     * // Create many LoginLogs
     * const loginLog = await prisma.loginLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginLogCreateManyArgs>(args?: SelectSubset<T, LoginLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoginLogs and returns the data saved in the database.
     * @param {LoginLogCreateManyAndReturnArgs} args - Arguments to create many LoginLogs.
     * @example
     * // Create many LoginLogs
     * const loginLog = await prisma.loginLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoginLogs and only return the `id`
     * const loginLogWithIdOnly = await prisma.loginLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoginLogCreateManyAndReturnArgs>(args?: SelectSubset<T, LoginLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoginLog.
     * @param {LoginLogDeleteArgs} args - Arguments to delete one LoginLog.
     * @example
     * // Delete one LoginLog
     * const LoginLog = await prisma.loginLog.delete({
     *   where: {
     *     // ... filter to delete one LoginLog
     *   }
     * })
     * 
     */
    delete<T extends LoginLogDeleteArgs>(args: SelectSubset<T, LoginLogDeleteArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginLog.
     * @param {LoginLogUpdateArgs} args - Arguments to update one LoginLog.
     * @example
     * // Update one LoginLog
     * const loginLog = await prisma.loginLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginLogUpdateArgs>(args: SelectSubset<T, LoginLogUpdateArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginLogs.
     * @param {LoginLogDeleteManyArgs} args - Arguments to filter LoginLogs to delete.
     * @example
     * // Delete a few LoginLogs
     * const { count } = await prisma.loginLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginLogDeleteManyArgs>(args?: SelectSubset<T, LoginLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginLogs
     * const loginLog = await prisma.loginLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginLogUpdateManyArgs>(args: SelectSubset<T, LoginLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginLogs and returns the data updated in the database.
     * @param {LoginLogUpdateManyAndReturnArgs} args - Arguments to update many LoginLogs.
     * @example
     * // Update many LoginLogs
     * const loginLog = await prisma.loginLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoginLogs and only return the `id`
     * const loginLogWithIdOnly = await prisma.loginLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoginLogUpdateManyAndReturnArgs>(args: SelectSubset<T, LoginLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoginLog.
     * @param {LoginLogUpsertArgs} args - Arguments to update or create a LoginLog.
     * @example
     * // Update or create a LoginLog
     * const loginLog = await prisma.loginLog.upsert({
     *   create: {
     *     // ... data to create a LoginLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginLog we want to update
     *   }
     * })
     */
    upsert<T extends LoginLogUpsertArgs>(args: SelectSubset<T, LoginLogUpsertArgs<ExtArgs>>): Prisma__LoginLogClient<$Result.GetResult<Prisma.$LoginLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoginLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginLogCountArgs} args - Arguments to filter LoginLogs to count.
     * @example
     * // Count the number of LoginLogs
     * const count = await prisma.loginLog.count({
     *   where: {
     *     // ... the filter for the LoginLogs we want to count
     *   }
     * })
    **/
    count<T extends LoginLogCountArgs>(
      args?: Subset<T, LoginLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginLogAggregateArgs>(args: Subset<T, LoginLogAggregateArgs>): Prisma.PrismaPromise<GetLoginLogAggregateType<T>>

    /**
     * Group by LoginLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoginLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginLogGroupByArgs['orderBy'] }
        : { orderBy?: LoginLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoginLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginLog model
   */
  readonly fields: LoginLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoginLog model
   */
  interface LoginLogFieldRefs {
    readonly id: FieldRef<"LoginLog", 'String'>
    readonly userId: FieldRef<"LoginLog", 'String'>
    readonly loginTime: FieldRef<"LoginLog", 'DateTime'>
    readonly ipAddress: FieldRef<"LoginLog", 'String'>
    readonly userAgent: FieldRef<"LoginLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LoginLog findUnique
   */
  export type LoginLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * Filter, which LoginLog to fetch.
     */
    where: LoginLogWhereUniqueInput
  }

  /**
   * LoginLog findUniqueOrThrow
   */
  export type LoginLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * Filter, which LoginLog to fetch.
     */
    where: LoginLogWhereUniqueInput
  }

  /**
   * LoginLog findFirst
   */
  export type LoginLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * Filter, which LoginLog to fetch.
     */
    where?: LoginLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginLogs to fetch.
     */
    orderBy?: LoginLogOrderByWithRelationInput | LoginLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginLogs.
     */
    cursor?: LoginLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginLogs.
     */
    distinct?: LoginLogScalarFieldEnum | LoginLogScalarFieldEnum[]
  }

  /**
   * LoginLog findFirstOrThrow
   */
  export type LoginLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * Filter, which LoginLog to fetch.
     */
    where?: LoginLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginLogs to fetch.
     */
    orderBy?: LoginLogOrderByWithRelationInput | LoginLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginLogs.
     */
    cursor?: LoginLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginLogs.
     */
    distinct?: LoginLogScalarFieldEnum | LoginLogScalarFieldEnum[]
  }

  /**
   * LoginLog findMany
   */
  export type LoginLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * Filter, which LoginLogs to fetch.
     */
    where?: LoginLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginLogs to fetch.
     */
    orderBy?: LoginLogOrderByWithRelationInput | LoginLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginLogs.
     */
    cursor?: LoginLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginLogs.
     */
    skip?: number
    distinct?: LoginLogScalarFieldEnum | LoginLogScalarFieldEnum[]
  }

  /**
   * LoginLog create
   */
  export type LoginLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * The data needed to create a LoginLog.
     */
    data: XOR<LoginLogCreateInput, LoginLogUncheckedCreateInput>
  }

  /**
   * LoginLog createMany
   */
  export type LoginLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginLogs.
     */
    data: LoginLogCreateManyInput | LoginLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoginLog createManyAndReturn
   */
  export type LoginLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * The data used to create many LoginLogs.
     */
    data: LoginLogCreateManyInput | LoginLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginLog update
   */
  export type LoginLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * The data needed to update a LoginLog.
     */
    data: XOR<LoginLogUpdateInput, LoginLogUncheckedUpdateInput>
    /**
     * Choose, which LoginLog to update.
     */
    where: LoginLogWhereUniqueInput
  }

  /**
   * LoginLog updateMany
   */
  export type LoginLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginLogs.
     */
    data: XOR<LoginLogUpdateManyMutationInput, LoginLogUncheckedUpdateManyInput>
    /**
     * Filter which LoginLogs to update
     */
    where?: LoginLogWhereInput
    /**
     * Limit how many LoginLogs to update.
     */
    limit?: number
  }

  /**
   * LoginLog updateManyAndReturn
   */
  export type LoginLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * The data used to update LoginLogs.
     */
    data: XOR<LoginLogUpdateManyMutationInput, LoginLogUncheckedUpdateManyInput>
    /**
     * Filter which LoginLogs to update
     */
    where?: LoginLogWhereInput
    /**
     * Limit how many LoginLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginLog upsert
   */
  export type LoginLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * The filter to search for the LoginLog to update in case it exists.
     */
    where: LoginLogWhereUniqueInput
    /**
     * In case the LoginLog found by the `where` argument doesn't exist, create a new LoginLog with this data.
     */
    create: XOR<LoginLogCreateInput, LoginLogUncheckedCreateInput>
    /**
     * In case the LoginLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginLogUpdateInput, LoginLogUncheckedUpdateInput>
  }

  /**
   * LoginLog delete
   */
  export type LoginLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
    /**
     * Filter which LoginLog to delete.
     */
    where: LoginLogWhereUniqueInput
  }

  /**
   * LoginLog deleteMany
   */
  export type LoginLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginLogs to delete
     */
    where?: LoginLogWhereInput
    /**
     * Limit how many LoginLogs to delete.
     */
    limit?: number
  }

  /**
   * LoginLog without action
   */
  export type LoginLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginLog
     */
    select?: LoginLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginLog
     */
    omit?: LoginLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginLogInclude<ExtArgs> | null
  }


  /**
   * Model VerificationCode
   */

  export type AggregateVerificationCode = {
    _count: VerificationCodeCountAggregateOutputType | null
    _min: VerificationCodeMinAggregateOutputType | null
    _max: VerificationCodeMaxAggregateOutputType | null
  }

  export type VerificationCodeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    code: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type VerificationCodeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    code: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type VerificationCodeCountAggregateOutputType = {
    id: number
    userId: number
    code: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type VerificationCodeMinAggregateInputType = {
    id?: true
    userId?: true
    code?: true
    createdAt?: true
    expiresAt?: true
  }

  export type VerificationCodeMaxAggregateInputType = {
    id?: true
    userId?: true
    code?: true
    createdAt?: true
    expiresAt?: true
  }

  export type VerificationCodeCountAggregateInputType = {
    id?: true
    userId?: true
    code?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type VerificationCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationCode to aggregate.
     */
    where?: VerificationCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationCodes to fetch.
     */
    orderBy?: VerificationCodeOrderByWithRelationInput | VerificationCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationCodes
    **/
    _count?: true | VerificationCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationCodeMaxAggregateInputType
  }

  export type GetVerificationCodeAggregateType<T extends VerificationCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationCode[P]>
      : GetScalarType<T[P], AggregateVerificationCode[P]>
  }




  export type VerificationCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationCodeWhereInput
    orderBy?: VerificationCodeOrderByWithAggregationInput | VerificationCodeOrderByWithAggregationInput[]
    by: VerificationCodeScalarFieldEnum[] | VerificationCodeScalarFieldEnum
    having?: VerificationCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCodeCountAggregateInputType | true
    _min?: VerificationCodeMinAggregateInputType
    _max?: VerificationCodeMaxAggregateInputType
  }

  export type VerificationCodeGroupByOutputType = {
    id: string
    userId: string
    code: string
    createdAt: Date
    expiresAt: Date
    _count: VerificationCodeCountAggregateOutputType | null
    _min: VerificationCodeMinAggregateOutputType | null
    _max: VerificationCodeMaxAggregateOutputType | null
  }

  type GetVerificationCodeGroupByPayload<T extends VerificationCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationCodeGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationCodeGroupByOutputType[P]>
        }
      >
    >


  export type VerificationCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    code?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["verificationCode"]>

  export type VerificationCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    code?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["verificationCode"]>

  export type VerificationCodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    code?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["verificationCode"]>

  export type VerificationCodeSelectScalar = {
    id?: boolean
    userId?: boolean
    code?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type VerificationCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "code" | "createdAt" | "expiresAt", ExtArgs["result"]["verificationCode"]>
  export type VerificationCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VerificationCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VerificationCodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $VerificationCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationCode"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      code: string
      createdAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["verificationCode"]>
    composites: {}
  }

  type VerificationCodeGetPayload<S extends boolean | null | undefined | VerificationCodeDefaultArgs> = $Result.GetResult<Prisma.$VerificationCodePayload, S>

  type VerificationCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCodeCountAggregateInputType | true
    }

  export interface VerificationCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationCode'], meta: { name: 'VerificationCode' } }
    /**
     * Find zero or one VerificationCode that matches the filter.
     * @param {VerificationCodeFindUniqueArgs} args - Arguments to find a VerificationCode
     * @example
     * // Get one VerificationCode
     * const verificationCode = await prisma.verificationCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationCodeFindUniqueArgs>(args: SelectSubset<T, VerificationCodeFindUniqueArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationCodeFindUniqueOrThrowArgs} args - Arguments to find a VerificationCode
     * @example
     * // Get one VerificationCode
     * const verificationCode = await prisma.verificationCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCodeFindFirstArgs} args - Arguments to find a VerificationCode
     * @example
     * // Get one VerificationCode
     * const verificationCode = await prisma.verificationCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationCodeFindFirstArgs>(args?: SelectSubset<T, VerificationCodeFindFirstArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCodeFindFirstOrThrowArgs} args - Arguments to find a VerificationCode
     * @example
     * // Get one VerificationCode
     * const verificationCode = await prisma.verificationCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationCodes
     * const verificationCodes = await prisma.verificationCode.findMany()
     * 
     * // Get first 10 VerificationCodes
     * const verificationCodes = await prisma.verificationCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationCodeWithIdOnly = await prisma.verificationCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationCodeFindManyArgs>(args?: SelectSubset<T, VerificationCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationCode.
     * @param {VerificationCodeCreateArgs} args - Arguments to create a VerificationCode.
     * @example
     * // Create one VerificationCode
     * const VerificationCode = await prisma.verificationCode.create({
     *   data: {
     *     // ... data to create a VerificationCode
     *   }
     * })
     * 
     */
    create<T extends VerificationCodeCreateArgs>(args: SelectSubset<T, VerificationCodeCreateArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationCodes.
     * @param {VerificationCodeCreateManyArgs} args - Arguments to create many VerificationCodes.
     * @example
     * // Create many VerificationCodes
     * const verificationCode = await prisma.verificationCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCodeCreateManyArgs>(args?: SelectSubset<T, VerificationCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationCodes and returns the data saved in the database.
     * @param {VerificationCodeCreateManyAndReturnArgs} args - Arguments to create many VerificationCodes.
     * @example
     * // Create many VerificationCodes
     * const verificationCode = await prisma.verificationCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationCodes and only return the `id`
     * const verificationCodeWithIdOnly = await prisma.verificationCode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationCode.
     * @param {VerificationCodeDeleteArgs} args - Arguments to delete one VerificationCode.
     * @example
     * // Delete one VerificationCode
     * const VerificationCode = await prisma.verificationCode.delete({
     *   where: {
     *     // ... filter to delete one VerificationCode
     *   }
     * })
     * 
     */
    delete<T extends VerificationCodeDeleteArgs>(args: SelectSubset<T, VerificationCodeDeleteArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationCode.
     * @param {VerificationCodeUpdateArgs} args - Arguments to update one VerificationCode.
     * @example
     * // Update one VerificationCode
     * const verificationCode = await prisma.verificationCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationCodeUpdateArgs>(args: SelectSubset<T, VerificationCodeUpdateArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationCodes.
     * @param {VerificationCodeDeleteManyArgs} args - Arguments to filter VerificationCodes to delete.
     * @example
     * // Delete a few VerificationCodes
     * const { count } = await prisma.verificationCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationCodeDeleteManyArgs>(args?: SelectSubset<T, VerificationCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationCodes
     * const verificationCode = await prisma.verificationCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationCodeUpdateManyArgs>(args: SelectSubset<T, VerificationCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationCodes and returns the data updated in the database.
     * @param {VerificationCodeUpdateManyAndReturnArgs} args - Arguments to update many VerificationCodes.
     * @example
     * // Update many VerificationCodes
     * const verificationCode = await prisma.verificationCode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationCodes and only return the `id`
     * const verificationCodeWithIdOnly = await prisma.verificationCode.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationCodeUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationCode.
     * @param {VerificationCodeUpsertArgs} args - Arguments to update or create a VerificationCode.
     * @example
     * // Update or create a VerificationCode
     * const verificationCode = await prisma.verificationCode.upsert({
     *   create: {
     *     // ... data to create a VerificationCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationCode we want to update
     *   }
     * })
     */
    upsert<T extends VerificationCodeUpsertArgs>(args: SelectSubset<T, VerificationCodeUpsertArgs<ExtArgs>>): Prisma__VerificationCodeClient<$Result.GetResult<Prisma.$VerificationCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCodeCountArgs} args - Arguments to filter VerificationCodes to count.
     * @example
     * // Count the number of VerificationCodes
     * const count = await prisma.verificationCode.count({
     *   where: {
     *     // ... the filter for the VerificationCodes we want to count
     *   }
     * })
    **/
    count<T extends VerificationCodeCountArgs>(
      args?: Subset<T, VerificationCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationCodeAggregateArgs>(args: Subset<T, VerificationCodeAggregateArgs>): Prisma.PrismaPromise<GetVerificationCodeAggregateType<T>>

    /**
     * Group by VerificationCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationCodeGroupByArgs['orderBy'] }
        : { orderBy?: VerificationCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationCode model
   */
  readonly fields: VerificationCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationCode model
   */
  interface VerificationCodeFieldRefs {
    readonly id: FieldRef<"VerificationCode", 'String'>
    readonly userId: FieldRef<"VerificationCode", 'String'>
    readonly code: FieldRef<"VerificationCode", 'String'>
    readonly createdAt: FieldRef<"VerificationCode", 'DateTime'>
    readonly expiresAt: FieldRef<"VerificationCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationCode findUnique
   */
  export type VerificationCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * Filter, which VerificationCode to fetch.
     */
    where: VerificationCodeWhereUniqueInput
  }

  /**
   * VerificationCode findUniqueOrThrow
   */
  export type VerificationCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * Filter, which VerificationCode to fetch.
     */
    where: VerificationCodeWhereUniqueInput
  }

  /**
   * VerificationCode findFirst
   */
  export type VerificationCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * Filter, which VerificationCode to fetch.
     */
    where?: VerificationCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationCodes to fetch.
     */
    orderBy?: VerificationCodeOrderByWithRelationInput | VerificationCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationCodes.
     */
    cursor?: VerificationCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationCodes.
     */
    distinct?: VerificationCodeScalarFieldEnum | VerificationCodeScalarFieldEnum[]
  }

  /**
   * VerificationCode findFirstOrThrow
   */
  export type VerificationCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * Filter, which VerificationCode to fetch.
     */
    where?: VerificationCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationCodes to fetch.
     */
    orderBy?: VerificationCodeOrderByWithRelationInput | VerificationCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationCodes.
     */
    cursor?: VerificationCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationCodes.
     */
    distinct?: VerificationCodeScalarFieldEnum | VerificationCodeScalarFieldEnum[]
  }

  /**
   * VerificationCode findMany
   */
  export type VerificationCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * Filter, which VerificationCodes to fetch.
     */
    where?: VerificationCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationCodes to fetch.
     */
    orderBy?: VerificationCodeOrderByWithRelationInput | VerificationCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationCodes.
     */
    cursor?: VerificationCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationCodes.
     */
    skip?: number
    distinct?: VerificationCodeScalarFieldEnum | VerificationCodeScalarFieldEnum[]
  }

  /**
   * VerificationCode create
   */
  export type VerificationCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a VerificationCode.
     */
    data: XOR<VerificationCodeCreateInput, VerificationCodeUncheckedCreateInput>
  }

  /**
   * VerificationCode createMany
   */
  export type VerificationCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationCodes.
     */
    data: VerificationCodeCreateManyInput | VerificationCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationCode createManyAndReturn
   */
  export type VerificationCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationCodes.
     */
    data: VerificationCodeCreateManyInput | VerificationCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VerificationCode update
   */
  export type VerificationCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a VerificationCode.
     */
    data: XOR<VerificationCodeUpdateInput, VerificationCodeUncheckedUpdateInput>
    /**
     * Choose, which VerificationCode to update.
     */
    where: VerificationCodeWhereUniqueInput
  }

  /**
   * VerificationCode updateMany
   */
  export type VerificationCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationCodes.
     */
    data: XOR<VerificationCodeUpdateManyMutationInput, VerificationCodeUncheckedUpdateManyInput>
    /**
     * Filter which VerificationCodes to update
     */
    where?: VerificationCodeWhereInput
    /**
     * Limit how many VerificationCodes to update.
     */
    limit?: number
  }

  /**
   * VerificationCode updateManyAndReturn
   */
  export type VerificationCodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * The data used to update VerificationCodes.
     */
    data: XOR<VerificationCodeUpdateManyMutationInput, VerificationCodeUncheckedUpdateManyInput>
    /**
     * Filter which VerificationCodes to update
     */
    where?: VerificationCodeWhereInput
    /**
     * Limit how many VerificationCodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VerificationCode upsert
   */
  export type VerificationCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the VerificationCode to update in case it exists.
     */
    where: VerificationCodeWhereUniqueInput
    /**
     * In case the VerificationCode found by the `where` argument doesn't exist, create a new VerificationCode with this data.
     */
    create: XOR<VerificationCodeCreateInput, VerificationCodeUncheckedCreateInput>
    /**
     * In case the VerificationCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationCodeUpdateInput, VerificationCodeUncheckedUpdateInput>
  }

  /**
   * VerificationCode delete
   */
  export type VerificationCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
    /**
     * Filter which VerificationCode to delete.
     */
    where: VerificationCodeWhereUniqueInput
  }

  /**
   * VerificationCode deleteMany
   */
  export type VerificationCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationCodes to delete
     */
    where?: VerificationCodeWhereInput
    /**
     * Limit how many VerificationCodes to delete.
     */
    limit?: number
  }

  /**
   * VerificationCode without action
   */
  export type VerificationCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationCode
     */
    select?: VerificationCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationCode
     */
    omit?: VerificationCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationCodeInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: string | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: string | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    status: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    name: string
    description: string | null
    status: string | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    users?: boolean | Role$usersArgs<ExtArgs>
    rolePermissions?: boolean | Role$rolePermissionsArgs<ExtArgs>
    roleMenus?: boolean | Role$roleMenusArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "status" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Role$usersArgs<ExtArgs>
    rolePermissions?: boolean | Role$rolePermissionsArgs<ExtArgs>
    roleMenus?: boolean | Role$roleMenusArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      rolePermissions: Prisma.$RolePermissionPayload<ExtArgs>[]
      roleMenus: Prisma.$RoleMenuPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      status: string | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Role$usersArgs<ExtArgs> = {}>(args?: Subset<T, Role$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    rolePermissions<T extends Role$rolePermissionsArgs<ExtArgs> = {}>(args?: Subset<T, Role$rolePermissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    roleMenus<T extends Role$roleMenusArgs<ExtArgs> = {}>(args?: Subset<T, Role$roleMenusArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly name: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
    readonly status: FieldRef<"Role", 'String'>
    readonly createdBy: FieldRef<"Role", 'String'>
    readonly updatedBy: FieldRef<"Role", 'String'>
    readonly createdAt: FieldRef<"Role", 'DateTime'>
    readonly updatedAt: FieldRef<"Role", 'DateTime'>
    readonly deletedAt: FieldRef<"Role", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.users
   */
  export type Role$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Role.rolePermissions
   */
  export type Role$rolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * Role.roleMenus
   */
  export type Role$roleMenusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    where?: RoleMenuWhereInput
    orderBy?: RoleMenuOrderByWithRelationInput | RoleMenuOrderByWithRelationInput[]
    cursor?: RoleMenuWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleMenuScalarFieldEnum | RoleMenuScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  export type PermissionMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    groupName: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PermissionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    groupName: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PermissionCountAggregateOutputType = {
    id: number
    name: number
    description: number
    groupName: number
    status: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type PermissionMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    groupName?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PermissionMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    groupName?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PermissionCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    groupName?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Permissions
    **/
    _count?: true | PermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionMaxAggregateInputType
  }

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
        [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>
  }




  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[]
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum
    having?: PermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionCountAggregateInputType | true
    _min?: PermissionMinAggregateInputType
    _max?: PermissionMaxAggregateInputType
  }

  export type PermissionGroupByOutputType = {
    id: string
    name: string
    description: string | null
    groupName: string | null
    status: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: PermissionCountAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
        }
      >
    >


  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    groupName?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    rolePermissions?: boolean | Permission$rolePermissionsArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    groupName?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    groupName?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    groupName?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type PermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "groupName" | "status" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["permission"]>
  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePermissions?: boolean | Permission$rolePermissionsArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Permission"
    objects: {
      rolePermissions: Prisma.$RolePermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      groupName: string | null
      status: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["permission"]>
    composites: {}
  }

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<Prisma.$PermissionPayload, S>

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PermissionCountAggregateInputType | true
    }

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission'], meta: { name: 'Permission' } }
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionFindUniqueArgs>(args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Permission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionFindFirstArgs>(args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionWithIdOnly = await prisma.permission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PermissionFindManyArgs>(args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     * 
     */
    create<T extends PermissionCreateArgs>(args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Permissions.
     * @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PermissionCreateManyArgs>(args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {PermissionCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, PermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     * 
     */
    delete<T extends PermissionDeleteArgs>(args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PermissionUpdateArgs>(args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PermissionDeleteManyArgs>(args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PermissionUpdateManyArgs>(args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions and returns the data updated in the database.
     * @param {PermissionUpdateManyAndReturnArgs} args - Arguments to update many Permissions.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, PermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     */
    upsert<T extends PermissionUpsertArgs>(args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PermissionAggregateArgs>(args: Subset<T, PermissionAggregateArgs>): Prisma.PrismaPromise<GetPermissionAggregateType<T>>

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Permission model
   */
  readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rolePermissions<T extends Permission$rolePermissionsArgs<ExtArgs> = {}>(args?: Subset<T, Permission$rolePermissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Permission model
   */
  interface PermissionFieldRefs {
    readonly id: FieldRef<"Permission", 'String'>
    readonly name: FieldRef<"Permission", 'String'>
    readonly description: FieldRef<"Permission", 'String'>
    readonly groupName: FieldRef<"Permission", 'String'>
    readonly status: FieldRef<"Permission", 'String'>
    readonly createdAt: FieldRef<"Permission", 'DateTime'>
    readonly updatedAt: FieldRef<"Permission", 'DateTime'>
    readonly deletedAt: FieldRef<"Permission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
  }

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission createManyAndReturn
   */
  export type PermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission updateManyAndReturn
   */
  export type PermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
  }

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to delete.
     */
    limit?: number
  }

  /**
   * Permission.rolePermissions
   */
  export type Permission$rolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
  }


  /**
   * Model RolePermission
   */

  export type AggregateRolePermission = {
    _count: RolePermissionCountAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  export type RolePermissionMinAggregateOutputType = {
    roleId: string | null
    permissionId: string | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type RolePermissionMaxAggregateOutputType = {
    roleId: string | null
    permissionId: string | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type RolePermissionCountAggregateOutputType = {
    roleId: number
    permissionId: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type RolePermissionMinAggregateInputType = {
    roleId?: true
    permissionId?: true
    createdAt?: true
    deletedAt?: true
  }

  export type RolePermissionMaxAggregateInputType = {
    roleId?: true
    permissionId?: true
    createdAt?: true
    deletedAt?: true
  }

  export type RolePermissionCountAggregateInputType = {
    roleId?: true
    permissionId?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type RolePermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermission to aggregate.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RolePermissions
    **/
    _count?: true | RolePermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolePermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolePermissionMaxAggregateInputType
  }

  export type GetRolePermissionAggregateType<T extends RolePermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateRolePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRolePermission[P]>
      : GetScalarType<T[P], AggregateRolePermission[P]>
  }




  export type RolePermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithAggregationInput | RolePermissionOrderByWithAggregationInput[]
    by: RolePermissionScalarFieldEnum[] | RolePermissionScalarFieldEnum
    having?: RolePermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolePermissionCountAggregateInputType | true
    _min?: RolePermissionMinAggregateInputType
    _max?: RolePermissionMaxAggregateInputType
  }

  export type RolePermissionGroupByOutputType = {
    roleId: string
    permissionId: string
    createdAt: Date
    deletedAt: Date | null
    _count: RolePermissionCountAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  type GetRolePermissionGroupByPayload<T extends RolePermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolePermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolePermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
            : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
        }
      >
    >


  export type RolePermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    permissionId?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    permissionId?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    permissionId?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectScalar = {
    roleId?: boolean
    permissionId?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type RolePermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"roleId" | "permissionId" | "createdAt" | "deletedAt", ExtArgs["result"]["rolePermission"]>
  export type RolePermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }

  export type $RolePermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RolePermission"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      permission: Prisma.$PermissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      roleId: string
      permissionId: string
      createdAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["rolePermission"]>
    composites: {}
  }

  type RolePermissionGetPayload<S extends boolean | null | undefined | RolePermissionDefaultArgs> = $Result.GetResult<Prisma.$RolePermissionPayload, S>

  type RolePermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RolePermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolePermissionCountAggregateInputType | true
    }

  export interface RolePermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RolePermission'], meta: { name: 'RolePermission' } }
    /**
     * Find zero or one RolePermission that matches the filter.
     * @param {RolePermissionFindUniqueArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RolePermissionFindUniqueArgs>(args: SelectSubset<T, RolePermissionFindUniqueArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RolePermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RolePermissionFindUniqueOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RolePermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, RolePermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RolePermissionFindFirstArgs>(args?: SelectSubset<T, RolePermissionFindFirstArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RolePermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, RolePermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RolePermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany()
     * 
     * // Get first 10 RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany({ take: 10 })
     * 
     * // Only select the `roleId`
     * const rolePermissionWithRoleIdOnly = await prisma.rolePermission.findMany({ select: { roleId: true } })
     * 
     */
    findMany<T extends RolePermissionFindManyArgs>(args?: SelectSubset<T, RolePermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RolePermission.
     * @param {RolePermissionCreateArgs} args - Arguments to create a RolePermission.
     * @example
     * // Create one RolePermission
     * const RolePermission = await prisma.rolePermission.create({
     *   data: {
     *     // ... data to create a RolePermission
     *   }
     * })
     * 
     */
    create<T extends RolePermissionCreateArgs>(args: SelectSubset<T, RolePermissionCreateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RolePermissions.
     * @param {RolePermissionCreateManyArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RolePermissionCreateManyArgs>(args?: SelectSubset<T, RolePermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RolePermissions and returns the data saved in the database.
     * @param {RolePermissionCreateManyAndReturnArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RolePermissions and only return the `roleId`
     * const rolePermissionWithRoleIdOnly = await prisma.rolePermission.createManyAndReturn({
     *   select: { roleId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RolePermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, RolePermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RolePermission.
     * @param {RolePermissionDeleteArgs} args - Arguments to delete one RolePermission.
     * @example
     * // Delete one RolePermission
     * const RolePermission = await prisma.rolePermission.delete({
     *   where: {
     *     // ... filter to delete one RolePermission
     *   }
     * })
     * 
     */
    delete<T extends RolePermissionDeleteArgs>(args: SelectSubset<T, RolePermissionDeleteArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RolePermission.
     * @param {RolePermissionUpdateArgs} args - Arguments to update one RolePermission.
     * @example
     * // Update one RolePermission
     * const rolePermission = await prisma.rolePermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RolePermissionUpdateArgs>(args: SelectSubset<T, RolePermissionUpdateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RolePermissions.
     * @param {RolePermissionDeleteManyArgs} args - Arguments to filter RolePermissions to delete.
     * @example
     * // Delete a few RolePermissions
     * const { count } = await prisma.rolePermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RolePermissionDeleteManyArgs>(args?: SelectSubset<T, RolePermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RolePermissionUpdateManyArgs>(args: SelectSubset<T, RolePermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions and returns the data updated in the database.
     * @param {RolePermissionUpdateManyAndReturnArgs} args - Arguments to update many RolePermissions.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RolePermissions and only return the `roleId`
     * const rolePermissionWithRoleIdOnly = await prisma.rolePermission.updateManyAndReturn({
     *   select: { roleId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RolePermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, RolePermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RolePermission.
     * @param {RolePermissionUpsertArgs} args - Arguments to update or create a RolePermission.
     * @example
     * // Update or create a RolePermission
     * const rolePermission = await prisma.rolePermission.upsert({
     *   create: {
     *     // ... data to create a RolePermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RolePermission we want to update
     *   }
     * })
     */
    upsert<T extends RolePermissionUpsertArgs>(args: SelectSubset<T, RolePermissionUpsertArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionCountArgs} args - Arguments to filter RolePermissions to count.
     * @example
     * // Count the number of RolePermissions
     * const count = await prisma.rolePermission.count({
     *   where: {
     *     // ... the filter for the RolePermissions we want to count
     *   }
     * })
    **/
    count<T extends RolePermissionCountArgs>(
      args?: Subset<T, RolePermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolePermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolePermissionAggregateArgs>(args: Subset<T, RolePermissionAggregateArgs>): Prisma.PrismaPromise<GetRolePermissionAggregateType<T>>

    /**
     * Group by RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RolePermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RolePermissionGroupByArgs['orderBy'] }
        : { orderBy?: RolePermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RolePermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolePermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RolePermission model
   */
  readonly fields: RolePermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RolePermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RolePermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    permission<T extends PermissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PermissionDefaultArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RolePermission model
   */
  interface RolePermissionFieldRefs {
    readonly roleId: FieldRef<"RolePermission", 'String'>
    readonly permissionId: FieldRef<"RolePermission", 'String'>
    readonly createdAt: FieldRef<"RolePermission", 'DateTime'>
    readonly deletedAt: FieldRef<"RolePermission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RolePermission findUnique
   */
  export type RolePermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findUniqueOrThrow
   */
  export type RolePermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findFirst
   */
  export type RolePermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findFirstOrThrow
   */
  export type RolePermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findMany
   */
  export type RolePermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermissions to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission create
   */
  export type RolePermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a RolePermission.
     */
    data: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
  }

  /**
   * RolePermission createMany
   */
  export type RolePermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RolePermission createManyAndReturn
   */
  export type RolePermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission update
   */
  export type RolePermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a RolePermission.
     */
    data: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
    /**
     * Choose, which RolePermission to update.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission updateMany
   */
  export type RolePermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
  }

  /**
   * RolePermission updateManyAndReturn
   */
  export type RolePermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission upsert
   */
  export type RolePermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the RolePermission to update in case it exists.
     */
    where: RolePermissionWhereUniqueInput
    /**
     * In case the RolePermission found by the `where` argument doesn't exist, create a new RolePermission with this data.
     */
    create: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
    /**
     * In case the RolePermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
  }

  /**
   * RolePermission delete
   */
  export type RolePermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter which RolePermission to delete.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission deleteMany
   */
  export type RolePermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermissions to delete
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to delete.
     */
    limit?: number
  }

  /**
   * RolePermission without action
   */
  export type RolePermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
  }


  /**
   * Model Menu
   */

  export type AggregateMenu = {
    _count: MenuCountAggregateOutputType | null
    _avg: MenuAvgAggregateOutputType | null
    _sum: MenuSumAggregateOutputType | null
    _min: MenuMinAggregateOutputType | null
    _max: MenuMaxAggregateOutputType | null
  }

  export type MenuAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type MenuSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type MenuMinAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    parentId: string | null
    sortOrder: number | null
    icon: string | null
    description: string | null
    component: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type MenuMaxAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    parentId: string | null
    sortOrder: number | null
    icon: string | null
    description: string | null
    component: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type MenuCountAggregateOutputType = {
    id: number
    name: number
    url: number
    parentId: number
    sortOrder: number
    icon: number
    description: number
    component: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type MenuAvgAggregateInputType = {
    sortOrder?: true
  }

  export type MenuSumAggregateInputType = {
    sortOrder?: true
  }

  export type MenuMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
    parentId?: true
    sortOrder?: true
    icon?: true
    description?: true
    component?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type MenuMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
    parentId?: true
    sortOrder?: true
    icon?: true
    description?: true
    component?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type MenuCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    parentId?: true
    sortOrder?: true
    icon?: true
    description?: true
    component?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type MenuAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Menu to aggregate.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Menus
    **/
    _count?: true | MenuCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MenuAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MenuSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MenuMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MenuMaxAggregateInputType
  }

  export type GetMenuAggregateType<T extends MenuAggregateArgs> = {
        [P in keyof T & keyof AggregateMenu]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMenu[P]>
      : GetScalarType<T[P], AggregateMenu[P]>
  }




  export type MenuGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MenuWhereInput
    orderBy?: MenuOrderByWithAggregationInput | MenuOrderByWithAggregationInput[]
    by: MenuScalarFieldEnum[] | MenuScalarFieldEnum
    having?: MenuScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MenuCountAggregateInputType | true
    _avg?: MenuAvgAggregateInputType
    _sum?: MenuSumAggregateInputType
    _min?: MenuMinAggregateInputType
    _max?: MenuMaxAggregateInputType
  }

  export type MenuGroupByOutputType = {
    id: string
    name: string
    url: string | null
    parentId: string | null
    sortOrder: number | null
    icon: string | null
    description: string | null
    component: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: MenuCountAggregateOutputType | null
    _avg: MenuAvgAggregateOutputType | null
    _sum: MenuSumAggregateOutputType | null
    _min: MenuMinAggregateOutputType | null
    _max: MenuMaxAggregateOutputType | null
  }

  type GetMenuGroupByPayload<T extends MenuGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MenuGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MenuGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MenuGroupByOutputType[P]>
            : GetScalarType<T[P], MenuGroupByOutputType[P]>
        }
      >
    >


  export type MenuSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    parentId?: boolean
    sortOrder?: boolean
    icon?: boolean
    description?: boolean
    component?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    parent?: boolean | Menu$parentArgs<ExtArgs>
    children?: boolean | Menu$childrenArgs<ExtArgs>
    roleMenus?: boolean | Menu$roleMenusArgs<ExtArgs>
    _count?: boolean | MenuCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["menu"]>

  export type MenuSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    parentId?: boolean
    sortOrder?: boolean
    icon?: boolean
    description?: boolean
    component?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    parent?: boolean | Menu$parentArgs<ExtArgs>
  }, ExtArgs["result"]["menu"]>

  export type MenuSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    parentId?: boolean
    sortOrder?: boolean
    icon?: boolean
    description?: boolean
    component?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    parent?: boolean | Menu$parentArgs<ExtArgs>
  }, ExtArgs["result"]["menu"]>

  export type MenuSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
    parentId?: boolean
    sortOrder?: boolean
    icon?: boolean
    description?: boolean
    component?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type MenuOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "url" | "parentId" | "sortOrder" | "icon" | "description" | "component" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["menu"]>
  export type MenuInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Menu$parentArgs<ExtArgs>
    children?: boolean | Menu$childrenArgs<ExtArgs>
    roleMenus?: boolean | Menu$roleMenusArgs<ExtArgs>
    _count?: boolean | MenuCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MenuIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Menu$parentArgs<ExtArgs>
  }
  export type MenuIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Menu$parentArgs<ExtArgs>
  }

  export type $MenuPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Menu"
    objects: {
      parent: Prisma.$MenuPayload<ExtArgs> | null
      children: Prisma.$MenuPayload<ExtArgs>[]
      roleMenus: Prisma.$RoleMenuPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      url: string | null
      parentId: string | null
      sortOrder: number | null
      icon: string | null
      description: string | null
      component: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["menu"]>
    composites: {}
  }

  type MenuGetPayload<S extends boolean | null | undefined | MenuDefaultArgs> = $Result.GetResult<Prisma.$MenuPayload, S>

  type MenuCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MenuFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MenuCountAggregateInputType | true
    }

  export interface MenuDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Menu'], meta: { name: 'Menu' } }
    /**
     * Find zero or one Menu that matches the filter.
     * @param {MenuFindUniqueArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MenuFindUniqueArgs>(args: SelectSubset<T, MenuFindUniqueArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Menu that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MenuFindUniqueOrThrowArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MenuFindUniqueOrThrowArgs>(args: SelectSubset<T, MenuFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Menu that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuFindFirstArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MenuFindFirstArgs>(args?: SelectSubset<T, MenuFindFirstArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Menu that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuFindFirstOrThrowArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MenuFindFirstOrThrowArgs>(args?: SelectSubset<T, MenuFindFirstOrThrowArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Menus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Menus
     * const menus = await prisma.menu.findMany()
     * 
     * // Get first 10 Menus
     * const menus = await prisma.menu.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const menuWithIdOnly = await prisma.menu.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MenuFindManyArgs>(args?: SelectSubset<T, MenuFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Menu.
     * @param {MenuCreateArgs} args - Arguments to create a Menu.
     * @example
     * // Create one Menu
     * const Menu = await prisma.menu.create({
     *   data: {
     *     // ... data to create a Menu
     *   }
     * })
     * 
     */
    create<T extends MenuCreateArgs>(args: SelectSubset<T, MenuCreateArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Menus.
     * @param {MenuCreateManyArgs} args - Arguments to create many Menus.
     * @example
     * // Create many Menus
     * const menu = await prisma.menu.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MenuCreateManyArgs>(args?: SelectSubset<T, MenuCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Menus and returns the data saved in the database.
     * @param {MenuCreateManyAndReturnArgs} args - Arguments to create many Menus.
     * @example
     * // Create many Menus
     * const menu = await prisma.menu.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Menus and only return the `id`
     * const menuWithIdOnly = await prisma.menu.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MenuCreateManyAndReturnArgs>(args?: SelectSubset<T, MenuCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Menu.
     * @param {MenuDeleteArgs} args - Arguments to delete one Menu.
     * @example
     * // Delete one Menu
     * const Menu = await prisma.menu.delete({
     *   where: {
     *     // ... filter to delete one Menu
     *   }
     * })
     * 
     */
    delete<T extends MenuDeleteArgs>(args: SelectSubset<T, MenuDeleteArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Menu.
     * @param {MenuUpdateArgs} args - Arguments to update one Menu.
     * @example
     * // Update one Menu
     * const menu = await prisma.menu.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MenuUpdateArgs>(args: SelectSubset<T, MenuUpdateArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Menus.
     * @param {MenuDeleteManyArgs} args - Arguments to filter Menus to delete.
     * @example
     * // Delete a few Menus
     * const { count } = await prisma.menu.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MenuDeleteManyArgs>(args?: SelectSubset<T, MenuDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Menus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Menus
     * const menu = await prisma.menu.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MenuUpdateManyArgs>(args: SelectSubset<T, MenuUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Menus and returns the data updated in the database.
     * @param {MenuUpdateManyAndReturnArgs} args - Arguments to update many Menus.
     * @example
     * // Update many Menus
     * const menu = await prisma.menu.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Menus and only return the `id`
     * const menuWithIdOnly = await prisma.menu.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MenuUpdateManyAndReturnArgs>(args: SelectSubset<T, MenuUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Menu.
     * @param {MenuUpsertArgs} args - Arguments to update or create a Menu.
     * @example
     * // Update or create a Menu
     * const menu = await prisma.menu.upsert({
     *   create: {
     *     // ... data to create a Menu
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Menu we want to update
     *   }
     * })
     */
    upsert<T extends MenuUpsertArgs>(args: SelectSubset<T, MenuUpsertArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Menus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCountArgs} args - Arguments to filter Menus to count.
     * @example
     * // Count the number of Menus
     * const count = await prisma.menu.count({
     *   where: {
     *     // ... the filter for the Menus we want to count
     *   }
     * })
    **/
    count<T extends MenuCountArgs>(
      args?: Subset<T, MenuCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MenuCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Menu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MenuAggregateArgs>(args: Subset<T, MenuAggregateArgs>): Prisma.PrismaPromise<GetMenuAggregateType<T>>

    /**
     * Group by Menu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MenuGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MenuGroupByArgs['orderBy'] }
        : { orderBy?: MenuGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MenuGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMenuGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Menu model
   */
  readonly fields: MenuFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Menu.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MenuClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends Menu$parentArgs<ExtArgs> = {}>(args?: Subset<T, Menu$parentArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends Menu$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Menu$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    roleMenus<T extends Menu$roleMenusArgs<ExtArgs> = {}>(args?: Subset<T, Menu$roleMenusArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Menu model
   */
  interface MenuFieldRefs {
    readonly id: FieldRef<"Menu", 'String'>
    readonly name: FieldRef<"Menu", 'String'>
    readonly url: FieldRef<"Menu", 'String'>
    readonly parentId: FieldRef<"Menu", 'String'>
    readonly sortOrder: FieldRef<"Menu", 'Int'>
    readonly icon: FieldRef<"Menu", 'String'>
    readonly description: FieldRef<"Menu", 'String'>
    readonly component: FieldRef<"Menu", 'String'>
    readonly createdAt: FieldRef<"Menu", 'DateTime'>
    readonly updatedAt: FieldRef<"Menu", 'DateTime'>
    readonly deletedAt: FieldRef<"Menu", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Menu findUnique
   */
  export type MenuFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu findUniqueOrThrow
   */
  export type MenuFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu findFirst
   */
  export type MenuFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Menus.
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Menus.
     */
    distinct?: MenuScalarFieldEnum | MenuScalarFieldEnum[]
  }

  /**
   * Menu findFirstOrThrow
   */
  export type MenuFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Menus.
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Menus.
     */
    distinct?: MenuScalarFieldEnum | MenuScalarFieldEnum[]
  }

  /**
   * Menu findMany
   */
  export type MenuFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menus to fetch.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Menus.
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    distinct?: MenuScalarFieldEnum | MenuScalarFieldEnum[]
  }

  /**
   * Menu create
   */
  export type MenuCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * The data needed to create a Menu.
     */
    data: XOR<MenuCreateInput, MenuUncheckedCreateInput>
  }

  /**
   * Menu createMany
   */
  export type MenuCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Menus.
     */
    data: MenuCreateManyInput | MenuCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Menu createManyAndReturn
   */
  export type MenuCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * The data used to create many Menus.
     */
    data: MenuCreateManyInput | MenuCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Menu update
   */
  export type MenuUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * The data needed to update a Menu.
     */
    data: XOR<MenuUpdateInput, MenuUncheckedUpdateInput>
    /**
     * Choose, which Menu to update.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu updateMany
   */
  export type MenuUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Menus.
     */
    data: XOR<MenuUpdateManyMutationInput, MenuUncheckedUpdateManyInput>
    /**
     * Filter which Menus to update
     */
    where?: MenuWhereInput
    /**
     * Limit how many Menus to update.
     */
    limit?: number
  }

  /**
   * Menu updateManyAndReturn
   */
  export type MenuUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * The data used to update Menus.
     */
    data: XOR<MenuUpdateManyMutationInput, MenuUncheckedUpdateManyInput>
    /**
     * Filter which Menus to update
     */
    where?: MenuWhereInput
    /**
     * Limit how many Menus to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Menu upsert
   */
  export type MenuUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * The filter to search for the Menu to update in case it exists.
     */
    where: MenuWhereUniqueInput
    /**
     * In case the Menu found by the `where` argument doesn't exist, create a new Menu with this data.
     */
    create: XOR<MenuCreateInput, MenuUncheckedCreateInput>
    /**
     * In case the Menu was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MenuUpdateInput, MenuUncheckedUpdateInput>
  }

  /**
   * Menu delete
   */
  export type MenuDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter which Menu to delete.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu deleteMany
   */
  export type MenuDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Menus to delete
     */
    where?: MenuWhereInput
    /**
     * Limit how many Menus to delete.
     */
    limit?: number
  }

  /**
   * Menu.parent
   */
  export type Menu$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    where?: MenuWhereInput
  }

  /**
   * Menu.children
   */
  export type Menu$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    where?: MenuWhereInput
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    cursor?: MenuWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MenuScalarFieldEnum | MenuScalarFieldEnum[]
  }

  /**
   * Menu.roleMenus
   */
  export type Menu$roleMenusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    where?: RoleMenuWhereInput
    orderBy?: RoleMenuOrderByWithRelationInput | RoleMenuOrderByWithRelationInput[]
    cursor?: RoleMenuWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleMenuScalarFieldEnum | RoleMenuScalarFieldEnum[]
  }

  /**
   * Menu without action
   */
  export type MenuDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
  }


  /**
   * Model RoleMenu
   */

  export type AggregateRoleMenu = {
    _count: RoleMenuCountAggregateOutputType | null
    _min: RoleMenuMinAggregateOutputType | null
    _max: RoleMenuMaxAggregateOutputType | null
  }

  export type RoleMenuMinAggregateOutputType = {
    roleId: string | null
    menuId: string | null
    createdAt: Date | null
  }

  export type RoleMenuMaxAggregateOutputType = {
    roleId: string | null
    menuId: string | null
    createdAt: Date | null
  }

  export type RoleMenuCountAggregateOutputType = {
    roleId: number
    menuId: number
    createdAt: number
    _all: number
  }


  export type RoleMenuMinAggregateInputType = {
    roleId?: true
    menuId?: true
    createdAt?: true
  }

  export type RoleMenuMaxAggregateInputType = {
    roleId?: true
    menuId?: true
    createdAt?: true
  }

  export type RoleMenuCountAggregateInputType = {
    roleId?: true
    menuId?: true
    createdAt?: true
    _all?: true
  }

  export type RoleMenuAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleMenu to aggregate.
     */
    where?: RoleMenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleMenus to fetch.
     */
    orderBy?: RoleMenuOrderByWithRelationInput | RoleMenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleMenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleMenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleMenus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoleMenus
    **/
    _count?: true | RoleMenuCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMenuMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMenuMaxAggregateInputType
  }

  export type GetRoleMenuAggregateType<T extends RoleMenuAggregateArgs> = {
        [P in keyof T & keyof AggregateRoleMenu]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoleMenu[P]>
      : GetScalarType<T[P], AggregateRoleMenu[P]>
  }




  export type RoleMenuGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleMenuWhereInput
    orderBy?: RoleMenuOrderByWithAggregationInput | RoleMenuOrderByWithAggregationInput[]
    by: RoleMenuScalarFieldEnum[] | RoleMenuScalarFieldEnum
    having?: RoleMenuScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleMenuCountAggregateInputType | true
    _min?: RoleMenuMinAggregateInputType
    _max?: RoleMenuMaxAggregateInputType
  }

  export type RoleMenuGroupByOutputType = {
    roleId: string
    menuId: string
    createdAt: Date
    _count: RoleMenuCountAggregateOutputType | null
    _min: RoleMenuMinAggregateOutputType | null
    _max: RoleMenuMaxAggregateOutputType | null
  }

  type GetRoleMenuGroupByPayload<T extends RoleMenuGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleMenuGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleMenuGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleMenuGroupByOutputType[P]>
            : GetScalarType<T[P], RoleMenuGroupByOutputType[P]>
        }
      >
    >


  export type RoleMenuSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    menuId?: boolean
    createdAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    menu?: boolean | MenuDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleMenu"]>

  export type RoleMenuSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    menuId?: boolean
    createdAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    menu?: boolean | MenuDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleMenu"]>

  export type RoleMenuSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    menuId?: boolean
    createdAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    menu?: boolean | MenuDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleMenu"]>

  export type RoleMenuSelectScalar = {
    roleId?: boolean
    menuId?: boolean
    createdAt?: boolean
  }

  export type RoleMenuOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"roleId" | "menuId" | "createdAt", ExtArgs["result"]["roleMenu"]>
  export type RoleMenuInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    menu?: boolean | MenuDefaultArgs<ExtArgs>
  }
  export type RoleMenuIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    menu?: boolean | MenuDefaultArgs<ExtArgs>
  }
  export type RoleMenuIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    menu?: boolean | MenuDefaultArgs<ExtArgs>
  }

  export type $RoleMenuPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoleMenu"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      menu: Prisma.$MenuPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      roleId: string
      menuId: string
      createdAt: Date
    }, ExtArgs["result"]["roleMenu"]>
    composites: {}
  }

  type RoleMenuGetPayload<S extends boolean | null | undefined | RoleMenuDefaultArgs> = $Result.GetResult<Prisma.$RoleMenuPayload, S>

  type RoleMenuCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleMenuFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleMenuCountAggregateInputType | true
    }

  export interface RoleMenuDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoleMenu'], meta: { name: 'RoleMenu' } }
    /**
     * Find zero or one RoleMenu that matches the filter.
     * @param {RoleMenuFindUniqueArgs} args - Arguments to find a RoleMenu
     * @example
     * // Get one RoleMenu
     * const roleMenu = await prisma.roleMenu.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleMenuFindUniqueArgs>(args: SelectSubset<T, RoleMenuFindUniqueArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoleMenu that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleMenuFindUniqueOrThrowArgs} args - Arguments to find a RoleMenu
     * @example
     * // Get one RoleMenu
     * const roleMenu = await prisma.roleMenu.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleMenuFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleMenuFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleMenu that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleMenuFindFirstArgs} args - Arguments to find a RoleMenu
     * @example
     * // Get one RoleMenu
     * const roleMenu = await prisma.roleMenu.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleMenuFindFirstArgs>(args?: SelectSubset<T, RoleMenuFindFirstArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleMenu that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleMenuFindFirstOrThrowArgs} args - Arguments to find a RoleMenu
     * @example
     * // Get one RoleMenu
     * const roleMenu = await prisma.roleMenu.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleMenuFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleMenuFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoleMenus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleMenuFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoleMenus
     * const roleMenus = await prisma.roleMenu.findMany()
     * 
     * // Get first 10 RoleMenus
     * const roleMenus = await prisma.roleMenu.findMany({ take: 10 })
     * 
     * // Only select the `roleId`
     * const roleMenuWithRoleIdOnly = await prisma.roleMenu.findMany({ select: { roleId: true } })
     * 
     */
    findMany<T extends RoleMenuFindManyArgs>(args?: SelectSubset<T, RoleMenuFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoleMenu.
     * @param {RoleMenuCreateArgs} args - Arguments to create a RoleMenu.
     * @example
     * // Create one RoleMenu
     * const RoleMenu = await prisma.roleMenu.create({
     *   data: {
     *     // ... data to create a RoleMenu
     *   }
     * })
     * 
     */
    create<T extends RoleMenuCreateArgs>(args: SelectSubset<T, RoleMenuCreateArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoleMenus.
     * @param {RoleMenuCreateManyArgs} args - Arguments to create many RoleMenus.
     * @example
     * // Create many RoleMenus
     * const roleMenu = await prisma.roleMenu.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleMenuCreateManyArgs>(args?: SelectSubset<T, RoleMenuCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoleMenus and returns the data saved in the database.
     * @param {RoleMenuCreateManyAndReturnArgs} args - Arguments to create many RoleMenus.
     * @example
     * // Create many RoleMenus
     * const roleMenu = await prisma.roleMenu.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoleMenus and only return the `roleId`
     * const roleMenuWithRoleIdOnly = await prisma.roleMenu.createManyAndReturn({
     *   select: { roleId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleMenuCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleMenuCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoleMenu.
     * @param {RoleMenuDeleteArgs} args - Arguments to delete one RoleMenu.
     * @example
     * // Delete one RoleMenu
     * const RoleMenu = await prisma.roleMenu.delete({
     *   where: {
     *     // ... filter to delete one RoleMenu
     *   }
     * })
     * 
     */
    delete<T extends RoleMenuDeleteArgs>(args: SelectSubset<T, RoleMenuDeleteArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoleMenu.
     * @param {RoleMenuUpdateArgs} args - Arguments to update one RoleMenu.
     * @example
     * // Update one RoleMenu
     * const roleMenu = await prisma.roleMenu.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleMenuUpdateArgs>(args: SelectSubset<T, RoleMenuUpdateArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoleMenus.
     * @param {RoleMenuDeleteManyArgs} args - Arguments to filter RoleMenus to delete.
     * @example
     * // Delete a few RoleMenus
     * const { count } = await prisma.roleMenu.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleMenuDeleteManyArgs>(args?: SelectSubset<T, RoleMenuDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleMenus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleMenuUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoleMenus
     * const roleMenu = await prisma.roleMenu.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleMenuUpdateManyArgs>(args: SelectSubset<T, RoleMenuUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleMenus and returns the data updated in the database.
     * @param {RoleMenuUpdateManyAndReturnArgs} args - Arguments to update many RoleMenus.
     * @example
     * // Update many RoleMenus
     * const roleMenu = await prisma.roleMenu.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoleMenus and only return the `roleId`
     * const roleMenuWithRoleIdOnly = await prisma.roleMenu.updateManyAndReturn({
     *   select: { roleId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleMenuUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleMenuUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoleMenu.
     * @param {RoleMenuUpsertArgs} args - Arguments to update or create a RoleMenu.
     * @example
     * // Update or create a RoleMenu
     * const roleMenu = await prisma.roleMenu.upsert({
     *   create: {
     *     // ... data to create a RoleMenu
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoleMenu we want to update
     *   }
     * })
     */
    upsert<T extends RoleMenuUpsertArgs>(args: SelectSubset<T, RoleMenuUpsertArgs<ExtArgs>>): Prisma__RoleMenuClient<$Result.GetResult<Prisma.$RoleMenuPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoleMenus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleMenuCountArgs} args - Arguments to filter RoleMenus to count.
     * @example
     * // Count the number of RoleMenus
     * const count = await prisma.roleMenu.count({
     *   where: {
     *     // ... the filter for the RoleMenus we want to count
     *   }
     * })
    **/
    count<T extends RoleMenuCountArgs>(
      args?: Subset<T, RoleMenuCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleMenuCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoleMenu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleMenuAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleMenuAggregateArgs>(args: Subset<T, RoleMenuAggregateArgs>): Prisma.PrismaPromise<GetRoleMenuAggregateType<T>>

    /**
     * Group by RoleMenu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleMenuGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleMenuGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleMenuGroupByArgs['orderBy'] }
        : { orderBy?: RoleMenuGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleMenuGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleMenuGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoleMenu model
   */
  readonly fields: RoleMenuFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoleMenu.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleMenuClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    menu<T extends MenuDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MenuDefaultArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoleMenu model
   */
  interface RoleMenuFieldRefs {
    readonly roleId: FieldRef<"RoleMenu", 'String'>
    readonly menuId: FieldRef<"RoleMenu", 'String'>
    readonly createdAt: FieldRef<"RoleMenu", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoleMenu findUnique
   */
  export type RoleMenuFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * Filter, which RoleMenu to fetch.
     */
    where: RoleMenuWhereUniqueInput
  }

  /**
   * RoleMenu findUniqueOrThrow
   */
  export type RoleMenuFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * Filter, which RoleMenu to fetch.
     */
    where: RoleMenuWhereUniqueInput
  }

  /**
   * RoleMenu findFirst
   */
  export type RoleMenuFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * Filter, which RoleMenu to fetch.
     */
    where?: RoleMenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleMenus to fetch.
     */
    orderBy?: RoleMenuOrderByWithRelationInput | RoleMenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleMenus.
     */
    cursor?: RoleMenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleMenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleMenus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleMenus.
     */
    distinct?: RoleMenuScalarFieldEnum | RoleMenuScalarFieldEnum[]
  }

  /**
   * RoleMenu findFirstOrThrow
   */
  export type RoleMenuFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * Filter, which RoleMenu to fetch.
     */
    where?: RoleMenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleMenus to fetch.
     */
    orderBy?: RoleMenuOrderByWithRelationInput | RoleMenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleMenus.
     */
    cursor?: RoleMenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleMenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleMenus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleMenus.
     */
    distinct?: RoleMenuScalarFieldEnum | RoleMenuScalarFieldEnum[]
  }

  /**
   * RoleMenu findMany
   */
  export type RoleMenuFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * Filter, which RoleMenus to fetch.
     */
    where?: RoleMenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleMenus to fetch.
     */
    orderBy?: RoleMenuOrderByWithRelationInput | RoleMenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoleMenus.
     */
    cursor?: RoleMenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleMenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleMenus.
     */
    skip?: number
    distinct?: RoleMenuScalarFieldEnum | RoleMenuScalarFieldEnum[]
  }

  /**
   * RoleMenu create
   */
  export type RoleMenuCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * The data needed to create a RoleMenu.
     */
    data: XOR<RoleMenuCreateInput, RoleMenuUncheckedCreateInput>
  }

  /**
   * RoleMenu createMany
   */
  export type RoleMenuCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoleMenus.
     */
    data: RoleMenuCreateManyInput | RoleMenuCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoleMenu createManyAndReturn
   */
  export type RoleMenuCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * The data used to create many RoleMenus.
     */
    data: RoleMenuCreateManyInput | RoleMenuCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleMenu update
   */
  export type RoleMenuUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * The data needed to update a RoleMenu.
     */
    data: XOR<RoleMenuUpdateInput, RoleMenuUncheckedUpdateInput>
    /**
     * Choose, which RoleMenu to update.
     */
    where: RoleMenuWhereUniqueInput
  }

  /**
   * RoleMenu updateMany
   */
  export type RoleMenuUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoleMenus.
     */
    data: XOR<RoleMenuUpdateManyMutationInput, RoleMenuUncheckedUpdateManyInput>
    /**
     * Filter which RoleMenus to update
     */
    where?: RoleMenuWhereInput
    /**
     * Limit how many RoleMenus to update.
     */
    limit?: number
  }

  /**
   * RoleMenu updateManyAndReturn
   */
  export type RoleMenuUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * The data used to update RoleMenus.
     */
    data: XOR<RoleMenuUpdateManyMutationInput, RoleMenuUncheckedUpdateManyInput>
    /**
     * Filter which RoleMenus to update
     */
    where?: RoleMenuWhereInput
    /**
     * Limit how many RoleMenus to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleMenu upsert
   */
  export type RoleMenuUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * The filter to search for the RoleMenu to update in case it exists.
     */
    where: RoleMenuWhereUniqueInput
    /**
     * In case the RoleMenu found by the `where` argument doesn't exist, create a new RoleMenu with this data.
     */
    create: XOR<RoleMenuCreateInput, RoleMenuUncheckedCreateInput>
    /**
     * In case the RoleMenu was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleMenuUpdateInput, RoleMenuUncheckedUpdateInput>
  }

  /**
   * RoleMenu delete
   */
  export type RoleMenuDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
    /**
     * Filter which RoleMenu to delete.
     */
    where: RoleMenuWhereUniqueInput
  }

  /**
   * RoleMenu deleteMany
   */
  export type RoleMenuDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleMenus to delete
     */
    where?: RoleMenuWhereInput
    /**
     * Limit how many RoleMenus to delete.
     */
    limit?: number
  }

  /**
   * RoleMenu without action
   */
  export type RoleMenuDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleMenu
     */
    select?: RoleMenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleMenu
     */
    omit?: RoleMenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleMenuInclude<ExtArgs> | null
  }


  /**
   * Model HomeSection
   */

  export type AggregateHomeSection = {
    _count: HomeSectionCountAggregateOutputType | null
    _avg: HomeSectionAvgAggregateOutputType | null
    _sum: HomeSectionSumAggregateOutputType | null
    _min: HomeSectionMinAggregateOutputType | null
    _max: HomeSectionMaxAggregateOutputType | null
  }

  export type HomeSectionAvgAggregateOutputType = {
    id: number | null
  }

  export type HomeSectionSumAggregateOutputType = {
    id: bigint | null
  }

  export type HomeSectionMinAggregateOutputType = {
    id: bigint | null
    title: string | null
    description: string | null
    linkText: string | null
    linkHref: string | null
    gradient: string | null
    createdAt: Date | null
    updatedAt: Date | null
    status: string | null
  }

  export type HomeSectionMaxAggregateOutputType = {
    id: bigint | null
    title: string | null
    description: string | null
    linkText: string | null
    linkHref: string | null
    gradient: string | null
    createdAt: Date | null
    updatedAt: Date | null
    status: string | null
  }

  export type HomeSectionCountAggregateOutputType = {
    id: number
    title: number
    description: number
    linkText: number
    linkHref: number
    gradient: number
    createdAt: number
    updatedAt: number
    status: number
    _all: number
  }


  export type HomeSectionAvgAggregateInputType = {
    id?: true
  }

  export type HomeSectionSumAggregateInputType = {
    id?: true
  }

  export type HomeSectionMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    linkText?: true
    linkHref?: true
    gradient?: true
    createdAt?: true
    updatedAt?: true
    status?: true
  }

  export type HomeSectionMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    linkText?: true
    linkHref?: true
    gradient?: true
    createdAt?: true
    updatedAt?: true
    status?: true
  }

  export type HomeSectionCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    linkText?: true
    linkHref?: true
    gradient?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    _all?: true
  }

  export type HomeSectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HomeSection to aggregate.
     */
    where?: HomeSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HomeSections to fetch.
     */
    orderBy?: HomeSectionOrderByWithRelationInput | HomeSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HomeSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HomeSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HomeSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HomeSections
    **/
    _count?: true | HomeSectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HomeSectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HomeSectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HomeSectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HomeSectionMaxAggregateInputType
  }

  export type GetHomeSectionAggregateType<T extends HomeSectionAggregateArgs> = {
        [P in keyof T & keyof AggregateHomeSection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHomeSection[P]>
      : GetScalarType<T[P], AggregateHomeSection[P]>
  }




  export type HomeSectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HomeSectionWhereInput
    orderBy?: HomeSectionOrderByWithAggregationInput | HomeSectionOrderByWithAggregationInput[]
    by: HomeSectionScalarFieldEnum[] | HomeSectionScalarFieldEnum
    having?: HomeSectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HomeSectionCountAggregateInputType | true
    _avg?: HomeSectionAvgAggregateInputType
    _sum?: HomeSectionSumAggregateInputType
    _min?: HomeSectionMinAggregateInputType
    _max?: HomeSectionMaxAggregateInputType
  }

  export type HomeSectionGroupByOutputType = {
    id: bigint
    title: string
    description: string
    linkText: string
    linkHref: string
    gradient: string
    createdAt: Date | null
    updatedAt: Date | null
    status: string | null
    _count: HomeSectionCountAggregateOutputType | null
    _avg: HomeSectionAvgAggregateOutputType | null
    _sum: HomeSectionSumAggregateOutputType | null
    _min: HomeSectionMinAggregateOutputType | null
    _max: HomeSectionMaxAggregateOutputType | null
  }

  type GetHomeSectionGroupByPayload<T extends HomeSectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HomeSectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HomeSectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HomeSectionGroupByOutputType[P]>
            : GetScalarType<T[P], HomeSectionGroupByOutputType[P]>
        }
      >
    >


  export type HomeSectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    linkText?: boolean
    linkHref?: boolean
    gradient?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["homeSection"]>

  export type HomeSectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    linkText?: boolean
    linkHref?: boolean
    gradient?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["homeSection"]>

  export type HomeSectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    linkText?: boolean
    linkHref?: boolean
    gradient?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["homeSection"]>

  export type HomeSectionSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    linkText?: boolean
    linkHref?: boolean
    gradient?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
  }

  export type HomeSectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "linkText" | "linkHref" | "gradient" | "createdAt" | "updatedAt" | "status", ExtArgs["result"]["homeSection"]>

  export type $HomeSectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HomeSection"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      title: string
      description: string
      linkText: string
      linkHref: string
      gradient: string
      createdAt: Date | null
      updatedAt: Date | null
      status: string | null
    }, ExtArgs["result"]["homeSection"]>
    composites: {}
  }

  type HomeSectionGetPayload<S extends boolean | null | undefined | HomeSectionDefaultArgs> = $Result.GetResult<Prisma.$HomeSectionPayload, S>

  type HomeSectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HomeSectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HomeSectionCountAggregateInputType | true
    }

  export interface HomeSectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HomeSection'], meta: { name: 'HomeSection' } }
    /**
     * Find zero or one HomeSection that matches the filter.
     * @param {HomeSectionFindUniqueArgs} args - Arguments to find a HomeSection
     * @example
     * // Get one HomeSection
     * const homeSection = await prisma.homeSection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HomeSectionFindUniqueArgs>(args: SelectSubset<T, HomeSectionFindUniqueArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HomeSection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HomeSectionFindUniqueOrThrowArgs} args - Arguments to find a HomeSection
     * @example
     * // Get one HomeSection
     * const homeSection = await prisma.homeSection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HomeSectionFindUniqueOrThrowArgs>(args: SelectSubset<T, HomeSectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HomeSection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HomeSectionFindFirstArgs} args - Arguments to find a HomeSection
     * @example
     * // Get one HomeSection
     * const homeSection = await prisma.homeSection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HomeSectionFindFirstArgs>(args?: SelectSubset<T, HomeSectionFindFirstArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HomeSection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HomeSectionFindFirstOrThrowArgs} args - Arguments to find a HomeSection
     * @example
     * // Get one HomeSection
     * const homeSection = await prisma.homeSection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HomeSectionFindFirstOrThrowArgs>(args?: SelectSubset<T, HomeSectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HomeSections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HomeSectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HomeSections
     * const homeSections = await prisma.homeSection.findMany()
     * 
     * // Get first 10 HomeSections
     * const homeSections = await prisma.homeSection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const homeSectionWithIdOnly = await prisma.homeSection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HomeSectionFindManyArgs>(args?: SelectSubset<T, HomeSectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HomeSection.
     * @param {HomeSectionCreateArgs} args - Arguments to create a HomeSection.
     * @example
     * // Create one HomeSection
     * const HomeSection = await prisma.homeSection.create({
     *   data: {
     *     // ... data to create a HomeSection
     *   }
     * })
     * 
     */
    create<T extends HomeSectionCreateArgs>(args: SelectSubset<T, HomeSectionCreateArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HomeSections.
     * @param {HomeSectionCreateManyArgs} args - Arguments to create many HomeSections.
     * @example
     * // Create many HomeSections
     * const homeSection = await prisma.homeSection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HomeSectionCreateManyArgs>(args?: SelectSubset<T, HomeSectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HomeSections and returns the data saved in the database.
     * @param {HomeSectionCreateManyAndReturnArgs} args - Arguments to create many HomeSections.
     * @example
     * // Create many HomeSections
     * const homeSection = await prisma.homeSection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HomeSections and only return the `id`
     * const homeSectionWithIdOnly = await prisma.homeSection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HomeSectionCreateManyAndReturnArgs>(args?: SelectSubset<T, HomeSectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HomeSection.
     * @param {HomeSectionDeleteArgs} args - Arguments to delete one HomeSection.
     * @example
     * // Delete one HomeSection
     * const HomeSection = await prisma.homeSection.delete({
     *   where: {
     *     // ... filter to delete one HomeSection
     *   }
     * })
     * 
     */
    delete<T extends HomeSectionDeleteArgs>(args: SelectSubset<T, HomeSectionDeleteArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HomeSection.
     * @param {HomeSectionUpdateArgs} args - Arguments to update one HomeSection.
     * @example
     * // Update one HomeSection
     * const homeSection = await prisma.homeSection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HomeSectionUpdateArgs>(args: SelectSubset<T, HomeSectionUpdateArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HomeSections.
     * @param {HomeSectionDeleteManyArgs} args - Arguments to filter HomeSections to delete.
     * @example
     * // Delete a few HomeSections
     * const { count } = await prisma.homeSection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HomeSectionDeleteManyArgs>(args?: SelectSubset<T, HomeSectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HomeSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HomeSectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HomeSections
     * const homeSection = await prisma.homeSection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HomeSectionUpdateManyArgs>(args: SelectSubset<T, HomeSectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HomeSections and returns the data updated in the database.
     * @param {HomeSectionUpdateManyAndReturnArgs} args - Arguments to update many HomeSections.
     * @example
     * // Update many HomeSections
     * const homeSection = await prisma.homeSection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HomeSections and only return the `id`
     * const homeSectionWithIdOnly = await prisma.homeSection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HomeSectionUpdateManyAndReturnArgs>(args: SelectSubset<T, HomeSectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HomeSection.
     * @param {HomeSectionUpsertArgs} args - Arguments to update or create a HomeSection.
     * @example
     * // Update or create a HomeSection
     * const homeSection = await prisma.homeSection.upsert({
     *   create: {
     *     // ... data to create a HomeSection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HomeSection we want to update
     *   }
     * })
     */
    upsert<T extends HomeSectionUpsertArgs>(args: SelectSubset<T, HomeSectionUpsertArgs<ExtArgs>>): Prisma__HomeSectionClient<$Result.GetResult<Prisma.$HomeSectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HomeSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HomeSectionCountArgs} args - Arguments to filter HomeSections to count.
     * @example
     * // Count the number of HomeSections
     * const count = await prisma.homeSection.count({
     *   where: {
     *     // ... the filter for the HomeSections we want to count
     *   }
     * })
    **/
    count<T extends HomeSectionCountArgs>(
      args?: Subset<T, HomeSectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HomeSectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HomeSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HomeSectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HomeSectionAggregateArgs>(args: Subset<T, HomeSectionAggregateArgs>): Prisma.PrismaPromise<GetHomeSectionAggregateType<T>>

    /**
     * Group by HomeSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HomeSectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HomeSectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HomeSectionGroupByArgs['orderBy'] }
        : { orderBy?: HomeSectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HomeSectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHomeSectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HomeSection model
   */
  readonly fields: HomeSectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HomeSection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HomeSectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HomeSection model
   */
  interface HomeSectionFieldRefs {
    readonly id: FieldRef<"HomeSection", 'BigInt'>
    readonly title: FieldRef<"HomeSection", 'String'>
    readonly description: FieldRef<"HomeSection", 'String'>
    readonly linkText: FieldRef<"HomeSection", 'String'>
    readonly linkHref: FieldRef<"HomeSection", 'String'>
    readonly gradient: FieldRef<"HomeSection", 'String'>
    readonly createdAt: FieldRef<"HomeSection", 'DateTime'>
    readonly updatedAt: FieldRef<"HomeSection", 'DateTime'>
    readonly status: FieldRef<"HomeSection", 'String'>
  }
    

  // Custom InputTypes
  /**
   * HomeSection findUnique
   */
  export type HomeSectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * Filter, which HomeSection to fetch.
     */
    where: HomeSectionWhereUniqueInput
  }

  /**
   * HomeSection findUniqueOrThrow
   */
  export type HomeSectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * Filter, which HomeSection to fetch.
     */
    where: HomeSectionWhereUniqueInput
  }

  /**
   * HomeSection findFirst
   */
  export type HomeSectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * Filter, which HomeSection to fetch.
     */
    where?: HomeSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HomeSections to fetch.
     */
    orderBy?: HomeSectionOrderByWithRelationInput | HomeSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HomeSections.
     */
    cursor?: HomeSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HomeSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HomeSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HomeSections.
     */
    distinct?: HomeSectionScalarFieldEnum | HomeSectionScalarFieldEnum[]
  }

  /**
   * HomeSection findFirstOrThrow
   */
  export type HomeSectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * Filter, which HomeSection to fetch.
     */
    where?: HomeSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HomeSections to fetch.
     */
    orderBy?: HomeSectionOrderByWithRelationInput | HomeSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HomeSections.
     */
    cursor?: HomeSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HomeSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HomeSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HomeSections.
     */
    distinct?: HomeSectionScalarFieldEnum | HomeSectionScalarFieldEnum[]
  }

  /**
   * HomeSection findMany
   */
  export type HomeSectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * Filter, which HomeSections to fetch.
     */
    where?: HomeSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HomeSections to fetch.
     */
    orderBy?: HomeSectionOrderByWithRelationInput | HomeSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HomeSections.
     */
    cursor?: HomeSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HomeSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HomeSections.
     */
    skip?: number
    distinct?: HomeSectionScalarFieldEnum | HomeSectionScalarFieldEnum[]
  }

  /**
   * HomeSection create
   */
  export type HomeSectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * The data needed to create a HomeSection.
     */
    data: XOR<HomeSectionCreateInput, HomeSectionUncheckedCreateInput>
  }

  /**
   * HomeSection createMany
   */
  export type HomeSectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HomeSections.
     */
    data: HomeSectionCreateManyInput | HomeSectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HomeSection createManyAndReturn
   */
  export type HomeSectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * The data used to create many HomeSections.
     */
    data: HomeSectionCreateManyInput | HomeSectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HomeSection update
   */
  export type HomeSectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * The data needed to update a HomeSection.
     */
    data: XOR<HomeSectionUpdateInput, HomeSectionUncheckedUpdateInput>
    /**
     * Choose, which HomeSection to update.
     */
    where: HomeSectionWhereUniqueInput
  }

  /**
   * HomeSection updateMany
   */
  export type HomeSectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HomeSections.
     */
    data: XOR<HomeSectionUpdateManyMutationInput, HomeSectionUncheckedUpdateManyInput>
    /**
     * Filter which HomeSections to update
     */
    where?: HomeSectionWhereInput
    /**
     * Limit how many HomeSections to update.
     */
    limit?: number
  }

  /**
   * HomeSection updateManyAndReturn
   */
  export type HomeSectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * The data used to update HomeSections.
     */
    data: XOR<HomeSectionUpdateManyMutationInput, HomeSectionUncheckedUpdateManyInput>
    /**
     * Filter which HomeSections to update
     */
    where?: HomeSectionWhereInput
    /**
     * Limit how many HomeSections to update.
     */
    limit?: number
  }

  /**
   * HomeSection upsert
   */
  export type HomeSectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * The filter to search for the HomeSection to update in case it exists.
     */
    where: HomeSectionWhereUniqueInput
    /**
     * In case the HomeSection found by the `where` argument doesn't exist, create a new HomeSection with this data.
     */
    create: XOR<HomeSectionCreateInput, HomeSectionUncheckedCreateInput>
    /**
     * In case the HomeSection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HomeSectionUpdateInput, HomeSectionUncheckedUpdateInput>
  }

  /**
   * HomeSection delete
   */
  export type HomeSectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
    /**
     * Filter which HomeSection to delete.
     */
    where: HomeSectionWhereUniqueInput
  }

  /**
   * HomeSection deleteMany
   */
  export type HomeSectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HomeSections to delete
     */
    where?: HomeSectionWhereInput
    /**
     * Limit how many HomeSections to delete.
     */
    limit?: number
  }

  /**
   * HomeSection without action
   */
  export type HomeSectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HomeSection
     */
    select?: HomeSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HomeSection
     */
    omit?: HomeSectionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SeedVersionScalarFieldEnum: {
    id: 'id',
    version: 'version',
    appliedAt: 'appliedAt'
  };

  export type SeedVersionScalarFieldEnum = (typeof SeedVersionScalarFieldEnum)[keyof typeof SeedVersionScalarFieldEnum]


  export const AuditLogEntryScalarFieldEnum: {
    id: 'id',
    instanceId: 'instanceId',
    payload: 'payload',
    createdAt: 'createdAt',
    ipAddress: 'ipAddress'
  };

  export type AuditLogEntryScalarFieldEnum = (typeof AuditLogEntryScalarFieldEnum)[keyof typeof AuditLogEntryScalarFieldEnum]


  export const UserScalarFieldEnum: {
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

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LoginLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    loginTime: 'loginTime',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type LoginLogScalarFieldEnum = (typeof LoginLogScalarFieldEnum)[keyof typeof LoginLogScalarFieldEnum]


  export const VerificationCodeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    code: 'code',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type VerificationCodeScalarFieldEnum = (typeof VerificationCodeScalarFieldEnum)[keyof typeof VerificationCodeScalarFieldEnum]


  export const RoleScalarFieldEnum: {
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

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const PermissionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    groupName: 'groupName',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


  export const RolePermissionScalarFieldEnum: {
    roleId: 'roleId',
    permissionId: 'permissionId',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum]


  export const MenuScalarFieldEnum: {
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

  export type MenuScalarFieldEnum = (typeof MenuScalarFieldEnum)[keyof typeof MenuScalarFieldEnum]


  export const RoleMenuScalarFieldEnum: {
    roleId: 'roleId',
    menuId: 'menuId',
    createdAt: 'createdAt'
  };

  export type RoleMenuScalarFieldEnum = (typeof RoleMenuScalarFieldEnum)[keyof typeof RoleMenuScalarFieldEnum]


  export const HomeSectionScalarFieldEnum: {
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

  export type HomeSectionScalarFieldEnum = (typeof HomeSectionScalarFieldEnum)[keyof typeof HomeSectionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type SeedVersionWhereInput = {
    AND?: SeedVersionWhereInput | SeedVersionWhereInput[]
    OR?: SeedVersionWhereInput[]
    NOT?: SeedVersionWhereInput | SeedVersionWhereInput[]
    id?: StringFilter<"SeedVersion"> | string
    version?: StringFilter<"SeedVersion"> | string
    appliedAt?: DateTimeFilter<"SeedVersion"> | Date | string
  }

  export type SeedVersionOrderByWithRelationInput = {
    id?: SortOrder
    version?: SortOrder
    appliedAt?: SortOrder
  }

  export type SeedVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SeedVersionWhereInput | SeedVersionWhereInput[]
    OR?: SeedVersionWhereInput[]
    NOT?: SeedVersionWhereInput | SeedVersionWhereInput[]
    version?: StringFilter<"SeedVersion"> | string
    appliedAt?: DateTimeFilter<"SeedVersion"> | Date | string
  }, "id">

  export type SeedVersionOrderByWithAggregationInput = {
    id?: SortOrder
    version?: SortOrder
    appliedAt?: SortOrder
    _count?: SeedVersionCountOrderByAggregateInput
    _max?: SeedVersionMaxOrderByAggregateInput
    _min?: SeedVersionMinOrderByAggregateInput
  }

  export type SeedVersionScalarWhereWithAggregatesInput = {
    AND?: SeedVersionScalarWhereWithAggregatesInput | SeedVersionScalarWhereWithAggregatesInput[]
    OR?: SeedVersionScalarWhereWithAggregatesInput[]
    NOT?: SeedVersionScalarWhereWithAggregatesInput | SeedVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeedVersion"> | string
    version?: StringWithAggregatesFilter<"SeedVersion"> | string
    appliedAt?: DateTimeWithAggregatesFilter<"SeedVersion"> | Date | string
  }

  export type AuditLogEntryWhereInput = {
    AND?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    OR?: AuditLogEntryWhereInput[]
    NOT?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    id?: UuidFilter<"AuditLogEntry"> | string
    instanceId?: UuidNullableFilter<"AuditLogEntry"> | string | null
    payload?: JsonNullableFilter<"AuditLogEntry">
    createdAt?: DateTimeNullableFilter<"AuditLogEntry"> | Date | string | null
    ipAddress?: StringFilter<"AuditLogEntry"> | string
  }

  export type AuditLogEntryOrderByWithRelationInput = {
    id?: SortOrder
    instanceId?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    ipAddress?: SortOrder
  }

  export type AuditLogEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    OR?: AuditLogEntryWhereInput[]
    NOT?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    instanceId?: UuidNullableFilter<"AuditLogEntry"> | string | null
    payload?: JsonNullableFilter<"AuditLogEntry">
    createdAt?: DateTimeNullableFilter<"AuditLogEntry"> | Date | string | null
    ipAddress?: StringFilter<"AuditLogEntry"> | string
  }, "id">

  export type AuditLogEntryOrderByWithAggregationInput = {
    id?: SortOrder
    instanceId?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    ipAddress?: SortOrder
    _count?: AuditLogEntryCountOrderByAggregateInput
    _max?: AuditLogEntryMaxOrderByAggregateInput
    _min?: AuditLogEntryMinOrderByAggregateInput
  }

  export type AuditLogEntryScalarWhereWithAggregatesInput = {
    AND?: AuditLogEntryScalarWhereWithAggregatesInput | AuditLogEntryScalarWhereWithAggregatesInput[]
    OR?: AuditLogEntryScalarWhereWithAggregatesInput[]
    NOT?: AuditLogEntryScalarWhereWithAggregatesInput | AuditLogEntryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AuditLogEntry"> | string
    instanceId?: UuidNullableWithAggregatesFilter<"AuditLogEntry"> | string | null
    payload?: JsonNullableWithAggregatesFilter<"AuditLogEntry">
    createdAt?: DateTimeNullableWithAggregatesFilter<"AuditLogEntry"> | Date | string | null
    ipAddress?: StringWithAggregatesFilter<"AuditLogEntry"> | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    instanceId?: UuidNullableFilter<"User"> | string | null
    aud?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    encryptedPassword?: StringNullableFilter<"User"> | string | null
    emailConfirmedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    invitedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    confirmationToken?: StringNullableFilter<"User"> | string | null
    confirmationSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    recoveryToken?: StringNullableFilter<"User"> | string | null
    recoverySentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    emailChangeTokenNew?: StringNullableFilter<"User"> | string | null
    emailChange?: StringNullableFilter<"User"> | string | null
    emailChangeSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastSignInAt?: DateTimeNullableFilter<"User"> | Date | string | null
    rawAppMetaData?: JsonNullableFilter<"User">
    rawUserMetaData?: JsonNullableFilter<"User">
    isSuperAdmin?: BoolNullableFilter<"User"> | boolean | null
    createdAt?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phone?: StringNullableFilter<"User"> | string | null
    phoneConfirmedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phoneChange?: StringNullableFilter<"User"> | string | null
    phoneChangeToken?: StringNullableFilter<"User"> | string | null
    phoneChangeSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    emailChangeTokenCurrent?: StringNullableFilter<"User"> | string | null
    emailChangeConfirmStatus?: IntNullableFilter<"User"> | number | null
    bannedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    reauthenticationToken?: StringNullableFilter<"User"> | string | null
    reauthenticationSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isSsoUser?: BoolFilter<"User"> | boolean
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isAnonymous?: BoolFilter<"User"> | boolean
    username?: StringNullableFilter<"User"> | string | null
    phoneNumber?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    roleId?: UuidNullableFilter<"User"> | string | null
    status?: StringNullableFilter<"User"> | string | null
    userRole?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null
    loginLogs?: LoginLogListRelationFilter
    verificationCodes?: VerificationCodeListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    instanceId?: SortOrderInput | SortOrder
    aud?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    encryptedPassword?: SortOrderInput | SortOrder
    emailConfirmedAt?: SortOrderInput | SortOrder
    invitedAt?: SortOrderInput | SortOrder
    confirmationToken?: SortOrderInput | SortOrder
    confirmationSentAt?: SortOrderInput | SortOrder
    recoveryToken?: SortOrderInput | SortOrder
    recoverySentAt?: SortOrderInput | SortOrder
    emailChangeTokenNew?: SortOrderInput | SortOrder
    emailChange?: SortOrderInput | SortOrder
    emailChangeSentAt?: SortOrderInput | SortOrder
    lastSignInAt?: SortOrderInput | SortOrder
    rawAppMetaData?: SortOrderInput | SortOrder
    rawUserMetaData?: SortOrderInput | SortOrder
    isSuperAdmin?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    phoneConfirmedAt?: SortOrderInput | SortOrder
    phoneChange?: SortOrderInput | SortOrder
    phoneChangeToken?: SortOrderInput | SortOrder
    phoneChangeSentAt?: SortOrderInput | SortOrder
    emailChangeTokenCurrent?: SortOrderInput | SortOrder
    emailChangeConfirmStatus?: SortOrderInput | SortOrder
    bannedUntil?: SortOrderInput | SortOrder
    reauthenticationToken?: SortOrderInput | SortOrder
    reauthenticationSentAt?: SortOrderInput | SortOrder
    isSsoUser?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    isAnonymous?: SortOrder
    username?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    roleId?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    userRole?: RoleOrderByWithRelationInput
    loginLogs?: LoginLogOrderByRelationAggregateInput
    verificationCodes?: VerificationCodeOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    instanceId?: UuidNullableFilter<"User"> | string | null
    aud?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    encryptedPassword?: StringNullableFilter<"User"> | string | null
    emailConfirmedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    invitedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    confirmationToken?: StringNullableFilter<"User"> | string | null
    confirmationSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    recoveryToken?: StringNullableFilter<"User"> | string | null
    recoverySentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    emailChangeTokenNew?: StringNullableFilter<"User"> | string | null
    emailChange?: StringNullableFilter<"User"> | string | null
    emailChangeSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastSignInAt?: DateTimeNullableFilter<"User"> | Date | string | null
    rawAppMetaData?: JsonNullableFilter<"User">
    rawUserMetaData?: JsonNullableFilter<"User">
    isSuperAdmin?: BoolNullableFilter<"User"> | boolean | null
    createdAt?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phoneConfirmedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phoneChange?: StringNullableFilter<"User"> | string | null
    phoneChangeToken?: StringNullableFilter<"User"> | string | null
    phoneChangeSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    emailChangeTokenCurrent?: StringNullableFilter<"User"> | string | null
    emailChangeConfirmStatus?: IntNullableFilter<"User"> | number | null
    bannedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    reauthenticationToken?: StringNullableFilter<"User"> | string | null
    reauthenticationSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isSsoUser?: BoolFilter<"User"> | boolean
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isAnonymous?: BoolFilter<"User"> | boolean
    username?: StringNullableFilter<"User"> | string | null
    phoneNumber?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    roleId?: UuidNullableFilter<"User"> | string | null
    status?: StringNullableFilter<"User"> | string | null
    userRole?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null
    loginLogs?: LoginLogListRelationFilter
    verificationCodes?: VerificationCodeListRelationFilter
  }, "id" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    instanceId?: SortOrderInput | SortOrder
    aud?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    encryptedPassword?: SortOrderInput | SortOrder
    emailConfirmedAt?: SortOrderInput | SortOrder
    invitedAt?: SortOrderInput | SortOrder
    confirmationToken?: SortOrderInput | SortOrder
    confirmationSentAt?: SortOrderInput | SortOrder
    recoveryToken?: SortOrderInput | SortOrder
    recoverySentAt?: SortOrderInput | SortOrder
    emailChangeTokenNew?: SortOrderInput | SortOrder
    emailChange?: SortOrderInput | SortOrder
    emailChangeSentAt?: SortOrderInput | SortOrder
    lastSignInAt?: SortOrderInput | SortOrder
    rawAppMetaData?: SortOrderInput | SortOrder
    rawUserMetaData?: SortOrderInput | SortOrder
    isSuperAdmin?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    phoneConfirmedAt?: SortOrderInput | SortOrder
    phoneChange?: SortOrderInput | SortOrder
    phoneChangeToken?: SortOrderInput | SortOrder
    phoneChangeSentAt?: SortOrderInput | SortOrder
    emailChangeTokenCurrent?: SortOrderInput | SortOrder
    emailChangeConfirmStatus?: SortOrderInput | SortOrder
    bannedUntil?: SortOrderInput | SortOrder
    reauthenticationToken?: SortOrderInput | SortOrder
    reauthenticationSentAt?: SortOrderInput | SortOrder
    isSsoUser?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    isAnonymous?: SortOrder
    username?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    roleId?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    instanceId?: UuidNullableWithAggregatesFilter<"User"> | string | null
    aud?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    encryptedPassword?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailConfirmedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    invitedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    confirmationToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    confirmationSentAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    recoveryToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    recoverySentAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    emailChangeTokenNew?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailChange?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailChangeSentAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastSignInAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    rawAppMetaData?: JsonNullableWithAggregatesFilter<"User">
    rawUserMetaData?: JsonNullableWithAggregatesFilter<"User">
    isSuperAdmin?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    phoneConfirmedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    phoneChange?: StringNullableWithAggregatesFilter<"User"> | string | null
    phoneChangeToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    phoneChangeSentAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    emailChangeTokenCurrent?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailChangeConfirmStatus?: IntNullableWithAggregatesFilter<"User"> | number | null
    bannedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    reauthenticationToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    reauthenticationSentAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    isSsoUser?: BoolWithAggregatesFilter<"User"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    isAnonymous?: BoolWithAggregatesFilter<"User"> | boolean
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    roleId?: UuidNullableWithAggregatesFilter<"User"> | string | null
    status?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type LoginLogWhereInput = {
    AND?: LoginLogWhereInput | LoginLogWhereInput[]
    OR?: LoginLogWhereInput[]
    NOT?: LoginLogWhereInput | LoginLogWhereInput[]
    id?: UuidFilter<"LoginLog"> | string
    userId?: UuidFilter<"LoginLog"> | string
    loginTime?: DateTimeFilter<"LoginLog"> | Date | string
    ipAddress?: StringNullableFilter<"LoginLog"> | string | null
    userAgent?: StringNullableFilter<"LoginLog"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type LoginLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    loginTime?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type LoginLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoginLogWhereInput | LoginLogWhereInput[]
    OR?: LoginLogWhereInput[]
    NOT?: LoginLogWhereInput | LoginLogWhereInput[]
    userId?: UuidFilter<"LoginLog"> | string
    loginTime?: DateTimeFilter<"LoginLog"> | Date | string
    ipAddress?: StringNullableFilter<"LoginLog"> | string | null
    userAgent?: StringNullableFilter<"LoginLog"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type LoginLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    loginTime?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    _count?: LoginLogCountOrderByAggregateInput
    _max?: LoginLogMaxOrderByAggregateInput
    _min?: LoginLogMinOrderByAggregateInput
  }

  export type LoginLogScalarWhereWithAggregatesInput = {
    AND?: LoginLogScalarWhereWithAggregatesInput | LoginLogScalarWhereWithAggregatesInput[]
    OR?: LoginLogScalarWhereWithAggregatesInput[]
    NOT?: LoginLogScalarWhereWithAggregatesInput | LoginLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"LoginLog"> | string
    userId?: UuidWithAggregatesFilter<"LoginLog"> | string
    loginTime?: DateTimeWithAggregatesFilter<"LoginLog"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"LoginLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"LoginLog"> | string | null
  }

  export type VerificationCodeWhereInput = {
    AND?: VerificationCodeWhereInput | VerificationCodeWhereInput[]
    OR?: VerificationCodeWhereInput[]
    NOT?: VerificationCodeWhereInput | VerificationCodeWhereInput[]
    id?: UuidFilter<"VerificationCode"> | string
    userId?: UuidFilter<"VerificationCode"> | string
    code?: StringFilter<"VerificationCode"> | string
    createdAt?: DateTimeFilter<"VerificationCode"> | Date | string
    expiresAt?: DateTimeFilter<"VerificationCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type VerificationCodeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type VerificationCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationCodeWhereInput | VerificationCodeWhereInput[]
    OR?: VerificationCodeWhereInput[]
    NOT?: VerificationCodeWhereInput | VerificationCodeWhereInput[]
    userId?: UuidFilter<"VerificationCode"> | string
    code?: StringFilter<"VerificationCode"> | string
    createdAt?: DateTimeFilter<"VerificationCode"> | Date | string
    expiresAt?: DateTimeFilter<"VerificationCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type VerificationCodeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: VerificationCodeCountOrderByAggregateInput
    _max?: VerificationCodeMaxOrderByAggregateInput
    _min?: VerificationCodeMinOrderByAggregateInput
  }

  export type VerificationCodeScalarWhereWithAggregatesInput = {
    AND?: VerificationCodeScalarWhereWithAggregatesInput | VerificationCodeScalarWhereWithAggregatesInput[]
    OR?: VerificationCodeScalarWhereWithAggregatesInput[]
    NOT?: VerificationCodeScalarWhereWithAggregatesInput | VerificationCodeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"VerificationCode"> | string
    userId?: UuidWithAggregatesFilter<"VerificationCode"> | string
    code?: StringWithAggregatesFilter<"VerificationCode"> | string
    createdAt?: DateTimeWithAggregatesFilter<"VerificationCode"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"VerificationCode"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: UuidFilter<"Role"> | string
    name?: StringFilter<"Role"> | string
    description?: StringNullableFilter<"Role"> | string | null
    status?: StringNullableFilter<"Role"> | string | null
    createdBy?: UuidNullableFilter<"Role"> | string | null
    updatedBy?: UuidNullableFilter<"Role"> | string | null
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Role"> | Date | string | null
    users?: UserListRelationFilter
    rolePermissions?: RolePermissionListRelationFilter
    roleMenus?: RoleMenuListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    users?: UserOrderByRelationAggregateInput
    rolePermissions?: RolePermissionOrderByRelationAggregateInput
    roleMenus?: RoleMenuOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    description?: StringNullableFilter<"Role"> | string | null
    status?: StringNullableFilter<"Role"> | string | null
    createdBy?: UuidNullableFilter<"Role"> | string | null
    updatedBy?: UuidNullableFilter<"Role"> | string | null
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Role"> | Date | string | null
    users?: UserListRelationFilter
    rolePermissions?: RolePermissionListRelationFilter
    roleMenus?: RoleMenuListRelationFilter
  }, "id" | "name">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Role"> | string
    name?: StringWithAggregatesFilter<"Role"> | string
    description?: StringNullableWithAggregatesFilter<"Role"> | string | null
    status?: StringNullableWithAggregatesFilter<"Role"> | string | null
    createdBy?: UuidNullableWithAggregatesFilter<"Role"> | string | null
    updatedBy?: UuidNullableWithAggregatesFilter<"Role"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Role"> | Date | string | null
  }

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    id?: UuidFilter<"Permission"> | string
    name?: StringFilter<"Permission"> | string
    description?: StringNullableFilter<"Permission"> | string | null
    groupName?: StringNullableFilter<"Permission"> | string | null
    status?: StringNullableFilter<"Permission"> | string | null
    createdAt?: DateTimeFilter<"Permission"> | Date | string
    updatedAt?: DateTimeFilter<"Permission"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Permission"> | Date | string | null
    rolePermissions?: RolePermissionListRelationFilter
  }

  export type PermissionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    groupName?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    rolePermissions?: RolePermissionOrderByRelationAggregateInput
  }

  export type PermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    description?: StringNullableFilter<"Permission"> | string | null
    groupName?: StringNullableFilter<"Permission"> | string | null
    status?: StringNullableFilter<"Permission"> | string | null
    createdAt?: DateTimeFilter<"Permission"> | Date | string
    updatedAt?: DateTimeFilter<"Permission"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Permission"> | Date | string | null
    rolePermissions?: RolePermissionListRelationFilter
  }, "id" | "name">

  export type PermissionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    groupName?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: PermissionCountOrderByAggregateInput
    _max?: PermissionMaxOrderByAggregateInput
    _min?: PermissionMinOrderByAggregateInput
  }

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    OR?: PermissionScalarWhereWithAggregatesInput[]
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Permission"> | string
    name?: StringWithAggregatesFilter<"Permission"> | string
    description?: StringNullableWithAggregatesFilter<"Permission"> | string | null
    groupName?: StringNullableWithAggregatesFilter<"Permission"> | string | null
    status?: StringNullableWithAggregatesFilter<"Permission"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Permission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Permission"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Permission"> | Date | string | null
  }

  export type RolePermissionWhereInput = {
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    roleId?: UuidFilter<"RolePermission"> | string
    permissionId?: UuidFilter<"RolePermission"> | string
    createdAt?: DateTimeFilter<"RolePermission"> | Date | string
    deletedAt?: DateTimeNullableFilter<"RolePermission"> | Date | string | null
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }

  export type RolePermissionOrderByWithRelationInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    role?: RoleOrderByWithRelationInput
    permission?: PermissionOrderByWithRelationInput
  }

  export type RolePermissionWhereUniqueInput = Prisma.AtLeast<{
    roleId_permissionId?: RolePermissionRoleIdPermissionIdCompoundUniqueInput
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    roleId?: UuidFilter<"RolePermission"> | string
    permissionId?: UuidFilter<"RolePermission"> | string
    createdAt?: DateTimeFilter<"RolePermission"> | Date | string
    deletedAt?: DateTimeNullableFilter<"RolePermission"> | Date | string | null
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }, "roleId_permissionId">

  export type RolePermissionOrderByWithAggregationInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: RolePermissionCountOrderByAggregateInput
    _max?: RolePermissionMaxOrderByAggregateInput
    _min?: RolePermissionMinOrderByAggregateInput
  }

  export type RolePermissionScalarWhereWithAggregatesInput = {
    AND?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    OR?: RolePermissionScalarWhereWithAggregatesInput[]
    NOT?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    roleId?: UuidWithAggregatesFilter<"RolePermission"> | string
    permissionId?: UuidWithAggregatesFilter<"RolePermission"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RolePermission"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"RolePermission"> | Date | string | null
  }

  export type MenuWhereInput = {
    AND?: MenuWhereInput | MenuWhereInput[]
    OR?: MenuWhereInput[]
    NOT?: MenuWhereInput | MenuWhereInput[]
    id?: UuidFilter<"Menu"> | string
    name?: StringFilter<"Menu"> | string
    url?: StringNullableFilter<"Menu"> | string | null
    parentId?: UuidNullableFilter<"Menu"> | string | null
    sortOrder?: IntNullableFilter<"Menu"> | number | null
    icon?: StringNullableFilter<"Menu"> | string | null
    description?: StringNullableFilter<"Menu"> | string | null
    component?: StringNullableFilter<"Menu"> | string | null
    createdAt?: DateTimeFilter<"Menu"> | Date | string
    updatedAt?: DateTimeFilter<"Menu"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Menu"> | Date | string | null
    parent?: XOR<MenuNullableScalarRelationFilter, MenuWhereInput> | null
    children?: MenuListRelationFilter
    roleMenus?: RoleMenuListRelationFilter
  }

  export type MenuOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    sortOrder?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    component?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    parent?: MenuOrderByWithRelationInput
    children?: MenuOrderByRelationAggregateInput
    roleMenus?: RoleMenuOrderByRelationAggregateInput
  }

  export type MenuWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MenuWhereInput | MenuWhereInput[]
    OR?: MenuWhereInput[]
    NOT?: MenuWhereInput | MenuWhereInput[]
    name?: StringFilter<"Menu"> | string
    url?: StringNullableFilter<"Menu"> | string | null
    parentId?: UuidNullableFilter<"Menu"> | string | null
    sortOrder?: IntNullableFilter<"Menu"> | number | null
    icon?: StringNullableFilter<"Menu"> | string | null
    description?: StringNullableFilter<"Menu"> | string | null
    component?: StringNullableFilter<"Menu"> | string | null
    createdAt?: DateTimeFilter<"Menu"> | Date | string
    updatedAt?: DateTimeFilter<"Menu"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Menu"> | Date | string | null
    parent?: XOR<MenuNullableScalarRelationFilter, MenuWhereInput> | null
    children?: MenuListRelationFilter
    roleMenus?: RoleMenuListRelationFilter
  }, "id">

  export type MenuOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    sortOrder?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    component?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: MenuCountOrderByAggregateInput
    _avg?: MenuAvgOrderByAggregateInput
    _max?: MenuMaxOrderByAggregateInput
    _min?: MenuMinOrderByAggregateInput
    _sum?: MenuSumOrderByAggregateInput
  }

  export type MenuScalarWhereWithAggregatesInput = {
    AND?: MenuScalarWhereWithAggregatesInput | MenuScalarWhereWithAggregatesInput[]
    OR?: MenuScalarWhereWithAggregatesInput[]
    NOT?: MenuScalarWhereWithAggregatesInput | MenuScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Menu"> | string
    name?: StringWithAggregatesFilter<"Menu"> | string
    url?: StringNullableWithAggregatesFilter<"Menu"> | string | null
    parentId?: UuidNullableWithAggregatesFilter<"Menu"> | string | null
    sortOrder?: IntNullableWithAggregatesFilter<"Menu"> | number | null
    icon?: StringNullableWithAggregatesFilter<"Menu"> | string | null
    description?: StringNullableWithAggregatesFilter<"Menu"> | string | null
    component?: StringNullableWithAggregatesFilter<"Menu"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Menu"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Menu"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Menu"> | Date | string | null
  }

  export type RoleMenuWhereInput = {
    AND?: RoleMenuWhereInput | RoleMenuWhereInput[]
    OR?: RoleMenuWhereInput[]
    NOT?: RoleMenuWhereInput | RoleMenuWhereInput[]
    roleId?: UuidFilter<"RoleMenu"> | string
    menuId?: UuidFilter<"RoleMenu"> | string
    createdAt?: DateTimeFilter<"RoleMenu"> | Date | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    menu?: XOR<MenuScalarRelationFilter, MenuWhereInput>
  }

  export type RoleMenuOrderByWithRelationInput = {
    roleId?: SortOrder
    menuId?: SortOrder
    createdAt?: SortOrder
    role?: RoleOrderByWithRelationInput
    menu?: MenuOrderByWithRelationInput
  }

  export type RoleMenuWhereUniqueInput = Prisma.AtLeast<{
    roleId_menuId?: RoleMenuRoleIdMenuIdCompoundUniqueInput
    AND?: RoleMenuWhereInput | RoleMenuWhereInput[]
    OR?: RoleMenuWhereInput[]
    NOT?: RoleMenuWhereInput | RoleMenuWhereInput[]
    roleId?: UuidFilter<"RoleMenu"> | string
    menuId?: UuidFilter<"RoleMenu"> | string
    createdAt?: DateTimeFilter<"RoleMenu"> | Date | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    menu?: XOR<MenuScalarRelationFilter, MenuWhereInput>
  }, "roleId_menuId">

  export type RoleMenuOrderByWithAggregationInput = {
    roleId?: SortOrder
    menuId?: SortOrder
    createdAt?: SortOrder
    _count?: RoleMenuCountOrderByAggregateInput
    _max?: RoleMenuMaxOrderByAggregateInput
    _min?: RoleMenuMinOrderByAggregateInput
  }

  export type RoleMenuScalarWhereWithAggregatesInput = {
    AND?: RoleMenuScalarWhereWithAggregatesInput | RoleMenuScalarWhereWithAggregatesInput[]
    OR?: RoleMenuScalarWhereWithAggregatesInput[]
    NOT?: RoleMenuScalarWhereWithAggregatesInput | RoleMenuScalarWhereWithAggregatesInput[]
    roleId?: UuidWithAggregatesFilter<"RoleMenu"> | string
    menuId?: UuidWithAggregatesFilter<"RoleMenu"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RoleMenu"> | Date | string
  }

  export type HomeSectionWhereInput = {
    AND?: HomeSectionWhereInput | HomeSectionWhereInput[]
    OR?: HomeSectionWhereInput[]
    NOT?: HomeSectionWhereInput | HomeSectionWhereInput[]
    id?: BigIntFilter<"HomeSection"> | bigint | number
    title?: StringFilter<"HomeSection"> | string
    description?: StringFilter<"HomeSection"> | string
    linkText?: StringFilter<"HomeSection"> | string
    linkHref?: StringFilter<"HomeSection"> | string
    gradient?: StringFilter<"HomeSection"> | string
    createdAt?: DateTimeNullableFilter<"HomeSection"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"HomeSection"> | Date | string | null
    status?: StringNullableFilter<"HomeSection"> | string | null
  }

  export type HomeSectionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    linkText?: SortOrder
    linkHref?: SortOrder
    gradient?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
  }

  export type HomeSectionWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: HomeSectionWhereInput | HomeSectionWhereInput[]
    OR?: HomeSectionWhereInput[]
    NOT?: HomeSectionWhereInput | HomeSectionWhereInput[]
    title?: StringFilter<"HomeSection"> | string
    description?: StringFilter<"HomeSection"> | string
    linkText?: StringFilter<"HomeSection"> | string
    linkHref?: StringFilter<"HomeSection"> | string
    gradient?: StringFilter<"HomeSection"> | string
    createdAt?: DateTimeNullableFilter<"HomeSection"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"HomeSection"> | Date | string | null
    status?: StringNullableFilter<"HomeSection"> | string | null
  }, "id">

  export type HomeSectionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    linkText?: SortOrder
    linkHref?: SortOrder
    gradient?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    _count?: HomeSectionCountOrderByAggregateInput
    _avg?: HomeSectionAvgOrderByAggregateInput
    _max?: HomeSectionMaxOrderByAggregateInput
    _min?: HomeSectionMinOrderByAggregateInput
    _sum?: HomeSectionSumOrderByAggregateInput
  }

  export type HomeSectionScalarWhereWithAggregatesInput = {
    AND?: HomeSectionScalarWhereWithAggregatesInput | HomeSectionScalarWhereWithAggregatesInput[]
    OR?: HomeSectionScalarWhereWithAggregatesInput[]
    NOT?: HomeSectionScalarWhereWithAggregatesInput | HomeSectionScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"HomeSection"> | bigint | number
    title?: StringWithAggregatesFilter<"HomeSection"> | string
    description?: StringWithAggregatesFilter<"HomeSection"> | string
    linkText?: StringWithAggregatesFilter<"HomeSection"> | string
    linkHref?: StringWithAggregatesFilter<"HomeSection"> | string
    gradient?: StringWithAggregatesFilter<"HomeSection"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"HomeSection"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"HomeSection"> | Date | string | null
    status?: StringNullableWithAggregatesFilter<"HomeSection"> | string | null
  }

  export type SeedVersionCreateInput = {
    id: string
    version: string
    appliedAt?: Date | string
  }

  export type SeedVersionUncheckedCreateInput = {
    id: string
    version: string
    appliedAt?: Date | string
  }

  export type SeedVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeedVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeedVersionCreateManyInput = {
    id: string
    version: string
    appliedAt?: Date | string
  }

  export type SeedVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeedVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryCreateInput = {
    id?: string
    instanceId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string | null
    ipAddress?: string
  }

  export type AuditLogEntryUncheckedCreateInput = {
    id?: string
    instanceId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string | null
    ipAddress?: string
  }

  export type AuditLogEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
  }

  export type AuditLogEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
  }

  export type AuditLogEntryCreateManyInput = {
    id?: string
    instanceId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string | null
    ipAddress?: string
  }

  export type AuditLogEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
  }

  export type AuditLogEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    status?: string | null
    userRole?: RoleCreateNestedOneWithoutUsersInput
    loginLogs?: LoginLogCreateNestedManyWithoutUserInput
    verificationCodes?: VerificationCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    roleId?: string | null
    status?: string | null
    loginLogs?: LoginLogUncheckedCreateNestedManyWithoutUserInput
    verificationCodes?: VerificationCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: RoleUpdateOneWithoutUsersNestedInput
    loginLogs?: LoginLogUpdateManyWithoutUserNestedInput
    verificationCodes?: VerificationCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    loginLogs?: LoginLogUncheckedUpdateManyWithoutUserNestedInput
    verificationCodes?: VerificationCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    roleId?: string | null
    status?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LoginLogCreateInput = {
    id?: string
    loginTime?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    user: UserCreateNestedOneWithoutLoginLogsInput
  }

  export type LoginLogUncheckedCreateInput = {
    id?: string
    userId: string
    loginTime?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type LoginLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loginTime?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutLoginLogsNestedInput
  }

  export type LoginLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    loginTime?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LoginLogCreateManyInput = {
    id?: string
    userId: string
    loginTime?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type LoginLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    loginTime?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LoginLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    loginTime?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VerificationCodeCreateInput = {
    id?: string
    code: string
    createdAt?: Date | string
    expiresAt: Date | string
    user: UserCreateNestedOneWithoutVerificationCodesInput
  }

  export type VerificationCodeUncheckedCreateInput = {
    id?: string
    userId: string
    code: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type VerificationCodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVerificationCodesNestedInput
  }

  export type VerificationCodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCodeCreateManyInput = {
    id?: string
    userId: string
    code: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type VerificationCodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    users?: UserCreateNestedManyWithoutUserRoleInput
    rolePermissions?: RolePermissionCreateNestedManyWithoutRoleInput
    roleMenus?: RoleMenuCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutUserRoleInput
    rolePermissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
    roleMenus?: RoleMenuUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutUserRoleNestedInput
    rolePermissions?: RolePermissionUpdateManyWithoutRoleNestedInput
    roleMenus?: RoleMenuUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutUserRoleNestedInput
    rolePermissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
    roleMenus?: RoleMenuUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PermissionCreateInput = {
    id?: string
    name: string
    description?: string | null
    groupName?: string | null
    status?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    rolePermissions?: RolePermissionCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    groupName?: string | null
    status?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    rolePermissions?: RolePermissionUncheckedCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    groupName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rolePermissions?: RolePermissionUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    groupName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rolePermissions?: RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    groupName?: string | null
    status?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PermissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    groupName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PermissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    groupName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RolePermissionCreateInput = {
    createdAt?: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutRolePermissionsInput
    permission: PermissionCreateNestedOneWithoutRolePermissionsInput
  }

  export type RolePermissionUncheckedCreateInput = {
    roleId: string
    permissionId: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RolePermissionUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutRolePermissionsNestedInput
    permission?: PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    permissionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RolePermissionCreateManyInput = {
    roleId: string
    permissionId: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RolePermissionUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RolePermissionUncheckedUpdateManyInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    permissionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MenuCreateInput = {
    id?: string
    name: string
    url?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    parent?: MenuCreateNestedOneWithoutChildrenInput
    children?: MenuCreateNestedManyWithoutParentInput
    roleMenus?: RoleMenuCreateNestedManyWithoutMenuInput
  }

  export type MenuUncheckedCreateInput = {
    id?: string
    name: string
    url?: string | null
    parentId?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    children?: MenuUncheckedCreateNestedManyWithoutParentInput
    roleMenus?: RoleMenuUncheckedCreateNestedManyWithoutMenuInput
  }

  export type MenuUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parent?: MenuUpdateOneWithoutChildrenNestedInput
    children?: MenuUpdateManyWithoutParentNestedInput
    roleMenus?: RoleMenuUpdateManyWithoutMenuNestedInput
  }

  export type MenuUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: MenuUncheckedUpdateManyWithoutParentNestedInput
    roleMenus?: RoleMenuUncheckedUpdateManyWithoutMenuNestedInput
  }

  export type MenuCreateManyInput = {
    id?: string
    name: string
    url?: string | null
    parentId?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type MenuUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MenuUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoleMenuCreateInput = {
    createdAt?: Date | string
    role: RoleCreateNestedOneWithoutRoleMenusInput
    menu: MenuCreateNestedOneWithoutRoleMenusInput
  }

  export type RoleMenuUncheckedCreateInput = {
    roleId: string
    menuId: string
    createdAt?: Date | string
  }

  export type RoleMenuUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutRoleMenusNestedInput
    menu?: MenuUpdateOneRequiredWithoutRoleMenusNestedInput
  }

  export type RoleMenuUncheckedUpdateInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleMenuCreateManyInput = {
    roleId: string
    menuId: string
    createdAt?: Date | string
  }

  export type RoleMenuUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleMenuUncheckedUpdateManyInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HomeSectionCreateInput = {
    id?: bigint | number
    title: string
    description: string
    linkText: string
    linkHref: string
    gradient: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    status?: string | null
  }

  export type HomeSectionUncheckedCreateInput = {
    id?: bigint | number
    title: string
    description: string
    linkText: string
    linkHref: string
    gradient: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    status?: string | null
  }

  export type HomeSectionUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkText?: StringFieldUpdateOperationsInput | string
    linkHref?: StringFieldUpdateOperationsInput | string
    gradient?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HomeSectionUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkText?: StringFieldUpdateOperationsInput | string
    linkHref?: StringFieldUpdateOperationsInput | string
    gradient?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HomeSectionCreateManyInput = {
    id?: bigint | number
    title: string
    description: string
    linkText: string
    linkHref: string
    gradient: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    status?: string | null
  }

  export type HomeSectionUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkText?: StringFieldUpdateOperationsInput | string
    linkHref?: StringFieldUpdateOperationsInput | string
    gradient?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HomeSectionUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkText?: StringFieldUpdateOperationsInput | string
    linkHref?: StringFieldUpdateOperationsInput | string
    gradient?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SeedVersionCountOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    appliedAt?: SortOrder
  }

  export type SeedVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    appliedAt?: SortOrder
  }

  export type SeedVersionMinOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    appliedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditLogEntryCountOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrder
  }

  export type AuditLogEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrder
  }

  export type AuditLogEntryMinOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    createdAt?: SortOrder
    ipAddress?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RoleNullableScalarRelationFilter = {
    is?: RoleWhereInput | null
    isNot?: RoleWhereInput | null
  }

  export type LoginLogListRelationFilter = {
    every?: LoginLogWhereInput
    some?: LoginLogWhereInput
    none?: LoginLogWhereInput
  }

  export type VerificationCodeListRelationFilter = {
    every?: VerificationCodeWhereInput
    some?: VerificationCodeWhereInput
    none?: VerificationCodeWhereInput
  }

  export type LoginLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VerificationCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    aud?: SortOrder
    role?: SortOrder
    email?: SortOrder
    encryptedPassword?: SortOrder
    emailConfirmedAt?: SortOrder
    invitedAt?: SortOrder
    confirmationToken?: SortOrder
    confirmationSentAt?: SortOrder
    recoveryToken?: SortOrder
    recoverySentAt?: SortOrder
    emailChangeTokenNew?: SortOrder
    emailChange?: SortOrder
    emailChangeSentAt?: SortOrder
    lastSignInAt?: SortOrder
    rawAppMetaData?: SortOrder
    rawUserMetaData?: SortOrder
    isSuperAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    phone?: SortOrder
    phoneConfirmedAt?: SortOrder
    phoneChange?: SortOrder
    phoneChangeToken?: SortOrder
    phoneChangeSentAt?: SortOrder
    emailChangeTokenCurrent?: SortOrder
    emailChangeConfirmStatus?: SortOrder
    bannedUntil?: SortOrder
    reauthenticationToken?: SortOrder
    reauthenticationSentAt?: SortOrder
    isSsoUser?: SortOrder
    deletedAt?: SortOrder
    isAnonymous?: SortOrder
    username?: SortOrder
    phoneNumber?: SortOrder
    avatarUrl?: SortOrder
    roleId?: SortOrder
    status?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    emailChangeConfirmStatus?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    aud?: SortOrder
    role?: SortOrder
    email?: SortOrder
    encryptedPassword?: SortOrder
    emailConfirmedAt?: SortOrder
    invitedAt?: SortOrder
    confirmationToken?: SortOrder
    confirmationSentAt?: SortOrder
    recoveryToken?: SortOrder
    recoverySentAt?: SortOrder
    emailChangeTokenNew?: SortOrder
    emailChange?: SortOrder
    emailChangeSentAt?: SortOrder
    lastSignInAt?: SortOrder
    isSuperAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    phone?: SortOrder
    phoneConfirmedAt?: SortOrder
    phoneChange?: SortOrder
    phoneChangeToken?: SortOrder
    phoneChangeSentAt?: SortOrder
    emailChangeTokenCurrent?: SortOrder
    emailChangeConfirmStatus?: SortOrder
    bannedUntil?: SortOrder
    reauthenticationToken?: SortOrder
    reauthenticationSentAt?: SortOrder
    isSsoUser?: SortOrder
    deletedAt?: SortOrder
    isAnonymous?: SortOrder
    username?: SortOrder
    phoneNumber?: SortOrder
    avatarUrl?: SortOrder
    roleId?: SortOrder
    status?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    instanceId?: SortOrder
    aud?: SortOrder
    role?: SortOrder
    email?: SortOrder
    encryptedPassword?: SortOrder
    emailConfirmedAt?: SortOrder
    invitedAt?: SortOrder
    confirmationToken?: SortOrder
    confirmationSentAt?: SortOrder
    recoveryToken?: SortOrder
    recoverySentAt?: SortOrder
    emailChangeTokenNew?: SortOrder
    emailChange?: SortOrder
    emailChangeSentAt?: SortOrder
    lastSignInAt?: SortOrder
    isSuperAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    phone?: SortOrder
    phoneConfirmedAt?: SortOrder
    phoneChange?: SortOrder
    phoneChangeToken?: SortOrder
    phoneChangeSentAt?: SortOrder
    emailChangeTokenCurrent?: SortOrder
    emailChangeConfirmStatus?: SortOrder
    bannedUntil?: SortOrder
    reauthenticationToken?: SortOrder
    reauthenticationSentAt?: SortOrder
    isSsoUser?: SortOrder
    deletedAt?: SortOrder
    isAnonymous?: SortOrder
    username?: SortOrder
    phoneNumber?: SortOrder
    avatarUrl?: SortOrder
    roleId?: SortOrder
    status?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    emailChangeConfirmStatus?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type LoginLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loginTime?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type LoginLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loginTime?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type LoginLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loginTime?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type VerificationCodeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type VerificationCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type VerificationCodeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type RolePermissionListRelationFilter = {
    every?: RolePermissionWhereInput
    some?: RolePermissionWhereInput
    none?: RolePermissionWhereInput
  }

  export type RoleMenuListRelationFilter = {
    every?: RoleMenuWhereInput
    some?: RoleMenuWhereInput
    none?: RoleMenuWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RolePermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleMenuOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PermissionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    groupName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    groupName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PermissionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    groupName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type PermissionScalarRelationFilter = {
    is?: PermissionWhereInput
    isNot?: PermissionWhereInput
  }

  export type RolePermissionRoleIdPermissionIdCompoundUniqueInput = {
    roleId: string
    permissionId: string
  }

  export type RolePermissionCountOrderByAggregateInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type RolePermissionMaxOrderByAggregateInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type RolePermissionMinOrderByAggregateInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MenuNullableScalarRelationFilter = {
    is?: MenuWhereInput | null
    isNot?: MenuWhereInput | null
  }

  export type MenuListRelationFilter = {
    every?: MenuWhereInput
    some?: MenuWhereInput
    none?: MenuWhereInput
  }

  export type MenuOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MenuCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    parentId?: SortOrder
    sortOrder?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    component?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MenuAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type MenuMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    parentId?: SortOrder
    sortOrder?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    component?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MenuMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    parentId?: SortOrder
    sortOrder?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    component?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MenuSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type MenuScalarRelationFilter = {
    is?: MenuWhereInput
    isNot?: MenuWhereInput
  }

  export type RoleMenuRoleIdMenuIdCompoundUniqueInput = {
    roleId: string
    menuId: string
  }

  export type RoleMenuCountOrderByAggregateInput = {
    roleId?: SortOrder
    menuId?: SortOrder
    createdAt?: SortOrder
  }

  export type RoleMenuMaxOrderByAggregateInput = {
    roleId?: SortOrder
    menuId?: SortOrder
    createdAt?: SortOrder
  }

  export type RoleMenuMinOrderByAggregateInput = {
    roleId?: SortOrder
    menuId?: SortOrder
    createdAt?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type HomeSectionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    linkText?: SortOrder
    linkHref?: SortOrder
    gradient?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
  }

  export type HomeSectionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type HomeSectionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    linkText?: SortOrder
    linkHref?: SortOrder
    gradient?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
  }

  export type HomeSectionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    linkText?: SortOrder
    linkHref?: SortOrder
    gradient?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
  }

  export type HomeSectionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RoleCreateNestedOneWithoutUsersInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    connect?: RoleWhereUniqueInput
  }

  export type LoginLogCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginLogCreateWithoutUserInput, LoginLogUncheckedCreateWithoutUserInput> | LoginLogCreateWithoutUserInput[] | LoginLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginLogCreateOrConnectWithoutUserInput | LoginLogCreateOrConnectWithoutUserInput[]
    createMany?: LoginLogCreateManyUserInputEnvelope
    connect?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
  }

  export type VerificationCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<VerificationCodeCreateWithoutUserInput, VerificationCodeUncheckedCreateWithoutUserInput> | VerificationCodeCreateWithoutUserInput[] | VerificationCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VerificationCodeCreateOrConnectWithoutUserInput | VerificationCodeCreateOrConnectWithoutUserInput[]
    createMany?: VerificationCodeCreateManyUserInputEnvelope
    connect?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
  }

  export type LoginLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginLogCreateWithoutUserInput, LoginLogUncheckedCreateWithoutUserInput> | LoginLogCreateWithoutUserInput[] | LoginLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginLogCreateOrConnectWithoutUserInput | LoginLogCreateOrConnectWithoutUserInput[]
    createMany?: LoginLogCreateManyUserInputEnvelope
    connect?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
  }

  export type VerificationCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<VerificationCodeCreateWithoutUserInput, VerificationCodeUncheckedCreateWithoutUserInput> | VerificationCodeCreateWithoutUserInput[] | VerificationCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VerificationCodeCreateOrConnectWithoutUserInput | VerificationCodeCreateOrConnectWithoutUserInput[]
    createMany?: VerificationCodeCreateManyUserInputEnvelope
    connect?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RoleUpdateOneWithoutUsersNestedInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    upsert?: RoleUpsertWithoutUsersInput
    disconnect?: RoleWhereInput | boolean
    delete?: RoleWhereInput | boolean
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUsersInput, RoleUpdateWithoutUsersInput>, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type LoginLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginLogCreateWithoutUserInput, LoginLogUncheckedCreateWithoutUserInput> | LoginLogCreateWithoutUserInput[] | LoginLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginLogCreateOrConnectWithoutUserInput | LoginLogCreateOrConnectWithoutUserInput[]
    upsert?: LoginLogUpsertWithWhereUniqueWithoutUserInput | LoginLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginLogCreateManyUserInputEnvelope
    set?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    disconnect?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    delete?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    connect?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    update?: LoginLogUpdateWithWhereUniqueWithoutUserInput | LoginLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginLogUpdateManyWithWhereWithoutUserInput | LoginLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginLogScalarWhereInput | LoginLogScalarWhereInput[]
  }

  export type VerificationCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<VerificationCodeCreateWithoutUserInput, VerificationCodeUncheckedCreateWithoutUserInput> | VerificationCodeCreateWithoutUserInput[] | VerificationCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VerificationCodeCreateOrConnectWithoutUserInput | VerificationCodeCreateOrConnectWithoutUserInput[]
    upsert?: VerificationCodeUpsertWithWhereUniqueWithoutUserInput | VerificationCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VerificationCodeCreateManyUserInputEnvelope
    set?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    disconnect?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    delete?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    connect?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    update?: VerificationCodeUpdateWithWhereUniqueWithoutUserInput | VerificationCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VerificationCodeUpdateManyWithWhereWithoutUserInput | VerificationCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VerificationCodeScalarWhereInput | VerificationCodeScalarWhereInput[]
  }

  export type LoginLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginLogCreateWithoutUserInput, LoginLogUncheckedCreateWithoutUserInput> | LoginLogCreateWithoutUserInput[] | LoginLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginLogCreateOrConnectWithoutUserInput | LoginLogCreateOrConnectWithoutUserInput[]
    upsert?: LoginLogUpsertWithWhereUniqueWithoutUserInput | LoginLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginLogCreateManyUserInputEnvelope
    set?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    disconnect?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    delete?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    connect?: LoginLogWhereUniqueInput | LoginLogWhereUniqueInput[]
    update?: LoginLogUpdateWithWhereUniqueWithoutUserInput | LoginLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginLogUpdateManyWithWhereWithoutUserInput | LoginLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginLogScalarWhereInput | LoginLogScalarWhereInput[]
  }

  export type VerificationCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<VerificationCodeCreateWithoutUserInput, VerificationCodeUncheckedCreateWithoutUserInput> | VerificationCodeCreateWithoutUserInput[] | VerificationCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VerificationCodeCreateOrConnectWithoutUserInput | VerificationCodeCreateOrConnectWithoutUserInput[]
    upsert?: VerificationCodeUpsertWithWhereUniqueWithoutUserInput | VerificationCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VerificationCodeCreateManyUserInputEnvelope
    set?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    disconnect?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    delete?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    connect?: VerificationCodeWhereUniqueInput | VerificationCodeWhereUniqueInput[]
    update?: VerificationCodeUpdateWithWhereUniqueWithoutUserInput | VerificationCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VerificationCodeUpdateManyWithWhereWithoutUserInput | VerificationCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VerificationCodeScalarWhereInput | VerificationCodeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLoginLogsInput = {
    create?: XOR<UserCreateWithoutLoginLogsInput, UserUncheckedCreateWithoutLoginLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutLoginLogsNestedInput = {
    create?: XOR<UserCreateWithoutLoginLogsInput, UserUncheckedCreateWithoutLoginLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginLogsInput
    upsert?: UserUpsertWithoutLoginLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLoginLogsInput, UserUpdateWithoutLoginLogsInput>, UserUncheckedUpdateWithoutLoginLogsInput>
  }

  export type UserCreateNestedOneWithoutVerificationCodesInput = {
    create?: XOR<UserCreateWithoutVerificationCodesInput, UserUncheckedCreateWithoutVerificationCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVerificationCodesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutVerificationCodesNestedInput = {
    create?: XOR<UserCreateWithoutVerificationCodesInput, UserUncheckedCreateWithoutVerificationCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVerificationCodesInput
    upsert?: UserUpsertWithoutVerificationCodesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVerificationCodesInput, UserUpdateWithoutVerificationCodesInput>, UserUncheckedUpdateWithoutVerificationCodesInput>
  }

  export type UserCreateNestedManyWithoutUserRoleInput = {
    create?: XOR<UserCreateWithoutUserRoleInput, UserUncheckedCreateWithoutUserRoleInput> | UserCreateWithoutUserRoleInput[] | UserUncheckedCreateWithoutUserRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutUserRoleInput | UserCreateOrConnectWithoutUserRoleInput[]
    createMany?: UserCreateManyUserRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type RolePermissionCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RoleMenuCreateNestedManyWithoutRoleInput = {
    create?: XOR<RoleMenuCreateWithoutRoleInput, RoleMenuUncheckedCreateWithoutRoleInput> | RoleMenuCreateWithoutRoleInput[] | RoleMenuUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutRoleInput | RoleMenuCreateOrConnectWithoutRoleInput[]
    createMany?: RoleMenuCreateManyRoleInputEnvelope
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutUserRoleInput = {
    create?: XOR<UserCreateWithoutUserRoleInput, UserUncheckedCreateWithoutUserRoleInput> | UserCreateWithoutUserRoleInput[] | UserUncheckedCreateWithoutUserRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutUserRoleInput | UserCreateOrConnectWithoutUserRoleInput[]
    createMany?: UserCreateManyUserRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RoleMenuUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RoleMenuCreateWithoutRoleInput, RoleMenuUncheckedCreateWithoutRoleInput> | RoleMenuCreateWithoutRoleInput[] | RoleMenuUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutRoleInput | RoleMenuCreateOrConnectWithoutRoleInput[]
    createMany?: RoleMenuCreateManyRoleInputEnvelope
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutUserRoleNestedInput = {
    create?: XOR<UserCreateWithoutUserRoleInput, UserUncheckedCreateWithoutUserRoleInput> | UserCreateWithoutUserRoleInput[] | UserUncheckedCreateWithoutUserRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutUserRoleInput | UserCreateOrConnectWithoutUserRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutUserRoleInput | UserUpsertWithWhereUniqueWithoutUserRoleInput[]
    createMany?: UserCreateManyUserRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutUserRoleInput | UserUpdateWithWhereUniqueWithoutUserRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutUserRoleInput | UserUpdateManyWithWhereWithoutUserRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RolePermissionUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RoleMenuUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RoleMenuCreateWithoutRoleInput, RoleMenuUncheckedCreateWithoutRoleInput> | RoleMenuCreateWithoutRoleInput[] | RoleMenuUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutRoleInput | RoleMenuCreateOrConnectWithoutRoleInput[]
    upsert?: RoleMenuUpsertWithWhereUniqueWithoutRoleInput | RoleMenuUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RoleMenuCreateManyRoleInputEnvelope
    set?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    disconnect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    delete?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    update?: RoleMenuUpdateWithWhereUniqueWithoutRoleInput | RoleMenuUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RoleMenuUpdateManyWithWhereWithoutRoleInput | RoleMenuUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RoleMenuScalarWhereInput | RoleMenuScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutUserRoleNestedInput = {
    create?: XOR<UserCreateWithoutUserRoleInput, UserUncheckedCreateWithoutUserRoleInput> | UserCreateWithoutUserRoleInput[] | UserUncheckedCreateWithoutUserRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutUserRoleInput | UserCreateOrConnectWithoutUserRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutUserRoleInput | UserUpsertWithWhereUniqueWithoutUserRoleInput[]
    createMany?: UserCreateManyUserRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutUserRoleInput | UserUpdateWithWhereUniqueWithoutUserRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutUserRoleInput | UserUpdateManyWithWhereWithoutUserRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RoleMenuUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RoleMenuCreateWithoutRoleInput, RoleMenuUncheckedCreateWithoutRoleInput> | RoleMenuCreateWithoutRoleInput[] | RoleMenuUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutRoleInput | RoleMenuCreateOrConnectWithoutRoleInput[]
    upsert?: RoleMenuUpsertWithWhereUniqueWithoutRoleInput | RoleMenuUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RoleMenuCreateManyRoleInputEnvelope
    set?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    disconnect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    delete?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    update?: RoleMenuUpdateWithWhereUniqueWithoutRoleInput | RoleMenuUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RoleMenuUpdateManyWithWhereWithoutRoleInput | RoleMenuUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RoleMenuScalarWhereInput | RoleMenuScalarWhereInput[]
  }

  export type RolePermissionCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutRolePermissionsInput = {
    create?: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRolePermissionsInput
    connect?: RoleWhereUniqueInput
  }

  export type PermissionCreateNestedOneWithoutRolePermissionsInput = {
    create?: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolePermissionsInput
    connect?: PermissionWhereUniqueInput
  }

  export type RoleUpdateOneRequiredWithoutRolePermissionsNestedInput = {
    create?: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRolePermissionsInput
    upsert?: RoleUpsertWithoutRolePermissionsInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutRolePermissionsInput, RoleUpdateWithoutRolePermissionsInput>, RoleUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput = {
    create?: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolePermissionsInput
    upsert?: PermissionUpsertWithoutRolePermissionsInput
    connect?: PermissionWhereUniqueInput
    update?: XOR<XOR<PermissionUpdateToOneWithWhereWithoutRolePermissionsInput, PermissionUpdateWithoutRolePermissionsInput>, PermissionUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type MenuCreateNestedOneWithoutChildrenInput = {
    create?: XOR<MenuCreateWithoutChildrenInput, MenuUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: MenuCreateOrConnectWithoutChildrenInput
    connect?: MenuWhereUniqueInput
  }

  export type MenuCreateNestedManyWithoutParentInput = {
    create?: XOR<MenuCreateWithoutParentInput, MenuUncheckedCreateWithoutParentInput> | MenuCreateWithoutParentInput[] | MenuUncheckedCreateWithoutParentInput[]
    connectOrCreate?: MenuCreateOrConnectWithoutParentInput | MenuCreateOrConnectWithoutParentInput[]
    createMany?: MenuCreateManyParentInputEnvelope
    connect?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
  }

  export type RoleMenuCreateNestedManyWithoutMenuInput = {
    create?: XOR<RoleMenuCreateWithoutMenuInput, RoleMenuUncheckedCreateWithoutMenuInput> | RoleMenuCreateWithoutMenuInput[] | RoleMenuUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutMenuInput | RoleMenuCreateOrConnectWithoutMenuInput[]
    createMany?: RoleMenuCreateManyMenuInputEnvelope
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
  }

  export type MenuUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<MenuCreateWithoutParentInput, MenuUncheckedCreateWithoutParentInput> | MenuCreateWithoutParentInput[] | MenuUncheckedCreateWithoutParentInput[]
    connectOrCreate?: MenuCreateOrConnectWithoutParentInput | MenuCreateOrConnectWithoutParentInput[]
    createMany?: MenuCreateManyParentInputEnvelope
    connect?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
  }

  export type RoleMenuUncheckedCreateNestedManyWithoutMenuInput = {
    create?: XOR<RoleMenuCreateWithoutMenuInput, RoleMenuUncheckedCreateWithoutMenuInput> | RoleMenuCreateWithoutMenuInput[] | RoleMenuUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutMenuInput | RoleMenuCreateOrConnectWithoutMenuInput[]
    createMany?: RoleMenuCreateManyMenuInputEnvelope
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
  }

  export type MenuUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<MenuCreateWithoutChildrenInput, MenuUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: MenuCreateOrConnectWithoutChildrenInput
    upsert?: MenuUpsertWithoutChildrenInput
    disconnect?: MenuWhereInput | boolean
    delete?: MenuWhereInput | boolean
    connect?: MenuWhereUniqueInput
    update?: XOR<XOR<MenuUpdateToOneWithWhereWithoutChildrenInput, MenuUpdateWithoutChildrenInput>, MenuUncheckedUpdateWithoutChildrenInput>
  }

  export type MenuUpdateManyWithoutParentNestedInput = {
    create?: XOR<MenuCreateWithoutParentInput, MenuUncheckedCreateWithoutParentInput> | MenuCreateWithoutParentInput[] | MenuUncheckedCreateWithoutParentInput[]
    connectOrCreate?: MenuCreateOrConnectWithoutParentInput | MenuCreateOrConnectWithoutParentInput[]
    upsert?: MenuUpsertWithWhereUniqueWithoutParentInput | MenuUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: MenuCreateManyParentInputEnvelope
    set?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    disconnect?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    delete?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    connect?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    update?: MenuUpdateWithWhereUniqueWithoutParentInput | MenuUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: MenuUpdateManyWithWhereWithoutParentInput | MenuUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: MenuScalarWhereInput | MenuScalarWhereInput[]
  }

  export type RoleMenuUpdateManyWithoutMenuNestedInput = {
    create?: XOR<RoleMenuCreateWithoutMenuInput, RoleMenuUncheckedCreateWithoutMenuInput> | RoleMenuCreateWithoutMenuInput[] | RoleMenuUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutMenuInput | RoleMenuCreateOrConnectWithoutMenuInput[]
    upsert?: RoleMenuUpsertWithWhereUniqueWithoutMenuInput | RoleMenuUpsertWithWhereUniqueWithoutMenuInput[]
    createMany?: RoleMenuCreateManyMenuInputEnvelope
    set?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    disconnect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    delete?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    update?: RoleMenuUpdateWithWhereUniqueWithoutMenuInput | RoleMenuUpdateWithWhereUniqueWithoutMenuInput[]
    updateMany?: RoleMenuUpdateManyWithWhereWithoutMenuInput | RoleMenuUpdateManyWithWhereWithoutMenuInput[]
    deleteMany?: RoleMenuScalarWhereInput | RoleMenuScalarWhereInput[]
  }

  export type MenuUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<MenuCreateWithoutParentInput, MenuUncheckedCreateWithoutParentInput> | MenuCreateWithoutParentInput[] | MenuUncheckedCreateWithoutParentInput[]
    connectOrCreate?: MenuCreateOrConnectWithoutParentInput | MenuCreateOrConnectWithoutParentInput[]
    upsert?: MenuUpsertWithWhereUniqueWithoutParentInput | MenuUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: MenuCreateManyParentInputEnvelope
    set?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    disconnect?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    delete?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    connect?: MenuWhereUniqueInput | MenuWhereUniqueInput[]
    update?: MenuUpdateWithWhereUniqueWithoutParentInput | MenuUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: MenuUpdateManyWithWhereWithoutParentInput | MenuUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: MenuScalarWhereInput | MenuScalarWhereInput[]
  }

  export type RoleMenuUncheckedUpdateManyWithoutMenuNestedInput = {
    create?: XOR<RoleMenuCreateWithoutMenuInput, RoleMenuUncheckedCreateWithoutMenuInput> | RoleMenuCreateWithoutMenuInput[] | RoleMenuUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: RoleMenuCreateOrConnectWithoutMenuInput | RoleMenuCreateOrConnectWithoutMenuInput[]
    upsert?: RoleMenuUpsertWithWhereUniqueWithoutMenuInput | RoleMenuUpsertWithWhereUniqueWithoutMenuInput[]
    createMany?: RoleMenuCreateManyMenuInputEnvelope
    set?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    disconnect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    delete?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    connect?: RoleMenuWhereUniqueInput | RoleMenuWhereUniqueInput[]
    update?: RoleMenuUpdateWithWhereUniqueWithoutMenuInput | RoleMenuUpdateWithWhereUniqueWithoutMenuInput[]
    updateMany?: RoleMenuUpdateManyWithWhereWithoutMenuInput | RoleMenuUpdateManyWithWhereWithoutMenuInput[]
    deleteMany?: RoleMenuScalarWhereInput | RoleMenuScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutRoleMenusInput = {
    create?: XOR<RoleCreateWithoutRoleMenusInput, RoleUncheckedCreateWithoutRoleMenusInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRoleMenusInput
    connect?: RoleWhereUniqueInput
  }

  export type MenuCreateNestedOneWithoutRoleMenusInput = {
    create?: XOR<MenuCreateWithoutRoleMenusInput, MenuUncheckedCreateWithoutRoleMenusInput>
    connectOrCreate?: MenuCreateOrConnectWithoutRoleMenusInput
    connect?: MenuWhereUniqueInput
  }

  export type RoleUpdateOneRequiredWithoutRoleMenusNestedInput = {
    create?: XOR<RoleCreateWithoutRoleMenusInput, RoleUncheckedCreateWithoutRoleMenusInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRoleMenusInput
    upsert?: RoleUpsertWithoutRoleMenusInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutRoleMenusInput, RoleUpdateWithoutRoleMenusInput>, RoleUncheckedUpdateWithoutRoleMenusInput>
  }

  export type MenuUpdateOneRequiredWithoutRoleMenusNestedInput = {
    create?: XOR<MenuCreateWithoutRoleMenusInput, MenuUncheckedCreateWithoutRoleMenusInput>
    connectOrCreate?: MenuCreateOrConnectWithoutRoleMenusInput
    upsert?: MenuUpsertWithoutRoleMenusInput
    connect?: MenuWhereUniqueInput
    update?: XOR<XOR<MenuUpdateToOneWithWhereWithoutRoleMenusInput, MenuUpdateWithoutRoleMenusInput>, MenuUncheckedUpdateWithoutRoleMenusInput>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type RoleCreateWithoutUsersInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    rolePermissions?: RolePermissionCreateNestedManyWithoutRoleInput
    roleMenus?: RoleMenuCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    rolePermissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
    roleMenus?: RoleMenuUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutUsersInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
  }

  export type LoginLogCreateWithoutUserInput = {
    id?: string
    loginTime?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type LoginLogUncheckedCreateWithoutUserInput = {
    id?: string
    loginTime?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type LoginLogCreateOrConnectWithoutUserInput = {
    where: LoginLogWhereUniqueInput
    create: XOR<LoginLogCreateWithoutUserInput, LoginLogUncheckedCreateWithoutUserInput>
  }

  export type LoginLogCreateManyUserInputEnvelope = {
    data: LoginLogCreateManyUserInput | LoginLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type VerificationCodeCreateWithoutUserInput = {
    id?: string
    code: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type VerificationCodeUncheckedCreateWithoutUserInput = {
    id?: string
    code: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type VerificationCodeCreateOrConnectWithoutUserInput = {
    where: VerificationCodeWhereUniqueInput
    create: XOR<VerificationCodeCreateWithoutUserInput, VerificationCodeUncheckedCreateWithoutUserInput>
  }

  export type VerificationCodeCreateManyUserInputEnvelope = {
    data: VerificationCodeCreateManyUserInput | VerificationCodeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RoleUpsertWithoutUsersInput = {
    update: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUsersInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rolePermissions?: RolePermissionUpdateManyWithoutRoleNestedInput
    roleMenus?: RoleMenuUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rolePermissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
    roleMenus?: RoleMenuUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type LoginLogUpsertWithWhereUniqueWithoutUserInput = {
    where: LoginLogWhereUniqueInput
    update: XOR<LoginLogUpdateWithoutUserInput, LoginLogUncheckedUpdateWithoutUserInput>
    create: XOR<LoginLogCreateWithoutUserInput, LoginLogUncheckedCreateWithoutUserInput>
  }

  export type LoginLogUpdateWithWhereUniqueWithoutUserInput = {
    where: LoginLogWhereUniqueInput
    data: XOR<LoginLogUpdateWithoutUserInput, LoginLogUncheckedUpdateWithoutUserInput>
  }

  export type LoginLogUpdateManyWithWhereWithoutUserInput = {
    where: LoginLogScalarWhereInput
    data: XOR<LoginLogUpdateManyMutationInput, LoginLogUncheckedUpdateManyWithoutUserInput>
  }

  export type LoginLogScalarWhereInput = {
    AND?: LoginLogScalarWhereInput | LoginLogScalarWhereInput[]
    OR?: LoginLogScalarWhereInput[]
    NOT?: LoginLogScalarWhereInput | LoginLogScalarWhereInput[]
    id?: UuidFilter<"LoginLog"> | string
    userId?: UuidFilter<"LoginLog"> | string
    loginTime?: DateTimeFilter<"LoginLog"> | Date | string
    ipAddress?: StringNullableFilter<"LoginLog"> | string | null
    userAgent?: StringNullableFilter<"LoginLog"> | string | null
  }

  export type VerificationCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: VerificationCodeWhereUniqueInput
    update: XOR<VerificationCodeUpdateWithoutUserInput, VerificationCodeUncheckedUpdateWithoutUserInput>
    create: XOR<VerificationCodeCreateWithoutUserInput, VerificationCodeUncheckedCreateWithoutUserInput>
  }

  export type VerificationCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: VerificationCodeWhereUniqueInput
    data: XOR<VerificationCodeUpdateWithoutUserInput, VerificationCodeUncheckedUpdateWithoutUserInput>
  }

  export type VerificationCodeUpdateManyWithWhereWithoutUserInput = {
    where: VerificationCodeScalarWhereInput
    data: XOR<VerificationCodeUpdateManyMutationInput, VerificationCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type VerificationCodeScalarWhereInput = {
    AND?: VerificationCodeScalarWhereInput | VerificationCodeScalarWhereInput[]
    OR?: VerificationCodeScalarWhereInput[]
    NOT?: VerificationCodeScalarWhereInput | VerificationCodeScalarWhereInput[]
    id?: UuidFilter<"VerificationCode"> | string
    userId?: UuidFilter<"VerificationCode"> | string
    code?: StringFilter<"VerificationCode"> | string
    createdAt?: DateTimeFilter<"VerificationCode"> | Date | string
    expiresAt?: DateTimeFilter<"VerificationCode"> | Date | string
  }

  export type UserCreateWithoutLoginLogsInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    status?: string | null
    userRole?: RoleCreateNestedOneWithoutUsersInput
    verificationCodes?: VerificationCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLoginLogsInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    roleId?: string | null
    status?: string | null
    verificationCodes?: VerificationCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLoginLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLoginLogsInput, UserUncheckedCreateWithoutLoginLogsInput>
  }

  export type UserUpsertWithoutLoginLogsInput = {
    update: XOR<UserUpdateWithoutLoginLogsInput, UserUncheckedUpdateWithoutLoginLogsInput>
    create: XOR<UserCreateWithoutLoginLogsInput, UserUncheckedCreateWithoutLoginLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLoginLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLoginLogsInput, UserUncheckedUpdateWithoutLoginLogsInput>
  }

  export type UserUpdateWithoutLoginLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: RoleUpdateOneWithoutUsersNestedInput
    verificationCodes?: VerificationCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLoginLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    verificationCodes?: VerificationCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutVerificationCodesInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    status?: string | null
    userRole?: RoleCreateNestedOneWithoutUsersInput
    loginLogs?: LoginLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVerificationCodesInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    roleId?: string | null
    status?: string | null
    loginLogs?: LoginLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVerificationCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVerificationCodesInput, UserUncheckedCreateWithoutVerificationCodesInput>
  }

  export type UserUpsertWithoutVerificationCodesInput = {
    update: XOR<UserUpdateWithoutVerificationCodesInput, UserUncheckedUpdateWithoutVerificationCodesInput>
    create: XOR<UserCreateWithoutVerificationCodesInput, UserUncheckedCreateWithoutVerificationCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVerificationCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVerificationCodesInput, UserUncheckedUpdateWithoutVerificationCodesInput>
  }

  export type UserUpdateWithoutVerificationCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: RoleUpdateOneWithoutUsersNestedInput
    loginLogs?: LoginLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVerificationCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    loginLogs?: LoginLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutUserRoleInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    status?: string | null
    loginLogs?: LoginLogCreateNestedManyWithoutUserInput
    verificationCodes?: VerificationCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserRoleInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    status?: string | null
    loginLogs?: LoginLogUncheckedCreateNestedManyWithoutUserInput
    verificationCodes?: VerificationCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserRoleInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserRoleInput, UserUncheckedCreateWithoutUserRoleInput>
  }

  export type UserCreateManyUserRoleInputEnvelope = {
    data: UserCreateManyUserRoleInput | UserCreateManyUserRoleInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionCreateWithoutRoleInput = {
    createdAt?: Date | string
    deletedAt?: Date | string | null
    permission: PermissionCreateNestedOneWithoutRolePermissionsInput
  }

  export type RolePermissionUncheckedCreateWithoutRoleInput = {
    permissionId: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RolePermissionCreateOrConnectWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionCreateManyRoleInputEnvelope = {
    data: RolePermissionCreateManyRoleInput | RolePermissionCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type RoleMenuCreateWithoutRoleInput = {
    createdAt?: Date | string
    menu: MenuCreateNestedOneWithoutRoleMenusInput
  }

  export type RoleMenuUncheckedCreateWithoutRoleInput = {
    menuId: string
    createdAt?: Date | string
  }

  export type RoleMenuCreateOrConnectWithoutRoleInput = {
    where: RoleMenuWhereUniqueInput
    create: XOR<RoleMenuCreateWithoutRoleInput, RoleMenuUncheckedCreateWithoutRoleInput>
  }

  export type RoleMenuCreateManyRoleInputEnvelope = {
    data: RoleMenuCreateManyRoleInput | RoleMenuCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutUserRoleInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutUserRoleInput, UserUncheckedUpdateWithoutUserRoleInput>
    create: XOR<UserCreateWithoutUserRoleInput, UserUncheckedCreateWithoutUserRoleInput>
  }

  export type UserUpdateWithWhereUniqueWithoutUserRoleInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutUserRoleInput, UserUncheckedUpdateWithoutUserRoleInput>
  }

  export type UserUpdateManyWithWhereWithoutUserRoleInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutUserRoleInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: UuidFilter<"User"> | string
    instanceId?: UuidNullableFilter<"User"> | string | null
    aud?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    encryptedPassword?: StringNullableFilter<"User"> | string | null
    emailConfirmedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    invitedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    confirmationToken?: StringNullableFilter<"User"> | string | null
    confirmationSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    recoveryToken?: StringNullableFilter<"User"> | string | null
    recoverySentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    emailChangeTokenNew?: StringNullableFilter<"User"> | string | null
    emailChange?: StringNullableFilter<"User"> | string | null
    emailChangeSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastSignInAt?: DateTimeNullableFilter<"User"> | Date | string | null
    rawAppMetaData?: JsonNullableFilter<"User">
    rawUserMetaData?: JsonNullableFilter<"User">
    isSuperAdmin?: BoolNullableFilter<"User"> | boolean | null
    createdAt?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phone?: StringNullableFilter<"User"> | string | null
    phoneConfirmedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    phoneChange?: StringNullableFilter<"User"> | string | null
    phoneChangeToken?: StringNullableFilter<"User"> | string | null
    phoneChangeSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    emailChangeTokenCurrent?: StringNullableFilter<"User"> | string | null
    emailChangeConfirmStatus?: IntNullableFilter<"User"> | number | null
    bannedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    reauthenticationToken?: StringNullableFilter<"User"> | string | null
    reauthenticationSentAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isSsoUser?: BoolFilter<"User"> | boolean
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    isAnonymous?: BoolFilter<"User"> | boolean
    username?: StringNullableFilter<"User"> | string | null
    phoneNumber?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    roleId?: UuidNullableFilter<"User"> | string | null
    status?: StringNullableFilter<"User"> | string | null
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutRoleInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePermissionScalarWhereInput = {
    AND?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    OR?: RolePermissionScalarWhereInput[]
    NOT?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    roleId?: UuidFilter<"RolePermission"> | string
    permissionId?: UuidFilter<"RolePermission"> | string
    createdAt?: DateTimeFilter<"RolePermission"> | Date | string
    deletedAt?: DateTimeNullableFilter<"RolePermission"> | Date | string | null
  }

  export type RoleMenuUpsertWithWhereUniqueWithoutRoleInput = {
    where: RoleMenuWhereUniqueInput
    update: XOR<RoleMenuUpdateWithoutRoleInput, RoleMenuUncheckedUpdateWithoutRoleInput>
    create: XOR<RoleMenuCreateWithoutRoleInput, RoleMenuUncheckedCreateWithoutRoleInput>
  }

  export type RoleMenuUpdateWithWhereUniqueWithoutRoleInput = {
    where: RoleMenuWhereUniqueInput
    data: XOR<RoleMenuUpdateWithoutRoleInput, RoleMenuUncheckedUpdateWithoutRoleInput>
  }

  export type RoleMenuUpdateManyWithWhereWithoutRoleInput = {
    where: RoleMenuScalarWhereInput
    data: XOR<RoleMenuUpdateManyMutationInput, RoleMenuUncheckedUpdateManyWithoutRoleInput>
  }

  export type RoleMenuScalarWhereInput = {
    AND?: RoleMenuScalarWhereInput | RoleMenuScalarWhereInput[]
    OR?: RoleMenuScalarWhereInput[]
    NOT?: RoleMenuScalarWhereInput | RoleMenuScalarWhereInput[]
    roleId?: UuidFilter<"RoleMenu"> | string
    menuId?: UuidFilter<"RoleMenu"> | string
    createdAt?: DateTimeFilter<"RoleMenu"> | Date | string
  }

  export type RolePermissionCreateWithoutPermissionInput = {
    createdAt?: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutRolePermissionsInput
  }

  export type RolePermissionUncheckedCreateWithoutPermissionInput = {
    roleId: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RolePermissionCreateOrConnectWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionCreateManyPermissionInputEnvelope = {
    data: RolePermissionCreateManyPermissionInput | RolePermissionCreateManyPermissionInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutPermissionInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutPermissionInput>
  }

  export type RoleCreateWithoutRolePermissionsInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    users?: UserCreateNestedManyWithoutUserRoleInput
    roleMenus?: RoleMenuCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutRolePermissionsInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutUserRoleInput
    roleMenus?: RoleMenuUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutRolePermissionsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
  }

  export type PermissionCreateWithoutRolePermissionsInput = {
    id?: string
    name: string
    description?: string | null
    groupName?: string | null
    status?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PermissionUncheckedCreateWithoutRolePermissionsInput = {
    id?: string
    name: string
    description?: string | null
    groupName?: string | null
    status?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PermissionCreateOrConnectWithoutRolePermissionsInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
  }

  export type RoleUpsertWithoutRolePermissionsInput = {
    update: XOR<RoleUpdateWithoutRolePermissionsInput, RoleUncheckedUpdateWithoutRolePermissionsInput>
    create: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutRolePermissionsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutRolePermissionsInput, RoleUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type RoleUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutUserRoleNestedInput
    roleMenus?: RoleMenuUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutUserRoleNestedInput
    roleMenus?: RoleMenuUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type PermissionUpsertWithoutRolePermissionsInput = {
    update: XOR<PermissionUpdateWithoutRolePermissionsInput, PermissionUncheckedUpdateWithoutRolePermissionsInput>
    create: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
    where?: PermissionWhereInput
  }

  export type PermissionUpdateToOneWithWhereWithoutRolePermissionsInput = {
    where?: PermissionWhereInput
    data: XOR<PermissionUpdateWithoutRolePermissionsInput, PermissionUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type PermissionUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    groupName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PermissionUncheckedUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    groupName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MenuCreateWithoutChildrenInput = {
    id?: string
    name: string
    url?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    parent?: MenuCreateNestedOneWithoutChildrenInput
    roleMenus?: RoleMenuCreateNestedManyWithoutMenuInput
  }

  export type MenuUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    url?: string | null
    parentId?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    roleMenus?: RoleMenuUncheckedCreateNestedManyWithoutMenuInput
  }

  export type MenuCreateOrConnectWithoutChildrenInput = {
    where: MenuWhereUniqueInput
    create: XOR<MenuCreateWithoutChildrenInput, MenuUncheckedCreateWithoutChildrenInput>
  }

  export type MenuCreateWithoutParentInput = {
    id?: string
    name: string
    url?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    children?: MenuCreateNestedManyWithoutParentInput
    roleMenus?: RoleMenuCreateNestedManyWithoutMenuInput
  }

  export type MenuUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    url?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    children?: MenuUncheckedCreateNestedManyWithoutParentInput
    roleMenus?: RoleMenuUncheckedCreateNestedManyWithoutMenuInput
  }

  export type MenuCreateOrConnectWithoutParentInput = {
    where: MenuWhereUniqueInput
    create: XOR<MenuCreateWithoutParentInput, MenuUncheckedCreateWithoutParentInput>
  }

  export type MenuCreateManyParentInputEnvelope = {
    data: MenuCreateManyParentInput | MenuCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type RoleMenuCreateWithoutMenuInput = {
    createdAt?: Date | string
    role: RoleCreateNestedOneWithoutRoleMenusInput
  }

  export type RoleMenuUncheckedCreateWithoutMenuInput = {
    roleId: string
    createdAt?: Date | string
  }

  export type RoleMenuCreateOrConnectWithoutMenuInput = {
    where: RoleMenuWhereUniqueInput
    create: XOR<RoleMenuCreateWithoutMenuInput, RoleMenuUncheckedCreateWithoutMenuInput>
  }

  export type RoleMenuCreateManyMenuInputEnvelope = {
    data: RoleMenuCreateManyMenuInput | RoleMenuCreateManyMenuInput[]
    skipDuplicates?: boolean
  }

  export type MenuUpsertWithoutChildrenInput = {
    update: XOR<MenuUpdateWithoutChildrenInput, MenuUncheckedUpdateWithoutChildrenInput>
    create: XOR<MenuCreateWithoutChildrenInput, MenuUncheckedCreateWithoutChildrenInput>
    where?: MenuWhereInput
  }

  export type MenuUpdateToOneWithWhereWithoutChildrenInput = {
    where?: MenuWhereInput
    data: XOR<MenuUpdateWithoutChildrenInput, MenuUncheckedUpdateWithoutChildrenInput>
  }

  export type MenuUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parent?: MenuUpdateOneWithoutChildrenNestedInput
    roleMenus?: RoleMenuUpdateManyWithoutMenuNestedInput
  }

  export type MenuUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roleMenus?: RoleMenuUncheckedUpdateManyWithoutMenuNestedInput
  }

  export type MenuUpsertWithWhereUniqueWithoutParentInput = {
    where: MenuWhereUniqueInput
    update: XOR<MenuUpdateWithoutParentInput, MenuUncheckedUpdateWithoutParentInput>
    create: XOR<MenuCreateWithoutParentInput, MenuUncheckedCreateWithoutParentInput>
  }

  export type MenuUpdateWithWhereUniqueWithoutParentInput = {
    where: MenuWhereUniqueInput
    data: XOR<MenuUpdateWithoutParentInput, MenuUncheckedUpdateWithoutParentInput>
  }

  export type MenuUpdateManyWithWhereWithoutParentInput = {
    where: MenuScalarWhereInput
    data: XOR<MenuUpdateManyMutationInput, MenuUncheckedUpdateManyWithoutParentInput>
  }

  export type MenuScalarWhereInput = {
    AND?: MenuScalarWhereInput | MenuScalarWhereInput[]
    OR?: MenuScalarWhereInput[]
    NOT?: MenuScalarWhereInput | MenuScalarWhereInput[]
    id?: UuidFilter<"Menu"> | string
    name?: StringFilter<"Menu"> | string
    url?: StringNullableFilter<"Menu"> | string | null
    parentId?: UuidNullableFilter<"Menu"> | string | null
    sortOrder?: IntNullableFilter<"Menu"> | number | null
    icon?: StringNullableFilter<"Menu"> | string | null
    description?: StringNullableFilter<"Menu"> | string | null
    component?: StringNullableFilter<"Menu"> | string | null
    createdAt?: DateTimeFilter<"Menu"> | Date | string
    updatedAt?: DateTimeFilter<"Menu"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Menu"> | Date | string | null
  }

  export type RoleMenuUpsertWithWhereUniqueWithoutMenuInput = {
    where: RoleMenuWhereUniqueInput
    update: XOR<RoleMenuUpdateWithoutMenuInput, RoleMenuUncheckedUpdateWithoutMenuInput>
    create: XOR<RoleMenuCreateWithoutMenuInput, RoleMenuUncheckedCreateWithoutMenuInput>
  }

  export type RoleMenuUpdateWithWhereUniqueWithoutMenuInput = {
    where: RoleMenuWhereUniqueInput
    data: XOR<RoleMenuUpdateWithoutMenuInput, RoleMenuUncheckedUpdateWithoutMenuInput>
  }

  export type RoleMenuUpdateManyWithWhereWithoutMenuInput = {
    where: RoleMenuScalarWhereInput
    data: XOR<RoleMenuUpdateManyMutationInput, RoleMenuUncheckedUpdateManyWithoutMenuInput>
  }

  export type RoleCreateWithoutRoleMenusInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    users?: UserCreateNestedManyWithoutUserRoleInput
    rolePermissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutRoleMenusInput = {
    id?: string
    name: string
    description?: string | null
    status?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutUserRoleInput
    rolePermissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutRoleMenusInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutRoleMenusInput, RoleUncheckedCreateWithoutRoleMenusInput>
  }

  export type MenuCreateWithoutRoleMenusInput = {
    id?: string
    name: string
    url?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    parent?: MenuCreateNestedOneWithoutChildrenInput
    children?: MenuCreateNestedManyWithoutParentInput
  }

  export type MenuUncheckedCreateWithoutRoleMenusInput = {
    id?: string
    name: string
    url?: string | null
    parentId?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    children?: MenuUncheckedCreateNestedManyWithoutParentInput
  }

  export type MenuCreateOrConnectWithoutRoleMenusInput = {
    where: MenuWhereUniqueInput
    create: XOR<MenuCreateWithoutRoleMenusInput, MenuUncheckedCreateWithoutRoleMenusInput>
  }

  export type RoleUpsertWithoutRoleMenusInput = {
    update: XOR<RoleUpdateWithoutRoleMenusInput, RoleUncheckedUpdateWithoutRoleMenusInput>
    create: XOR<RoleCreateWithoutRoleMenusInput, RoleUncheckedCreateWithoutRoleMenusInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutRoleMenusInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutRoleMenusInput, RoleUncheckedUpdateWithoutRoleMenusInput>
  }

  export type RoleUpdateWithoutRoleMenusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutUserRoleNestedInput
    rolePermissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutRoleMenusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutUserRoleNestedInput
    rolePermissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type MenuUpsertWithoutRoleMenusInput = {
    update: XOR<MenuUpdateWithoutRoleMenusInput, MenuUncheckedUpdateWithoutRoleMenusInput>
    create: XOR<MenuCreateWithoutRoleMenusInput, MenuUncheckedCreateWithoutRoleMenusInput>
    where?: MenuWhereInput
  }

  export type MenuUpdateToOneWithWhereWithoutRoleMenusInput = {
    where?: MenuWhereInput
    data: XOR<MenuUpdateWithoutRoleMenusInput, MenuUncheckedUpdateWithoutRoleMenusInput>
  }

  export type MenuUpdateWithoutRoleMenusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parent?: MenuUpdateOneWithoutChildrenNestedInput
    children?: MenuUpdateManyWithoutParentNestedInput
  }

  export type MenuUncheckedUpdateWithoutRoleMenusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: MenuUncheckedUpdateManyWithoutParentNestedInput
  }

  export type LoginLogCreateManyUserInput = {
    id?: string
    loginTime?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type VerificationCodeCreateManyUserInput = {
    id?: string
    code: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type LoginLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    loginTime?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LoginLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    loginTime?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LoginLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    loginTime?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VerificationCodeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCodeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCodeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyUserRoleInput = {
    id?: string
    instanceId?: string | null
    aud?: string | null
    role?: string | null
    email?: string | null
    encryptedPassword?: string | null
    emailConfirmedAt?: Date | string | null
    invitedAt?: Date | string | null
    confirmationToken?: string | null
    confirmationSentAt?: Date | string | null
    recoveryToken?: string | null
    recoverySentAt?: Date | string | null
    emailChangeTokenNew?: string | null
    emailChange?: string | null
    emailChangeSentAt?: Date | string | null
    lastSignInAt?: Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: boolean | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    phone?: string | null
    phoneConfirmedAt?: Date | string | null
    phoneChange?: string | null
    phoneChangeToken?: string | null
    phoneChangeSentAt?: Date | string | null
    emailChangeTokenCurrent?: string | null
    emailChangeConfirmStatus?: number | null
    bannedUntil?: Date | string | null
    reauthenticationToken?: string | null
    reauthenticationSentAt?: Date | string | null
    isSsoUser?: boolean
    deletedAt?: Date | string | null
    isAnonymous?: boolean
    username?: string | null
    phoneNumber?: string | null
    avatarUrl?: string | null
    status?: string | null
  }

  export type RolePermissionCreateManyRoleInput = {
    permissionId: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RoleMenuCreateManyRoleInput = {
    menuId: string
    createdAt?: Date | string
  }

  export type UserUpdateWithoutUserRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    loginLogs?: LoginLogUpdateManyWithoutUserNestedInput
    verificationCodes?: VerificationCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    loginLogs?: LoginLogUncheckedUpdateManyWithoutUserNestedInput
    verificationCodes?: VerificationCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutUserRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    instanceId?: NullableStringFieldUpdateOperationsInput | string | null
    aud?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    emailConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invitedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recoveryToken?: NullableStringFieldUpdateOperationsInput | string | null
    recoverySentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenNew?: NullableStringFieldUpdateOperationsInput | string | null
    emailChange?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSignInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawAppMetaData?: NullableJsonNullValueInput | InputJsonValue
    rawUserMetaData?: NullableJsonNullValueInput | InputJsonValue
    isSuperAdmin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneConfirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phoneChange?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeToken?: NullableStringFieldUpdateOperationsInput | string | null
    phoneChangeSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailChangeTokenCurrent?: NullableStringFieldUpdateOperationsInput | string | null
    emailChangeConfirmStatus?: NullableIntFieldUpdateOperationsInput | number | null
    bannedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reauthenticationToken?: NullableStringFieldUpdateOperationsInput | string | null
    reauthenticationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isSsoUser?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isAnonymous?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RolePermissionUpdateWithoutRoleInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    permission?: PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutRoleInput = {
    permissionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleInput = {
    permissionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoleMenuUpdateWithoutRoleInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    menu?: MenuUpdateOneRequiredWithoutRoleMenusNestedInput
  }

  export type RoleMenuUncheckedUpdateWithoutRoleInput = {
    menuId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleMenuUncheckedUpdateManyWithoutRoleInput = {
    menuId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RolePermissionCreateManyPermissionInput = {
    roleId: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RolePermissionUpdateWithoutPermissionInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutRolePermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutPermissionInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MenuCreateManyParentInput = {
    id?: string
    name: string
    url?: string | null
    sortOrder?: number | null
    icon?: string | null
    description?: string | null
    component?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type RoleMenuCreateManyMenuInput = {
    roleId: string
    createdAt?: Date | string
  }

  export type MenuUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: MenuUpdateManyWithoutParentNestedInput
    roleMenus?: RoleMenuUpdateManyWithoutMenuNestedInput
  }

  export type MenuUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: MenuUncheckedUpdateManyWithoutParentNestedInput
    roleMenus?: RoleMenuUncheckedUpdateManyWithoutMenuNestedInput
  }

  export type MenuUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    component?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoleMenuUpdateWithoutMenuInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutRoleMenusNestedInput
  }

  export type RoleMenuUncheckedUpdateWithoutMenuInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleMenuUncheckedUpdateManyWithoutMenuInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}