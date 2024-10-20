export const SAAS_JQL = 'resolution in (Unresolved) AND status in (新建, 创建工单) AND fixVersion = EMPTY AND created >= startOfYear()  ORDER BY created DESC, status ASC, resolution DESC, fixVersion ASC, updated DESC'

// 调整jql created 为近三个月
export const SAAS_JQL_3M = 'resolution in (Unresolved) AND status in (新建, 创建工单) AND fixVersion = EMPTY AND created >= startOfMonth(-2) ORDER BY created DESC, status ASC, resolution DESC, fixVersion ASC, updated DESC'
