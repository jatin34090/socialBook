import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

const Signup = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (url) {
      uploadFeilds();
    }
  }, [url]);
  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/dbvyslsdc/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "social-book";
    const url = `${CLOUDINARY_URL}?upload_preset=${CLOUDINARY_UPLOAD_PRESET}`;
    fetch(url, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        // console.log(data);
        // return data.url
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFeilds = () => {
    fetch("api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic:url
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("res ===> ", data);

        if (data.error) {
          console.log("dI am running error");
          M.toast({ html: data.error, classes: "red" });
        } else {
          console.log("data ===> ", data);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "Successfully SignUp", classes: "green" });
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("I am running catch error");
        console.log(err);
      });
  };
  const clickHandler = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFeilds();
    }
  };
  return (
    <div className="container mt-8 flex justify-center ">
      <div className="card p-8 m-auto rounded-3xl drop-shadow-[0px_10px_35px_rgba(255,255,255,0.25)] bg-slate-800 mt-10 text-center max-w-md">
        <h2 className="text-3xl hover:text-sky-400">Signup</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <div className="file-field input-field">
          <div className="btn bg-sky-400">
            <span>Upload Pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          onClick={() => clickHandler()}
          className=" py-2 px-3 text-xl border-2 rounded-md hover:bg-sky-400"
        >
          Login
        </button>
        <h5 className="mt-4">
          <Link className="hover:text-sky-400" to="/login">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
