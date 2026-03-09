CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255)
);

CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    filename VARCHAR(255),
    text_content TEXT
);

CREATE TABLE job_descriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    description TEXT
);

CREATE TABLE analysis_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT,
    job_id INT,
    match_score FLOAT,
    suggestions TEXT
);