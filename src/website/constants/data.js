import React from "react"
import {
  Code2,
  Smartphone,
  Megaphone,
  Mail,
  Video,
  Lock,
} from "lucide-react"

export const products = [
  {
    name: "FreeWall VPN",
    description: "A privacy-focused VPN service that secures internet traffic, protects user data, and enables safe, lawful online access through encrypted connections and controlled acceptable use.",
    category: "Security",
    icon: React.createElement(Lock, { className: "w-6 h-6 text-green-400 mb-4" }),
    detailedDescription: `FreeWall VPN is a privacy-focused VPN service that secures internet traffic, protects user data, and enables safe, lawful online access through encrypted connections and controlled acceptable use.
        <br/><br/>
        <strong>Key Features:</strong>
        <ul class="list-disc pl-5 space-y-2 mt-3 mb-4">
          <li>Encrypted connections for secure internet traffic</li>
          <li>User data protection and privacy</li>
          <li>Safe and lawful online access</li>
          <li>Controlled acceptable use policies</li>
          <li>High-speed VPN servers worldwide</li>
        </ul>
        FreeWall VPN provides robust security and privacy protection, ensuring your internet traffic is encrypted and your data remains protected while maintaining lawful and responsible usage.`,
  },
  {
    name: "AI Email Categorizer",
    description: "An AI-powered email management tool designed for job seekers to organize and track their job search communications.",
    category: "Productivity",
    icon: React.createElement(Mail, { className: "w-6 h-6 text-blue-400 mb-4" }),
    detailedDescription: `AI Email Categorizer is an AI-powered email management tool designed specifically for job seekers to organize and track their job search communications.
        <br/><br/>
        <strong>Key Features:</strong>
        <ul class="list-disc pl-5 space-y-2 mt-3 mb-4">
          <li>Automatic categorization of job application, interview, and recruiter emails</li>
          <li>Smart labeling for offers, rejections, follow-ups, and required documents</li>
          <li>Thread grouping by company and role</li>
          <li>Priority detection for interview and time-sensitive messages</li>
          <li>AI-powered drafting of professional replies and follow-up emails</li>
          <li>Custom AI rules tailored for job search workflows</li>
        </ul>
        AI Email Categorizer streamlines the job search process by turning a busy inbox into a structured job pipeline, helping candidates stay organized, respond faster, and never miss important opportunities.`,
  },
  {
    name: "Dumbstruck",
    description: "A video app that captured real-time reactions and later evolved into an emotion analytics tool.",
    category: "Analytics",
    icon: React.createElement(Video, { className: "w-6 h-6 text-purple-400 mb-4" }),
    detailedDescription: `Dumbstruck is a video app that captured real-time reactions and later evolved into an emotion analytics tool.
        <br/><br/>
        <strong>Key Features:</strong>
        <ul class="list-disc pl-5 space-y-2 mt-3 mb-4">
          <li>Real-time reaction capture through video</li>
          <li>Emotion analytics and sentiment analysis</li>
          <li>Video-based emotional response tracking</li>
          <li>Advanced analytics dashboard</li>
          <li>Insights into user engagement and reactions</li>
        </ul>
        Dumbstruck combines video technology with emotion analytics, providing valuable insights into user reactions and emotional responses through innovative video capture and analysis.`,
  },
]

export const services = [
  {
    title: "Web App Development",
    icon: React.createElement(Code2, { className: "w-12 h-12 text-blue-400 mb-4" }),
    description:
      "Our Custom Web Development Services Include Both Front-End And Back-End Development. Whether It Is Enhancing An Existing App Or Architecting An Enterprise App, Our Developers Are Up For The Challenge.",
    detailedDescription: `Our Custom Web Development Services Include Both Front-End And Back-End Development. Whether It Is Enhancing An Existing App Or Architecting An Enterprise App, Our Developers Are Up For The Challenge.
      <br/><br/>
      <strong>What We Offer:</strong>
      <ul class="list-disc pl-5 space-y-2 mt-3 mb-4">
        <li>Front-end development with modern frameworks and technologies</li>
        <li>Back-end development with scalable architecture</li>
        <li>Enhancement of existing web applications</li>
        <li>Enterprise-level web application development</li>
        <li>Full-stack development solutions</li>
      </ul>
      We deliver high-quality web applications that are responsive, scalable, and tailored to meet your specific business requirements.`,
  },
  {
    title: "Mobile App Development",
    icon: React.createElement(Smartphone, { className: "w-12 h-12 text-purple-400 mb-4" }),
    description:
      "We Have Expertise In Creating Multi-Platform Mobile App Solutions For Both Android And IOS Devices. Using PhoneGap, Xamarin, And React Native, We Offer Custom Mobile App That Runs Smoothly On Multiple Platforms.",
    detailedDescription: `We Have Expertise In Creating Multi-Platform Mobile App Solutions For Both Android And IOS Devices. Using PhoneGap, Xamarin, And React Native, We Offer Custom Mobile App That Runs Smoothly On Multiple Platforms.
      <br/><br/>
      <strong>What We Offer:</strong>
      <ul class="list-disc pl-5 space-y-2 mt-3 mb-4">
        <li>Cross-platform mobile app development with React Native</li>
        <li>Native iOS and Android app development</li>
        <li>Mobile app development using PhoneGap and Xamarin</li>
        <li>Custom mobile solutions for multiple platforms</li>
        <li>Mobile app maintenance and updates</li>
      </ul>
      We create mobile applications that provide seamless user experiences across all platforms while maintaining high performance and reliability.`,
  },
  {
    title: "Digital Marketing",
    icon: React.createElement(Megaphone, { className: "w-12 h-12 text-green-400 mb-4" }),
    description:
      "The digital marketing services that we provide have their own set of charms. By taking our digital marketing services, our clients will be able to increase visibility and engage with their customers at the online platform.",
    detailedDescription: `The digital marketing services that we provide have their own set of charms. By taking our digital marketing services, our clients will be able to increase visibility and engage with their customers at the online platform.
      <br/><br/>
      <strong>What We Offer:</strong>
      <ul class="list-disc pl-5 space-y-2 mt-3 mb-4">
        <li>Search Engine Optimization (SEO) to increase online visibility</li>
        <li>Social media marketing and engagement strategies</li>
        <li>Content marketing and brand awareness campaigns</li>
        <li>Pay-per-click (PPC) advertising management</li>
        <li>Analytics and performance tracking</li>
      </ul>
      Our digital marketing services help you reach your target audience, increase brand visibility, and drive meaningful engagement with your customers online.`,
  },
]

