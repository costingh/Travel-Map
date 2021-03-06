import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import { Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import SearchBar from './components/SearchBar';

import "./app.css";

function App() {
	const myStorage = window.localStorage;
	const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [newPlace, setNewPlace] = useState(null);
	const [title, setTitle] = useState(null);
	const [desc, setDesc] = useState(null);
	const [star, setStar] = useState(0);
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
    const [viewport, setViewport] = useState({
		height: '100vh',
		width: '100vw',
        latitude: 45,
        longitude: 25,
        zoom: 4,
	});

	const [locations, setLocations] = useState(null);
	const [value, setValue] = useState('');

	const handleMarkerClick = (id, lat, long) => {
		setCurrentPlaceId(id);
		setViewport({ ...viewport, latitude: lat, longitude: long });
	};

	const handleAddClick = (e) => {
		const [longitude, latitude] = e.lngLat;
		setNewPlace({
		  lat: latitude,
		  long: longitude,
		});
	  };

	  const handleSubmit = async (e) => {
		e.preventDefault();
		const newPin = {
		  username: currentUsername,
		  title,
		  desc,
		  rating: star,
		  lat: newPlace.lat,
		  long: newPlace.long,
		};
	
		try {
		  const res = await axios.post("/pins", newPin);
		  setPins([...pins, res.data]);
		  setNewPlace(null);
		} catch (err) {
		  console.log(err);
		}
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

	  const handleLogout = () => {
		setCurrentUsername(null);
		myStorage.removeItem("user");
	  };
	
	const search = async (query) => {
		const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + query + '.json?access_token=' + process.env.REACT_APP_MAPBOX;

		try {
		  const res = await axios.get(url);
		  setLocations(res.data.features);
		} catch (err) {
		  console.log(err);
		}
	}

	const clearForm = () => {
		setValue('');
		if(locations) {
			setLocations(null);
		}
	}

	useEffect(() => {
		if(value !== '') {
			search(value);
		}
	}, [value])

	const searchLocation = (e) => {
		if(locations) {
			const searchedLocation = locations.filter( location => location.place_name === e.target.innerText);
			setViewport({	
				...viewport, 
				latitude: searchedLocation[0].geometry.coordinates[1], 
				longitude: searchedLocation[0].geometry.coordinates[0],
				zoom: 8
			});
		}
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
			<SearchBar
				value={value}
				setValue={setValue}
				locations={locations}
				clearForm={clearForm}
				searchLocation={searchLocation}
			/>	
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
				transitionDuration="200"
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                mapStyle="mapbox://styles/costingh/ckr2ev6g8e83v18pdshcjn8ti"
				onDblClick={currentUsername && handleAddClick}
				onClick={clearForm}
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
							className="marker"
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
				{newPlace && (
					<>
						<Marker
							latitude={newPlace.lat}
							longitude={newPlace.long}
							offsetLeft={-3.5 * viewport.zoom}
							offsetTop={-7 * viewport.zoom}
						>
						<RoomIcon
							style={{
							fontSize: 7 * viewport.zoom,
							color: "tomato",
							cursor: "pointer",
							}}
						/>
						</Marker>
						<Popup
						latitude={newPlace.lat}
						longitude={newPlace.long}
						closeButton={true}
						closeOnClick={false}
						onClose={() => setNewPlace(null)}
						anchor="left"
						>
						<div>
							<form onSubmit={handleSubmit} className='addNewPinForm'>
							<label>Title</label>
							<input
								placeholder="Enter a title"
								autoFocus
								onChange={(e) => setTitle(e.target.value)}
							/>
							<label>Description</label>
							<textarea
								placeholder="Say us something about this place."
								onChange={(e) => setDesc(e.target.value)}
							/>
							<label>Rating</label>
							<select onChange={(e) => setStar(e.target.value)}>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
							<button type="submit" className="submitButton">
								Add Pin
							</button>
							</form>
						</div>
						</Popup>
					</>
					)}
					{currentUsername ? (
						<button className="button logout" onClick={handleLogout}>
							Log out
						</button>
						) : (
						<div className="buttons">
							<button className="button login" onClick={() => setShowLogin(true)}>
								Log in
							</button>
							<button
								className="button register"
								onClick={() => setShowRegister(true)}
							>
								Register
							</button>
						</div>
						)}
						{showRegister && <Register setShowRegister={setShowRegister} />}
						{showLogin && (
						<Login
							setShowLogin={setShowLogin}
							setCurrentUsername={setCurrentUsername}
							myStorage={myStorage}
						/>
					)}		
            </ReactMapGL>
        </div>
    );
}

export default App;
