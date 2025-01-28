use academiadb;

CREATE TABLE IF NOT EXISTS students (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        nume VARCHAR(70) NOT NULL,
    prenume VARCHAR(70) NOT NULL,
    email VARCHAR(70) UNIQUE NOT NULL,
    grupa VARCHAR(50) UNIQUE,
    an_studiu INT NOT NULL,
    ciclu_studii ENUM('licenta', 'master') NOT NULL

    );

CREATE TABLE IF NOT EXISTS teachers (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        nume VARCHAR(70) NOT NULL,
    prenume VARCHAR(70) NOT NULL,
    email VARCHAR(50) NOT NULL,
    grad_didactic ENUM('asist', 'sef_lucr', 'conf', 'prof'),
    tip_asociere ENUM('titular', 'asociat', 'extern') NOT NULL,
    afiliere VARCHAR(50)
    );

CREATE TABLE IF NOT EXISTS subjects (
    cod VARCHAR(60) PRIMARY KEY,
    id_titular INT,
    nume_disciplina VARCHAR(50) NOT NULL,
    an_studiu INT NOT NULL,
    tip_disciplina ENUM('obligatorie', 'optionala', 'liber_aleasa') NOT NULL,
    tip_examinare ENUM('colocviu', 'examen') NOT NULL,
    FOREIGN KEY (id_titular) REFERENCES teachers(id) ON DELETE CASCADE,
    categorie_disciplina ENUM('domeniu', 'specialitate', 'adiacenta') NOT NULL,
    nr_credite INT NOT NULL
    );

CREATE TABLE IF NOT EXISTS students_subjects (
    id_student INT,
    id_disciplina VARCHAR(60),
    PRIMARY KEY (id_disciplina, id_student),
    FOREIGN KEY (id_disciplina) REFERENCES subjects(cod) ON DELETE CASCADE,
    FOREIGN KEY (id_student) REFERENCES students(id) ON DELETE CASCADE
    );

CREATE USER IF NOT EXISTS 'academia-manager'@'172.17.0.1' IDENTIFIED BY 'manager123';
GRANT SELECT, INSERT, UPDATE, DELETE ON academiadb.* TO 'academia-manager'@'172.17.0.1';
FLUSH PRIVILEGES;


