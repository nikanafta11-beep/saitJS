// CLOCK

function updateClock() {

    const now = new Date();

    document.getElementById("clock")
        .textContent =
        now.toLocaleString();
}

setInterval(updateClock, 1000);

updateClock();


// BROWSER INFO

document.getElementById(
    "browserInfo"
).textContent =

    "Ваш браузер: " +
    navigator.userAgent;


// SPA NAVIGATION

const navButtons =
    document.querySelectorAll("aside button");

const sections =
    document.querySelectorAll("main section");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const sectionId =
            button.dataset.section;

        sections.forEach(section => {

            section.classList.remove("active");
        });

        document
            .getElementById(sectionId)
            .classList.add("active");
    });
});


// DATABASE

let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


// SAVE

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// AVERAGE

function getAverage(student) {

    return (

        Number(student.subjects.oop) +

        Number(student.subjects.english) +

        Number(student.subjects.math)

    ) / 3;
}


// RENDER

function renderStudents(data = []) {

    const container =
        document.getElementById(
            "studentContainer"
        );

    const list =
        document.getElementById(
            "studentList"
        );

    container.innerHTML = "";

    list.innerHTML = "";

    // SIMPLE LIST

    students.forEach(student => {

        list.innerHTML += `

        <div class="student-name">

            ${student.name}

        </div>
        `;
    });

    // FULL CARDS

    data.forEach(student => {

        container.innerHTML += `

        <div class="card"
             data-id="${student.id}">

            <h3>${student.name}</h3>

            <p>
                Підгрупа:
                ${student.subgroup}
            </p>

            <p>
                ООП:
                ${student.subjects.oop}
            </p>

            <p>
                Англійська:
                ${student.subjects.english}
            </p>

            <p>
                Математика:
                ${student.subjects.math}
            </p>

            <p>
                Пропуски:
                ${student.absences}
            </p>

            <p>
                Середній бал:
                ${getAverage(student).toFixed(2)}
            </p>

            <button class="detailsBtn">

                Оцінки

            </button>

            <button class="transferBtn">

                Перевести

            </button>

            <button class="deleteBtn">

                Відрахувати

            </button>

        </div>
        `;
    });

    renderScholarship();

    renderExpelled();

    renderStatistics();

    saveStudents();
}


// START

renderStudents();


// ADD STUDENT

document
    .getElementById("studentForm")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        if (name === "") {

            alert("Введіть ім'я");

            return;
        }

        const subgroup =
            students.length % 2 === 0
                ? 1
                : 2;

        const student = {

            id: Date.now(),

            name: name,

            subgroup: subgroup,

            subjects: {

                oop: 0,
                english: 0,
                math: 0
            },

            absences: 0
        };

        students.push(student);

        renderStudents();

        e.target.reset();
    });


// SEARCH

document
    .getElementById("search")
    .addEventListener("input", (e) => {

        const value =
            e.target.value.toLowerCase();

        if (value === "") {

            renderStudents([]);

            return;
        }

        const filtered =
            students.filter(student =>

                student.name
                    .toLowerCase()
                    .includes(value)
            );

        renderStudents(filtered);
    });


// EVENT DELEGATION

document
    .getElementById("studentContainer")
    .addEventListener("click", (e) => {

        const card =
            e.target.closest(".card");

        if (!card) return;

        const id =
            Number(card.dataset.id);

        const student =
            students.find(
                s => s.id === id
            );

        // DETAILS

        if (
            e.target.classList
                .contains("detailsBtn")
        ) {

            document
                .getElementById("modal")
                .style.display = "block";

            document
                .getElementById("modalBody")
                .innerHTML = `

            <h2>${student.name}</h2>

            <label>ООП</label>

            <input
                type="number"
                id="oop"
                value="${student.subjects.oop}"
            >

            <label>Англійська</label>

            <input
                type="number"
                id="english"
                value="${student.subjects.english}"
            >

            <label>Математика</label>

            <input
                type="number"
                id="math"
                value="${student.subjects.math}"
            >

            <label>Пропуски</label>

            <input
                type="number"
                id="absences"
                value="${student.absences}"
            >

            <button onclick="saveGrades(${student.id})">

                Зберегти

            </button>
            `;
        }

        // TRANSFER

        if (
            e.target.classList
                .contains("transferBtn")
        ) {

            student.subgroup =
                student.subgroup === 1
                    ? 2
                    : 1;

            renderStudents();
        }

        // DELETE

        if (
            e.target.classList
                .contains("deleteBtn")
        ) {

            students =
                students.filter(
                    s => s.id !== id
                );

            renderStudents();
        }
    });


// SAVE GRADES

function saveGrades(id) {

    const student =
        students.find(
            s => s.id === id
        );

    student.subjects.oop =
        Number(
            document
                .getElementById("oop")
                .value
        );

    student.subjects.english =
        Number(
            document
                .getElementById("english")
                .value
        );

    student.subjects.math =
        Number(
            document
                .getElementById("math")
                .value
        );

    student.absences =
        Number(
            document
                .getElementById("absences")
                .value
        );

    renderStudents();

    document
        .getElementById("modal")
        .style.display = "none";
}


// CLOSE MODAL

document
    .getElementById("closeModal")
    .addEventListener("click", () => {

        document
            .getElementById("modal")
            .style.display = "none";
    });


// SCHOLARSHIP

function renderScholarship() {

    const container =
        document.getElementById(
            "scholarshipList"
        );

    container.innerHTML = "";

    const sorted =
        [...students]
            .sort(
                (a, b) =>
                    getAverage(b) -
                    getAverage(a)
            );

    const count =
        Math.ceil(
            students.length * 0.14
        );

    const scholarship =
        sorted.slice(0, count);

    scholarship.forEach(student => {

        container.innerHTML += `

        <div class="card">

            <h3>${student.name}</h3>

            <p>
                Середній бал:
                ${getAverage(student).toFixed(2)}
            </p>

        </div>
        `;
    });
}


// EXPELLED

function renderExpelled() {

    const container =
        document.getElementById(
            "expelledList"
        );

    container.innerHTML = "";

    const expelled =
        students.filter(
            student =>
                getAverage(student) < 60
        );

    expelled.forEach(student => {

        container.innerHTML += `

        <div class="card">

            <h3>${student.name}</h3>

            <p>
                Середній бал:
                ${getAverage(student).toFixed(2)}
            </p>

        </div>
        `;
    });
}


// STATISTICS

function renderStatistics() {

    const total =
        students.reduce(

            (sum, student) =>

                sum + getAverage(student),

            0
        );

    const average =
        students.length > 0

            ? (total / students.length)
                .toFixed(2)

            : 0;

    document
        .getElementById("statistics")
        .innerHTML = `

        <div class="card">

            <h3>
                Загальна кількість:
                ${students.length}
            </h3>

            <h3>
                Середній бал групи:
                ${average}
            </h3>

        </div>
        `;
}