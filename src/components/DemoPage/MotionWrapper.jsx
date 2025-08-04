import * as m from "motion/react-m"
import { LazyMotion } from "motion/react"

const MotionWrapper = ({ children, ...props }) => {
  const loadFeatures = () =>
    import("../UI/features.js").then((res) => res.default)
  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

export default MotionWrapper
