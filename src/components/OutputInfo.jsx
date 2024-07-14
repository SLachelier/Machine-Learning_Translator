import React, { useState, useEffect, useRef } from 'react';
import Translation from './Translation';
import Transcript from './Transcript';

export default function OutputInfo(props) {
  const { output, finished } = props;
  const [tab, setTab] = useState('transcription');
  const [translation, setTranslation] = useState(null); 
  const [toLang, setToLang] = useState('Select language');
  const [translating, setTranslating] = useState(null);
  // console.log(output);

  const worker = useRef(null);

  useEffect(() => { 
    if (!worker.current) {
      worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
          type: 'module'
      })
  }


  const onMsgReceived = async (e) => {
    switch (e.data.status) {
        case 'initiate':
            console.log('DOWNLOADING')
            break;
        case 'progress':
            console.log('LOADING')
            break;
        case 'update':
            setTranslation(e.data.output)
            console.log(e.data.output)
            break;
        case 'complete':
            setTranslating(false)
            console.log("DONE")
            break;
    }
}

    worker.current.addEventListener('message', onMsgReceived); //listen for messages from the worker

    return () => worker.current.removeEventListener('message', onMsgReceived); //cleanup
  });

  const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || '';

  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }

  function handleDownload() { //handles downloading the output text when user clicks on the download button
    const element = document.createElement('a');
    const file = new Blob([textElement], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `YourTranscription_${(new Date()).toDateString()}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  function generateTranslation() {
    if(translating | toLang === 'Select language') {return};

    setTranslating(true);

    worker.current.postMessage({
      text: output.map(val => val.text),
      src_lang: 'eng_Latn',
      tgt_lang: toLang
    })
  }

  return (
    <main className="flex-1 flex flex-col justify-center text-center max-w-prose w-full mx-auto gap-3 sm:gap-4 p-6 pb-20">
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-semibold whitespace-nowrap'>Your
          <span className='text-teal-400'> Transcription</span>:
        </h1>

        <div className='grid grid-cols-2 items-center bg-white border-solid border-teal-500 shadow-sm rounded-full mx-auto my-8 overflow-hidden'>
          <button onClick={() => setTab('transcription')} className={'px-4 py-2 font-medium duration-200 ' + (tab === 'transcription' ? 'bg-teal-400 text-white' : 'text-teal-400 hover:text-teal-600')}>Transcription</button>
          <button onClick={() => setTab('translation')} className={'px-4 py-2 font-medium duration-200 ' + (tab === 'translation' ? 'bg-teal-400 text-white' : 'text-teal-400 hover:text-teal-500')}>Translation</button>
        </div>
        <div className='flex flex-col mb-8'>
          {(!finished || translating) && (
                    <div className='grid place-items-center'>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                    </div>
          )}
          {tab === 'transcription' ? ( <Transcript {...props} textElement={textElement} /> ) : ( <Translation {...props} translating={translating} setTranslating={setTranslating} textElement={textElement} setTranslation={setTranslation} toLang={toLang} setToLang={setToLang} generateTranslation={generateTranslation} /> )}
        </div>
        <div className='flex items-center mx-auto gap-4 text-base'>
          <button onClick={handleCopy} title="Copy" className='bg-white shadow-md p-4 rounded-md px-5 hover:text-teal-400 duration-200 aspect-square grid place-items-center' ><i className='fa-solid fa-copy'></i></button>
          <button onClick={handleDownload} title="Download" className='bg-white shadow-md hover:text-teal-400 duration-200 p-4 rounded-md px-5 aspect-square grid place-items-center'><i className='fa-solid fa-download'></i></button>
        </div>
    </main>
  )
}
