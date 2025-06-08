import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "..";

export default function Login() {
    const { isAuthenticated, setIsAuthenticated, settoken,setcurrentEmail } = useContext(Context);
    const navigate = useNavigate();
    const [data, setdata] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value });
    }

    const navigat = () => {
        navigate('/SignIn');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/api/use/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Login successful:", result);
                settoken(result.token);
                setcurrentEmail(data.email);
                setIsAuthenticated(true);
            } else {
                console.error("Login failed:", result.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };


    if (isAuthenticated) {
        navigate("/allmessages");
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Welcome Back</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="email" value={data.email} name='email'
                        onChange={handleChange} placeholder="Email" className="login-input" required />
                    <input type="password" value={data.password} name='password'
                        onChange={handleChange} placeholder="Password" className="login-input" required />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="login-footer">Don't have an account? <p style={{ color: "#764ba2", cursor: "pointer" }} onClick={navigat}>Sign up</p></p>
            </div>
        </div>
    );
}
