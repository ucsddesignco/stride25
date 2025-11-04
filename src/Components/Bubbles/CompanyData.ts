export type BubbleCategory = 'Recruiting' | 'Networking' | 'Student Ambassadors';

export interface Company {
  id: number;
  name: string;
  logo?: string; // Path to SVG logo, or undefined if text-only
  description: string;
  category: BubbleCategory;
}

export const CompanyData: Record<BubbleCategory, Company[]> = {
  Recruiting: [
    {
      id: 1,
      name: 'Algae Foods',
      logo: undefined, // No logo file, will render as text
      description: 'Algae Foods is a student-founded startup developing the next generation of super food snacks using algae. They focus on enhancing the nutrition of popular snack foods and won the Audience Choice Award at Demo Day 2025.',
      category: 'Recruiting',
    },
    {
      id: 2,
      name: 'UC San Diego Library',
      logo: '/images/Bubbles/Recruiting/UC_San_Diego_Library.svg',
      description: "UC San Diego Library is one of the nation's top public academic libraries, providing an important role in advancing the university's research and teaching missions. They focus on the advancement of knowledge throughout various academic levels, offering a range of opportunities that cater to diverse majors.",
      category: 'Recruiting',
    },
    {
      id: 3,
      name: 'Art of Problem Solving',
      logo: '/images/Bubbles/Recruiting/AoPS.svg',
      description: 'The Art of Problem Solving is a company dedicated to enhancing the mathematical skills of students through innovative resources and engaging courses. They focus on developing critical thinking and problem-solving abilities, offering a range of materials from textbooks to online classes that cater to various learning styles.',
      category: 'Recruiting',
    },
    {
      id: 4,
      name: 'CheckRX',
      logo: '/images/Bubbles/Recruiting/checkRX.svg',
      description: 'CheckRx is a technology company dedicated to creating modern background screening solutions using artificial intelligence and machine learning. They focus on automating processes, with services covering employment verification, drug testing, and more.',
      category: 'Recruiting',
    },
    {
      id: 5,
      name: 'Triton TV',
      logo: '/images/Bubbles/Recruiting/TTV.svg',
      description: "Triton TV is a film and art-making community that captures UCSD's live events and provides students with an extracurricular filmmaking education. They focus on developing a collaborative environment where members work together as they grow as filmmakers.",
      category: 'Recruiting',
    },
    {
      id: 6,
      name: 'Owaves',
      logo: '/images/Bubbles/Recruiting/owaves.svg',
      description: 'Owaves is focused on developing a holistic calendar that optimizes your circadian rhythm. They encourage sustainable life habits via planning tools and mobile applications. Their software incorporates input from leaders in mindfulness and more.',
      category: 'Recruiting',
    },
  ],
  Networking: [
    {
      id: 7,
      name: 'Google',
      logo: '/images/Bubbles/Networking/Google.svg',
      description: "Google is a leader in technology, dedicated to organizing the world's information by making it universally accessible. They focus on developing user-centric services, offering diverse digital platforms to billions of consumers and businesses worldwide.",
      category: 'Networking',
    },
    {
      id: 8,
      name: 'Illumina',
      logo: '/images/Bubbles/Networking/illumina.svg',
      description: 'Illumina is a biotechnology company dedicated to supplying innovative solutions to the analysis of genetic variation and function. They focus on developing DNA sequencing and array-based life sciences to pioneer advances in diverse scientific fields.',
      category: 'Networking',
    },
    {
      id: 9,
      name: 'Snapchat',
      logo: '/images/Bubbles/Networking/snapchat.svg',
      description: 'Snapchat is a company dedicated to empowering people to express themselves and communicate visually. They focus on developing innovative social experiences and Augmented Reality features, offering a range of mobile applications that cater to personalized sharing.',
      category: 'Networking',
    },
    {
      id: 10,
      name: 'Illumina (Alan Tran)',
      logo: undefined, // No logo file, will render as text
      description: 'Alan Tran is a UX Engineer at Illumina dedicated to delivering a consistent design framework for complex medical platforms. Since 2021, he\'s helped brainstorm efficient technical solutions in collaboration with interaction and visual design.',
      category: 'Networking',
    },
  ],
  'Student Ambassadors': [
    {
      id: 11,
      name: 'Figma',
      logo: undefined, // No logo file, will render as text
      description: 'Figma is a collaborative design platform dedicated to making design accessible to everyone through community-driven tools. They focus on creating global user communities, offering a range of educational programs and resources that cater to both students and professionals.',
      category: 'Student Ambassadors',
    },
    {
      id: 12,
      name: 'CoPilot',
      logo: undefined, // No logo file, will render as text
      description: 'CoPilot is an AI technology dedicated to boosting individual productivity and accelerating innovation in software development. They focus on developing intelligent coding assistance and streamlined development workflows, offering diverse educational resources and AI-powered tools.',
      category: 'Student Ambassadors',
    },
    {
      id: 13,
      name: 'Claude',
      logo: undefined, // No logo file, will render as text
      description: 'Developed by Anthropic, Claude is an AI research company dedicated to building safe and reliable large language models for widespread public use. They focus on developing trustworthy AI systems by facilitating tasks such as editing, search, and code-writing. Claude aims to be steerable and efficient for users.',
      category: 'Student Ambassadors',
    },
    {
      id: 14,
      name: 'Autodesk',
      logo: undefined, // No logo file, will render as text
      description: 'Autodesk is a software company dedicated to empowering innovators in architecture, engineering, and manufacturing. They focus on developing design tools and cultivating technical expertise, offering a range of software access and educational programs. They offer Autodesk Inventor, Fusion 360, and more.',
      category: 'Student Ambassadors',
    },
  ],
};
