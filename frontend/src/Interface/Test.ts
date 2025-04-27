export interface TestInterface {
    title: string;          // ชื่อของ Test
    description: string;    // คำอธิบาย
    due_date: string;       // วันครบกำหนด
    time_out: string;       // เวลาสิ้นสุด
    course_id: number;      // รหัสวิชา
    quiz_questions: QuizQuestionInterface[]; // Array ของคำถาม
}

export interface QuizQuestionInterface {
    id?: number;
    question_text: string;           // ข้อความคำถาม
    point: number;
    test_id?: number;                // รหัส Test ที่คำถามนี้สังกัด
    answer_options: AnswerOptionInterface[]; // Array ของตัวเลือกคำตอบ
}

export interface AnswerOptionInterface {
    option_text: string; // ข้อความตัวเลือกคำตอบ
    is_correct: boolean; // ตัวเลือกนี้ถูกต้องหรือไม่
    question_id: number; // รหัสคำถามที่ตัวเลือกนี้สังกัด
}

export interface StudentAnswerInterface{
    selected_option:number;
    correct:number;
	user_id:number;
	question_id:number;
}