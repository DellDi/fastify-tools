export interface Task {
    task_id: string
    task_mode: string
    status: string
    message: string
    created_at: string
    updated_at: string
}

export interface CreateTaskRequest {
    jql: string
    description_limit: number
    comments_limit: number
    page_size: number
    start_at: number
}

export interface CreateKmsRequest {
    api_key: string
    api_url: string
    model: string
    optimizer_type: string
    start_url: string
}