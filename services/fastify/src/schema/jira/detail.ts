import { Type, Static } from '@sinclair/typebox'

const Header = Type.Object({
  id: Type.String(),
  iconClass: Type.String(),
  label: Type.String(),
  title: Type.String(),
  contentId: Type.String(),
})

const Header2 = Type.Object({
  id: Type.String(),
  label: Type.String(),
  contentId: Type.String(),
  styleClass: Type.Optional(Type.String()),
})

const HeaderLinks2 = Type.Object({
  links: Type.Array(Type.Any()),
  groups: Type.Array(Type.Any()),
})

const RightPanel = Type.Object({
  completeKey: Type.String(),
  prefix: Type.String(),
  id: Type.String(),
  styleClass: Type.String(),
  label: Type.String(),
  renderHeader: Type.Boolean(),
  headerLinks: HeaderLinks2,
  subpanelHtmls: Type.Array(Type.Any()),
  html: Type.String(),
  weight: Type.Number(),
  contentId: Type.String(),
})

const Status = Type.Object({
  iconUrl: Type.String(),
  name: Type.String(),
  id: Type.String(),
})

const Link2 = Type.Object({
  id: Type.String(),
  styleClass: Type.Optional(Type.String()),
  iconClass: Type.Optional(Type.String()),
  label: Type.String(),
  title: Type.Optional(Type.String()),
  href: Type.String(),
  weight: Type.Optional(Type.Number()),
  contentId: Type.String(),
})

const Link3 = Type.Object({
  id: Type.String(),
  styleClass: Type.String(),
  href: Type.String(),
  weight: Type.Number(),
  contentId: Type.String(),
  label: Type.Optional(Type.String()),
  title: Type.Optional(Type.String()),
})

const Params = Type.Object({})

const Link4 = Type.Object({
  id: Type.String(),
  styleClass: Type.String(),
  label: Type.String(),
  title: Type.String(),
  href: Type.String(),
  weight: Type.Number(),
  params: Params,
})
const Header3 = Type.Object({
  id: Type.String(),
  weight: Type.Number(),
})

const Params2 = Type.Object({
  ariaChecked: Type.Optional(Type.String()),
})

const Link5 = Type.Object({
  id: Type.String(),
  styleClass: Type.String(),
  label: Type.String(),
  title: Type.String(),
  href: Type.String(),
  weight: Type.Number(),
  params: Params2,
})

const Group4 = Type.Object({
  header: Header3,
  links: Type.Array(Link5),
  groups: Type.Array(Type.Any()),
})

const HeaderLinks = Type.Object({
  links: Type.Array(Link4),
  groups: Type.Array(Group4),
})

const LeftPanel = Type.Object({
  completeKey: Type.String(),
  prefix: Type.String(),
  id: Type.String(),
  styleClass: Type.String(),
  label: Type.String(),
  renderHeader: Type.Boolean(),
  headerLinks: HeaderLinks,
  subpanelHtmls: Type.Array(Type.Any()),
  html: Type.String(),
  weight: Type.Number(),
  contentId: Type.String(),
})

const Panels = Type.Object({
  leftPanels: Type.Array(LeftPanel),
  rightPanels: Type.Array(RightPanel),
  infoPanels: Type.Array(Type.Any()),
})

const Group3 = Type.Object({
  id: Type.String(),
  weight: Type.Number(),
  links: Type.Array(Link3),
  groups: Type.Array(Type.Any()),
})

const Group2 = Type.Object({
  header: Header2,
  links: Type.Array(Type.Any()),
  groups: Type.Array(Group3),
})

const Link = Type.Object({
  id: Type.String(),
  styleClass: Type.String(),
  iconClass: Type.String(),
  label: Type.String(),
  title: Type.String(),
  href: Type.String(),
  weight: Type.Number(),
  contentId: Type.String(),
})

const Group = Type.Object({
  id: Type.String(),
  header: Type.Optional(Header),
  links: Type.Array(Link2),
  groups: Type.Array(Group2),
  weight: Type.Optional(Type.Number()),
})

const Errors = Type.Object({})

const ErrorCollection = Type.Object({
  errorMessages: Type.Array(Type.Any()),
  errors: Errors,
})

const Metadata = Type.Object({
  'can-search-users': Type.String(),
  'can-edit-watchers': Type.String(),
  'default-avatar-url': Type.String(),
  'issue-project-type': Type.String(),
  'issue-key': Type.String(),
})
const LinkGroup = Type.Object({
  id: Type.String(),
  links: Type.Array(Link),
  groups: Type.Array(Group),
})

const Operations = Type.Object({
  linkGroups: Type.Array(LinkGroup),
})

const AvatarUrls = Type.Object({
  '48x48': Type.String(),
  '24x24': Type.String(),
  '16x16': Type.String(),
  '32x32': Type.String(),
})

const Project = Type.Object({
  id: Type.Number(),
  key: Type.String(),
  projectType: Type.String(),
  name: Type.String(),
  avatarUrls: AvatarUrls,
  systemAvatar: Type.Boolean(),
  archived: Type.Boolean(),
})

const Issue = Type.Object({
  id: Type.Number(),
  key: Type.String(),
  metadata: Metadata,
  operations: Operations,
  project: Project,
  status: Status,
  summary: Type.String(),
  summaryContentId: Type.String(),
  isEditable: Type.Boolean(),
  archived: Type.Boolean(),
})

const RemovedContentIds = Type.Object({})

export const JiraDetailRoot = Type.Object({
  fields: Type.Array(Type.Any()),
  errorCollection: ErrorCollection,
  issue: Issue,
  panels: Panels,
  removedContentIds: RemovedContentIds,
  readTime: Type.Number(),
  atl_token: Type.String(),
})

export type JiraDetail = Static<typeof JiraDetailRoot>

export type jiraOrgParams = {
  issueKey: string
  decorator: string
  prefetch: string
  shouldUpdateCurrentProject: string
  loadFields: string
  _: string
}

export const jiraDetailSchema = {
  description: '根据Jira单子keyOrId获取单子详情',
  tags: ['jira'],
  params: Type.Object({
    issueIdOrKey: Type.String({ default: 'V10-000' }),
  }),
  response: {
    200: JiraDetailRoot,
    400: Type.Object({
      error: Type.String(),
    }),
  },
}
