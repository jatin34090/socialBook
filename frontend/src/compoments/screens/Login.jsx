import React, { useContext } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";


const Login = () => {
  const  {state,dispatch} = useContext(UserContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const clickHandler = () => {
    fetch("api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("res ===> ", data);
        // localStorage.setItem("jwt", data.token)
        // localStorage.setItem("user", JSON.stringify(data.user))


        if (data.error) {
          M.toast({ html: data.error, classes: "red" });
        } else {
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          M.toast({ html: "Login Successfully", classes: "green" });
          navigate("/");
          dispatch({type:"USER",payload:data.user})
        }
      }).catch(err => {
        console.log(err)
      })
    
  };

  return (
    <div className="container mt-8 flex justify-center">
      <div className="rounded-3xl drop-shadow-[0px_10px_35px_rgba(255,255,255,0.25)] bg-slate-800 p-8 m-auto mt-10 text-center max-w-md">
        <h2 className="text-3xl hover:text-sky-400">Login</h2>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={() => clickHandler()} className=" py-2 px-3 text-xl border-2 hover:bg-sky-400 rounded-md">Login</button>
        <h5 className="m-5">
          <Link className="hover:text-sky-400" to="/signup">Don't have an account ?</Link>
        </h5>
        <h6>
          <Link className="hover:text-sky-400" to="/resetpassword">Forget Password ?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Login;
