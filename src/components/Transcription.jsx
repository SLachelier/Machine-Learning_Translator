import React from 'react'

export default function Transcription(props) {
  const { downloadStatus } = props;

  return (
    <div className='flex flex-1 flex-col justify-center items-center text-center gap-8 md:gap-12 p-4 py-22'>
      <div className='flex flex-col gap-2 sm:gap-4'>
        <h1 className='text-teal-400 font-bold text-6xl pb-6'>Transcribing</h1>
        <p>{!downloadStatus ? 'Getting started...' : 'Finishing up!'}</p>
      </div>

      <div className='flex flex-col sm:gap-2 gap-4 max-w-[350px] mx-auto w-full'>
        {[0,1,2].map(val => {
          return (
            <div key={val} className={'bg-slate-400 rounded-full h-2 sm:h-3 loadbar ' + `loadbar${val}`}></div>
          )
        })}
      </div>
    </div>
  )
}
