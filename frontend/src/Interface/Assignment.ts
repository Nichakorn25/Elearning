export interface AssignmentInterface {
    title: string; 
    description: string; 
    deadline: string; 
    course_id: number;  
}

export interface SubmissionInterface {
    submission_date?: string;
    file_name: string;
    file_path?: File;
    user_id: number;
    assignment_id: number;
}

export interface GradeInterface{
    status: string;
    score: number;
    feedback: string;
    submission_id: number;
}