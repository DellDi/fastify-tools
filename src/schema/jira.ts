import { Static, Type } from '@sinclair/typebox'

const JiraLoginBody = Type.Object({
  jiraUser: Type.String({ default: process.env.JIRA_USER }),
  jiraPassword: Type.String({ default: process.env.JIRA_PASSWORD }),
})

const JiraLoginResponse = Type.Object({
  cookies: Type.String(),
  atlToken: Type.String(),
})

export const jiraLoginSchema = {
  description: 'Login to Jira',
  tags: ['jira'],
  body: JiraLoginBody,
  response: {
    200: JiraLoginResponse,
  },
}

export type JiraLoginBodyType = Static<typeof JiraLoginBody>
export type JiraLoginResponseType = Static<typeof JiraLoginResponse>

const JiraCreateExportBody = Type.Object({
  title: Type.String({ default: 'JIRA_TITLE', description: '单子标题' }),
  description: Type.Optional(Type.String({ default: 'JIRA_DESCRIPTION', description: '单子描述' })),
  assignee: Type.String({
    default: 'JIRA_ASSIGNEE_USER',
    description: '经办人',
  }),
})

const AvatarUrls = Type.Object({
  '48x48': Type.String(),
  '24x24': Type.String(),
  '16x16': Type.String(),
  '32x32': Type.String(),
})

const JiraCreateExportResponse = Type.Object({
  issueKey: Type.String(),
  issueId: Type.String(),
  issueUrl: Type.String(),
  avatarUrls: AvatarUrls,
})

export const jiraCreateExport = {
  description: 'Create a Jira ticket',
  tags: ['jira'],
  body: JiraCreateExportBody,
  response: {
    200: JiraCreateExportResponse,
  },
}

export type JiraCreateExportBodyType = Static<typeof JiraCreateExportBody>
export type JiraCreateExportResponseType = Static<
  typeof JiraCreateExportResponse
>

const JiraUpdateBody = Type.Object({
  customfield_12600: Type.Optional(Type.String()),
  'customfield_12600:1': Type.Optional(Type.String()),
  issueId: Type.Number(),
  atl_token: Type.String(),
  singleFieldEdit: Type.Boolean(),
  fieldsToForcePresent: Type.String(),
})

const responseUpdateSchema = Type.Object({
  message: Type.String(),
})

export const JiraUpdateTicketSchema = {
  body: JiraUpdateBody,
  response: {
    200: responseUpdateSchema,
  },
}

export type JiraUpdateTicket = Static<typeof JiraUpdateBody>

export type JiraUpdateResponseSchema = Static<typeof responseUpdateSchema>
