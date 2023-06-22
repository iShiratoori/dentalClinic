// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item => {
    const a = item.parentElement.querySelector('a:first-child');
    a.addEventListener('click', function (e) {
        e.preventDefault();

        if (!this.classList.contains('active')) {
            allDropdown.forEach(i => {
                const aLink = i.parentElement.querySelector('a:first-child');

                aLink.classList.remove('active');
                i.classList.remove('show');
            })
        }

        this.classList.toggle('active');
        item.classList.toggle('show');
    })
})

//Light and Dark
const body = document.querySelector('body')
const daynight = document.getElementById('daynight')
if (daynight) {
    daynight.addEventListener('click', function () {
        if (body.classList.contains('light')) {
            body.classList.remove('light')
            body.classList.add('dark');
        } else {
            body.classList.remove('dark')
            body.classList.add('light');
        }
    })
}

//SEARCH BOX
const dentistSearchInput = document.getElementById('dentistSearchInput');
const dentistSearchResults = document.getElementById('dentistSearchResults');
if (dentistSearchInput) {
    dentistSearchInput.addEventListener('input', function (e) {
        e.preventDefault();
        const searchTerm = dentistSearchInput.value;

        // Make AJAX request to the server
        fetch(`/admin/dashboard/dentists/search?name=${encodeURIComponent(searchTerm)}`)
            .then(response => response.text())
            .then(data => {
                // Update search results section with the response data
                dentistSearchResults.innerHTML = data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

const pateintSearchResults = document.getElementById('patientSearchResults');
const pateintInputSearch = document.getElementById('patientSearchInput');
if (pateintInputSearch) {
    pateintInputSearch.addEventListener('input', function (e) {
        e.preventDefault();
        const searchTerm = pateintInputSearch.value;

        // Make AJAX request to the server
        fetch(`/admin/dashboard/patients/search?name=${encodeURIComponent(searchTerm)}`)
            .then(response => response.text())
            .then(data => {
                // Update search results section with the response data
                pateintSearchResults.innerHTML = data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}


//notificationBell
const notificationBell = document.getElementById('notificationBell');
const notification = document.getElementById('notification');
if (notificationBell) {
    notificationBell.addEventListener('click', function () {
        notification.classList.toggle('fade')
    })
}


const messagesIcon = document.getElementById('messagesIcon');
const chatUser = document.getElementById('chat-users');
const users = document.querySelectorAll('#chat-users #user');
const messageContainer = document.getElementById('toast')
const messages = document.getElementById('messages');
if (messagesIcon) {
    if (!messageContainer.classList.contains('show')) {
        messagesIcon.addEventListener('click', function () {
            fetch('/messages')
                .then(response => response.text())
                .then(data => {
                    messageContainer.classList.toggle('show')
                    // Update search results section with the response data
                    messages.innerHTML = data;
                    const messagetoggled = document.getElementById('message-toggle-bar')
                    const chatside = document.getElementById('chat-sidebar')

                    messagetoggled.addEventListener('click', () => {
                        chatside.classList.toggle('sidebar-message-hide')
                    })

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
    } else {
        messageContainer.classList.toggle('show')
    }
}

// NOTE FOR MOBILES
// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if (sidebar.classList.contains('hide')) {
    allSideDivider.forEach(item => {
        item.textContent = '-'
    })
    allDropdown.forEach(item => {
        const a = item.parentElement.querySelector('a:first-child');
        a.classList.remove('active');
        item.classList.remove('show');
    })
} else {
    allSideDivider.forEach(item => {
        item.textContent = item.dataset.text;
    })
}
if (toggleSidebar) {
    toggleSidebar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');

        if (sidebar.classList.contains('hide')) {
            allSideDivider.forEach(item => {
                item.textContent = '-'
            })

            allDropdown.forEach(item => {
                const a = item.parentElement.querySelector('a:first-child');
                a.classList.remove('active');
                item.classList.remove('show');
            })
        } else {
            allSideDivider.forEach(item => {
                item.textContent = item.dataset.text;
            })
        }
    })
}

if (sidebar) {
    sidebar.addEventListener('mouseleave', function () {
        if (this.classList.contains('hide')) {
            allDropdown.forEach(item => {
                const a = item.parentElement.querySelector('a:first-child');
                a.classList.remove('active');
                item.classList.remove('show');
            })
            allSideDivider.forEach(item => {
                item.textContent = '-'
            })
        }
    })
}



if (sidebar) {
    sidebar.addEventListener('mouseenter', function () {
        if (this.classList.contains('hide')) {
            allDropdown.forEach(item => {
                const a = item.parentElement.querySelector('a:first-child');
                a.classList.remove('active');
                item.classList.remove('show');
            })
            allSideDivider.forEach(item => {
                item.textContent = item.dataset.text;
            })
        }
    })
}



// PROFILE DROPDOWN
const profile = document.querySelector('nav .profile');
const imgProfile = profile.querySelector('img');
const dropdownProfile = profile.querySelector('.profile-link');
if (imgProfile) {
    imgProfile.addEventListener('click', function () {
        dropdownProfile.classList.toggle('show');
    })
}




// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu');

allMenu.forEach(item => {
    const icon = item.querySelector('.icon');
    const menuLink = item.querySelector('.menu-link');

    icon.addEventListener('click', function () {
        menuLink.classList.toggle('show');
    })
})

window.addEventListener('click', function (e) {
    if (e.target !== imgProfile) {
        if (e.target !== dropdownProfile) {
            if (dropdownProfile.classList.contains('show')) {
                dropdownProfile.classList.remove('show');
            }
        }
    }

    allMenu.forEach(item => {
        const icon = item.querySelector('.icon');
        const menuLink = item.querySelector('.menu-link');

        if (e.target !== icon) {
            if (e.target !== menuLink) {
                if (menuLink.classList.contains('show')) {
                    menuLink.classList.remove('show')
                }
            }
        }
    })
})



//Upcoming Appointment 
const AppointmentStatus = document.querySelectorAll('.upcoming-appointment #action');
var patientTicket = document.querySelectorAll('.upcoming-appointment #patient');
AppointmentStatus.forEach((action, i) => {
    console.log(patientTicket[i].innerText)
    setInterval(function () {
        $.ajax({
            url: 'http://localhost:3000/api/data?patient_ticket=' + encodeURIComponent(patientTicket[i].innerText) + '&action=' + action.innerText,
            method: 'GET',
            success: function (response) {
                if (response !== action.innerText) {
                    action.innerText = response;
                }
            },
            error: function (xhr, status, error) {
                console.log('Error:', error);
            }
        });
    }, 10000);
})


const flexRadioDefault1 = document.getElementById('flexRadioDefault1');
const flexRadioDefault2 = document.getElementById('flexRadioDefault2');
const dentistIdInputer = document.getElementById('dentistIdInputer');
const patientIdInputer = document.getElementById('patientIdInputer');
const dentistFeild = document.querySelector('#dentistIdInputer input');
const patientFeild = document.querySelector('#patientIdInputer input');

if (flexRadioDefault1) {
    flexRadioDefault1.addEventListener('click', () => {
        dentistFeild.disabled = false;
        dentistIdInputer.style.display = 'block';
        patientFeild.disabled = true;
        patientIdInputer.style.display = 'none';
    });
}

if (flexRadioDefault2) {
    flexRadioDefault2.addEventListener('click', () => {
        patientFeild.disabled = false;
        patientIdInputer.style.display = 'block';
        dentistFeild.disabled = true;
        dentistIdInputer.style.display = 'none';
    });
}
