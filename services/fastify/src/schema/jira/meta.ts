import { Type, Static } from '@sinclair/typebox'

export const FieldMetaBean = Type.Object({
  name: Type.String(),
  fieldId: Type.String(),
  required: Type.Boolean(),
  allowedValues: Type.Array(
    Type.Object({
      self: Type.String(),
      id: Type.String(),
      value: Type.Optional(Type.String()),
      name: Type.Optional(Type.String()),
      iconUrl: Type.Optional(Type.String()),
      child: Type.Optional(
        Type.Object({
          id: Type.String(),
          value: Type.Optional(Type.String()),
          self: Type.Optional(Type.String()),
          iconUrl: Type.Optional(Type.String()),
        })
      ),
    })
  ),

  schema: Type.Object({
    type: Type.String(),
    system: Type.Optional(Type.String()),
    items: Type.Optional(Type.String()),
    custom: Type.Optional(Type.String()),
    customId: Type.Optional(Type.Number()),
  }),
  autoCompleteUrl: Type.String(),
  defaultValue: Type.Optional(
    Type.Object({
      self: Type.String(),
      id: Type.String(),
      value: Type.Optional(Type.String()),
      name: Type.Optional(Type.String()),
      iconUrl: Type.Optional(Type.String()),
    })
  ),
  hasDefaultValue: Type.Boolean(),
  operations: Type.Array(Type.String()),
})


export type JiraMeta = Static<typeof FieldMetaBean>
