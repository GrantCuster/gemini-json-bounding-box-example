import {
  canvasRefAtom,
  isGeneratingAtom,
  responseAtom,
  promptAtom,
  visibleTextPromptAtom,
  activeModelAtom,
} from "./atoms";
import { useAtom } from "jotai";
import Markdown from "react-markdown";
import { predictImage } from "./modelUtils";
import { useHandleDragAndDropImage } from "./hooks";
import { Canvas } from "./Canvas";

function App() {
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [response, setResponse] = useAtom(responseAtom);
  const [isGenerating, setIsGenerating] = useAtom(isGeneratingAtom);
  const [canvasRefA] = useAtom(canvasRefAtom);
  const [visibleTextPrompt, setVisibleTextPrompt] = useAtom(
    visibleTextPromptAtom,
  );
  const [activeModel, setActiveModel] = useAtom(activeModelAtom);
  useHandleDragAndDropImage();

  return (
    <div className="flex h-[100dvh] overflow-auto flex-col">
      <div className="max-w-[530px] mx-auto flex pt-4 px-2 flex-col gap-3">
        <div className="">
          <span className="font-bold">Gemini JSON Bounding Box Example</span>{" "}
          using the{" "}
          <a
            href="https://ai.google.dev/"
            target="_blank"
            className="underline"
          >
            Gemini API
          </a>
        </div>
        <div className="flex gap-2 text-sm -my-1">
          <div>Model:</div>
          <label className="flex gap-1">
            <input
              type="radio"
              name="model"
              value="flash"
              checked={activeModel === "flash"}
              onChange={() => {
                setActiveModel("flash");
              }}
            />
            <span>Flash</span>
          </label>
          <label className="flex ml-1 gap-1">
            <input
              type="radio"
              name="model"
              value="pro"
              checked={activeModel === "pro"}
              onChange={() => {
                setActiveModel("pro");
              }}
            />
            <span>Pro</span>
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="text-sm">Prompt</div>
            <button
              className="text-sm underline"
              onClick={() => {
                setVisibleTextPrompt(!visibleTextPrompt);
              }}
            >
              {visibleTextPrompt ? "hide" : "show"}
            </button>
          </div>
          {visibleTextPrompt ? (
            <textarea
              className="border resize-y border-black w-full px-2 py-1"
              rows={4}
              value={prompt}
              placeholder="prompt"
              onChange={(e) => {
                setPrompt(e.currentTarget.value);
              }}
            />
          ) : null}
        </div>
        <Canvas />
        <div>
          {isGenerating ? (
            <div className="border border-black animate-pulse text-center w-full py-1 rounded-full bg-neutral-200">
              Generating...
            </div>
          ) : (
            <button
              className="border border-black text-center w-full py-1 rounded-full hover:bg-neutral-100"
              onClick={async () => {
                setResponse("");
                setIsGenerating(true);
                try {
                  const imgUrl = canvasRefA
                    .current!.toDataURL("image/jpeg", 0.5)
                    .replace("data:image/jpeg;base64,", "");
                  const res = await predictImage("image/jpeg", imgUrl, prompt, activeModel);
                  const val = res.text;
                  setResponse(val);
                } catch (e) {
                  setResponse("");
                  // @ts-expect-error need to set type
                  alert(e.error);
                }
                setIsGenerating(false);
              }}
            >
              Send
            </button>
          )}
        </div>
        {response.length > 0 ? (
          <div>
            <Markdown className="w-full pb-4 mx-auto prose text-black">
              {response}
            </Markdown>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
