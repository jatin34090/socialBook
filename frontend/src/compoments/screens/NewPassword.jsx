import M from "materialize-css";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const {token} = useParams();

  const clickHandler = () => {
    fetch("/api/newpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container mt-8">
      <div className="card p-8 m-auto mt-10 text-center text-black max-w-md">
        <h2 className="text-3xl">Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter New Password"
        />
        <button
          onClick={() => clickHandler()}
          className=" py-2 px-3 text-xl bg-sky-400"
        >
          Update Password
        </button>
      
      </div>
    </div>
  );
};

export default NewPassword;
