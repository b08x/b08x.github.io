import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, BookOpen, Robot, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const educationalContent = [
  {
    title: "Content Analysis",
    icon: Shield,
    description: "Analyzes user inputs and AI responses for potential threats.",
    keyPoints: [
      "Uses advanced NLP techniques",
      "Extracts linguistic features",
      "Identifies unusual patterns"
    ],
    color: "#FF6B6B"
  },
  {
    title: "Threat Detection",
    icon: AlertTriangle,
    description: "Identifies potential security risks and malicious content.",
    keyPoints: [
      "Detects instruction override attempts",
      "Recognizes unusual data access patterns",
      "Alerts on suspicious activities"
    ],
    color: "#4ECDC4"
  },
  {
    title: "Education Generation",
    icon: BookOpen,
    description: "Creates and updates educational content on AI safety.",
    keyPoints: [
      "Generates lessons on safe practices",
      "Updates taxonomy of threats",
      "Creates interactive quizzes"
    ],
    color: "#45B7D1"
  },
  {
    title: "Attack Simulation",
    icon: Robot,
    description: "Simulates various AI-based attack scenarios for training.",
    keyPoints: [
      "Emulates social engineering attempts",
      "Provides hands-on experience",
      "Assesses user responses"
    ],
    color: "#F9D56E"
  },
  {
    title: "Adaptive Defense",
    icon: RefreshCw,
    description: "Continuously updates defenses based on new threats.",
    keyPoints: [
      "Analyzes attack patterns",
      "Updates security rules",
      "Enhances system resilience"
    ],
    color: "#FF8C42"
  }
];

const EducationalCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % educationalContent.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + educationalContent.length) % educationalContent.length);
  };

  const CurrentSlide = ({ content }) => (
    <motion.div
      initial={{ opacity: 0, x: 100 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 * direction }}
      transition={{ duration: 0.5 }}
      style={{
        background: `linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)`,
        borderLeft: `8px solid ${content.color}`
      }}
      className="p-8 rounded-lg shadow-2xl max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-6">
        <content.icon style={{ color: content.color }} size={48} className="mr-4" />
        <h2 className="text-4xl font-bold text-white">{content.title}</h2>
      </div>
      <p className="text-xl mb-6 text-gray-300">{content.description}</p>
      <ul className="space-y-3">
        {content.keyPoints.map((point, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center text-gray-200"
          >
            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: content.color }}></div>
            {point}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <div className="relative p-8 bg-gray-900 min-h-[600px] flex items-center">
      <button onClick={prevSlide} className="absolute left-4 z-10 p-3 bg-gray-800 rounded-full shadow-lg text-white hover:bg-gray-700 transition-colors">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 z-10 p-3 bg-gray-800 rounded-full shadow-lg text-white hover:bg-gray-700 transition-colors">
        <ChevronRight size={24} />
      </button>
      <div className="w-full overflow-hidden">
        <AnimatePresence mode='wait'>
          <CurrentSlide key={currentIndex} content={educationalContent[currentIndex]} />
        </AnimatePresence>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {educationalContent.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-600"
            }`}
            animate={{ scale: index === currentIndex ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default EducationalCarousel;
