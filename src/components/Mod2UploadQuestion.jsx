import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './styles/Mod2UploadQuestion.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';

const QuestionPage = () => {
  const questionRef = useRef(null);
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  const CancelExpert = () => {
    setShowDescription(false);
    };

  const handleAskExpert = (e) => {
    e.preventDefault()
    if (!description) {
      toast.error('Please enter question description');
      return;
    }

    const Confirmation = prompt('Are you sure you want to ask an expert? (Y/N)');
    if (Confirmation !== 'Y') {
        setShowDescription(false);
        return;
    }
    
    html2canvas(questionRef.current, {
      width: document.getElementById('ScreenShotElement').offsetWidth,
      height: questionRef.current.offsetHeight
    }).then(canvas => {
      canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('testImage', blob, 'screenshot.png');
        formData.append('description', description);

        fetch('http://localhost:3001/DoubtSolverModule2', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            if (data.success === true) {
              toast.success('Question sent to expert');
              // Navigate to x page
            } else {
              toast.error('Error in Adding Details');
              // Navigate to x page
            }

        })
          .catch(error => {
            toast.error('Failed to send question to expert');
          });
      }, 'image/png');
    });
  };

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleAskExpertClick = () => {
    setShowDescription(true);
  };

  return (
    <>
      <div className='Title'>Expert Solve</div>
      <div className='container' id='Question-Box'>
        {/*Div container below will be the screenshot of the question*/}
        <div ref={questionRef} id='ScreenShotElement'>
          <img src='/SampleQuestion.png' alt='Sample Question' crossOrigin='anonymous' />
        </div>
        
        <button className='AskExpert-btn' onClick={handleAskExpertClick}>
          Ask an expert
        </button>


        <form onSubmit={handleAskExpert}>
        {showDescription && (
         <>
            <div className="container" id="ds-box-2">
                <label htmlFor="ds-text-area" className="form-label" id="ds-text-area-l-2">What problems are you facing in the question above?  <b>*</b></label>
                <textarea  id="ds-text-area-2" placeholder="Write your doubt here..." className='form-control' rows="4" value={description} onChange={handleDescriptionChange}></textarea>
            </div>
            <div className='container' id='btn-display'>
            <Button type="submit" id='AskExpert-btn-1' sx={{color:"white"}}  > Submit</Button>
            <Button id='AskExpert-btn-1' onClick={CancelExpert} sx={{color:"white"}}> Cancel</Button>
        </div>
        <ToastContainer theme='colored' />
        </>
        )}
        </form>
      </div>
    </>
  );
};

export default QuestionPage;
