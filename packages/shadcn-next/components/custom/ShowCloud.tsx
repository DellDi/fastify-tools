import IconCloud from "@/components/ui/icon-cloud";
import { Card } from "@/components/ui/card";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export function ShowCloud() {
  return (
      <Card
          className="min-w-80 max-w-sm" x-chunk="charts-05-chunk-1"
      >
        <IconCloud iconSlugs={slugs}/>
      </Card>

  );
}
