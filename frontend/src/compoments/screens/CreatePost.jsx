import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const[image, setImage] = useState('');
  const[url, setUrl] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if(url){
      fetch('api/createpost', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
          photo: url
        })
      }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "red" });
        } else {
          M.toast({ html: "Post Created", classes: "green" });
          navigate("/");
        }
      })
    }

  },[url])


  const postDetails = () => {

    const data = new FormData();
    data.append('file', image);
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dbvyslsdc/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'social-book';
    const url = `${CLOUDINARY_URL}?upload_preset=${CLOUDINARY_UPLOAD_PRESET}`;
    fetch(url, {
      method: 'POST',
      body: data
    })
    .then(res => res.json())
    .then(data => {
      setUrl(data.url)
      // console.log(data);
      // return data.url
    }).catch(err => {
      console.log(err)
    })
 


  }

  return (
   <div className='flex justify-center container'>
     <div className='bg-slate-800 rounded-3xl drop-shadow-[0px_10px_35px_rgba(255,255,255,0.25)]' style={{maxWidth: '500px', margin: '30px auto', padding: '20px', textAlign: "center"}}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Description" value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="file-field input-field">
        <div className="btn bg-sky-400">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button className="bg-sky-400 text-xl m-4 hover:bg-sky-400 p-2 rounded-md" onClick={() => postDetails()} type="submit" name="action">Submit
        <i className="material-icons right">send</i>
      </button>
    </div>
   </div>
  )
}

export default CreatePost