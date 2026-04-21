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
  headline: <>Engineering software that scales.</>,
  featured: {
    display: false,
    title: <></>,
    href: "/work",
  },
  subline: (
    <>
      I'm Osho, a Senior SDE based in{" "}
      <Text as="span" size="xl" weight="strong">Seattle</Text>.
      {" "}I build reliable, high-performance systems and enjoy working across the full stack — from distributed backends to polished UIs.
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
        I'm a Senior Software Development Engineer at Amazon Web Services, based in Seattle. I
        specialize in building large-scale distributed systems for ML inference and training
        infrastructure, working on the cutting edge of generative AI at cloud scale. I care deeply
        about system reliability, developer experience, and writing software that stands the test of
        time. Outside of work I enjoy exploring new technologies, contributing to open source, and
        building side projects that scratch my own itches.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Amazon Web Services",
        timeframe: "2021 - Present",
        role: "Senior Software Development Engineer",
        achievements: [
          <>
            Led the design and delivery of a high-throughput inference serving platform for
            SageMaker, reducing p99 latency by 40% and supporting hundreds of billions of
            monthly inference requests across foundation model workloads.
          </>,
          <>
            Architected a distributed model-loading pipeline for large generative AI models,
            cutting cold-start times by 60% through parallel S3 streaming and memory-mapped
            weight sharding across GPU fleets.
          </>,
          <>
            Drove a cross-team initiative to standardize SageMaker's training job scheduler,
            improving GPU cluster utilization by 25% and reducing job queue wait times for
            customers running large-scale fine-tuning workloads.
          </>,
          <>
            Mentored a team of 4 engineers, established code-review standards and on-call
            runbooks, and reduced production incident MTTR by 35% through improved observability
            instrumentation with CloudWatch and distributed tracing.
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
        name: "IIT BHU — Varanasi, India",
        description: <>Bachelor of Technology in Electronics Engineering.</>,
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
          { name: "Kafka", icon: "kafka" },
          { name: "Redis", icon: "redis" },
          { name: "PostgreSQL", icon: "postgresql" },
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
          { name: "Terraform", icon: "terraform" },
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
