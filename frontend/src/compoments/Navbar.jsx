import React, { useContext,useEffect,useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const Navbar = () => {
  const searchModal = useRef(null);
  const { state,dispatch } = useContext(UserContext);
  const navigate = useNavigate()
const [search,setSearch] = useState("")
const [userDetails, setUserDetails] = useState([])
  useEffect(() => {
    M.Modal.init(searchModal.current);
  },[])
  const logoutClickHandler = () => {
    localStorage.clear();
    dispatch({type:"CLEAR"})
    navigate("/login");
    // window.location.reload();
  };
  const renderList = () => {
    if (state) {
      return [
        <li key={0} className="hover:text-sky-400">
          <i data-target="modal1" className="hover:text-sky-400 large material-icons modal-trigger ">search</i>
        </li>,
        <li  key={1} className="hover:text-sky-400">
          <Link className="hover:text-sky-400" to="/profile">Profile</Link>
        </li>,
        <li  key={2}>
          <Link className="hover:text-sky-400" to="/createpost">Create Post</Link>
        </li>,
        <li  key={3} className="hover:text-sky-400">
          <Link className="hover:text-sky-400" to="/myfollowingpost">My Following Posts</Link>
        </li>,
        <li  key={4} >
          <button
            onClick={() => logoutClickHandler()}
            className=" py-2 px-3 text-xl text-center border-2 hover:bg-sky-400 rounded-md "
          >
            Logout
          </button>

        
        </li>,
      ];
    } else {
      return [
        <li key={1}>
          <Link className="hover:text-sky-400" to="/login">Login</Link>
        </li>,
        <li key={2}>
          <Link className="hover:text-sky-400" to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query)
    fetch("/api/searchusers", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json()).then(result => {
      console.log(result)
      setUserDetails(result.user)
    })
  }

  return (
    <nav >
      <div className="bg-slate-900 nav-wrapper pl-3 pr-3">
        <Link to={state ? "/" : "/signup"} className="brand-logo left hover:text-sky-400">
          Social Book
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div id="modal1" className="modal" ref={searchModal}>
    <div className="modal-content">
    <input style={{ color: "black" }} type="text" placeholder="search" value={search}
    onChange={(e) => fetchUsers(e.target.value)}
    />

<ul className="collection" >
  {userDetails.map(item => {
    return <Link key={item} onClick={() =>  M.Modal.getInstance(searchModal.current).close()
    } to={item._id !== state._id ? "/profile/"+item._id : "/profile"}>
      <li className="collection-item text-black ">{item.email}</li></Link>
  })}
</ul>

    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat">Agree</button>
    </div>
  </div>
    </nav>
  );
};

export default Navbar;
