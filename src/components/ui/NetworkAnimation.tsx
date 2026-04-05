import { motion } from 'framer-motion';

export default function NetworkAnimation() {
  // Generate random nodes
  const nodes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden border border-white/20 shadow-inner">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Floating Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full bg-white dark:bg-white/10 backdrop-blur-md border border-blue-200 dark:border-white/20 shadow-lg flex items-center justify-center"
          style={{
            width: node.size * 4,
            height: node.size * 4,
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Inner Core */}
          <div className="w-1/3 h-1/3 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full opacity-80" />
        </motion.div>
      ))}

      {/* Connecting Lines (Simulated with large blurred circles for aesthetic) */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-multiply dark:mix-blend-screen"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 mix-blend-multiply dark:mix-blend-screen"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Central Text or Icon (Optional) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h3 className="text-9xl font-bold text-blue-500/5 select-none">STEM</h3>
      </div>
    </div>
  );
}
