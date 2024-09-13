export const singleUpload = {
    description: '单文件上传的接口',
    tags: ['upload'],
    consumes: ['multipart/form-data'],
    body: {
        type: 'object',
        properties: {
            file: {
                type: 'object',
                properties: {
                    filename: { type: 'string' },
                    data: { type: 'string' },
                },
            },
        },
    },
};
export const multipleUpload = {
    description: '大文件分片上传的接口',
    tags: ['upload'],
    consumes: ['multipart/form-data'],
    body: {
        type: 'object',
        properties: {
            file: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        filename: { type: 'string' },
                        data: { type: 'string' },
                    },
                },
            },
        },
    },
};
export const uploadBatch = {
    description: '在单个请求中上传多个文件',
    tags: ['upload'],
    consumes: ['multipart/form-data'],
    body: {
        type: 'object',
        properties: {
            files: {
                type: 'array',
                items: { type: 'string', format: 'binary' },
            },
        },
        required: ['files'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                uploadedFiles: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            originalName: { type: 'string' },
                            fileUrl: { type: 'string' },
                        },
                    },
                },
            },
        },
        400: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
    },
};
