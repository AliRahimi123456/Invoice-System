//this page will accept a user's email and password
//Create a function in flux which will make a POST request with users info in body
//SUCCESS means;
//1. the user is already registered in the database 
//2. response will include a msg stored in flux store from backend 
//3. redirect user to /private page


//FAILURE means;
//1. response will retuen a msg stored in flux store
//2. msg will be dsiplayed on /login page telling the user that the email/password combo does not match
import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const handleClick = () => {
        actions.login(email, password);
    };

    useEffect(() => {
        if (store.isLoginSuccessful) {
            navigate("/private");
        }
    }, [store.isLoginSuccessful, navigate]);

    return (
        <div className="login-page">
            {store.token && store.token !== "" && store.token !== undefined ? (
                <>
                    <h1>You are logged in</h1>
                    <Link to="/private">
                        <button>Go to your Invoices</button>
                    </Link>
                </>
            ) : (
                <>
                    <div>
                        <h1>Log In</h1>
                    </div>
                    <div>
                        {store.loginMessage || ""}
                    </div>
                    <form onSubmit={handleClick} className="w-25 mx-auto pt-5" >
                        
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email"  value={email}
                            onChange={e => setEmail(e.target.value)} 
                            required class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" value={password}
                            onChange={e => setPassword(e.target.value)} 
                            required class="form-control" id="exampleInputPassword1"/>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
                </>
            )}
        </div>
    );
};