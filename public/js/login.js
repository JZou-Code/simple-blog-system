window.addEventListener("load", function () {
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        let count = 2;

        function changeImage() {
            let index = count % 3
            cards[index % 3].classList.add('disappear')
            cards[(index + 1) % 3].classList.remove('disappear')
            count++;
        }

        setInterval(changeImage, 2000)
    }

    // ==============begin===============
    // validate username in register page
    const usernameInput = document.querySelector('#regname');

    if (usernameInput) {
        const validateResult = document.querySelector('#validate-msg')
        let timer, username;

        usernameInput.addEventListener('input', function () {
            clearTimeout(timer);

            username = this.value;
            const regex = /^[a-zA-Z0-9_]+$/

            if (!username) {
                validateResult.textContent = 'Username cannot be null';
                validateResult.style.color = 'red';
            } else if (!regex.test(username)) {
                validateResult.textContent = 'Only letters, numbers and underscores';
                validateResult.style.color = 'red';
            } else {
                timer = setTimeout(delaySendMessage, 200);
            }
        })

        async function delaySendMessage() {
            fetch(`/account/validate-username?username=${username}`)
                .then(resPromise => resPromise.json())
                .then(data => {
                    // console.log(data)
                    if (data.isValid) {
                        validateResult.textContent = 'Available username';
                        validateResult.style.color = 'green';
                    } else {
                        validateResult.textContent = 'Username is already taken';
                        validateResult.style.color = 'red';
                    }
                }).catch(err => {
                console.log('validate username err', err)
            })
        }

        // ===============end================

        // ==============begin===============
        // remaining number of letters left in self introduction area
        const remaining = document.querySelector('#remaining');
        const ta = document.querySelector('textarea');
        const maxLength = ta.getAttribute('maxlength');
        ta.addEventListener('input', () => {
            const num = maxLength - ta.value.length;
            remaining.textContent = `${num}/${maxLength}`
        })
        // ===============end================

        // ==============begin===============
        // validate passwords are match or not
        const password = document.querySelector('#new-password');
        const confirm = document.querySelector('#confirm');
        const matchMessage = document.querySelector('#match-password');
        const registerBtn = document.querySelector('#keyBtn');

        function validatePwdMatch() {
            const passowrd1 = password.value;
            const passowrd2 = confirm.value;

            if (passowrd1 && passowrd2 && passowrd1 === passowrd2) {
                registerBtn.disabled = false;
                registerBtn.classList.remove('disabled')
                matchMessage.textContent = '';
            } else {
                registerBtn.disabled = true;
                registerBtn.classList.add('disabled')
                if (passowrd1 && passowrd2) {
                    matchMessage.textContent = "Passwords don't match";
                } else {
                    matchMessage.textContent = 'Passwords cannot be null';
                }
            }
        }

        password.addEventListener('input', validatePwdMatch)
        confirm.addEventListener('input', validatePwdMatch)
    }
    // ===============end================

    // ==============begin===============
    // set new avatar, pass the path by using a shadow input value, which contains the same src value as the new one.
    const avatar = document.querySelector('#avatar');
    const avatars = document.querySelectorAll('.avatar');
    const selectedAvatar = document.querySelector('#selected-avatar');

    function changeAvatar() {
        avatar.src = this.src;
        selectedAvatar.value = avatar.src;
    }

    for (const element of avatars) {
        element.addEventListener('click', changeAvatar)
    }
    // ===============end================

    // ==============begin===============
    // set delete account button feature
    const deleteBtn = document.querySelector('#deleteBtn');

    if (deleteBtn) {

        console.log(deleteBtn)

        deleteBtn.addEventListener('click', deleteAccount);

        async function deleteAccount() {
            const promiseRes = await fetch('/account/api/delete');
            const data = await promiseRes.json();

            console.log(data)

            if (!data.isLoggedIn) {
                window.location.href = '/account/login'
                return
            }

            if (!data.isDeleted) {
                alert('Failed to delete, please try again later.')
                return;
            }

            window.location.href = '/account/logout'
        }
    }

// ===============end================
})

// ==============begin===============
// To use flatpickr -- external date selector.
// Input with type='date' displayed incorrectly with phone browsers.
document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#birth", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        allowInput: false,
        disableMobile: true,
        static: true,
        minDate: "1900-01-01",
        maxDate: new Date(),
        required: true,
        onChange: function(selectedDates, dateStr, instance) {
            const submitBtn = document.querySelector('#keyBtn') || document.querySelector('#saveBtn');
            if (!dateStr) {
                submitBtn.disabled = true;
                submitBtn.classList.add('disabled');
                alert('Please select a valid date');
            }
        }
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const birthInput = this.querySelector('#birth');
            if (!birthInput) return;

            if (!birthInput.value) {
                e.preventDefault();
                alert('Please select your date of birth');
                return false;
            }

            const birthDate = new Date(birthInput.value);
            const minDate = new Date('1900-01-01');
            const today = new Date();

            if (isNaN(birthDate.getTime()) ||
                birthDate < minDate ||
                birthDate > today) {
                e.preventDefault();
                alert('Please select a valid date between 1900 and today');
                return false;
            }
        });
    });
});
// ===============end================
