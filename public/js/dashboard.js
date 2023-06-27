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
            url: '/api/data?patient_ticket=' + encodeURIComponent(patientTicket[i].innerText) + '&action=' + action.innerText,
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


const userRoleSelect = document.getElementById('user-role');
if (userRoleSelect) {

    //multi-select-tag.js
    // Author: Habib Mhamadi
    // Email: habibmhamadi@gmail.com

    new MultiSelectTag('user-role')
    function MultiSelectTag(el, customs = { shadow: false, rounded: true, searchBox: false }) {
        var element = null
        var options = null
        var customSelectContainer = null
        var wrapper = null
        var btnContainer = null
        var body = null
        var inputContainer = null
        var inputBody = null
        var input = null
        var button = null
        var drawer = null
        var ul = null
        var domParser = new DOMParser()
        init()

        function init() {
            element = document.getElementById(el)
            createElements()
            initOptions()
            enableItemSelection()
            setValues()

            button.addEventListener('click', () => {
                if (drawer.classList.contains('hidden')) {
                    initOptions()
                    enableItemSelection()
                    drawer.classList.remove('hidden')
                    input.focus()
                }
            })

            input.addEventListener('keyup', (e) => {
                initOptions(e.target.value)
                enableItemSelection()
            })

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && inputContainer.childElementCount > 1) {
                    const child = body.children[inputContainer.childElementCount - 2].firstChild
                    const option = options.find((op) => op.value == child.dataset.value)
                    option.selected = false
                    removeTag(child.dataset.value)
                    setValues()
                }

            })

            window.addEventListener('click', (e) => {
                if (!customSelectContainer.contains(e.target)) {
                    drawer.classList.add('hidden')
                }
            });

        }

        function createElements() {
            // Create custom elements
            options = getOptions();
            element.classList.add('hidden')

            // .multi-select-tag
            customSelectContainer = document.createElement('div')
            customSelectContainer.classList.add('mult-select-tag')

            // .container
            wrapper = document.createElement('div')
            wrapper.classList.add('wrapper')

            // body
            body = document.createElement('div')
            body.classList.add('body')
            if (customs.shadow) {
                body.classList.add('shadow')
            }
            if (customs.rounded) {
                body.classList.add('rounded')
            }

            // .input-container
            inputContainer = document.createElement('div')
            inputContainer.classList.add('input-container')

            // input
            input = document.createElement('input')
            input.classList.add('input')
            input.placeholder = `${customs.placeholder || 'Search...'}`

            inputBody = document.createElement('inputBody')
            inputBody.classList.add('input-body')
            inputBody.append(input)

            body.append(inputContainer)

            // .btn-container
            btnContainer = document.createElement('div')
            btnContainer.classList.add('btn-container')

            // button
            button = document.createElement('button')
            button.type = 'button'
            btnContainer.append(button)

            const icon = domParser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 21 6 15"></polyline></svg>`, 'image/svg+xml').documentElement
            button.append(icon)


            body.append(btnContainer)
            wrapper.append(body)

            drawer = document.createElement('div');
            drawer.classList.add(...['drawer', 'hidden'])
            if (customs.shadow) {
                drawer.classList.add('shadow')
            }
            if (customs.rounded) {
                drawer.classList.add('rounded')
            }
            if (customs.searchBox) {
                drawer.append(inputBody)
            }
            ul = document.createElement('ul');

            drawer.appendChild(ul)

            customSelectContainer.appendChild(wrapper)
            customSelectContainer.appendChild(drawer)

            // Place TailwindTagSelection after the element
            if (element.nextSibling) {
                element.parentNode.insertBefore(customSelectContainer, element.nextSibling)
            }
            else {
                element.parentNode.appendChild(customSelectContainer);
            }
        }

        function initOptions(val = null) {
            ul.innerHTML = ''
            for (var option of options) {
                if (option.selected) {
                    !isTagSelected(option.value) && createTag(option)
                }
                else {
                    const li = document.createElement('li')
                    li.innerHTML = option.label
                    li.dataset.value = option.value

                    // For search
                    if (val && option.label.toLowerCase().startsWith(val.toLowerCase())) {
                        ul.appendChild(li)
                    }
                    else if (!val) {
                        ul.appendChild(li)
                    }
                }
            }
        }

        function createTag(option) {
            // Create and show selected item as tag
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-container');
            const itemLabel = document.createElement('div');
            itemLabel.classList.add('item-label');
            itemLabel.innerHTML = option.label
            itemLabel.dataset.value = option.value
            const itemClose = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>`, 'image/svg+xml').documentElement

            itemClose.addEventListener('click', (e) => {
                const unselectOption = options.find((op) => op.value == option.value)
                unselectOption.selected = false
                removeTag(option.value)
                initOptions()
                setValues()
            })

            itemDiv.appendChild(itemLabel)
            itemDiv.appendChild(itemClose)
            inputContainer.append(itemDiv)
        }

        function enableItemSelection() {
            // Add click listener to the list items
            for (var li of ul.children) {
                li.addEventListener('click', (e) => {
                    options.find((o) => o.value == e.target.dataset.value).selected = true
                    input.value = null
                    initOptions()
                    setValues()
                    input.focus()
                })
            }
        }

        function isTagSelected(val) {
            // If the item is already selected
            for (var child of inputContainer.children) {
                if (!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                    return true
                }
            }
            return false
        }
        function removeTag(val) {
            // Remove selected item
            for (var child of inputContainer.children) {
                if (!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                    inputContainer.removeChild(child)
                }
            }
        }
        function setValues() {
            // Update element final values
            for (var i = 0; i < options.length; i++) {
                element.options[i].selected = options[i].selected
            }

        }
        function getOptions() {
            // Map element options
            return [...element.options].map((op) => {
                return {
                    value: op.value,
                    label: op.label,
                    selected: op.selected,
                }
            })
        }
    }
}