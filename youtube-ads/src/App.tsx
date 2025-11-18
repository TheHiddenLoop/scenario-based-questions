import { useEffect, useRef, useState } from "react";

function App() {
  const [isSkip, setIsSkip] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const refvid = useRef<HTMLVideoElement | null>(null);

  // Watch video time and show skip button after 5s
  useEffect(() => {
    const video = refvid.current;
    if (!video) return;

    const checkTime = () => {
      if (video.currentTime >= 5 && !showButton) {
        setShowButton(true);
      }
    };

    video.addEventListener("timeupdate", checkTime);
    return () => video.removeEventListener("timeupdate", checkTime);
  }, [showButton]);

  const handleSkip = () => setIsSkip(true);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {!isSkip ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <video ref={refvid} src="levi.mp4" controls autoPlay />
          {showButton && (
            <button
              onClick={handleSkip}
              style={{
                position: "absolute",
                right: "20px",
                bottom: "60px",
                padding: "8px 16px",
                background: "rgba(0,0,0,0.7)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Skip Ad
            </button>
          )}
        </div>
      ) : (
        <video src="vid.mp4" controls autoPlay />
      )}
    </div>
  );
}

export default App;
