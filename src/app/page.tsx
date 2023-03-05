"use client";
import { ChangeEventHandler, useCallback, useState } from "react";

export default function Home() {
  const [userName, updateUsername] = useState<string>();

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    updateUsername(e.currentTarget.value);
  }, []);

  const generate = useCallback(async () => {
    fetch(`/api/githubProfile/${userName}`, { method: "POST" });
  }, [userName]);
  return (
    <main>
      <h1>GitHub Profile OpenAI Generator</h1>

      <div>
        <input type="text" value={userName} onChange={onChange} />
      </div>
      <div>
        <button onClick={generate}>Generate</button>
      </div>
    </main>
  );
}
