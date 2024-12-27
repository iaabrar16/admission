// Variables and initial setup
const subjects = document.querySelectorAll('.subject');
const selectedList = document.getElementById('selected-list');
let selectedSchools = new Set();
let editIndex = null;

// Click functionality for Subjects
subjects.forEach(subject => {
    subject.addEventListener('click', () => {
        const school = subject.getAttribute('data-school');

        // If the school has not been selected and the user has already selected 3 schools, disable further selections
        if (!selectedSchools.has(school) && selectedSchools.size >= 3) {
            alert('You can select subjects from a maximum of 3 schools.');
            return;
        }

        // Allow the user to select more subjects from the same school if they have already selected that school
        selectedSchools.add(school);
        addSelectedSubject(subject.textContent, school);
    });
});

// Add selected subject to the list
function addSelectedSubject(name, school) {
    const div = document.createElement('div');
    div.className = 'selected-subject';
    div.innerHTML = `
         <span>${name}</span>
        <div>
            <button class="btn btn-sm btn-warning edit-btn">
                <i class="bi bi-pencil"></i> <!-- Edit icon -->
            </button>
            <button class="btn btn-sm btn-danger remove-btn">
                <i class="bi bi-trash"></i> <!-- Remove icon -->
            </button>
        </div>
    `;
    div.dataset.school = school;
    selectedList.appendChild(div);

    // Remove button functionality
    div.querySelector('.remove-btn').addEventListener('click', () => {
        selectedSchools.delete(school);
        div.remove();
    });

    // Edit button functionality
    div.querySelector('.edit-btn').addEventListener('click', () => {
        editIndex = Array.from(selectedList.children).indexOf(div);
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    });
}

// Reordering selected subjects
document.getElementById('move-up').addEventListener('click', () => {
    if (editIndex > 0) {
        const current = selectedList.children[editIndex];
        const previous = selectedList.children[editIndex - 1];
        selectedList.insertBefore(current, previous);
        editIndex--;
    }
});

document.getElementById('move-down').addEventListener('click', () => {
    if (editIndex < selectedList.children.length - 1) {
        const current = selectedList.children[editIndex];
        const next = selectedList.children[editIndex + 1];
        selectedList.insertBefore(next, current);
        editIndex++;
    }
});
