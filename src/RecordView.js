import React, { useState, useEffect, useRef } from 'react';
import RecordRTC from 'recordrtc/RecordRTC';
import { saveAs } from 'file-saver';

export default function RecordView() {


  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);


  const stopWebcam = () => {
    if (webcamStream) {
 
      webcamStream.getTracks().forEach((track) => {
        track.stop();
      });
      setWebcamStream(null);
    }
  };
    
  const startWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      setWebcamStream(stream);
    }).catch((error) => {
      console.error('Error accessing webcam: ', error);
    });
  };




  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mergedStream = new MediaStream([...screenStream.getTracks(), ...webcamStream.getTracks()]);
      const recorder = RecordRTC(mergedStream, {
        type: 'video',
        mimeType: 'video/mp4',
      });
      setRecorder(recorder);
      recorder.startRecording();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing screen: ', error);
    }
  };
  
  const stopRecording = async () => {
    recorder.stopRecording(async () => {
      const blob = recorder.getBlob();
      setRecordedBlob(blob);
      saveAs(blob, 'Video.mp4');
      setRecording(false);
  
      const formData = new FormData();
      formData.append('file', blob, 'Video.mp4');
      formData.append('title', 'My Recorded Video');
      formData.append(
        'description',
        'This is a recorded video uploaded from my app'
      );
      formData.append('privacyStatus', 'public'); 
      
      const YOUR_YOUTUBE_API_KEY = "AIzaSyD8VXZYL1iy4aTrxQloMj0ehRz6OoJQzBI"
      const response = await fetch(
        `https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status`,
        {
          mode: 'no-cors',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${YOUR_YOUTUBE_API_KEY}`,
          },
          body: formData,
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log('Video uploaded successfully:', data);
      } else {
        console.error('Error uploading video:', response.status);
      }
    });
  };
  
      
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      setWebcamStream(stream);
    }).catch((error) => {
      console.error('Error accessing webcam: ', error);
    });
  }, []);

  useEffect(() => {
    if (webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeStyle, setStrokeStyle] = useState("#000");
  const [lineWidth, setLineWidth] = useState(5);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }, []);

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    setPrevPos({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  const handleMouseMove = (event) => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const { offsetX, offsetY } = event.nativeEvent;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      setPrevPos({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handlePenColorChange = (event) => {
    setStrokeStyle(event.target.value);
  };

  const handlePenWidthChange = (event) => {
    setLineWidth(event.target.value);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  return (
    <>
      <div className='Title'>Expert Solve</div>
      <div className='options'>
        {webcamStream ? (
          <button className='options-btn' onClick={stopWebcam}>
            Stop Webcam
          </button>
        ) : (
          <button className='options-btn' onClick={startWebcam}>
            Start Webcam
          </button>
        )}
  
        {!recording ? (
          <button className='options-btn' onClick={startRecording}>
            Start Recording
          </button>
        ) : (
          <button className='options-btn' onClick={stopRecording}>
            Stop Recording
          </button>
        )}


        <div className='pen-settings'>
          <h5>WhiteBoard Settings</h5>
          <input
            id='pen-color'
            type='color'
            value={strokeStyle}
            onChange={handlePenColorChange}
          />
          <input
            id='pen-width'
            type='number'
            min='1'
            max='20'
            value={lineWidth}
            onChange={handlePenWidthChange}
          />
          <button className='options-btn' onClick={handleClearCanvas}>
            Clear
          </button>
        </div>
      </div>

      <div>
        <img src='/SampleQuestion.png' />
      </div>
  
      {webcamStream && (
        <div>
          <video className='video' ref={videoRef} autoPlay />
        </div>
      )}
  
      <div>
        <canvas
          className='canvas'
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight - 50}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
}