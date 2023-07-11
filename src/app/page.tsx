"use client";
import generateGitHubProfile from "@/defer/generateGitHubProfile";
import { useDeferRoute } from "@defer/client/next";
import Link from "next/link";
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";

export default function Home() {
  const [userName, updateUsername] = useState<string>();
  const [generate, { loading, result }] =
    useDeferRoute<typeof generateGitHubProfile>("/api/githubProfile");

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    updateUsername(e.currentTarget.value);
  }, []);

  const [copied, updateCopied] = useState(false);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(result!);
    updateCopied(true);
    setTimeout(() => updateCopied(false), 1000);
  }, [result]);

  return (
    <main className="container">
      <h1>GitHub Profile OpenAI Generator</h1>
      <p>Let ChatGPT generate a personalized GitHub Profile Readme for you</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate(userName!);
        }}
      >
        <div>
          <input
            type="text"
            value={userName}
            onChange={onChange}
            className={"input"}
            placeholder={"Enter your GitHub username"}
            disabled={loading}
          />
        </div>
        <div>
          <input
            type={"submit"}
            className="buttonPrimary"
            disabled={loading}
            value={loading ? "Generating ..." : "Generate"}
          />
        </div>
      </form>
      <div className="builtWith-container">
        <div className="builtWith">Built with</div>
        <Link href={"https://www.defer.run"} target={"_blank"}>
          <svg
            className="mr-[28px]"
            width="90"
            height="20"
            viewBox="0 0 90 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 0V20H0V0H20ZM7.85714 2.14286H2.14286V7.85714H7.85714V2.14286ZM2.14286 10H10V2.14286H12.8571V12.8571H2.14286V10ZM2.14286 17.8571V15H15V2.14286H17.8571V17.8571H2.14286Z"
              fill="white"
            />
            <path
              d="M44.09 12.4506C44.09 15.7411 45.8618 18.5714 50.0267 18.5714C53.7544 18.5714 55.2501 16.0863 55.6183 14.3145H53.3863C52.9951 15.8792 51.7985 16.7076 50.0267 16.7076C47.3575 16.7076 46.345 15.0278 46.253 13.0489H55.2271V12.2205C55.2271 8.6999 53.0411 6.65197 49.7276 6.65197C46.4141 6.65197 44.09 8.76894 44.09 12.4506ZM46.253 11.4842C46.253 9.85043 47.5186 8.49281 49.7276 8.49281C51.9826 8.49281 53.0641 9.85043 53.0641 11.4842H46.253Z"
              fill="white"
            />
            <path
              d="M61.9694 3.36146H65.9272V1.42857C63.8562 1.42857 61.7853 1.42857 59.7143 1.42857V6.88207H57.2752V8.81496H59.7143V16.4084H57.2752V18.3413H65.2829V16.4084H61.9694V8.81496H65.2829V6.88207H61.9694C61.9694 5.70853 61.9694 4.535 61.9694 3.36146Z"
              fill="white"
            />
            <path
              d="M67.1455 12.4506C67.1455 15.7411 68.9173 18.5714 73.0822 18.5714C76.8099 18.5714 78.3056 16.0863 78.6738 14.3145H76.4418C76.0506 15.8792 74.854 16.7076 73.0822 16.7076C70.413 16.7076 69.4005 15.0278 69.3085 13.0489H78.2826V12.2205C78.2826 8.6999 76.0966 6.65197 72.7831 6.65197C69.4696 6.65197 67.1455 8.76894 67.1455 12.4506ZM69.3085 11.4842C69.3085 9.85043 70.5741 8.49281 72.7831 8.49281C75.0381 8.49281 76.1196 9.85043 76.1196 11.4842H69.3085Z"
              fill="white"
            />
            <path
              d="M81.0884 18.3413H83.3205V8.60786H89.3492V6.65197H81.0884C81.0884 10.5484 81.0884 14.4449 81.0884 18.3413Z"
              fill="white"
            />
            <path
              d="M33.8672 2.1041H28.5696V18.3424H33.8672C37.898 18.3424 42.1591 17.2138 42.1591 10.2117C42.1591 3.23272 37.898 2.1041 33.8672 2.1041ZM33.8672 16.4076H30.8038V4.03887H33.8672C36.7464 4.03887 39.9019 4.4765 39.9019 10.2117C39.9019 15.97 36.7464 16.4076 33.8672 16.4076Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>
      {result && (
        <div className="codeblock-container">
          <div className="buttonTertiary codeblock-copy-btn" onClick={onCopy}>
            <div>{copied ? "Copied!" : "Copy"}</div>
          </div>
          <div className="codeblock-content">{result}</div>
        </div>
      )}
    </main>
  );
}
