import * as m from "motion/react-m"
import { LazyMotion } from "motion/react"

export const TransitionWrapper = ({ isActive, children, ...props }) => {
  const loadFeatures = () =>
    import("../../UI/features.js").then((res) => res.default)
  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
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
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
