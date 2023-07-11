import { asNextRoute } from "@defer/client/next";
import generateGitHubProfile from "@/defer/generateGitHubProfile";

const { GetHandler, PostHandler } = asNextRoute(generateGitHubProfile);

export const GET = GetHandler;
export const POST = PostHandler;
