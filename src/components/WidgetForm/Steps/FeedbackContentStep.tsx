import { FormEvent, useState } from "react";

import { api } from "../../../lib/api";

import { CloseButton } from "../../CloseButton";
import { ScreenshotButton } from "../ScreenshotButton";

import { ArrowLeft, Camera } from "phosphor-react";

import { FeedbackType, feedbackTypes } from "..";
import { Loading } from "../Loading";

interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequested: () => void;
  onFeddbackSent: () => void;
}

export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequested,
  onFeddbackSent,
}: FeedbackContentStepProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [comment, setComment] = useState("");

  const feedBacktypeInfo = feedbackTypes[feedbackType];

  async function handleSubmitFeedback(event: FormEvent) {
    try {
      event.preventDefault();
      setIsSendingFeedback(true);

      const body = {
        type: feedbackType,
        comment,
        screenshot,
      };

      await api.post("/feedbacks", body);

      onFeddbackSent();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSendingFeedback(false);
    }
  }

  return (
    <>
      <header>
        <button
          type="button"
          className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
          onClick={onFeedbackRestartRequested}
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
        </button>

        <span className="text-xl leading-6 flex items-center gap-2">
          <img
            className="w-6 h-6"
            src={feedBacktypeInfo.image.source}
            alt={feedBacktypeInfo.image.alt}
          />
          {feedBacktypeInfo.title}
        </span>
        <CloseButton />
      </header>

      <form className="my-4 w-full">
        <textarea
          onChange={(event) => setComment(event.target.value)}
          className="
            min-w-[304px]
            w-full
            min-h-[112px]
            text-sm
            placeholder-zinc-400
            text-zinc-100
            border-zinc-600
            bg-transparent
            rounded-md
            focus:border-brand-500
            focus:ring-brand-500
            focus:ring-1
            focus:outline-none
            resize-none
            scrollbar
            scrollbar-thumb-zinc-700
            scrollbar-track-transparent
            scrollbar-thin
          "
          placeholder="Conte com detalhes o que está acontecendo..."
        />

        <footer className="flex gap-2 mt-2">
          <ScreenshotButton
            screenshot={screenshot}
            onScreenshotTook={setScreenshot}
          />

          <button
            type="submit"
            onClick={handleSubmitFeedback}
            disabled={!comment.length || isSendingFeedback}
            className="
              p-2 
              bg-brand-500 
              rounded-md 
              border-transparent 
              flex-1 
              flex 
              justify-center 
              items-center 
              text-sm
              hover:bg-brand-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-offset-zinc-900
              focus:ring-brand-500
              transition-colors
              disabled:opacity-50
              disabled:hover:bg-brand-500
            "
          >
            {isSendingFeedback ? <Loading /> : "Enviar feedback"}
          </button>
        </footer>
      </form>
    </>
  );
}
