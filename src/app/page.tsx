"use client";
import { ChangeEventHandler, useCallback, useRef, useState } from "react";

export default function Home() {
  const [userName, updateUsername] = useState<string>();

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    updateUsername(e.currentTarget.value);
  }, []);

  const [pendingGenerationStatus, setPendingGenerationStatus] = useState<any>();
  const intervalRef = useRef<number | null>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pollExecution = (pendingExecId: string) => async () => {
    const res = await fetch(`/api/githubProfile/${pendingExecId}`, {
      method: "GET",
    });
    const data = await res.json();
    setPendingGenerationStatus(await data);
    if (
      ["succeed", "failed"].includes((await data).state) &&
      intervalRef.current
    ) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const generate = useCallback(async () => {
    const result = await fetch(`/api/githubProfile/${userName}`, {
      method: "POST",
    });
    const data = await result.json();
    intervalRef.current = setInterval(
      pollExecution(data.id),
      500
    ) as unknown as number;
  }, [userName, pollExecution]);
  return (
    <main>
      <h1>GitHub Profile OpenAI Generator</h1>

      <div>
        <input type="text" value={userName} onChange={onChange} />
      </div>
      <div>
        <button onClick={generate} disabled={!!pendingGenerationStatus}>
          {pendingGenerationStatus ? "Generating" : "Generate"}
        </button>
      </div>
      {pendingGenerationStatus && pendingGenerationStatus.result && (
        <div>{pendingGenerationStatus.result}</div>
      )}
    </main>
  );
}
