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

export interface DifyUploadRequest {
  dataset_prefix: string
  max_docs: number
  indexing_technique: 'high_quality' | 'economy' | 'parent' | 'qa'
}

export interface DifyTask {
    task_id: string
    status: string
    input_dir: string
    dataset_prefix: string
    max_docs: number
    created_at: string
    updated_at: string
    message: string
    total_files: number
    successful_uploads: number
    duration_seconds: number
}