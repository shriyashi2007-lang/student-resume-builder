function generateResume() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const college = document.getElementById("college").value;
    const course = document.getElementById("course").value;
    const skills = document.getElementById("skills").value;
    const education = document.getElementById("education").value;
    const projects = document.getElementById("projects").value;

    document.getElementById("r-name").innerText = name;

    document.getElementById("r-contact").innerText =
        `${email} | ${phone} | ${college}`;

    document.getElementById("r-course").innerText = course;

    document.getElementById("r-skills").innerText = skills;

    document.getElementById("r-education").innerText = education;

    document.getElementById("r-projects").innerText = projects;

    document.getElementById("resume").style.display = "block";
}

function downloadPDF() {

    const resume = document.getElementById("resume");

    const options = {
        margin: 0.5,
        filename: 'Student_Resume.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    html2pdf().set(options).from(resume).save();
}