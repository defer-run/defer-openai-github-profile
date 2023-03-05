import { NextRequest } from "next/server";
import { getExecution } from "@defer/client";
import generateGitHubProfile from "@/defer/generateGitHubProfile";

export async function POST(
  _request: NextRequest,
  { params }: { params: { usernameOrExecId: string } }
) {
  const ret = await generateGitHubProfile(params.usernameOrExecId);
  return new Response(JSON.stringify(ret), {
    status: 200,
    headers: { "Content-type": "application/json" },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { usernameOrExecId: string } }
) {
  const ret = await getExecution(params.usernameOrExecId);
  return new Response(JSON.stringify(ret), {
    status: 200,
    headers: { "Content-type": "application/json" },
  });
}
