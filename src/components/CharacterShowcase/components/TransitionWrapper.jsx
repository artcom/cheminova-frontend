import { motion } from "framer-motion"

export const TransitionWrapper = ({ isActive, children }) => {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.95,
        y: isActive ? 0 : 20,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      }}
      style={{
        width: "100%",
        height: "100%",
        position: isActive ? "relative" : "absolute",
        top: 0,
        left: 0,
        zIndex: isActive ? 2 : 1,
        pointerEvents: isActive ? "auto" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </motion.div>
  )
}
