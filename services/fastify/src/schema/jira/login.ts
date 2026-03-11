import { Static, Type } from '@sinclair/typebox'

export const JiraLoginBody = Type.Object({
  jiraUser: Type.String({ default: process.env.JIRA_USERNAME }),
  jiraPassword: Type.String({ default: process.env.JIRA_PASSWORD }),
})

export const JiraLoginResponse = Type.Object({
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
