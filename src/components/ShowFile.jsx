import React, { useRef, useEffect } from 'react'


export default function ShowFile(props) {
  const { audioReset, file, audioStream, handleFormSubmit } = props;

  return (
    <main className="flex-1 flex flex-col justify-center text-center w-fit max-w-full mx-auto gap-3 sm:gap-4 p-6 pb-20 sm:w-96">
      <h1 className='text-4xl sm:text-5xl md:text-6xl font-semibold'>
      Your <span className='text-teal-400 bold'>file </span>uploaded!
      </h1>
      <div className='flex flex-col text-left my-6'>
        <h3 className='font-semibold'>File name:</h3>
        <p className='truncate'>{file ? file?.name : 'Your Recorded Audio.mp3'}</p>
      </div>
      <div className='flex justify-between items-center gap-4'>
        <button className='text-slate-400 hover:text-red-600 hover:bold duration-200' onClick={audioReset}>
          Clear File
        </button>
        <button onClick={handleFormSubmit} className='recBtn rounded-lg'>
          <p className='rounded-lg flex items-center gap-2 p-4 font-medium'>Transcribe Audio <i className="fa-solid fa-scroll text-teal-400"></i></p>
        </button>
      </div>
    </main>
  )
}
