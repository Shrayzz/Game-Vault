function triggerPopup(type, message, timeout) {
    const e = new CustomEvent(`${type}-popup`, {
        detail: {
            message: message,
            timeout: timeout
        }
    });
    document.dispatchEvent(e);
}

['success', 'error'].forEach(type => {
    document.addEventListener(`${type}-popup`, (e) => {
        const { message, timeout } = e.detail;
        showPopup(type, message, timeout);
    });
});

function showPopup(type, message, timeout) {
    let div, p;

    try {
        if (type === 'success') {
            div = document.getElementById('success');
            p = document.getElementById('success-text');
        } else if (type === 'error') {
            div = document.getElementById('error');
            p = document.getElementById('error-text');
        }

        div.style.display = 'block';
        p.innerText = message;

        setTimeout(() => {
            div.style.display = 'none';
        }, timeout);
    }
    catch (err) {
        console.warn(`No popup display: Bad type! ${err.message}`)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const actions = {
        register: async () => {
            const username = getValue('r_username');
            const email = getValue('email');
            const cemail = getValue('cemail');
            const password = getValue('r_password');
            const cpassword = getValue('cpassword');

            if (!areAllInputsFilled(username, email, cemail, password, cpassword)) {
                return triggerPopup('error', '❌ㆍNot all inputs are filled!', 5000);
            }

            if (email !== cemail || password !== cpassword) {
                return triggerPopup('error', '❌ㆍEmails / Passwords do not match!', 5000);
            }

            if (!isValidPassword(password)) {
                return triggerPopup('error', '❌ㆍPassword must contain at least 8 characters, one uppercase, one lowercase, and one number.', 5000);
            }

            if (!isValidEmail(email)) {
                return triggerPopup('error', '❌ㆍPlease enter a valid email address.', 5000);
            }

            try {
                const response = await sendRequest('http://localhost:3000/api/register', {
                    username,
                    email,
                    password,
                });

                if (response.ok) {
                    window.location.href = '/login?success=true';
                } else if (response.status === 502) {
                    triggerPopup('error', '❌ㆍUser already exists!', 5000);
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
            }
        },

        login: async () => {
            const username = getValue('l_username');
            const password = getValue('l_password');

            if (!areAllInputsFilled(username, password)) {
                return triggerPopup('error', '❌ㆍNot all inputs are filled!', 5000);
            }

            try {
                const response = await sendRequest('http://localhost:3000/api/auth', {
                    username,
                    password,
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/library';
                } else {
                    triggerPopup('error', '❌ㆍInvalid credentials. Try again.', 5000);
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
            }
        },

        forgotPassword: async () => {
            const email = getValue('fp_email');

            if (!email) {
                return triggerPopup('error', '❌ㆍPlease enter your email', 5000);
            }

            try {
                const response = await sendRequest('http://localhost:3000/api/email', { email });
                const data = await response.json();

                if (response.ok && data.success) {
                    triggerPopup('success', '✔️ㆍAccount found! An email has been sent to your mailbox.', 2500);
                } else {
                    triggerPopup('error', '❌ㆍThis account doesn\'t exist. Try again.', 2500);
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
            }
        },
    };

    const buttonMapping = {
        registerBtn: 'register',
        loginBtn: 'login',
        fpBtn: 'forgotPassword',
    };

    Object.entries(buttonMapping).forEach(([btnId, action]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', actions[action]);
        }
    });

    // Helper functions
    function getValue(id) {
        return document.getElementById(id)?.value.trim() || '';
    }

    function areAllInputsFilled(...inputs) {
        return inputs.every(input => input);
    }

    function isValidPassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d._-]{8,}$/;
        return passwordPattern.test(password);
    }

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    async function sendRequest(url, body) {              // TODO: Fix auth
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return await response.json();
    }
});
