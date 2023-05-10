import React , {useState} from 'react'
import axios from 'axios'
export default function ExpertDashboard() 
{
  const [Title,SetTitle] = useState()
  const [Description  , SetDescription] = useState()
  const [File, SetFile ] = useState()

  const handleChange = (e)=>
  {
    const inputValue = e.target.name
    const value = e.target.value
    if (inputValue==="file")
    {
      SetFile(e.target.files[0])
    }
    else if (inputValue==="title")
    {
      SetTitle(value)
    }
    else if (inputValue==="description")
    {
      SetDescription(value)
    }
  }

  const Submit = (e) =>
  {
    e.preventDefault()

    const videoData = new FormData()
    videoData.append("title",Title)
    videoData.append("description",Description)
    videoData.append("videoFile",File)

    axios.post("http://localhost:3001/upload",videoData)
    .then((res)=>
    {
      console.log(res)
      const videoUrl = res.data.videoUrl;
      console.log(res)
    }
    )
    .catch((err)=>
    {
      console.log(err)
    }
    )
    


  }

  return (
  <>
    <div>ExpertDashboard</div>

    <form>
      <input onChange={handleChange} type="text" placeholder="title" name="title" />
      <input  onChange={handleChange} type="text" placeholder="description" name="description" />

      <input  onChange={handleChange} accept="video/mp4" type="file" placeholder="add video" name="file" />      

      <button type="submit" onClick={Submit}>Submit</button>
    </form>
  </>



  )
}
