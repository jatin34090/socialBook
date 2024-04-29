import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';



const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/api/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("resultof allposts", result.posts);
        setData(result.posts);
      });
  }, []);

  const clickLike = (item) => {
    const userID = state._id;

    if (item.likes.includes(userID)) {
      fetch("/api/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: item._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log("UNLIKE result", result.likes)
          const newData = data.map((item) => {
            if (item._id == result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        });
    } else {
      fetch("/api/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: item._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log("LIKE result", result.likes);
          const newData = data.map((item) => {
            if (item._id == result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        });
    }
  };

  const makeComment = (text, postId) => {
    fetch("api/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("resultcomment===>", result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const deletePost = (postid) => {
    fetch(`/api/deletepost/${postid}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(" delete result", result);
        const newData = data.filter((item) => {
          return item._id !== postid;
        });
        setData(newData);
        M.toast({ html: "Delete Successfully", classes: "green" });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <div>
      <div>
        {data &&
          data.map((item) => {
            return (
              <div className="card max-w-md m-auto bg-slate-900 drop-shadow-[0px_10px_35px_rgba(255,255,255,0.25)]" key={item._id}>
               <div className="flex">
                {
                  item.postedBy.pic ?
               <img
              className=" w-10 h-10 bg-white text-black rounded-full"
              src={item.postedBy.pic}
              alt=""
            />
               :
               <Avatar>{item.postedBy.name[0]}</Avatar>

                }
                <h5 className="">
                  <Link className="text-2xl p-4"
                    to={
                      item.postedBy._id === state._id
                        ? "/profile"
                        : `/profile/${item.postedBy._id}`
                    }
                  >
                    {item.postedBy.name}
                  </Link> 
                   {item.postedBy._id === state._id && (
                    <i
                      className="material-icons absolute right-3 top-2 hover:bg-sky-400"
                      style={{ float: "right" }}
                      onClick={() => {
                        deletePost(item._id);
                      }}
                    >
                      delete
                    </i>
                  )}
                </h5>
               </div>

                <div className="card-image">
                  <img src={item.photo} alt="" />
                  <div className="card-content">
                    <i className={`material-icons text-red-600`}>favorite</i>
                    {item.likes.includes(state._id) ? (
                      <i
                        className="material-icons"
                        onClick={() => {
                          clickLike(item);
                        }}
                      >
                        thumb_down
                      </i>
                    ) : (
                      <i
                        className="material-icons"
                        onClick={() => {
                          clickLike(item);
                        }}
                      >
                        thumb_up
                      </i>
                    )}
                    <h6>{`${item.likes.length} likes`}</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>

                    {item.comments.map((record) => {
                      return (
                        <h6 key={record._id}>
                          <span style={{ fontWeight: "500" }}>
                            <strong className="text-lg mr-2">{record.postedBy.name}</strong>
                          </span>
                         <span className="text-gray-300"> {record.text}</span>
                        </h6>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        makeComment(e.target[0].value, item._id);
                        e.target[0].value= "";

                      }}
                    >
                      <input type="text" placeholder="add a comment" />
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
