"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const TasksSection = () => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const tasks = [
    {
      week: 24,
      items: [
        {
          title: "Personal Development Workouts Week 24",
          type: "PERSONAL TASK",
          completed: true,
        },
        {
          title: "Web development using Python Django and React - Week 24",
          type: "TECHNICAL TASK",
          completed: true,
        },
        {
          title: "Communication Task - Week 24",
          type: "COMMUNICATION TASK",
          completed: true,
        },
      ],
    },
    {
      week: 25,
      items: [
        {
          title: "Web development using Python Django and React - Week 25",
          type: "TECHNICAL TASK",
          completed: true,
        },
        {
          title: "Communication Task - Week 25",
          type: "COMMUNICATION TASK",
          completed: true,
        },
        {
          title: "Miscellaneous - Week 25",
          type: "MISCELLANEOUS TASK",
          completed: true,
        },
      ],
    },
    {
      week: 26,
      items: [
        {
          title: "Personal Development Workouts Week 26",
          type: "PERSONAL TASK",
          completed: false,
        },
        {
          title: "Web development using Python Django and React - Week 26",
          type: "TECHNICAL TASK",
          completed: false,
        },
        {
          title: "Communication Task - Week 26",
          type: "COMMUNICATION TASK",
          completed: false,
        },
      ],
    },
    {
      week: 27,
      items: [
        {
          title: "Communication Task - Week 27",
          type: "COMMUNICATION TASK",
          completed: false,
        },
        {
          title: "Soft Skills - Week 27",
          type: "MISCELLANEOUS TASK",
          completed: false,
        },
      ],
    },
  ];

  const isUnlocked = (index) =>
    index === 0 || tasks[index - 1].items.every((item) => item.completed);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerWidth = container.offsetWidth;
      const scrollPosition = container.scrollLeft;
      const cardWidth = container.firstChild.offsetWidth;

      // Calculate which card is in the center
      const centerIndex = Math.round(scrollPosition / cardWidth);
      if (centerIndex !== activeIndex) {
        setActiveIndex(centerIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);

    // Initial scroll to active card
    const cardWidth = container.firstChild.offsetWidth;
    container.scrollTo({
      left: activeIndex * cardWidth,
      behavior: "smooth",
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex]);

  const scrollTo = (direction) => {
    const maxIndex = tasks.length - 1;
    let newIndex = activeIndex + (direction === "right" ? 1 : -1);
    newIndex = Math.max(0, Math.min(newIndex, maxIndex));

    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstChild.offsetWidth;
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });

    setActiveIndex(newIndex);
  };

  return (
    <div className="relative bg-black min-h-screen text-white px-6 py-10 flex flex-col items-center">
      <h1 className="text-white text-3xl font-bold mb-6">Tasks</h1>

      <div className="relative w-full max-w-3xl mx-auto">
        <button
          onClick={() => scrollTo("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white text-black rounded-full p-2 shadow-md hover:scale-110"
        >
          ⬅️
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {tasks.map((task, index) => {
            const unlocked = isUnlocked(index);
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={index}
                className={`snap-center rounded-xl p-4 transition-all duration-500 flex-shrink-0 w-[280px] mx-auto ${
                  isActive
                    ? "scale-105 bg-[#282828] z-10 shadow-2xl"
                    : "scale-90 opacity-60 bg-[#1a1a1a]"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-full">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Week {task.week}
                  </h2>
                  {unlocked ? (
                    task.items.map((item, i) => (
                      <div
                        key={i}
                        className="p-4 mb-2 border border-gray-700 rounded-md bg-black/30"
                      >
                        <p className="text-sm text-purple-400 font-semibold">
                          {item.completed ? (
                            <>
                              Completed <span className="text-lg">✔</span>
                            </>
                          ) : (
                            "Pending"
                          )}
                        </p>
                        <h3 className="text-base font-bold">{item.title}</h3>
                        <p className="text-xs text-gray-400">{item.type}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-gray-400 mt-10 space-y-2">
                      <Lock size={40} />
                      <p>Please complete the tasks from the previous</p>
                      <p>pass the review to unlock access to this week.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => scrollTo("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white text-black rounded-full p-2 shadow-md hover:scale-110"
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default TasksSection;
