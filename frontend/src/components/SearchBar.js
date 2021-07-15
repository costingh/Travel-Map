import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

import './searchbar.css'

function SearchBar({value, setValue, locations, clearForm, searchLocation}) {
    return (
        <div className="searchBar">
            <form className="search-form">
                <input value={value} type="text" name="search" onChange={e => setValue(e.target.value)} placeholder='Search for a location...'/>
                <button type='submit'>
                    <SearchIcon className='icon'/>
                </button>
                <CloseIcon className='reset' onClick={clearForm}/>
            </form>
            <div className="locations">
                {locations && 
                locations.map( location => (
                    <div className="location" onClick={searchLocation}>{location.place_name}</div>
                ))}
            </div>
        </div>
    )
}

export default SearchBar
