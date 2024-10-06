import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Function to convert 3D star coordinates (RA, Dec) to 2D within the viewport
const project3DTo2D = (ra, dec, width, height, padding = 50) => {
  const centerX = width / 2;
  const centerY = height / 2;

  // RA (0-360) maps to width, Dec (-90 to +90) maps to height, and it's centered
  const x = centerX + ((ra / 360) * (width - padding * 2)) - (width - padding * 2) / 2;

  // Dec (-90 to +90) should map to height and center vertically
  const y = centerY - ((dec / 180) * (height - padding * 2)); // Adjusted for better vertical alignment

  return { x, y };
};

function Constellation() {
  const canvasRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lines, setLines] = useState([]); // Store lines between stars
  const [selectedStars, setSelectedStars] = useState([]); // Keep track of selected stars
  const [constellationName, setConstellationName] = useState(""); // Store constellation name
  const [constellations, setConstellations] = useState([]); // Store saved constellations
  const location = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const ra = parseFloat(params.get("ra"));
    const dec = parseFloat(params.get("dec"));
    const dist = parseFloat(params.get("dist"));
    return { ra, dec, dist };
  };

  const fetchStars = async (ra, dec, dist) => {
    try {
      const response = await fetch(`${API_URL}/stars/ra=${ra}&dec=${dec}&dist=${dist}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stars.");
      }
      const data = await response.json();
      setStars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { ra, dec, dist } = getQueryParams();
    if (ra && dec && dist) {
      fetchStars(ra, dec, dist);
    }
  }, [location.search]);

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw stars and lines on the canvas
  useEffect(() => {
    if (!stars.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    stars.forEach((star, index) => {
      const { ra, dec } = star;
      const { x, y } = project3DTo2D(ra, dec, width, height);

      // Draw the star as a small circle
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2); // Larger radius for visibility
      ctx.fillStyle = selectedStars.includes(index) ? "yellow" : "white"; // Highlight selected stars
      ctx.fill();
    });

    // Draw lines between selected stars
    if (lines.length > 0) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      lines.forEach(([startIdx, endIdx]) => {
        const startStar = stars[startIdx];
        const endStar = stars[endIdx];
        const startCoord = project3DTo2D(startStar.ra, startStar.dec, width, height);
        const endCoord = project3DTo2D(endStar.ra, endStar.dec, width, height);

        ctx.beginPath();
        ctx.moveTo(startCoord.x, startCoord.y);
        ctx.lineTo(endCoord.x, endCoord.y);
        ctx.stroke();
      });
    }
  }, [stars, lines, selectedStars]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check which star was clicked
    stars.forEach((star, index) => {
      const { ra, dec } = star;
      const { x: starX, y: starY } = project3DTo2D(ra, dec, canvas.width, canvas.height);

      // Check if click is close to the star
      if (Math.abs(x - starX) < 10 && Math.abs(y - starY) < 10) {
        // If clicked, toggle selection
        setSelectedStars((prev) => {
          if (prev.includes(index)) {
            return prev.filter((id) => id !== index);
          } else {
            return [...prev, index];
          }
        });
      }
    });

    // If two stars are selected, draw a line
    if (selectedStars.length === 2) {
      setLines((prev) => [...prev, [selectedStars[0], selectedStars[1]]]);
      setSelectedStars([]); // Reset selection
    }
  };

  const handleClearLines = () => {
    setLines([]); // Clear all lines
  };

  // Save constellation as PNG
  const handleSaveConstellationAsImage = () => {
    const canvas = canvasRef.current;
    if (!constellationName.trim()) {
      alert("Please provide a name for the constellation.");
      return;
    }

    // Convert canvas to PNG
    const imageURI = canvas.toDataURL("image/png");

    // Create a link element to trigger download
    const link = document.createElement("a");
    link.href = imageURI;
    link.download = `${constellationName}.png`;

    // Trigger the download
    link.click();

    setConstellationName(""); // Reset name input
  };

  const handleRemoveConstellation = () => {
    if (window.confirm("Are you sure you want to clear the constellation?")) {
      handleClearLines(); // Clears the drawn lines
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "white" }}>Star Constellation</h1>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ backgroundColor: "black", display: "block", margin: "0", position: "absolute", top: 0, left: 0 }}
      />
      
      {/* Minimalistic control panel */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "10px 20px",
          borderRadius: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Constellation Name"
          value={constellationName}
          onChange={(e) => setConstellationName(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#fff",
            color: "#000",
            outline: "none",
            width: "200px",
          }}
        />
        <button
          onClick={handleSaveConstellationAsImage}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
        >
          Save as PNG
        </button>
        <button
          onClick={handleRemoveConstellation}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
        >
          Clear Constellation
        </button>
      </div>
      
      {/* Display saved constellations */}
      {constellations.length > 0 && (
        <div style={{ position: "absolute", bottom: 20, left: 20, color: "white" }}>
          <h3>Saved Constellations:</h3>
          <ul>
            {constellations.map((constellation, index) => (
              <li key={index}>
                <strong>{constellation.name}</strong>: {constellation.lines.length} lines
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Constellation;
