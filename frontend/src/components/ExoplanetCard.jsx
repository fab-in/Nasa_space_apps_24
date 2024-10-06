import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Spinner,
} from "@nextui-org/react";
import styles from "./ExoplanetCard.module.css"; // Import css modules stylesheet as styles
import Rocket from "@mui/icons-material/Rocket";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ExoplanetCard({ selectedPlanet, planetData }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleExploreClick = () => {
    // Navigate to /skyview with RA and Dec as query parameters
    const ra = planetData?.ra || "N/A";
    const dec = planetData?.dec || "N/A";
    const dist = planetData?.distance || "N/A";
    navigate(`/skyview?ra=${ra}&dec=${dec}&dist=${dist}`);
  };

  return (
    <Card className={[styles.exoplanetCard, "dark max-w-[400px]"]}>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{selectedPlanet}</p>
          {/* Exoplanet Name */}
        </div>
      </CardHeader>
      <Divider />
      {selectedPlanet && !planetData ? (
        <Spinner style={{ margin: "10px" }} size="lg" />
      ) : (
        <>
          <CardBody>
            <p>
              <strong>RA:</strong> {planetData?.ra || "N/A"}
            </p>
            <p>
              <strong>Dec:</strong> {planetData?.dec || "N/A"}
            </p>
            <p>
              <strong>Distance:</strong> {planetData?.distance || "N/A"}
            </p>
            <p>
              <strong>Orbital Period (days):</strong>{" "}
              {planetData?.orbital_period || "N/A"}
            </p>
            <p>
              <strong>Semi-Major Axis (AU):</strong>{" "}
              {planetData?.semi_major_axis || "N/A"}
            </p>
            <p>
              <strong>Mass (Jupiter Masses):</strong>{" "}
              {planetData?.mass || "N/A"}
            </p>
            <p>
              <strong>Radius (Jupiter Radius):</strong>{" "}
              {planetData?.radius || "N/A"}
            </p>
          </CardBody>
          <Divider />
          <CardFooter>
            <Button color="primary" onClick={handleExploreClick}> {/* Attach click handler */}
              Explore the skies! <Rocket />
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
