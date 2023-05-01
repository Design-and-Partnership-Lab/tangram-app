import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";
import useClipboard from "react-use-clipboard";
import { Microphone, Send, PlayerPause } from "tabler-icons-react";

export default function SpeechTranscription() {
  const [textToCopy, setTextToCopy] = useState();
  const [response, setResponse] = useState(null);

  const startListening = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });

  const { transcript } = useSpeechRecognition();

  // const handleTranscript = async () => {
  //   openai.api_key = api_key;
  //   const result = await openai.Completion.create({
  //     model: "text-davinci-003",
  //     prompt: transcript,
  //     max_tokens: 100,
  //     temperature: 0,
  //   });

  //   setResponse(result.choices[0].text);
  // };

  //const API_KEY = ;
  // const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const APIBODY = {
    model: "text-davinci-003",
    // prompt: prompt + message, we can now add a prompt
    prompt: transcript,
    max_tokens: 60,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  async function handleTranscript() {
    await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(APIBODY),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setResponse(data.choices[0].text);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <h2 className="text-red-800">Speech to text Converter</h2>
      <br />
      <p>Press start listening and speak to record</p>
      <div onClick={() => setTextToCopy(transcript)}>{transcript}</div>
      <div>
        <button onClick={startListening} className="bg-purple-300">
          <Microphone size={48} strokeWidth={2} color={"black"} />
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          className="bg-blue-300"
        >
          <PlayerPause size={48} strokeWidth={2} color={"black"} />
        </button>
        <button onClick={handleTranscript} className="bg-red-800">
          <Send size={48} strokeWidth={2} color={"black"} />
        </button>
        <p>{response}</p>
      </div>
      {console.log(transcript)}
    </div>
  );
}
