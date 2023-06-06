import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cisco from "./Cisco";
import NavBar from "../components/NavBar";
import RecordButton from "../components/RecordButton";

export default function SpeechTranscription() {
  const [textToCopy, setTextToCopy] = useState();
  const router = useRouter();
  const CAREER_PATH = router.query.career;
  const [speechState, setSpeechState] = useState("record");
  const [response, setResponse] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [disabledSel, setDisabledSel] = useState(false);
  const [fullTranscript, setFullTranscript] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isFirst, setIsFirst] = useState(true);

  const handleTranscriptChange = (event) => {
    setFullTranscript(event.target.value);
  };

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });

    setSpeechState("pause");
  };

  const stopListening = async () => {
    await SpeechRecognition.stopListening();
    await setFullTranscript((prev) => prev + " " + transcript);
    resetTranscript();
    setIsFirst(false);
    setSpeechState("record");
  };

  const existing_transcript =
    "Working in data science and analytics is appealing because I've always liked the formula, the input and output aspect of Statistics. There's always an answer and a way to get the answers or you have data to see what you answered. I think research was really interesting for me as a first time research assistant because you can code your own projects. And once you have your project, you have all this data that you can do whatever you want. I love cleaning data which is a tedious task, but I think that's appealing to change the repetitiveness and the small attention to detail that it requires. So it's very specific and very important.\n\n The one thing that is unappealing to me or sort of like a negative factor is the amount of time and money. It takes a couple of years to get your Master's to your PhD, to be able to publish your work. I feel like there's pressure from everyone in the social circle to continue to do more work in less time. I'm almost done with my undergraduate degree, and time is going by really fast. Besides being afraid of like committing all of my time and efforts into getting a degree, another unappealing thing is the solitary aspect like it's just you and your project. It's mostly you and a small team. So I feel like your struggle would just remain there, so it's very important to network outside of your circle but it's really hard.";
  const existing_response =
    "Values:\n- Enjoys finding answers through data analysis.\n- Appreciates the importance of attention to detail in data cleaning.\n- Finds the ability to code projects and work independently appealing.\nChallenges:\n- Concerned about the time and financial commitment required to get a Master's or PhD and publish work.\n- Worried about the pressure to constantly do more work in less time.\n- Finds the solitary nature of the work unappealing and recognizes the importance of networking.\nQuestion:\n- How can I develop a strong professional network in the field of data science and analytics while still focusing on my studies?";

  const APIBODY = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Please read the following excerpt from an interview with an undergraduate student who is interested in a particular career. In up to 2 bullet points, identify what this student perceives as important values for themselves and this career path. Then in up to 2 bullet points, summarize back to the student what they have identified as challenges on their path to that career. Finally, provide one question that a student might want to ask their mentor about in the future. After each header and bullet point, add \n. Between each section, make sure there is a \n before each header.",
      },
      {
        role: "user",
        content:
          "I am interested in becoming an education researcher. I think education is one of the most important things everybody goes through the education system. So I think it’s a really good and also children don’t know anything. So by giving, they start off not knowing anything. So by giving them the gift of Education, the tools of a good quality education. I think that’s important and it will help just Society in general and education really is a powerful transformative tool. So I want to do that and I think I really enjoy the work aspect of that. It would be rewarding cuz I’m actually actively helping people and I want to do a job where I’m actually about actually actively helping people and also it’s you could say the same for a doctor but at the same time you’ve working with people at the worst in Life but in education you working at people who have the opportunity to go someplace else. I know an issue with the Ph.D program especially with the first few years. It’ll be a lot of work understanding your bearings and stuff which I know can be difficult at first but overall I see way more upsides than downsides and I feel like getting a PhD and becoming a professor is a career I really want to pursue and that I’d be really happy cuz I really love research and I really love like teaching and that combines both of them. So I couldn’t think of a better career for myself.",
      },
      {
        role: "assistant",
        content:
          "Values:\n- Believes education is one of the most important aspects of society.\n- Finds it rewarding to actively help people.\n- Excited about the prospect of being able to combine interests in research and teaching.\nChallenges:\n- Anticipates that the first few years of the PhD program may be challenging as they adjust to the workload and find their bearings.\n- Acknowledges the competitive nature of the job market for becoming a professor.\n- Concerned about balancing the responsibilities of research, teaching, and other aspects of the job.\nQuestion:\n- What is something you wish you knew before pursuing a PhD and entering academia full-time?",
      },
      {
        role: "user",
        content:
          "I am interested in becoming a " + CAREER_PATH + speechState ==
          "transcript"
            ? existing_transcript
            : fullTranscript,
      },
    ],
    max_tokens: 200,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  useEffect(() => {
    if (CAREER_PATH == "existing") {
      let values_challenges = existing_response
        .split("Question:\n")[0]
        .split("Challenges:\n");
      values_challenges = [
        values_challenges[0],
        "Challenges:\n" + values_challenges[1],
      ];
      let questions = [
        "Question:\n" + existing_response.split("Question:\n").slice(-1),
      ];

      setResponse([...values_challenges, ...questions]);
      setSpeechState("transcript");
      setLoading(true);
      setDisabled(true);
      setTimeout(() => {
        setLoading(false);
        setDisabled(false);
      }, 1500);
    }
  }, [CAREER_PATH]);

  async function handleTranscript() {
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify(APIBODY),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const resp = data.choices[0].message.content;
        try {
          let values_challenges = resp
            .split("Question:\n")[0]
            .split("Challenges:\n");
          console.log("values_challenges", values_challenges);
          console.log(values_challenges.length);
          console.log(resp);
          if (values_challenges.length == 1) {
            setResponse([resp]);
          } else {
            values_challenges = [
              values_challenges[0],
              "Challenges:\n" + values_challenges[1],
            ];
            let questions = [
              "Question:\n" + resp.split("Question:\n").slice(-1),
            ];
            setResponse([...values_challenges, ...questions]);
          }
          setLoading(false);
          setDisabled(false);
          setDisabledSel(false);
        } catch {
          setLoading(false);
          setDisabled(false);
          setDisabledSel(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <div className="flex flex-col items-center justify-between w-full">
        <header className="flex justify-start w-full items-center">
          <NavBar />
        </header>
      </div>
      <div className="grid grid-rows-1 grid-cols-2 gap-16 mt-3 mx-24">
        <div className="col-span-1 p-5 relative flex flex-col items-center">
          <h1 className="text-5xl font-bold text-black">Reflect:</h1>
          <h2 className="flex flex-col items-center justify-between mt-4 px-4 text-xl">
            <p className="text-center">
              As you explore careers, it’s important to imagine what you think
              life would be like in this potential career.
            </p>
            <br />
            <p className="text-center">
              <b>Answer the following in 1 - 2 minutes:</b> Imagine yourself as
              a {CAREER_PATH == "existing" ? "data scientist" : CAREER_PATH}.
              What aspects of this life seem appealing to you? What aspects of
              this life seem unappealing to you?
            </p>
          </h2>

          <div
            className={`border rounded-lg border-gray-500 p-8 w-full list-none h-[430px] ${
              CAREER_PATH == "existing"
                ? "overflow-y-auto m-4"
                : "my-4 ml-4 mr-3"
            }`}
          >
            {(speechState == "record" || speechState == "pause") && (
              <span className="grid grid-rows-2 grid-cols-4 w-full h-[230px]">
                <div
                  className="col-span-1 flex justify-center items-center h-[100px] tooltip"
                  data-tip="You will be able to edit the transcript after recording"
                >
                  <label htmlFor="my-modal">
                    <RecordButton
                      speechState={speechState}
                      startListening={startListening}
                      stopListening={stopListening}
                      isFirst={isFirst}
                    />
                  </label>
                  {/* {isFirst && (
                    <div>
                      <input
                        type="checkbox"
                        id="my-modal"
                        className="modal-toggle"
                      />
                      <div className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">
                            You Can Edit the text after the speech input!!!
                          </h3>
                          <div className="modal-action">
                            <label htmlFor="my-modal" className="btn">
                              OK
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
                <div className="col-span-3 flex justify-center items-center h-[100px] text-xl font-normal">
                  {speechState == "record" && (
                    <b>Click to start the recording.</b>
                  )}
                  {speechState == "pause" && (
                    <b>Click to stop the recording.</b>
                  )}
                </div>

                <textarea
                  readOnly={isFirst || (!isFirst && speechState == "pause")}
                  value={fullTranscript}
                  onChange={handleTranscriptChange}
                  className={`col-span-4 bg-slate-100 p-4 rounded-md overflow-y-auto h-[250px] mt-3 resize-none ${
                    isFirst || (!isFirst && speechState == "pause")
                      ? "outline-none border-none"
                      : ""
                  }`}
                />
              </span>
            )}
            {speechState == "transcript" &&
              existing_transcript.split("\n").map((line) => {
                return <p>{line}</p>;
              })}
            {/* {transcript ? (
              <div
                className="bg-slate-100 p-4 rounded-md"
                onClick={() => setTextToCopy(transcript)}
              >
                {transcript}
              </div>
            ) : null} */}
          </div>

          <div className="flex mt-2 gap-5">
            <button
              onClick={() => {
                router.push({
                  pathname: "/demo",
                });
              }}
              className="bg-black font-bold text-white text-lg py-4 px-7 rounded-xl disabled:bg-[#BABABA] disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              disabled={disabled}
              onClick={() => {
                setLoading(true);
                setDisabled(true);
                if (speechState == "transcript") {
                  setResponse(existing_response.split("\n\n"));
                  setTimeout(() => {
                    setLoading(false);
                    setDisabled(false);
                  }, 1500);
                } else {
                  handleTranscript();
                }
              }}
              className="bg-primary font-bold text-white text-lg py-4 px-5 rounded-xl disabled:bg-[#BABABA] disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="col-span-1 px-10 py-5 mt-8 border rounded-2xl border-[#5056E2] h-[700px] overflow-y-auto">
          <span className="flex flex-col place-self-start">
            <h1 className="text-5xl text-black font-bold mt-3 text-center">
              Insights from AI:
            </h1>
            {
              isLoading && (
                // <p>is still loading</p> this is a placeholder for debug
                //<Smile />
                <Cisco />
              ) //different kind of loading screen
            }
            {!isLoading && response && response.length == 1 && (
              <span className="text-lg">
                <p className="mt-7 text-primary">{response[0]}</p>
              </span>
            )}
            {!isLoading && response && response.length == 3 && (
              <span className="text-lg">
                <p className="mt-7 font-bold text-2xl">
                  In your audio response, the following values and challenges
                  surfaced:
                </p>
                {response.slice(0, 2).map((section) => (
                  <>
                    {section.split("\n").map((line) => (
                      <p className="text-primary">{line}</p>
                    ))}
                    <br />
                  </>
                ))}
                <div className="rounded-2xl bg-[#5056E2] text-white text-center p-6 my-2 mb-8">
                  <p>
                    <span className="font-bold">Reflect: </span> Do the values
                    listed here resonate with you? What is missing or
                    inaccurate? Expand on the AI-generated insights above.
                  </p>
                  {/* <p>
                    <span className="font-bold">Action: </span> Ask your
                    CP-LEADS mentor to share a challenge they face in their work
                    and how they deal with it. Give this a try next time you're
                    asking someone about a future career; most people are more
                    than happy to share.
                  </p> */}
                </div>

                <p className="font-bold text-2xl">
                  Here is a question that you may consider asking your mentor:
                </p>
                {response.slice(2, 3).map((section) => (
                  <>
                    {section
                      .split("\n")
                      .slice(1)
                      .map((line) => (
                        <p className="text-primary">{line}</p>
                      ))}
                    <br />
                  </>
                ))}
                {console.log("RESP", response)}
              </span>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
