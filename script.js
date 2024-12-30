// Variables
const subjects = document.querySelectorAll('.subject');
const selectedList = document.getElementById('selected-list');
let selectedSchools = new Set();
let draggedElement = null;

// Add drag-and-drop functionality
subjects.forEach(subject => {
    subject.addEventListener('dragstart', (e) => {
        draggedElement = subject;
        subject.classList.add('dragging');
    });

    subject.addEventListener('dragend', () => {
        draggedElement = null;
        subject.classList.remove('dragging');
    });
});

// Allow dropping on the selected list
selectedList.addEventListener('dragover', (e) => {
    e.preventDefault(); // Required for allowing drop
    selectedList.classList.add('drag-over');
});

selectedList.addEventListener('dragleave', () => {
    selectedList.classList.remove('drag-over');
});

selectedList.addEventListener('drop', () => {
    if (draggedElement) {
        const school = draggedElement.getAttribute('data-school');

        // Prevent adding more than 3 schools
        if (!selectedSchools.has(school) && selectedSchools.size >= 3) {
            return; // Disable adding subjects from a 4th school
        }

        if (isSubjectAlreadySelected(draggedElement.textContent)) {
            alert('This subject is already selected.');
            return;
        }

        // Add to the selected list and hide the subject in the left panel
        selectedSchools.add(school);
        addSelectedSubject(draggedElement.textContent, school);
        draggedElement.style.display = 'none';
        selectedList.classList.remove('drag-over');

        // Update disabled state for subjects
        updateSubjectDisability();
    }
});

// Handle click-based selection
subjects.forEach(subject => {
    subject.addEventListener('click', () => {
        const school = subject.getAttribute('data-school');

        // Prevent adding more than 3 schools
        if (!selectedSchools.has(school) && selectedSchools.size >= 3) {
            return; // Disable adding subjects from a 4th school
        }

        if (isSubjectAlreadySelected(subject.textContent)) {
            alert('This subject is already selected.');
            return;
        }

        // Add to the selected list and hide the subject in the left panel
        selectedSchools.add(school);
        addSelectedSubject(subject.textContent, school);
        subject.style.display = 'none';

        // Update disabled state for subjects
        updateSubjectDisability();
    });
});

// Helper function to check if a subject is already selected
function isSubjectAlreadySelected(name) {
    return Array.from(selectedList.children).some(child => {
        return child.querySelector('span').textContent === name;
    });
}

// Add the selected subject to the list
function addSelectedSubject(name, school) {
    const div = document.createElement('div');
    div.className = 'selected-subject';
    div.innerHTML = `
        <span>${name}</span>
        <div class="action-buttons">
    <button class="btn btn-sm btn-outline-success move-up" title="Move Up">
        <i class="bi bi-arrow-up-circle"></i>
    </button>
    <button class="btn btn-sm btn-outline-primary move-down" title="Move Down">
        <i class="bi bi-arrow-down-circle"></i>
    </button>
    <button class="btn btn-sm btn-outline-danger remove-btn" title="Remove">
        <i class="bi bi-trash"></i>
    </button>
</div>

    `;
    div.dataset.school = school;
    selectedList.appendChild(div);

    // Remove functionality
    div.querySelector('.remove-btn').addEventListener('click', () => {
        selectedSchools.delete(school);
        div.remove();

        // Restore the subject in the left panel
        const hiddenSubject = Array.from(subjects).find(
            subject => subject.textContent === name
        );
        if (hiddenSubject) hiddenSubject.style.display = '';

        // Update disabled state for subjects
        updateSubjectDisability();
    });

    // Move Up functionality
    div.querySelector('.move-up').addEventListener('click', () => {
        const prev = div.previousElementSibling;
        if (prev) selectedList.insertBefore(div, prev);
    });

    // Move Down functionality
    div.querySelector('.move-down').addEventListener('click', () => {
        const next = div.nextElementSibling;
        if (next) selectedList.insertBefore(next, div);
    });
}

// Update the disabled state for subjects
function updateSubjectDisability() {
    const allSchools = Array.from(subjects).map(subject =>
        subject.getAttribute('data-school')
    );

    subjects.forEach(subject => {
        const school = subject.getAttribute('data-school');

        if (!selectedSchools.has(school) && selectedSchools.size >= 3) {
            subject.classList.add('disabled'); // Add disabled style
            subject.setAttribute('disabled', true); // Disable click/drag

            // Show the "Note: You already selected 3 Schools" for the disabled school
            const schoolDiv = document.querySelector(`#school-${getSchoolIndex(school)} .note`);
            if (schoolDiv) {
                schoolDiv.style.display = 'block'; // Show the note
            }
        } else {
            subject.classList.remove('disabled'); // Remove disabled style
            subject.removeAttribute('disabled'); // Enable click/drag

            // Hide the "Note" for schools that are not disabled
            const schoolDiv = document.querySelector(`#school-${getSchoolIndex(school)} .note`);
            if (schoolDiv) {
                schoolDiv.style.display = 'none'; // Hide the note
            }
        }
    });
}

// Helper function to get the school index
function getSchoolIndex(schoolName) {
    const schoolIndexMap = {
        'SoBE': 1,
        'SoSE': 2,
        'SoHSS': 3,
        'SoLS': 4,
    };
    return schoolIndexMap[schoolName] || 0;
}
