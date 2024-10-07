import React from "react";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import RocketIcon from "@mui/icons-material/Rocket"; // Import the rocket icon
import styles from "./ExoplanetCard.module.css"; // Import css modules stylesheet as styles

export default function ExoplanetSearchCard({ planetName }) {
  return (
    <Card className={[styles.exoplanetCard, "max-w-[200px]"]} style={{ margin: '10px' }}>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-lg font-bold">{planetName}</p> {/* Display planet name */}
        </div>
      </CardHeader>

      <CardBody className="flex justify-center">
        <RocketIcon style={{ fontSize: 40 }} /> {/* Display the icon */}
      </CardBody>

      <Button color="primary" style={{ marginTop: "10px" }}>
        Explore
      </Button>
    </Card>
  );
}
