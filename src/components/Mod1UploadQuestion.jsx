import React from "react";
import "./styles/Mod1UploadQuestion.css";
import { useState } from "react";
import { useRef } from "react";
import { Button } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Mod1UploadQuestion() {
  
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [file , setFile] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [resource, setResource] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    } else {
      setFile(null);
      setFileName("");
    }
  }; 
  const OnDescriptionChangeValue = (e) => {setDescription(e.target.value);};
  const HandleSubjectValue = (e) => { setSubject(e.target.value);};
  const HandleTopicValue = (e) => { setTopic(e.target.value);};
  const HandleResourceValue = (e) => { setResource(e.target.value);};
  const handleButtonClick = () => {fileInputRef.current.click();};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !file || !description || !subject || !topic || !resource)
    {
      toast.error("Upload Image and Fill all the fields");
      return;
    }

    toast.info("Please Wait...");
    const FormDate = new FormData();
    FormDate.append("description", description);
    FormDate.append("subject", subject);
    FormDate.append("topic", topic);
    FormDate.append("resource", resource);  
    FormDate.append('testImage', file);

    const Response = await fetch("http://localhost:3001/DoubtSolverModule1", {
      method: "POST",
      body: FormDate,
    });
    const ResponseToJson = await Response.json();
    if (ResponseToJson.success===true)
    {
      toast.success("Details Added Successfully");
      //Navigate to x page
    }
    else
    {
      toast.error("Error in Adding Details");
      //Navigate to x page
    }
    

  };




  return (
    <>
      <div className="Title">Expert Solve</div>
      <div className="container">
        <img
          src="/DoubtSolveLogo.png"
          alt="Expert Solve"
          id="ds-image"
          width={350}
        />
        <h5 id="ds-tagline">Get Explainations from our Experts</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="testImage"
            className="form-control"
            type="file"
            id="formFile"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button className="options-btn" onClick={handleButtonClick}>
            Upload Doubt
          </button>
          <span className="form-text">{fileName}</span>
        </div>

        <div className="container" id="ds-box">
            <label htmlFor="ds-text-area" className="form-label" id="ds-text-area-l">What problems are you facing in the uploaded question above?  <b>*</b></label>
            <textarea  id="ds-text-area" placeholder="Write your doubt here..." className='form-control' rows="4" value={description} onChange={OnDescriptionChangeValue}></textarea>
        </div>

        <div className="container" id="ds-box">
            <label htmlFor="ds-text-area" className="form-label" id="ds-text-area-l">Subject:  <b>*</b></label>
            <select id='input-fy-2'  onChange={HandleSubjectValue}>
                <option value="">-- Select Subject --</option>
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
            </select>
        </div>

        <div className="container" id="ds-box">
            <label htmlFor="ds-text-area" className="form-label" id="ds-text-area-l">Topic:  <b>*</b></label>
            <select id='input-fy-2'  onChange={HandleTopicValue}>
                <option value="">-- Select Topic --</option>
                <option value="Topic-1">Topic-1</option>
                <option value="Topic-2">Topic-2</option>
                <option value="Topic-3">Topic-3</option>
            </select>
        </div>

        <div className="container" id="ds-box">
            <label htmlFor="ds-text-area" className="form-label" id="ds-text-area-l">Resource of the question:  <b>*</b></label>
            <select id='input-fy-2'  onChange={HandleResourceValue}>
                <option value="">-- Select Resource --</option>
                <option value="MDCAT Past Papers">MDCAT Past Papers</option>
                <option value="Olevels" >Olevels</option>
                <option value="AS level">AS level</option>
                <option value="A2 level">A2 level</option>
                <option value="FSC First Year">FSC First Year</option>
                <option value="FSC Second Year">FSC Second Year</option>
                <option value="Others">Others</option>
            </select>
        </div>

        <Button type="submit" padding= "2rem" sx={{backgroundColor:" #BE6163", color:"white", width:"50%" , marginTop:"1%"}}> SUBMIT MY DOUBT</Button>
        <ToastContainer theme="color"/>
      </form>
    </>
  );
}
