const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            signupMessage: null,
            isSignUpSuccessful: false,
            loginMessage: null,
            isLoginSuccessful: false,
            invoiceMessage: null,
            invoices: []
        },
        actions: {
            signUp: async (userEmail, userPassword) => {
                const options = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPassword
                    })
                };

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, options);

                    if (!response.ok) {
                        const data = await response.json();
                        setStore({
                            signupMessage: data.msg,
                            isSignUpSuccessful: false
                        });
                        return false; // Indicate failure
                    }

                    const data = await response.json();
                    setStore({
                        signupMessage: data.msg,
                        isSignUpSuccessful: true
                    });
                    return true; // Indicate success
                } catch (error) {
                    setStore({
                        signupMessage: 'An error occurred while signing up.',
                        isSignUpSuccessful: false
                    });
                    console.error('SignUp error:', error);
                    return false; // Indicate failure
                }
            },

            login: async (userEmail, userPassword) => {
                const options = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPassword
                    })
                };

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/token`, options);

                    if (!response.ok) {
                        const data = await response.json();
                        setStore({
                            loginMessage: data.msg,
                            isLoginSuccessful: false
                        });
                        return false; // Indicate failure
                    }

                    const data = await response.json();
                    sessionStorage.setItem("token", data.access_token);
                    setStore({
                        token: data.access_token,
                        loginMessage: data.msg,
                        isLoginSuccessful: true
                    });
                    return true; // Indicate success
                } catch (error) {
                    setStore({
                        loginMessage: 'An error occurred while logging in.',
                        isLoginSuccessful: false
                    });
                    console.error('Login error:', error);
                    return false; // Indicate failure
                }
            },

            syncSessionTokenFromStore: () => {
                const sessionToken = sessionStorage.getItem('token');
                if (sessionToken && sessionToken !== "" && sessionToken !== undefined) {
                    setStore({ token: sessionToken });
                }
            },

            logout: () => {
                sessionStorage.removeItem('token');
                setStore({
                    token: null,
                    signupMessage: null,
                    isSignUpSuccessful: false,
                    loginMessage: null,
                    isLoginSuccessful: false,
                    invoiceMessage: null,
                    invoices: []
                });
            },

            getInvoices: async () => {
                const store = getStore();

                const options = {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.token}`
                    }
                };

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/invoices`, options);

                    if (!response.ok) {
                        const error = {
                            status: response.status,
                            statusText: response.statusText
                        };
                        console.error('Invoices error:', error);
                        return { error };
                    }

                    const data = await response.json();
                    setStore({
                        invoices: data.invoices,
                        invoiceMessage: data.msg
                    });
                    console.log(data.msg, data.invoices);
                    return data;
                } catch (error) {
                    setStore({
                        invoiceMessage: 'An error occurred while fetching invoices.'
                    });
                    console.error('Fetching invoices error:', error);
                    return { error };
                }
            }
        }
    };
};

export default getState;