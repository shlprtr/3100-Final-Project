-- database: reviewly.db
-- Users Table
CREATE TABLE tblUsers (
    UserID TEXT PRIMARY KEY,
    Email TEXT UNIQUE NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Password TEXT NOT NULL,
    LastLoginDate TIMESTAMP,
    AccountCreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phone Table
CREATE TABLE tblPhone (
    PhoneID TEXT PRIMARY KEY,
    PhoneNumber TEXT,
    UserID TEXT,
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID)
);

-- Social Media Accounts
CREATE TABLE tblSocials (
    SocialID TEXT PRIMARY KEY,
    SocialType TEXT,
    Username TEXT,
    UserID TEXT,
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID)
);

-- Courses Table
CREATE TABLE tblCourses (
    CourseID TEXT PRIMARY KEY,
    CourseName TEXT,
    CourseNumber TEXT,
    SectionNumber TEXT,
    SemesterTerm TEXT,
    StartDate DATE,
    EndDate DATE,
    Enrollment INTEGER,
    InstructorID TEXT,
    FOREIGN KEY (InstructorID) REFERENCES tblUsers(UserID)
);

-- Survey Table
CREATE TABLE tblSurvey (
    SurveyID TEXT PRIMARY KEY,
    CourseID TEXT,
    Title TEXT,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    EndDate TIMESTAMP,
    FOREIGN KEY (CourseID) REFERENCES tblCourses(CourseID)
);

-- Survey Questions Table
CREATE TABLE tblSurveyQuestion (
    QuestionID TEXT PRIMARY KEY,
    SurveyID TEXT,
    Question TEXT,
    Options TEXT,  -- store JSON as TEXT in SQLite
    QuestionType TEXT,
    FOREIGN KEY (SurveyID) REFERENCES tblSurvey(SurveyID)
);

-- Survey Responses Table
CREATE TABLE tblSurveyResponse (
    ResponseID TEXT PRIMARY KEY,
    SurveyID TEXT,
    UserID TEXT,
    QuestionID TEXT,
    Response TEXT,
    Status TEXT,
    TargetUserID TEXT,
    FOREIGN KEY (SurveyID) REFERENCES tblSurvey(SurveyID),
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID),
    FOREIGN KEY (QuestionID) REFERENCES tblSurveyQuestion(QuestionID),
    FOREIGN KEY (TargetUserID) REFERENCES tblUsers(UserID)
);

-- Course Groups Table
CREATE TABLE tblCourseGroups (
    GroupID TEXT PRIMARY KEY,
    GroupName TEXT,
    CourseID TEXT,
    JoinCode TEXT,
    FOREIGN KEY (CourseID) REFERENCES tblCourses(CourseID)
);

-- Group Members Table
CREATE TABLE tblGroupMembers (
    GroupMemberID TEXT PRIMARY KEY,
    GroupID TEXT,
    UserID TEXT,
    FOREIGN KEY (GroupID) REFERENCES tblCourseGroups(GroupID),
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID)
);

-- Sessions Table
CREATE TABLE tblSessions (
    SessionID TEXT PRIMARY KEY,
    UserID TEXT,
    StartDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastUsedDate TIMESTAMP,
    Status TEXT,
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID)
);

-- Logs Table
CREATE TABLE tblLogs (
    LogID INTEGER PRIMARY KEY AUTOINCREMENT,
    Description TEXT,
    LogType TEXT,
    DateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
