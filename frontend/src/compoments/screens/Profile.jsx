import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import Spinner from "./Spinner";

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    fetch("/api/mypost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result.posts.length", result.posts.length);
        setMyPosts(result.posts);
        // console.log("result.posts", result.posts)
      });
  }, []);
  useEffect(() => {
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

        fetch('/api/updatepic',{
          method:"PUT",
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            pic:data.url
          })
        }).then(res=>res.json())
        .then(result=>{
          localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
          dispatch({type:"UPDATEPIC", payload:result.pic})
        })
        // console.log(data);
        // return data.url
      })
      .catch((err) => {
        console.log(err);
      });
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <>
    
   { myPosts ? 
       ( <div style={{ maxWidth: "650px", margin: "0px auto" }}>
        <div className="my-5 mx-0 border-b-2 border-gray-500 text-2xl ">
          <div className="flex justify-around ">
            <div>
              <img
                className=" w-40 h-40 text-black rounded-full"
                src={state? state.pic : "https://res.cloudinary.com/dbvyslsdc/image/upload/v1713746815/noimage_vcqmbk.jpg"}
                alt=""
              />
            </div>
            <div className="flex flex-col items-center">
              <h4>{state ? state.name : "loading"}</h4>
              <div className="flex justify-between gap-5 ">
                <h6>{myPosts.length} posts</h6>
                <h6>{state ? state.followers.length : "0"} followers</h6>
                <h6>{state ? state.following.length : "0"} following</h6>
              </div>
            </div>
          </div>
          <div className="file-field input-field m-4">
            <div className="btn">
              <span>Update Pic</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center">
          {myPosts.map((item) => {
            return (
              item.photo && item.photo.includes(".mp4") ?
              <video key={item._id} className="w-1/4" autoPlay loop controls controlsList="nodownload nofullscreen">
                <source src={item.photo} type="video/mp4" />
              </video>
              :
              <img key={item._id} className="w-1/4" src={item.photo} alt={item.title} />
            );
          })}
        </div>
      </div>)
    :
    (
      <div className="flex justify-center">
        <Spinner/>
      </div>
    )
  }
  </>
  );
};

export default Profile;
