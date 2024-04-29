import React, { useContext } from "react";
import M from "materialize-css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Reset = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");


  const clickHandler = () => {
    fetch("api/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
      


        if (data.error) {
          M.toast({ html: data.error, classes: "red" });
        } else {
       
          M.toast({ html: data.message, classes: "green" });
          navigate("/login");
        }
      }).catch(err => {
        console.log(err)
      })
    
  };

  return (
    <div className="container mt-8 text-black">
      <div className="card p-8 m-auto mt-10 text-center max-w-md">
        <h2 className="text-3xl">Login</h2>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button onClick={() => clickHandler()} className=" py-2 px-3 text-xl bg-sky-400">Reset Password</button>
      </div>
    </div>
  );
};

export default Reset;
