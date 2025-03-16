import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../assets/dreampixlogo.png";

const ImageGenerator = () => {
  const [imge_url, setImage_url] = useState("/");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading....");
  let inputRef = useRef(null);

  const generateImage = async () => {
    if (inputRef.current.value === "") {
      return 0;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: `${inputRef.current.value}`,
            n: 1,
            size: "512x512",
          }),
        }
      );
      let data = await response.json();
      setImage_url(data.data[0].url);
    } catch (error) {
      console.log(error);
      setLoadingText(error.data);
    } finally {
      setLoading(false);
      setLoadingText("Loading...");
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        DreamPix <span>AI</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={imge_url === "/" ? default_image : imge_url} alt="" />
        </div>
        <div className="loading">
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>
            {loadingText}
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Describe What you want to see"
        />
        <div
          className="generate-btn"
          onClick={() => {
            generateImage();
          }}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
