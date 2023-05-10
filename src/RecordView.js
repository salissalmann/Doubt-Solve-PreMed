import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';

export default function RecordView() {
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);

  const stopWebcam = async () => {

    if (webcamStream) {
      navigator.mediaDevices
      .getUserMedia({ video: false })
      webcamStream.getTracks().forEach((track) => {
        track.stop();
      });
      
      setWebcamStream(null);
    }
  };
  
  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      
      .then((stream) => {
        setWebcamStream(stream);
      })
      .catch((error) => {
        console.error('Error accessing webcam: ', error);
      });
  };

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const mergedStream = new MediaStream();

      screenStream.getTracks().forEach((track) => {
        mergedStream.addTrack(track);
      });

      webcamStream.getTracks().forEach((track) => {
        mergedStream.addTrack(track);
      });

      const mediaRecorder = new MediaRecorder(mergedStream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        saveAs(blob, 'Video.webm');
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing screen: ', error);
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      setRecording(false);
      recorder.stream.getTracks().forEach((track) => track.stop())
    }
  };

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
          <video className='video' ref={videoRef} autoPlay controls/>
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