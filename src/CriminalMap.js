import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

const accessToken = `L5K19ucxcoToxo9knKlvSqyYiXYTaCFtRXVJT4DiFkYIjWGQBf6iil33GVU5pOJF`;

const circleMarkerIcon = new Icon({
  iconUrl: "../sheriff_badge.svg",
  iconSize: [35, 35],
});

export const CriminalMap = ({ center, zoom, crimes, onMarkerClick }) => {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=${accessToken}`}
      />
      {crimes &&
        crimes
          .filter((crime) => crime.location)
          .map((crime, index) => (
            <Marker
              key={index}
              icon={circleMarkerIcon}
              position={[crime.location.latitude, crime.location.longitude]}
              eventHandlers={{
                click: () => onMarkerClick(crime),
              }}
            >
              <Popup>{crime.legislation}</Popup>
            </Marker>
          ))}
    </MapContainer>
  );
};
