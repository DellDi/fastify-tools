import { Type } from '@sinclair/typebox';
import { JiraCreateExportResponse, JiraCreateExportBody } from './jira.js';
const InputData = Type.Intersect([
    Type.Object({
        point: Type.String({
            default: 'ping',
            description: "触发标识:'ping' | 触发接口: 'app.external_data_tool.query'",
        }),
    }),
    JiraCreateExportBody,
]);
const DifyResponse = Type.Intersect([
    Type.Object({
        result: Type.String(),
    }),
    JiraCreateExportResponse,
]);
const ErrorResponse = Type.Object({
    error: Type.String(),
});
export const difySchema = {
    tags: ['dify'],
    body: InputData,
    response: {
        200: DifyResponse,
        400: ErrorResponse,
    },
};
