import React, { useState, useEffect, useRef } from "react";

export default function Home(props) {
  const { setAudioStream, setFile } = props;
  const [recStatus, setRecStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [duration, setDuration] = useState(0);

  const audioRecorder = useRef(null);
  const mimeType = "audio/webm";

  async function startRecStatus() {
    let currentAudioStream;

    console.log("Recording started.");

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })
      currentAudioStream = streamData;
    } catch (err) {
      console.log(err.message);
      return;
    }
    setRecStatus('recording');
    //Creates a recording instance using the audio stream
    const audio = new MediaRecorder(currentAudioStream, { type: mimeType });

    audioRecorder.current = audio;
    audioRecorder.current.start();

    let localAudioChunks = [];
    audioRecorder.current.ondataavailable = (e) => {
      if (typeof e.data === 'undefined') {
        return;
      }
      if (e.data.size === 0) {
        return;
      }

      localAudioChunks.push(e.data);
    };

    setAudioChunks(localAudioChunks);
  }

  async function stopRecStatus(){
    setRecStatus('inactive');
    console.log("Recording stopped.");

    audioRecorder.current.stop();
    audioRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(audioBlob);
      setAudioChunks([]);
      setDuration(0); //resets duration back to 0 for when recording starts.
    }
  }

  useEffect(() => {
    if (recStatus === 'inactive') { return }

      const interval = setInterval(() => {
        setDuration(prevDuration => prevDuration + 1)
      }, 1000)

    return () => clearInterval(interval);
  });

  return (
    <div>
      <main className="flex-1 flex flex-col justify-center text-center gap-3 sm:gap-4 p-6 pb-20">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold">
          <span className="text-teal-400 bold">ML</span> Translator
        </h1>
        <h3 className="font-medium md:text-lg">
          Record <span className="text-teal-400">&rarr;</span> Transcribe{" "}
          <span className="text-teal-400">&rarr;</span> Translate
        </h3>
        <button onClick={recStatus === 'recording' ? stopRecStatus : startRecStatus} className="flex text-base justify-between items-center gap-4 py-2 px-4 rounded-lg text-teal-400 recBtn my-4 mx-auto w-72 max-w-full">
          <p>{recStatus === 'inactive' ? 'Record' : `Stop recording`}</p>
            <div className="flex items-center gap-4">
              { duration !== 0 && ( <p className="text-sm">{duration}s</p> )}
              <i className={"fa-solid fa-microphone duration-200 " + (recStatus === 'recording' ? 'text-red-500' : "")}></i>
            </div>
        </button>
        <p className="text-base">
          Or
          <label className="cursor-pointer text-teal-400 hover:text-teal-300 duration-200">
            {" "}
            upload
            <input
              onChange={(e) => {
                const currentFile = e.target.files[0];
                setFile(currentFile);
              }}
              className="hidden"
              type="file"
              accept="audio/*"
            />
          </label>{" "}
          an audio file
        </p>
        <p className="text-slate-400 italic">
          With unlimited free transcriptions
        </p>
      </main>
    </div>
  );
}
