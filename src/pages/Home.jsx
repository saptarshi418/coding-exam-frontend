import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const creators = [
  {
    name: 'Animesh Chakrabarty',
    role: 'Software Developer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis, nulla in lacinia luctus, sem sapien convallis metus.',
    github: '#',
    linkedin: '#',
    img: 'https://via.placeholder.com/100',
  },
  {
    name: 'Saptarshi Ghosh',
    role: 'Backend Developer',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    github: '#',
    linkedin: '#',
    img: 'https://via.placeholder.com/100',
  },
  {
    name: 'Gaurab Kundu',
    role: 'Data Analyst',
    description:
      'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
    github: '#',
    linkedin: '#',
    img: 'https://via.placeholder.com/100',
  },
  {
    name: 'Akash Maity',
    role: 'Project Manager',
    description:
      'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
    github: '#',
    linkedin: '#',
    img: 'https://via.placeholder.com/100',
  },
  {
    name: 'Samarjit Bag',
    role: 'ML Engineer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae suscipit lorem. Nullam feugiat ligula in urna dignissim.',
    github: '#',
    linkedin: '#',
    img: 'https://via.placeholder.com/100',
  },
  {
    name: 'Debjyoti Ghosh',
    role: 'DevOps Engineer',
    description:
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    github: '#',
    linkedin: '#',
    img: 'https://via.placeholder.com/100',
  },
];

const Home = () => {
  return (
    <div className="bg-[#1A1A2E] text-[#E0E0E0] min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#6B8AFF]">
            Welcome to CodeGuard
          </h1>
          <p className="text-lg md:text-xl text-[#E0E0E0]">
            A secure online coding contest platform with real-time AI-powered cheating detection.
          </p>
        </section>

        {/* About Website */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#6BFF6B]">
            About the Platform
          </h2>
          <p className="text-base leading-relaxed">
            Welcome to CodeGuard — an innovative online coding contest platform designed to challenge your skills, ignite your creativity, and prepare you for real-world problem-solving.

            
            </p>
            <p className="text-base leading-relaxed">
              At CodeArena, we connect passionate programmers and organizations through fair, secure, and dynamic coding competitions. Whether you’re a student, a professional, or a company looking to discover top tech talent, our platform provides a seamless experience — from creating contests to live coding and automated cheating detection.


            </p>
            <p className="text-base leading-relaxed">
              Our mission is to empower the next generation of developers by providing a competitive, transparent, and rewarding environment. We believe coding should be fun, challenging, and accessible to everyone — anytime, anywhere.


            </p>
        </section>

        {/* Creators Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#6BFF6B]">
            Meet the Creators
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {creators.map((creator, index) => (
              <div
                key={index}
                className="bg-[#1F4068] rounded-2xl p-6 shadow-lg backdrop-blur-sm bg-opacity-70"
              >
                <img
                  src={creator.img}
                  alt={creator.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#6B8AFF]"
                />
                <h3 className="text-xl font-bold mb-1 text-center text-[#E0E0E0]">
                  {creator.name}
                </h3>
                <p className="text-sm text-center mb-2 text-[#6B8AFF]">{creator.role}</p>
                <p className="text-sm text-center text-[#E0E0E0] mb-3">
                  {creator.description}
                </p>
                <div className="flex justify-center gap-4">
                  <a href={creator.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-xl hover:text-[#E0E0E0]" />
                  </a>
                  <a href={creator.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-xl hover:text-[#E0E0E0]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
