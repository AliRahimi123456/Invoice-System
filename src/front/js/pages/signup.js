import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const handleClick = async () => {
        setIsLoading(true);
        const success = await actions.signUp(email, password);
        setIsLoading(false);
        if (success) {
            navigate("/login");
        }
    };

    useEffect(() => {
        if (store.isSignUpSuccessful) {
            navigate("/login");
        }
    }, [store.isSignUpSuccessful, navigate]);

    return (
        <div className="signup-page">
            <div>
                <h1>Sign Up</h1>
            </div>
            <div>
                {store.signupMessage && <p>{store.signupMessage}</p>}
            </div>
            <div>
                <input 
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    required
                />
                <input 
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                    required
                />
            </div>
            <div>
                <button onClick={handleClick} disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
            </div>
        </div>
    );
};