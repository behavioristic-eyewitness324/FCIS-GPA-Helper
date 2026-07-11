# FCIS GPA Helper 🎓

**FCIS GPA Helper** is a lightweight Chrome extension built for **Faculty of Computers and Information Sciences (FCIS), Ain Shams University** students.

The extension automatically detects missing **Semester GPA** and **Cumulative GPA (CGPA)** values on the UMS Student Grades page, calculates them locally, and displays them using the native UMS interface.

No configuration or user interaction is required.

---

## ✨ Features

- 🎯 Automatically calculates missing **Semester GPA**.
- 🎯 Automatically calculates missing **Cumulative GPA (CGPA)**.
- 🎯 Preserves existing GPA/CGPA values provided by the university system.
- 🎯 Supports both **Arabic** and **English** UMS interfaces.
- 🎯 Correctly handles repeated/improved courses by considering only the latest attempt.
- 🎯 Runs entirely inside your browser with **no API calls**, **no tracking**, and **no data collection**.

---

## 📁 Project Structure

```text
FCIS GPA Helper/
├── manifest.json
└── src/
    ├── constants.js
    ├── parser.js
    ├── calculator.js
    ├── renderer.js
    └── index.js
```

### File Responsibilities

| File | Responsibility |
|------|----------------|
| `constants.js` | Grade mappings and shared constants |
| `parser.js` | Extracts academic data from the UMS page |
| `calculator.js` | Calculates Semester GPA and CGPA |
| `renderer.js` | Injects calculated values into the page |
| `index.js` | Coordinates the extension workflow |

---

## ⚙️ How It Works

The extension follows this flow:

```text
UMS Student Grades Page
        │
        ▼
Parse HTML
        │
        ▼
Extract Semesters & Courses
        │
        ▼
Sort Chronologically
        │
        ▼
Calculate Semester GPA
        │
        ▼
Update Repeated Courses
        │
        ▼
Calculate CGPA
        │
        ▼
Render Missing Values
```

---

## 📊 Grade Scale

| Grade | Points |
|-------|------:|
| A+ | 4.0 |
| A | 4.0 |
| A- | 3.7 |
| B+ | 3.3 |
| B | 3.0 |
| B- | 2.7 |
| C+ | 2.3 |
| C | 2.0 |
| C- | 1.7 |
| D+ | 1.3 |
| D | 1.0 |
| Fail | 0.0 |

---

## 🚀 Installation

1. Download or clone this repository.
2. Open:

```
chrome://extensions
```

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder.
6. Open the UMS **Student Grades** page.

The extension will run automatically.

---

## 🔒 Privacy

FCIS GPA Helper is designed with privacy in mind.

- No account required.
- No data collection.
- No analytics.
- No external servers.
- No local storage.
- No network requests.

All calculations are performed locally inside your browser.

---

## 🎯 Supported Page

```
https://ums.asu.edu.eg/StudentGrades
```

---

## 📄 License

This project is intended for educational purposes and to improve the student experience for FCIS Ain Shams University students.