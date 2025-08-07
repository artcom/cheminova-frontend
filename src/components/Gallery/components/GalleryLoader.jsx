const LoadingSpinner = ({ size = 40, color = "black" }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `3px solid ${color}20`,
      borderTop: `3px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  />
)

export default function GalleryLoader({ loadedCount, totalImages }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        width: "100%",
        color: "black",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <LoadingSpinner size={60} color="black" />

      <h2
        style={{ margin: "20px 0 10px 0", fontSize: "24px", fontWeight: "300" }}
      >
        Loading Gallery
      </h2>

      <p style={{ margin: "0 0 20px 0", fontSize: "16px", opacity: 0.8 }}>
        {loadedCount} of {totalImages} images loaded
      </p>

      <div
        style={{
          width: "300px",
          height: "4px",
          backgroundColor: "#333",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${totalImages > 0 ? (loadedCount / totalImages) * 100 : 0}%`,
            height: "100%",
            backgroundColor: "#4CAF50",
            borderRadius: "2px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <p
        style={{
          margin: "10px 0 0 0",
          fontSize: "14px",
          opacity: 0.6,
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        Please wait while we prepare your image gallery experience
      </p>
    </div>
  )
}
