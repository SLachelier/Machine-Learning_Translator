import { useState, useRef, useEffect } from 'react'
import Home from './components/Home'
import Header from './components/Header'
import ShowFile from './components/ShowFile'
import OutputInfo from './components/OutputInfo';
import Transcription from './components/Transcription';
import { MessageTypes } from './utils/presets';


function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const audioAvailability = file || audioStream;

  function audioReset() {
    setFile(null);
    setAudioStream(null);
  }

  const worker = useRef(null); //web worker

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
        type: 'module'
      })
    }

  const onMsgReceived = async (e) => {
    switch (e.data.type){
      case 'DOWNLOADING':
        setDownloadStatus(true);
        console.log('DOWNLOADING');
        break;
      case 'LOADING':
        setLoading(true);
        console.log('LOADING');
        break;
      case 'RESULT':
        setOutput(e.data.results);
        console.log(e.data.results);
        break;
      case 'INFERENCE_DONE':
        setFinished(true);
        console.log('DONE');
        break;
    }
  }
  //listen for messages from the worker
  worker.current.addEventListener('message', onMsgReceived);

  //cleanup
  return () => worker.current.removeEventListener('message', onMsgReceived);
});

async function readAudio(file) {
  const samplingRate = 16000;
  const audioContext = new AudioContext({sampleRate: samplingRate});
  const response = await file.arrayBuffer();
  const decodedAudio = await audioContext.decodeAudioData(response);
  const audio = decodedAudio.getChannelData(0);
  return audio;
}

async function handleFormSubmit() {
  if (!file && !audioStream) { return }
    let audio = await readAudio(file ? file : audioStream);
    const model_name = `openai/whisper-tiny.en`;
    
    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name
    });
  }

  return (
    <div className="flex flex-col max-w-[1000px] w-full mx-auto">
      <section className="flex flex-col min-h-screen">
        <Header/>
        {/* if output exists, show the output information and loading, else show the transcription component */}
        {output ? ( 
          <OutputInfo output={output} finished={finished} />
        ) : loading ? ( <Transcription/> ) : audioAvailability ? (
          <ShowFile handleFormSubmit={handleFormSubmit} audioReset={audioReset} file={file} audioStream={audioStream} />
        ) : (<Home setFile={setFile} setAudioStream={setAudioStream}/>)}

      </section>
      <footer></footer>
    </div>
  )
}

export default App
