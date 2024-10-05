import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";


export default function ExoplanetCard({ planet_data }) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        {/* <Image
          alt="exoplanet"
          height={40}
          radius="sm"
          src="https://example.com/exoplanet-image.png" // Replace with actual image URL
          width={40}
        /> */}
        <div className="flex flex-col">
          <p className="text-md">{planet_data?.pl_name || "N/A"}</p>{" "}
          {/* Exoplanet Name */}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>
          <strong>RA :</strong> {planet_data?.ra || "N/A"}
        </p>
        <p>
          <strong>Dec :</strong> {planet_data?.dec || "N/A"}
        </p>
        <p>
          <strong>Distance :</strong> {planet_data?.distance || "N/A"}
        </p>
        <p>
          <strong>Orbital Period (days):</strong>{" "}
          {planet_data?.pl_orbper || "N/A"}
        </p>
        <p>
          <strong>Semi-Major Axis (AU):</strong>{" "}
          {planet_data?.pl_orbsmax || "N/A"}
        </p>
        <p>
          <strong>Mass (Jupiter Masses):</strong>{" "}
          {planet_data?.pl_bmassj || "N/A"}
        </p>
        <p>
          <strong>Radius (Jupiter Radius):</strong>{" "}
          {planet_data?.pl_radj || "N/A"}
        </p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href={`https://exoplanetarchive.ipac.caltech.edu/`} // Replace with a relevant link
        >
          Learn more about {planet_data?.pl_name || "this exoplanet"}.
        </Link>
      </CardFooter>
    </Card>
  );
}
