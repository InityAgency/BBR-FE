"use client";

import { motion, useMotionValue, useAnimation } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

type VerticalCarouselProps = {
  items: string[];
};

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ items }) => {
  const [index, setIndex] = useState(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

  const handleDragEnd = async (_: any, info: { offset: { y: number } }) => {
    const offsetY = info.offset.y;
    const threshold = 50;

    if (offsetY < -threshold) {
      setIndex((prev) => (prev + 1) % items.length);
    } else if (offsetY > threshold) {
      setIndex((prev) => (prev - 1 + items.length) % items.length);
    }

    await controls.start({ y: 0 });
  };

  const getItemAt = (i: number) => {
    const wrappedIndex = (i + items.length) % items.length;
    return items[wrappedIndex];
  };

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden relative">
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ y }}
        animate={controls}
        className="flex flex-col items-center justify-center cursor-grab w-full"
      >
        {/* Top item */}
        <motion.div className="h-[150px] w-[90%] my-1 bg-red-100 rounded-md flex items-center justify-center text-xl text-gray-400 opacity-60">
          {getItemAt(index - 1)}
        </motion.div>

        {/* Center item */}
        <motion.div className="flex flex-col h-[170px] w-full my-[-30px] rounded-md flex items-center justify-center text-xl font-bold text-blue-600 bg-white shadow-md scale-110 z-10">
          {getItemAt(index)}
          <Image src="/bbr-score.png" alt={""} width={170} height={170} />
        </motion.div>

        {/* Bottom item */}
        <motion.div className="h-[150px] w-[90%] my-1 bg-yellow-100  rounded-md flex items-center justify-center text-xl text-gray-400 opacity-60">
          {getItemAt(index + 1)}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerticalCarousel;
