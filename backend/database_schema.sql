-- Users Table
CREATE TABLE tblUsers (
    UserID TEXT PRIMARY KEY NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Password TEXT NOT NULL,
    PreferredContactMethod TEXT,
    Salutation TEXT,
    Status TEXT,
    LastLoginDate TIMESTAMP,
    AccountCreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phone Table
CREATE TABLE tblPhone (
    PhoneID INTEGER PRIMARY KEY AUTOINCREMENT,
    NationCode TEXT,
    AreaCode TEXT,
    PhoneNumber TEXT,
    UserID INTEGER,
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID)
);

-- Social Media Accounts
CREATE TABLE tblSocials (
    SocialID INTEGER PRIMARY KEY AUTOINCREMENT,
    SocialType TEXT,
    Username TEXT,
    UserID INTEGER,
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID)
);

-- Courses Table
CREATE TABLE tblCourses (
    CourseID INTEGER PRIMARY KEY AUTOINCREMENT,
    CourseTitle TEXT,
    CourseNumber TEXT,
    SectionNumber TEXT,
    SemesterTerm TEXT,
    StartDate DATE,
    EndDate DATE,
    Enrollment INTEGER,
    InstructorID INTEGER,
    FOREIGN KEY (InstructorID) REFERENCES tblUsers(UserID)
);

-- Survey Table
CREATE TABLE tblSurvey (
    SurveyID INTEGER PRIMARY KEY AUTOINCREMENT,
    CourseID INTEGER,
    Title TEXT,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    EndDate TIMESTAMP,
    FOREIGN KEY (CourseID) REFERENCES tblCourses(CourseID)
);

-- Survey Questions Table
CREATE TABLE tblSurveyQuestion (
    QuestionID INTEGER PRIMARY KEY AUTOINCREMENT,
    SurveyID INTEGER,
    Question TEXT,
    Options TEXT,  -- store JSON as TEXT in SQLite
    QuestionType TEXT,
    FOREIGN KEY (SurveyID) REFERENCES tblSurvey(SurveyID)
);

-- Survey Responses Table
CREATE TABLE tblSurveyResponse (
    ResponseID INTEGER PRIMARY KEY AUTOINCREMENT,
    SurveyID INTEGER,
    UserID INTEGER,
    QuestionID INTEGER,
    Response TEXT,
    TargetUserID INTEGER,
    FOREIGN KEY (SurveyID) REFERENCES tblSurvey(SurveyID),
    FOREIGN KEY (UserID) REFERENCES tblUsers(UserID),
    FOREIGN KEY (QuestionID) REFERENCES tblSurveyQuestion(QuestionID),
    FOREIGN KEY (TargetUserID) REFERENCES tblUsers(UserID)
);

-- Course Groups Table
CREATE TABLE tblCourseGroups (
    GroupID INTEGER PRIMARY KEY AUTOINCREMENT,
    GroupName TEXT,
    CourseID INTEGER,
    FOREIGN KEY (CourseID) REFERENCES tblCourses(CourseID)
);

-- Group Members Table
CREATE TABLE tblGroupMembers (
    GroupMemberID INTEGER PRIMARY KEY AUTOINCREMENT,
    GroupID INTEGER,
    UserID INTEGER,
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
