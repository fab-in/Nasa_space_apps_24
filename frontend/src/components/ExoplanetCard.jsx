import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Spinner,
} from "@nextui-org/react";
import styles from "./ExoplanetCard.module.css"; // Import css modules stylesheet as styles
import Rocket from "@mui/icons-material/Rocket";

export default function ExoplanetCard({ selectedPlanet, planetData }) {
  return (
    <Card className={[styles.exoplanetCard, "dark max-w-[400px]"]}>
      <CardHeader className="flex gap-3">
        {/* Uncomment and set an appropriate image URL if available */}
        {/* <Image
          alt="exoplanet"
          height={40}
          radius="sm"
          src="https://example.com/exoplanet-image.png" // Replace with actual image URL
          width={40}
        /> */}
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
            {/* <Link
          isExternal
          showAnchorIcon
          href={`https://exoplanetarchive.ipac.caltech.edu/`} // Replace with a relevant link
        >
          Learn more about {planetData?.name || "this exoplanet"}.
        </Link> */}
            <Button color="primary">
              Explore the skies! <Rocket />
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
