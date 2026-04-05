import { motion } from 'framer-motion';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl z-10"></div>
      
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/2 -left-1/2 w-[100vw] h-[100vh] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply"
      />
      
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply"
      />

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-1/2 left-1/4 w-[90vw] h-[90vh] bg-pink-200/40 rounded-full blur-[100px] mix-blend-multiply"
      />
    </div>
  );
}
