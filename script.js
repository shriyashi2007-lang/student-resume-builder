const form = document.getElementById('resume-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    generateResume();
});
document.getElementById('downloadBtn').addEventListener('click', downloadPDF);

function generateResume() {
    const value = (id) => document.getElementById(id).value.trim();
    document.getElementById('r-name').textContent = value('name');
    document.getElementById('r-contact').textContent = ['email', 'phone', 'college'].map(value).filter(Boolean).join(' | ');
    ['course', 'skills', 'education', 'projects'].forEach((id) => {
        const target = document.getElementById(`r-${id}`);
        target.textContent = value(id);
        target.hidden = !value(id);
        target.previousElementSibling.hidden = !value(id);
    });
    document.getElementById('empty-preview').hidden = true;
    document.getElementById('resume').hidden = false;
    document.getElementById('downloadBtn').hidden = false;
    document.getElementById('download-status').textContent = '';
    document.getElementById('resume').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function downloadPDF() {
    const button = document.getElementById('downloadBtn');
    const status = document.getElementById('download-status');
    if (typeof html2pdf === 'undefined') {
        status.textContent = 'The PDF download library could not load. Check your internet connection and try again.';
        return;
    }
    button.disabled = true;
    status.textContent = 'Preparing your PDF…';
    try {
        await html2pdf().set({
            margin: 0.5,
            filename: 'Student_Resume.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }).from(document.getElementById('resume')).save();
        status.textContent = 'Your resume is ready. Your next chapter is waiting.';
    } catch (error) {
        status.textContent = 'Your PDF could not be created. Please try again.';
    } finally {
        button.disabled = false;
    }
}
