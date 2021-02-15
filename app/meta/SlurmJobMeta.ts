export type SlurmJobInfo = {
    account: string;
    accrue_time: number;
    admin_comment: string;
    array_job_id: number;
    array_task_id: any;
    array_max_tasks: number;
    array_task_string: string;
    association_id: number;
    batch_features: string;
    batch_flag: boolean;
    batch_host: string;
    flags: [];
    burst_buffer: string;
    burst_buffer_state: string;
    cluster: string;
    cluster_features: string;
    command: string;
    comment: string;
    contiguous: boolean;
    core_spec: any;
    thread_spec: any;
    cores_per_socket: any;
    billable_tres: any;
    cpus_per_task: any;
    cpu_frequency_minimum: any;
    cpu_frequency_maximum: any;
    cpu_frequency_governor: any;
    cpus_per_tres: string;
    deadline: number;
    delay_boot: number;
    dependency: string;
    derived_exit_code: number;
    eligible_time: number;
    end_time: number;
    excluded_nodes: string;
    exit_code: number;
    features: string;
    federation_origin: string;
    federation_siblings_active: string;
    federation_siblings_viable: string;
    gres_detail: [];
    group_id: number;
    job_id: number;
    job_resources: {};
    job_state: string;
    last_sched_evaluation: number;
    licenses: string;
    max_cpus: number;
    max_nodes: number;
    mcs_label: string;
    memory_per_tres: string;
    name: string;
    nodes: string;
    nice: any;
    tasks_per_core: any;
    tasks_per_node: number;
    tasks_per_socket: any;
    tasks_per_board: number;
    cpus: number;
    node_count: number;
    tasks: number;
    het_job_id: number;
    het_job_id_set: string;
    het_job_offset: number;
    partition: 'Solitude';
    memory_per_node: any;
    memory_per_cpu: any;
    minimum_cpus_per_node: number;
    minimum_tmp_disk_per_node: number;
    preempt_time: number;
    pre_sus_time: number;
    priority: number;
    profile: any;
    qos: string;
    reboot: boolean;
    required_nodes: string;
    requeue: boolean;
    resize_time: number;
    restart_cnt: number;
    resv_name: string;
    shared: any;
    show_flags: Array<any>;
    sockets_per_board: number;
    sockets_per_node: any;
    start_time: number;
    state_description: string;
    state_reason: string;
    standard_error: string;
    standard_input: string;
    standard_output: string;
    submit_time: number;
    suspend_time: number;
    system_comment: string;
    time_limit: any;
    time_minimum: number;
    threads_per_core: any;
    tres_bind: string;
    tres_freq: string;
    tres_per_job: string;
    tres_per_node: string;
    tres_per_socket: string;
    tres_per_task: string;
    tres_req_str: string;
    tres_alloc_str: string;
    user_id: number;
    user_name: string;
    wckey: string;
    current_working_directory: string
}

export type SlurmJobBrief = {
    job_id: number;
    name: string;
    cpus: number;
    job_state: string;
    start_time: Date;
    end_time: Date
}

export const SlurmJobBriefKeys = [
    'job_id',
    'name',
    'cpus',
    'job_state',
    'start_time',
    'end_time'
]

