import { FaYoutube, FaFacebook } from "react-icons/fa";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

export const SKILL_DATA = [
  {
    skill_name: "Python",
    image: "python.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "FastAPI",
    image: "fastapi.png",
    width: 80,
    height: 80,
  },
] as const;

export const SOCIALS = [
  {
    name: "Instagram",
    icon: RxInstagramLogo,
    link: "https://instagram.com",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    link: "https://facebook.com",
  },
  {
    name: "Twitter",
    icon: RxTwitterLogo,
    link: "https://x.com/_sanidhyy",
  },
] as const;

export const FRONTEND_SKILL = [
  {
    skill_name: "JavaScript",
    image: "js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "React",
    image: "react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Node.js",
    image: "node.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "REST API",
    image: "rest.png",
    width: 80,
    height: 80,
  },
] as const;

export const BACKEND_SKILL = [
  {
    skill_name: "PostgreSQL",
    image: "postgresql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "MongoDB",
    image: "mongodb.png",
    width: 40,
    height: 40,
  },
  
  {
    skill_name: "TensorFlow",
    image: "tensorflow.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "PyTorch",
    image: "pytorch.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "OpenAI API",
    image: "openai.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "LangChain",
    image: "langchain.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Apache Kafka",
    image: "kafka.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "GraphQL",
    image: "graphql.png",
    width: 80,
    height: 80,
  },
] as const;

export const FULLSTACK_SKILL = [
  {
    skill_name: "n8n",
    image: "n8n.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Zapier",
    image: "zapier.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Apache Airflow",
    image: "airflow.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "AWS",
    image: "aws.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Power BI",
    image: "powerbi.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Google Vision API",
    image: "googlevision.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Mailgun",
    image: "mailgun.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Tableau",
    image: "tableau.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Twilio Voice API",
    image: "twilio.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "AWS Textract",
    image: "awstextract.png",
    width: 70,
    height: 70,
  },
] as const;

export const OTHER_SKILL = [
  
  
] as const;

export const PROJECTS = [
  {
    title: "Modern Next.js 14 Portfolio",
    description:
      'Embark on a journey through my professional evolution with the "Modern Next.js Portfolio" - a dynamic showcase of my skills, experiences, and passion for web development. Crafted with precision and powered by Next.js, this portfolio is more than just a static display; it\'s an immersive experience that reflects the cutting edge of modern web technologies.',
    image: "/projects/project-1.png",
    link: "https://example.com",
  },
  {
    title: "Interactive Cards Portfolio",
    description:
      'Step into the extraordinary world of my professional journey through the "Interactive Cards Portfolio" - an innovative and visually captivating platform that redefines the traditional portfolio experience. Ditching the conventional static layout, this portfolio leverages interactive cards to showcase my skills, projects, and personality in an engaging and dynamic manner.',
    image: "/projects/project-2.png",
    link: "https://example.com",
  },
  {
    title: "Space Themed Website",
    description:
      'Embark on an interstellar journey with my "Space Themed Website", a mesmerizing space-themed website that invites you to explore the cosmic wonders beyond our world. Immerse yourself in an awe-inspiring digital experience that blends cutting-edge design with the mysteries of the universe.',
    image: "/projects/project-3.png",
    link: "https://example.com",
  },
] as const;

export const FOOTER_DATA = [
  {
    title: "Community",
    data: [
      {
        name: "YouTube",
        icon: FaYoutube,
        link: "https://youtube.com",
      },
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: "https://github.com",
      },
      {
        name: "Discord",
        icon: RxDiscordLogo,
        link: "https://discord.com",
      },
    ],
  },
  {
    title: "Social Media",
    data: [
      {
        name: "Instagram",
        icon: RxInstagramLogo,
        link: "https://instagram.com",
      },
      {
        name: "Twitter",
        icon: RxTwitterLogo,
        link: "https://x.com/_sanidhyy",
      },
      {
        name: "Linkedin",
        icon: RxLinkedinLogo,
        link: "https://linkedin.com",
      },
    ],
  },
  {
    title: "About",
    data: [
      {
        name: "Become Sponsor",
        icon: null,
        link: "https://youtube.com",
      },
      {
        name: "Learning about me",
        icon: null,
        link: "https://example.com",
      },
      {
        name: "Contact Me",
        icon: null,
        link: "mailto:contact@example.com",
      },
    ],
  },
] as const;

export const NAV_LINKS = [
  {
    title: "Services",
    link: "#services",
  },
  {
    title: "Workflow",
    link: "#workflow",
  },
  {
    title: "Team",
    link: "#team",
  },
  {
    title: "Contact",
    link: "#contact",
  },
] as const;

export const LINKS = {
  sourceCode: "#contact",
};
