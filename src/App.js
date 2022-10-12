import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [mulImages, setMulImages] = useState([]);
  const [toFile, setToFile] = useState();
  const [submitText, setSubmitText] = useState();
  const [dogForTheBack, setDogForTheBack] = useState('');
  const [url, setUrl] = useState('');

  /* Please upload photos from the back: /uploads.html */
  useEffect(()=>{
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res=>{
        if(!res.ok){
        throw new Error ('Request Failed');
      }
        return res.json();
    })
      .then((image) => {
        setDogForTheBack(image.message)
      })
      .catch(err=>{
        console.log(err.message);
      })
  },[count])


  const getRandomDogImage = (e) =>{
    e.preventDefault();
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res=>{
        if(!res.ok){
        throw new Error ('Request Failed');
      }
        return res.json();
    })
      .then((image) => {
        setUrl(image.message)
      })
      .then(console.log(url))
      .catch(err=>{
        console.log(err.message);
      })
  }

  const displayPhotosFromServer = (e) => {
    fetch("/multiple")
      .then(res => {
        if(res.status !== 200){
          setSubmitText("Could not get random image");
          return Promise.reject("Exit promise");
        }
        return(res.json());
      })
      .then((image) => {
        setSubmitText("Photos from the backend are displayed!")
        setMulImages(image);
      })
      .then(console.log(mulImages))
      .catch((error) => {
        console.log(error.message);
        setSubmitText("Could not do it...");
      })
  }

  const uploadRandomDogImage = (e) =>{
    e.preventDefault();

    fetch(dogForTheBack)
      .then(res=>{
        return res.blob();
      })
      .then(blob=>{
        var file = new File([blob], 'doggy.jpg', {type: blob.type});
        setToFile(file);
      })
      .then(console.log(toFile))
      .catch(err=>{
        console.log(err.message);
      })
    
    const data = new FormData();
    data.append("image", toFile);

    fetch('/single', {
      method: "POST",
      body: data,
    })
      .then((result) => {
        console.log(result);
        console.log("Dog image sent to Backend!");
        setSubmitText("Dog image sent to Backend!");
      })
      .catch((err) => {
        console.log(err.message);
        setSubmitText(err.message);
      });
  }

  
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={uploadRandomDogImage}>
          <input type="button" onClick={displayPhotosFromServer} value="Display photos from the backend" />
          <br/>
          <br/>
          <input type="button" onClick={getRandomDogImage} value="Get a random dog picture to express"/>
          <br/>
          <br/>
          <input type="submit" onClick={() => setCount(count + 1)} value="Upload a random dog picture to express" />
          <p>{submitText}</p>
          {/* Display the random dog picture */}
          <img src={url} className="dogg" alt=" " width="200" height="200"/>

          {/* Display photos from the back */}
          {mulImages.map(e=>{
            return<img src={"/"+e} key={e} width="200" height="200"/>
          })}
        </form>
      </header>
    </div>
  );
}

export default App;
