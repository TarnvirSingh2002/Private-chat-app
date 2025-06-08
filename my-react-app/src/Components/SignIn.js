import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [data, setdata] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/api/use/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.text();

            if (response.ok) {
                navigate('/');
            } else {
                console.error("Login failed:", result);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Please Registered Your Self</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="email" value={data.email} name='email'
                        onChange={handleChange} placeholder="Email" className="login-input" required />
                    <input type="password" value={data.password} name='password'
                        onChange={handleChange} placeholder="Password" className="login-input" required />
                    <button type="submit" className="login-button">Register Me</button>
                </form>
              </div>
        </div>
    );
}
