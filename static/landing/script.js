$(document).ready(function () {
    // API Base URL - change for production vs development
    var API_BASE_URL = "https://api.metamilktech.com";
    // Uncomment below for local development:
    // var API_BASE_URL = "";

    $(".navbar a").on("click", function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top
                },
                900,
                function () {
                    window.location.hash = hash;
                }
            );
        }
    });

    var $loginModal = $("#loginModal");
    var loginForm = document.getElementById("webLoginForm");
    var loginError = document.getElementById("loginError");
    var usernameField = document.getElementById("loginUsername");
    var passwordField = document.getElementById("loginPassword");
    var emailSignupForm = document.getElementById("emailSignupForm");
    var emailSignupInput = document.getElementById("emailSignupInput");
    var emailSignupMessage = document.getElementById("emailSignupMessage");

    function clearError() {
        if (!loginError) {
            return;
        }
        loginError.textContent = "";
        loginError.classList.add("is-hidden");
    }

    function showError(message) {
        if (!loginError) {
            return;
        }
        loginError.textContent = message;
        loginError.classList.remove("is-hidden");
    }

    function setLoading(isLoading) {
        if (!loginForm) {
            return;
        }
        var submitButton = loginForm.querySelector(".meta-login-submit");
        if (!submitButton) {
            return;
        }
        submitButton.disabled = isLoading;
        var defaultText = submitButton.querySelector(".default-text");
        var loadingText = submitButton.querySelector(".loading-text");
        if (defaultText && loadingText) {
            if (isLoading) {
                defaultText.classList.add("is-hidden");
                loadingText.classList.remove("is-hidden");
            } else {
                defaultText.classList.remove("is-hidden");
                loadingText.classList.add("is-hidden");
            }
        }
    }

    function showEmailSignupMessage(message, isSuccess) {
        if (!emailSignupMessage) {
            return;
        }
        emailSignupMessage.style.display = "block";
        if (isSuccess) {
            emailSignupMessage.style.backgroundColor = "#d4edda";
            emailSignupMessage.style.color = "#155724";
        } else {
            emailSignupMessage.style.backgroundColor = "#f8d7da";
            emailSignupMessage.style.color = "#721c24";
        }
        emailSignupMessage.textContent = message;
    }

    function clearEmailSignupMessage() {
        if (!emailSignupMessage) {
            return;
        }
        emailSignupMessage.textContent = "";
        emailSignupMessage.style.display = "none";
    }

    function setEmailSignupLoading(isLoading) {
        if (!emailSignupForm) {
            return;
        }
        var submitButton = emailSignupForm.querySelector("button[type='submit']");
        if (!submitButton) {
            return;
        }
        submitButton.disabled = isLoading;
    }

    function isValidEmail(value) {
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value || "");
    }

    if ($loginModal.length) {
        $loginModal.on("show.bs.modal", function () {
            if (loginForm) {
                loginForm.reset();
            }
            clearError();
        });

        $loginModal.on("shown.bs.modal", function () {
            if (usernameField) {
                usernameField.focus();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!usernameField || !passwordField) {
                return;
            }
            var username = usernameField.value.trim();
            var password = passwordField.value;
            if (!username || !password) {
                showError("Enter your username and password.");
                return;
            }
            clearError();
            setLoading(true);

            fetch(API_BASE_URL + "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                .then(function (response) {
                    return response
                        .json()
                        .catch(function () {
                            return {};
                        })
                        .then(function (payload) {
                            return {
                                ok: response.ok,
                                status: response.status,
                                payload: payload
                            };
                        });
                })
                .then(function (result) {
                    setLoading(false);
                    if (result.ok && result.payload && result.payload.ok) {
                        var redirectUrl = result.payload.redirect || "/dashboard";
                        $("#loginModal").modal("hide");
                        window.location.href = redirectUrl;
                        return;
                    }
                    var message =
                        (result.payload && (result.payload.error || result.payload.message)) ||
                        "Unable to sign in with those credentials.";
                    showError(message);
                    if (passwordField) {
                        passwordField.value = "";
                        passwordField.focus();
                    }
                })
                .catch(function () {
                    setLoading(false);
                    showError("We could not reach the MetaMilk servers. Try again in a moment.");
                });
        });
    }

    if (emailSignupForm) {
        emailSignupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!emailSignupInput) {
                return;
            }
            var emailValue = emailSignupInput.value.trim();
            if (!emailValue) {
                showEmailSignupMessage("Enter your email address.", false);
                return;
            }
            if (!isValidEmail(emailValue)) {
                showEmailSignupMessage("Enter a valid email address.", false);
                return;
            }
            clearEmailSignupMessage();
            setEmailSignupLoading(true);

            fetch(API_BASE_URL + "/api/email-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: emailValue })
            })
                .then(function (response) {
                    return response
                        .json()
                        .catch(function () {
                            return {};
                        })
                        .then(function (payload) {
                            return {
                                ok: response.ok,
                                status: response.status,
                                payload: payload
                            };
                        });
                })
                .then(function (result) {
                    setEmailSignupLoading(false);
                    if (result.ok && result.payload && result.payload.ok) {
                        showEmailSignupMessage(
                            result.payload.message || "Thank you! Your email has been saved.",
                            true
                        );
                        emailSignupInput.value = "";
                        return;
                    }
                    var message =
                        (result.payload && (result.payload.error || result.payload.message)) ||
                        "Unable to save email.";
                    showEmailSignupMessage(message, false);
                })
                .catch(function () {
                    setEmailSignupLoading(false);
                    showEmailSignupMessage("We could not reach the MetaMilk servers. Try again in a moment.", false);
                });
        });
    }
});
