import { defer } from "@defer/client";
import { graphql } from "@octokit/graphql";
import { Configuration, OpenAIApi } from "openai";

interface GitHubUserInfoData {
  user: {
    login: string;
    location: string;
    reposLangs: {
      nodes: {
        name: string;
        languages: {
          edges: {
            size: number;
            node: {
              color: string;
              name: string;
            };
          }[];
        };
      }[];
    };
    reposStars: {
      totalCount: number;
      nodes: {
        name: string;
        stargazers: {
          totalCount: number;
        };
      }[];
    };
  };
}

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_PA_TOKEN}`,
  },
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface GithubInfos {
  location: string;
  stars: number;
  languages: {
    [k: string]: number;
  };
  username: string;
}

async function getGithubInfos(githubUsername: string): Promise<GithubInfos> {
  const result = await graphqlWithAuth<GitHubUserInfoData>(
    `
      query userInfo($githubUsername: String!) {
        user(login: $githubUsername) {
          login
          location
          reposLangs: repositories(ownerAffiliations: OWNER, first: 100) {
            nodes {
              name
              languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                edges {
                  size
                  node {
                    color
                    name
                  }
                }
              }
            }
          }
          reposStars: repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
            totalCount
            nodes {
              name
              stargazers {
                totalCount
              }
            }
          }
        }
      }
    `,
    {
      githubUsername,
    }
  );
  return {
    location: result.user.location,
    stars: (result.user.reposStars.nodes || []).reduce((sum, node) => {
      return sum + node.stargazers.totalCount;
    }, 0),
    languages: (result.user.reposLangs.nodes || []).reduce(
      (acc, node) => {
        (node.languages.edges || []).forEach((lang) => {
          if (!acc[lang.node.name]) {
            acc[lang.node.name] = lang.size;
          } else {
            acc[lang.node.name] = lang.size + acc[lang.node.name];
          }
          acc.total = acc.total + lang.size;
        });
        return acc;
      },
      { total: 0 } as Record<string, number>
    ),
    username: result.user.login,
  };
}

async function generateGitHubProfile(githubUsername: string) {
  const { languages, location, stars } = await getGithubInfos(githubUsername);
  const prompt = `Write a GitHub profile description with 2 emojis maximum, with the following information:
- Lives in ${location}
- Wrote ${Object.entries(languages)
    .map(([name, count]) =>
      name === "total" || (count / languages.total) * 100 < 1
        ? ""
        : `${Math.ceil((count / languages.total) * 100)}% ${name}`
    )
    .filter((v) => !!v)
    .join(", ")}
- Has ${stars} GitHub stars`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    best_of: 5,
    frequency_penalty: 1,
    presence_penalty: 0,
  });

  return completion.data.choices[0].text;
}

export default defer(generateGitHubProfile, { concurrency: 10 });
