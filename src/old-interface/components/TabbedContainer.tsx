import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { TabbedContainerProps } from '../types/TabbedContainerProps';
import { useSettingsContext } from '../SettingsContext';

const TabbedContainer: React.FC<TabbedContainerProps> = ({ tabs }) => {
  const { settingsState } = useSettingsContext();
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [tabWidth, setTabWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const positionRef = useRef(position);

  // Function to handle message
  const handleMessage = (event: MessageEvent) => {
    if (event.data === "popupClosed") {  
      setActiveTab(0);
    }
  };
  
  useEffect(() => {
    window.addEventListener("message", handleMessage);
  
    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const newPosition = -activeTab * 100;
    setPosition(newPosition);
    positionRef.current = newPosition;
  }, [activeTab]);

  const containerRef = useRef(null);

  const springTransition = settingsState.animations ? { type: 'spring', stiffness: 250, damping: 25 } : { duration: 0 };

  useEffect(() => {
    if (containerRef.current) {
      // @ts-expect-error for some reason its giving an error in TS but it works...
      const width = containerRef.current.getBoundingClientRect().width;
      setTabWidth(width / tabs.length);
    }
  }, [tabs.length]);

  const calcXPos = (index: number | null) => {
    if (index !== null) {
      return tabWidth * index;
    }
    return tabWidth * activeTab;
  };

  return (
  <>
    <div ref={containerRef} className="top-0 z-10 text-[0.875rem] pb-0.5 mx-4">
      <div className="relative flex">          
        <motion.div
          className="absolute top-0 left-0 z-0 h-full bg-[#DDDDDD] dark:bg-[#38373D] rounded-full opacity-40"
          style={{ width: `${tabWidth}px` }}
          initial={false}
          animate={{ x: calcXPos(hoveredTab) }}
          transition={springTransition}
        />
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="relative z-10 flex-1 px-4 py-2"
            onClick={() => setActiveTab(index)}
            onMouseEnter={() => setHoveredTab(index)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {tab.title}
          </button>
        ))}
      </div>
    </div>
    <div className="h-full px-4 overflow-x-clip">
      <motion.div
        initial={false}
        animate={{ x: `${position}%` }}
        transition={springTransition}
        className='flex'
      >
        {tabs.map((tab, index) => (
          <div key={index} className={`absolute h-[100vh] focus-visible:outline-none overflow-y-scroll w-full pb-40 ${ settingsState.animations ? 'transition-opacity duration-300' : ''} ${activeTab === index ? 'opacity-100' : 'opacity-0'}`}
            style={{left: `${index * 100}%`}}>
            {tab.content}
          </div>
        ))}
      </motion.div>
    </div>
  </>
  );
};

export default memo(TabbedContainer);