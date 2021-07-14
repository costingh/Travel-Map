import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import { Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";

import "./app.css";

function App() {
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [currentUsername, setCurrentUsername] = useState("john");
    const [viewport, setViewport] = useState({
		height: '100vh',
		width: '100vw',
        latitude: 45,
        longitude: 25,
        zoom: 4,
	});
	
	const handleMarkerClick = (id, lat, long) => {
		setCurrentPlaceId(id);
		setViewport({ ...viewport, latitude: lat, longitude: long });
	};

	useEffect(() => {
		const getPins = async () => {
		  try {
			const allPins = await axios.get("/pins");
			setPins(allPins.data);
		  } catch (err) {
			console.log(err);
		  }
		};
		getPins();
	  }, []);
	
	  

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                mapStyle="mapbox://styles/costingh/ckr2ev6g8e83v18pdshcjn8ti"
            >
			{pins.map((p) => (
				<>
					<Marker
					latitude={p.lat}
					longitude={p.long}
					offsetLeft={-3.5 * viewport.zoom}
					offsetTop={-7 * viewport.zoom}
					>
					<RoomIcon
						style={{
						fontSize: 7 * viewport.zoom,
						color:
							currentUsername === p.username ? "tomato" : "slateblue",
						cursor: "pointer",
						}}
						onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
					/>
					</Marker>
					{p._id === currentPlaceId && (
					<Popup
						key={p._id}
						latitude={p.lat}
						longitude={p.long}
						closeButton={true}
						closeOnClick={false}
						onClose={() => setCurrentPlaceId(null)}
						anchor="left"
					>
						<div className="card">
						<label>Place</label>
						<h4 className="place">{p.title}</h4>
						<label>Review</label>
						<p className="desc">{p.desc}</p>
						<label>Rating</label>
						<div className="stars">
							{Array(p.rating).fill(<Star className="star" />)}
						</div>
						<label>Information</label>
						<span className="username">
							Created by <b>{p.username}</b>
						</span>
						<span className="date">{format(p.createdAt)}</span>
						</div>
					</Popup>
					)}
				</>
				))}
            </ReactMapGL>
        </div>
    );
}

export default App;
