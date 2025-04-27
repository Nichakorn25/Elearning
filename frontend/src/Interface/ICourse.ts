export interface CourseInterface{
    ID?: number,
    CourseName?: string,
    CourseCode?: string,
    Credit?:  string | number,
    Description?: string,
    Stage?: number,
    CategoryID?: number,
    UserID?: number,
    SemesterID?: SemesterInterface | number,
    Status?: string,
}

export interface DepartmentInterface{
    ID?: number,
    DepartmentName?: string,
    
}

export interface DayofWeekInterface{
    ID?: number,
    DayName?: string,
}

export interface SemesterInterface {
    ID?: number;
    Year?: number;
    Term?: number;
    StartDate?: string; 
    EndDate?: string;  
  }

export interface StudyTimeInterface{
    StudyTimeStart?: string,
    StudyTimeEnd?: string,
    CourseID?: number,
    DayofWeekID?: number,
}

export interface LessonInterface {
    Title?: string;
    Sequence?: number;
    CourseID?: number;  // เพิ่ม CourseID
    LessonID?: number;  // เพิ่ม LessonID
  }

export interface CourseContentInterface{
    Title?: string
	Content?: string
    Status?: string
    LessonID?: number
}

export interface CourseUrlInterface{
    Title?: string;
    Url?: string;
    Status?: string
    LessonID?: number;

}

export interface MaterialInterface{
    MaterialName?: string
    FilePath?: string | File ;
    Status?: string
    LessonID?: number;
}

export interface CoursePictureInterface{
    Picture?: string
    CourseID?: number;
}