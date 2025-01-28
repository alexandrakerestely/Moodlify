db = db.getSiblingDB("subjects");

db.createUser({
  user: "subjects-manager",
  pwd: "manager123",
  roles: [
    {
      role: "readWrite",
      db: "subjects"
    }
  ]
});

db.subjects.insertMany([
  {
    title: "Mathematics",
    subject_code: "MAT101",
    evaluation_probes: [
      { name: "Midterm Exam", percentage: 50 },
      { name: "Final Exam", percentage: 50 }
    ],
    course_materials: [
      { file: "math_course1.pdf", week: 1 },
      { file: "math_course2.pdf", week: 2 }
    ],
    lab_materials: [
      { file: "math_lab1.pdf", week: 1 }
    ]
  },
  {
    title: "Physics",
    subject_code: "PHY102",
    evaluation_probes: [
      { name: "Lab Test", percentage: 40 },
      { name: "Final Exam", percentage: 60 }
    ],
    course_materials: [
      { file: "physics_course1.pdf", week: 1 },
      { file: "physics_course2.pdf", week: 3 }
    ],
    lab_materials: [
      { file: "physics_lab1.pdf", week: 2 }
    ]
  },
  {
    title: "Algorithms",
    subject_code: "ALG201",
    evaluation_probes: [
      { name: "Week 4 Exam", percentage: 20 },
      { name: "Week 8 Exam", percentage: 20 },
      { name: "Final Exam", percentage: 60 }
    ],
    course_materials: [
      { file: "course1.pdf", week: 1 }
    ],
    lab_materials: [
      { file: "lab1.pdf", week: 1 }
    ]
  },
  {
    title: "Databases",
    subject_code: "DBS202",
    evaluation_probes: [
      { name: "Quiz 1", percentage: 20 },
      { name: "Quiz 2", percentage: 20 },
      { name: "Final Exam", percentage: 60 }
    ],
    course_materials: [
      { file: "databases_course1.pdf", week: 1 },
      { file: "databases_course2.pdf", week: 3 }
    ],
    lab_materials: [
      { file: "databases_lab1.pdf", week: 2 }
    ]
  },
  {
    title: "Literature",
    subject_code: "LIT301",
    evaluation_probes: [
      { name: "Essay", percentage: 50 },
      { name: "Final Exam", percentage: 50 }
    ],
    course_materials: [
      { file: "literature_course1.pdf", week: 1 },
      { file: "literature_course2.pdf", week: 2 }
    ],
    lab_materials: []
  },
  {
    title: "History",
    subject_code: "HIS302",
    evaluation_probes: [
      { name: "Midterm Exam", percentage: 50 },
      { name: "Final Exam", percentage: 50 }
    ],
    course_materials: [
      { file: "history_course1.pdf", week: 1 },
      { file: "history_course2.pdf", week: 2 }
    ],
    lab_materials: []
  },
  {
    title: "Machine Learning",
    subject_code: "MLG401",
    evaluation_probes: [
      { name: "Project", percentage: 40 },
      { name: "Final Exam", percentage: 60 }
    ],
    course_materials: [
      { file: "ml_course1.pdf", week: 1 },
      { file: "ml_course2.pdf", week: 3 }
    ],
    lab_materials: [
      { file: "ml_lab1.pdf", week: 2 }
    ]
  },
  {
    title: "Artificial Intelligence",
    subject_code: "AIG402",
    evaluation_probes: [
      { name: "Final Exam", percentage: 100 }
    ],
    course_materials: [
      { file: "course1.pdf", week: 1 },
      { file: "course2.pdf", week: 2 }
    ],
    lab_materials: [
      { file: "lab1.pdf", week: 1 },
      { file: "lab2.pdf", week: 2 }
    ]
  }
]);
