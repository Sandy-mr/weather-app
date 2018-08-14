import React, { Component } from 'react';
import './App.css';
import request from 'superagent';

class App extends Component {
  constructor(){
    super();
    this.state = {
      checked: false,
      city: {},
      cities: [{
        id: 1,
        name: 'France'
      },{
        id:2,
        name: 'Canada'
      }]
    }
  }

  addPlace = (event) => {
    event.preventDefault();
    this.setState({
      checked: true
    })
  }

  boxLocation = (event) => {
    event.preventDefault();
    var country = this.refs.location.value;
    console.log(country)
    if (country !== '' ) {
      var addPlace = this.state;
      console.log(this.state.cities.length)
      addPlace.city = {
        id: this.state.cities.length + 1,
        name: country
      };
      this.setState(addPlace);
      addPlace.cities.unshift(addPlace.city);
      this.setState(addPlace);
    }
  }

  getWeather = (event) => {
    event.preventDefault();
    var country = event.target.textContent;
    const API_KEY = 'https://maps.googleapis.com/maps/api/geocode/json?address='+country;
    console.log(API_KEY)
    function getForeCast() {
      return request
              .get(API_KEY);
    }

    function getLocation(response) {
      let countryData = response.body.results;
      countryData.forEach(function(data){
        var location = data.geometry.location;
        DarkApi(location);
      })
    }
    getForeCast()
      .then(getLocation)
   }
   
  render() {
    let cities = this.state.cities;
    return (
      <div className='app'>
        <header className='app__header'>
          <button className='app__add' onClick={ this.addPlace }>
            <i className="fa fa-plus-circle"></i>
            New city
          </button>
        </header>
        <div className='grid'>
          <aside className='app__aside'>
            <h1 className='app__title'>All countries</h1>
            {cities.map((city) => {
              return <a href='#' onClick={ this.getWeather } className='app__country'>{ city.name }</a>
            })}
            { this.state.checked &&
              <form onSubmit={ this.boxLocation }>
                <input autoFocus type='text' ref="location" placeholder='Location' className='app__input' />
              </form>
            }
          </aside>
          <section className='app__view'></section>
        </div>
      </div>
    );
  }
}
var DarkApi = location => {
   console.log(location);
   const KEY = '700bf35b241f390062f821a55cc27f78'
   const API_KEY = 'https://api.darksky.net/forecast/'+KEY+'/'+location.lat+","+location.lng;
   request
      .get(API_KEY)
      .then(function (response) {
        document.querySelector(".app__view").textContent = response.body.currently.summary;
      });
}
export default App;
