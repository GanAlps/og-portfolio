import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Osho",
  lastName: "Gupta",
  name: `Osho Gupta`,
  role: "Senior Software Development Engineer",
  avatar: "/images/avatar.jpg",
  email: "oah1234@gmail.com",
  location: "America/Los_Angeles",
  languages: ["English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Thoughts on software engineering, system design, and building things.</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/GanAlps",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/oshogupta",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} — Senior SDE`,
  description: `Software engineer based in Seattle building scalable systems and great developer experiences.`,
  headline: <>The future belongs to the curious.</>,
  featured: {
    display: false,
    title: <></>,
    href: "/work",
  },
  subline: (
    <>
      Senior SDE based in{" "}
      <Text as="span" size="xl" weight="strong">Seattle</Text>.
      {" "} with 10+ years of experience in distributed systems and AI infrastructure.
      I believe that behind every scalable system and every AI breakthrough is a simple, 
      child-like curiosity to see what's possible. Hi! I'm Osho, and I build with curiosity.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `${person.name} is a ${person.role} based in Seattle, WA.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        With over a decade of experience at Amazon, I have architected solutions across diverse domains, 
        including AI infrastructure, fashion innovation, and supply chain optimization. My journey began 
        with a fundamental curiosity about how global tech products operate at scale, a drive that led 
        me to master large-scale distributed systems while consistently raising the bar for reliability, 
        operational excellence, and developer experience. In recent years, my focus has shifted to building 
        cutting-edge infrastructure that defines generative AI today. As we enter this new era, the explorer 
        in me is energized to discover what the next decade of technology will make possible.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Amazon Web Services - US",
        timeframe: "2024 - Present",
        role: "Senior Software Development Engineer",
        achievements: [
          <>
            Model Customization: Launched Serverless Model Customization on Amazon SageMaker as 
            part of AWS re:Invent 2025, enabling customers to perform scalable and cost-efficient 
            fine-tuning of foundation models using standardized recipes for supervised 
            fine-tuning (SFT) and preference optimization methods including RLAIF, DPO, PPO, and GRPO. 
            The solution supports PEFT optimizations: LoRA and QLoRA and scales seamlessly across 
            multiple instances using tensor, pipeline, and data parallelism. In addition to 
            serving as the cross-team security lead for the overall initiative, I led the 
            workstreams of the recipe management framework and the model evaluation system, 
            enabling customers to assess customized model quality using standardized benchmarks, 
            custom metrics, and LLM-as-a-judge (LLM-AJ) evaluations, with integrated MLflow support 
            for visualization, experiment tracking, and comparison.
          </>,
          <>
            Nova Forge: Launched Nova Forge on SageMaker, enabling customers to do Continued pre-training 
            on nova models with data mixing. I was responsible to make most critical infra changes to 
            SM HyperPod to enable secure CPT with Nova Models. Earned org level recognition for delivering
            fast on an away team project collaborating across 4 teams.
          </>,
          <>
            Inference Performance Benchmarking: Delivered a fully managed LLM performance benchmarking 
            platform that enables customers to evaluate and compare model-hosting and 
            optimization strategies across diverse hardware configurations to identify the 
            optimal price-performance setup for LLM inference. The tool measures key performance 
            metrics such as TTFT, TPOT, inter-token latency, throughput, etc. and supports comparative 
            analysis across optimization techniques including speculative decoding, continuous 
            batching, KV-cache optimizations (e.g., Paged Attention, MQA, GQA, FlashAttention), and 
            quantization. The platform automatically provisions models with the selected optimizations 
            on compatible hardware, generates detailed performance reports, and provides heuristic-based 
            recommendations aligned with workload characteristics and user-defined constraints.
          </>,
        ],
        images: [],
      },
      {
        company: "Amazon Development Center - US",
        timeframe: "2018 - 2023",
        role: "Senior Software Development Engineer",
        achievements: [
          <>
            Joined Amazon The Drop (fashion org) as a founding engineer. Taking product from PRFAQ
            stage to launch and scaling it to be one of the largest revenue stream for amazon fashion.
          </>,
          <>
            Solved complex supply chain problems to enable made-on-demand ordering on amazon ecosystem.
            Enabled a fresh look-driven UI for influencer driven content. Integrated with instagram APIs
            to manage brand's instagram page and inventory in automated way.
          </>,
          <>
            Built Design potal from scratch to enable influencers, manufacturers, and amazon representatives
            collaborate on mood boards, taking product from moodboard to ASIN readiness.
          </>,
          <>
            Scaled the system for sudden burst of ~10K TPS for celebrity launches.
          </>,
          <>
            Promoted to Senior SDE in Q1 2021.
          </>,
        ],
        images: [],
      },
      {
        company: "Amazon Development Center - India",
        timeframe: "2025 - 2017",
        role: "Software Development Engineer",
        achievements: [
          <>
            Worked in Suppy Chain Optimization Technologies (SCOT) org on building systems to Help
            vendor managers and in-stock managers make buy decisions and place orders to vendors.
          </>,
          <>
            Built Specialzed Buying System from scratch which focussed on buying recommendations for
            special cases like end of life, new product launches, staged buying, etc.
          </>,
          <>
            Built Commitment management system from scartch to enable softlines commitment and buying
            cycles in streamlined way. Converting offline commitments to intelligent recommendation
            based buys and streamlined via defined process tracked in our system.
          </>,
          <>
            Promtoed from SDE-1 to SDE-2 in under 2 years.
          </>,
        ],
        images: [],
      },
      {
        company: "Multiple",
        timeframe: "2013 - 2015",
        role: "Research Assistant/Intern",
        achievements: [
          <>
            Nanyang Technological University - Spring 2015: Worked with Prof. Chng-eng Siong and his team
            on speaker verification models.
          </>,
          <>
            Carnegie Mellon University (remote)- Fall 2014: Worked with Associate Scientist Judith Gelernter on
            spatio-temporal analysis of texts. Helper her team to build datasets used to train and text
            their new NLP models.
          </>,
          <>
            Hong Kong University of Science and Technology - Summer 2014: Research assistant at Human Language
            Technology Center, under mentorship of Prof. Dekai Wu. Worked on extracting 1000 dimensional
            features vectors from real time audio stream.
          </>,
          <>
            Changwon National University - Summer 2013: Internship at Speech Signal Processing at Signal and 
            Acoustic Signal Processing Lab (SASPL) under mentorship of Prof. Cheolwoo Jo. Studied 
            formant change in 3-vowel intercommenctions using Klatt synthetizer, and inverse 
            filtering of speech data. Published research paper: https://ieeexplore.ieee.org/document/6743877
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "Indian Institute of Technology BHU — Varanasi, India",
        description: <>Bachelor of Technology in Electronics Engineering. Graduated 2015.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Backend & Systems",
        description: (
          <>
            Extensive experience building high-throughput, fault-tolerant distributed services.
            Comfortable owning systems end-to-end — from API design to deployment and on-call.
          </>
        ),
        tags: [
          { name: "Java", icon: "java" },
          { name: "Python", icon: "python" },
          { name: "Go", icon: "go" },
          { name: "Spring Boot", icon: "spring" },
          { name: "DynamoDB", icon: "aws" },
          { name: "React", icon: "react" },
        ],
        images: [],
      },
      {
        title: "AWS & Infrastructure",
        description: (
          <>
            Deep AWS expertise across compute, storage, and ML services. Proficient in designing
            cloud-native architectures and managing infrastructure as code at scale.
          </>
        ),
        tags: [
          { name: "AWS", icon: "aws" },
          { name: "Kubernetes", icon: "kubernetes" },
          { name: "Docker", icon: "docker" },
          { name: "ECS", icon: "aws" },
          { name: "SageMaker", icon: "aws" },
          { name: "Bedrock", icon: "aws" },
        ],
        images: [],
      },
      {
        title: "AI & ML",
        description: (
          <>
            Hands-on experience building production-grade inference and training systems on
            SageMaker — from serverless fine-tuning experiences to continued pre-training on
            HyperPod and large-scale inference benchmarking. Familiar with modern optimizations
            like K-V Cache, Speculative Decoding, PEFT, RLVR, and RLAIF, and with the broader
            stack of model customization, evaluation, and deployment.
          </>
        ),
        tags: [
          { name: "Inference" },
          { name: "Fine Tuning" },
          { name: "Synthetic Data Generation" },
          { name: "Evaluation" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Thoughts on engineering and AI",
  description: `${person.name} writes about distributed systems, cloud infrastructure, and the evolving world of generative AI.`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