export const testimonials = [
  {
    name: "John Smith",
    company: "Acme Corp",
    quote:
      "Their team delivered our project on time and within budget.  Highly recommended!  Their communication was excellent.",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnSmith&style=circle&backgroundColor=ffaabb",
  },
  {
    name: "Jane Doe",
    company: "Beta Inc",
    quote:
      "We've been working with them for years and they consistently exceed our expectations.  A true partner in our success.",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=JaneDoe&style=circle&backgroundColor=aabbff",
  },
  {
    name: "David Lee",
    company: "Gamma Co",
    quote:
      "Their expertise in AI helped us transform our business.  A game-changer for our operations.  We're seeing significant ROI.",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidLee&style=circle&backgroundColor=bbffaa",
  },
]

export const teamMembers = [
  {
    name: "Daryl",
    title: "CEO",
    image: "/teams/1.png",
    social: { linkedin: "#", github: "#", twitter: "#" },
  },
  {
    name: "Mark",
    title: "CTO",
    image: "/teams/2.png",
    social: { linkedin: "#", github: "#", twitter: "#" },
  },
  {
    name: "Ching",
    title: "Software Architect",
    image: "/teams/3.png",
    social: { linkedin: "#", github: "#", twitter: "#" },
  },
  {
    name: "Loop",
    title: "Software Engineer",
    image: "/teams/4.png",
    social: { linkedin: "#", github: "#", twitter: "#" },
  },
]

export const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We offer a wide range of services including software development, consulting, quality assurance, database management, performance optimization, and AI solutions. We specialize in product development, website development, system modernization, performance optimization, and strategic consulting. Our teams are skilled in providing both outsourcing services and complete project delivery.",
  },
  {
    question: "What makes Servintec different from other software companies?",
    answer:
      "Servintec was founded on the principles of trust, quality, and affordability. Our team of experts delivers high-quality solutions at competitive prices. We're transparent in every step, from client communication to our technical approach. We utilize AI tools where appropriate to enhance efficiency, and we're deeply committed to understanding your unique business needs before proposing solutions.",
  },
  {
    question: "What technologies do you work with?",
    answer:
      "We work with modern technologies including .NET, React, React Native, and various other frameworks and platforms. We choose the best technology stack for each project's specific needs, ensuring scalability, performance, and long-term maintainability. Our expertise spans both front-end and back-end development, cloud infrastructure, and AI/ML implementation.",
  },
  {
    question: "How do you approach new projects?",
    answer:
      "We begin by thoroughly understanding your business needs and objectives. Our approach is collaborative and transparent from the start. We develop a comprehensive project plan, establish clear milestones, and maintain regular communication throughout the development process. We believe in agile methodologies that allow for flexibility and iterative improvements based on feedback.",
  },
  {
    question: "Do you offer support after project completion?",
    answer:
      "Yes, we offer ongoing support and maintenance to ensure your software continues to operate smoothly. We're committed to your long-term success and provide various support options to meet your needs, including regular updates, performance monitoring, and technical assistance. Our goal is to build lasting partnerships with our clients.",
  },
  {
    question: "Why should I choose Servintec for my software needs?",
    answer:
      "We offer an unwavering commitment to quality, delivering software that exceeds expectations. Our services are affordable without compromising on excellence. We combine local expertise with global standards, understanding the unique challenges of various markets. Most importantly, we view ourselves as partners, not just service providers, dedicated to your success through every stage of development and beyond.",
  },
  {
    question: "How do you ensure project quality?",
    answer:
      "We follow industry best practices for development and quality assurance, including rigorous testing and code reviews. Quality is built into every stage of our development process. We implement continuous integration/continuous deployment pipelines, automated testing, and regular security audits. Our team adheres to established coding standards and documentation practices to ensure maintainable, high-quality code.",
  },
  {
    question: "What is your pricing model?",
    answer:
      "We offer flexible pricing models tailored to project needs, including fixed-price projects, time and materials, and retainer-based engagements. We believe in transparent pricing with no hidden costs. During our initial consultation, we'll discuss your requirements in detail and recommend the most appropriate pricing structure for your specific project.",
  },
]
