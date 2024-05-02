import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { userid } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [showFollowBtn, setShowfollowBtn] = useState(state?!state.following.includes(userid):true)

  useEffect(() => {
    fetch(`/api/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result post", result);
        setUserProfile(result);
        // console.log("result.posts", result.posts)
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);

  const followUser = () => {
    console.log(userid);
    fetch(`/api/follow/${userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        dispatch({
          type: "UPDATE",
          payload: {
            following: result.following,
            followers: result.followers,
          }
        })
        localStorage.setItem("user", JSON.stringify(result));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {...prevState.user,
              followers:[...prevState.user.followers,result._id]},
          };
        });
        setShowfollowBtn(false)
      });
  };

  const unFollowUser = () => {
    console.log(userid);
    fetch(`/api/unfollow/${userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        dispatch({
          type: "UPDATE",
          payload: {
            following: result.following,
            followers: result.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(result));
        
        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(item=>item !== result._id)
          return {
            ...prevState,
            user: {...prevState.user,
              followers:newFollower
            }
          };
        });
        setShowfollowBtn(true)
      });
  };



  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "650px", margin: "0px auto" }}>
          <div className="flex justify-around my-5 mx-0 border-b-2 border-gray-500 text-2xl ">
            <div>
              <img
                className=" w-40 h-40 rounded-full"
                src={userProfile.user.pic}
                alt=""
              />
            </div>
            <div className="flex flex-col items-center">
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div className="flex justify-between gap-5 ">
                <h6> {userProfile.posts.length}</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {showFollowBtn ? (
                <button
                  onClick={() => followUser()}
                  className="m-4 py-2 px-3 text-xl bg-sky-400"
                >
                  Follow
                </button>
              ) : (
                <button
                  onClick={() => unFollowUser()}
                  className="m-4 py-2 px-3 text-xl bg-sky-400"
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            {userProfile.posts.map((item) => {
              return (
                  item.photo && item.photo.includes(".mp4") ?
            <video key={item._id} className="w-1/4" autoPlay loop controls controlsList="nodownload nofullscreen">
              <source src={item.photo} type="video/mp4" />
            </video>
            :
            <img key={item._id} className="w-1/4" src={item.photo} alt={item.title} />
                
                // <img
                //   key={item._id}
                //   className="w-1/4"
                //   src={item.photo}
                //   alt={item.title}
                // />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Spinner/>
        </div>
      )}
    </>
  );
};

export default UserProfile;
