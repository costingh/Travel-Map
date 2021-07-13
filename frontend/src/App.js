import { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";

function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 45,
    longitude: 25,
    zoom: 4,
  });

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
		mapStyle="mapbox://styles/costingh/ckr2ev6g8e83v18pdshcjn8ti"
	  >
        <Marker
          latitude={48.858093}
          longitude={2.294694}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <RoomIcon style={{fontSize: viewport.zoom * 6, color: 'slateblue'}} />
        </Marker>
      </ReactMapGL>
    </div>
  );
}

export default App;
