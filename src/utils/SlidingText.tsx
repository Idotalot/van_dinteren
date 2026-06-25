import React, { useEffect, useState } from "react";

interface TextSliderProps {
  texts: string[];
  interval?: number; // in milliseconds
}

const TextSlider: React.FC<TextSliderProps> = ({ texts, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateY(-${currentIndex * 100 / texts.length}%)`,
        }}
      >
        {texts.map((text, index) => (
          <div
            key={index}
            className="h-10 flex items-center text-5xl"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextSlider;
