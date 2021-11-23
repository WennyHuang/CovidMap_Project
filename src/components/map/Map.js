import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import CountyCard from '../card/CountyCard';
import StateCard from '../card/StateCard';
import {  MapService } from '../../service/mapService';
import { MapUtils } from '../../utils/mapUtils';

const AnyReactComponent = ({ children }) => <div>{children}</div>;

class Map extends Component {
    //props 不一定叫 props 也可以识别
    //state 一定得叫states
  static defaultProps = {
    center: {
      lat: 38.9072,
      lng: -77.0369,
    },
    zoom: 12 //from 1 (whole earth) to 20
  };

  state = {
      boundary:{},
      zoomLevel:12,
      points:{}, //fetched covid data
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      // {} to call javascript
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{key:'xxxxxxxxxxxx'}} //key is removed for security
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
              // 1.call api to get data
              MapService.getUSCovidData()
                .then((response)=>{
                     // 2.data handling
                     // repsonse.data -> covid data
                     console.log('raw data',response.data);
                     const covidDataPoints = MapUtils.getCovidPoints(response.data);
                     //console.log('handled data',covidDataPoints);
                     this.setState({
                         points: covidDataPoints,
                     });
                })
                .catch(error =>console.log(error));
              // 3.set state to trigger updating
          }}
          onChange={(changeObject)=>{
              this.setState({
                  boundary: changeObject.bounds,
                  zoomLevel: changeObject.zoom,
              });
          }} //change event value
        >
            {this.renderPoints()} 
        </GoogleMapReact>
      </div>
    );
  }
  renderPoints() {
      //console.log(this.state.points);
      // pass zoomlevel to points
      const points = this.state.points[this.state.zoomLevel];
      //
      const result = [];
      if (!points){
          return result;
      }
      if (Array.isArray(points)) {// raw data -> county level data
        for (const county of points) {
            if (!MapUtils.isInBoundary(this.state.boundary, county.coordinates)){
                continue;
            }
            // render this county card
            result.push(
                <AnyReactComponent
                    lat = {county.coordinates.latitude} //string and true dont need {}
                    lng = {county.coordinates.longitude}
                    >
                        <CountyCard 
                        county={county.county} 
                        deaths={county.stats.deaths} 
                        confirmed={county.stats.confirmed} 
                        recovered={county.stats.recovered} />
                </AnyReactComponent>

            );
        };
      } else {
          if (points.type === 'states') {
              for (const nation in points) {
                  for (const state in points[nation]) {
                      if (!MapUtils.isInBoundary(this.state.boundary, points[nation][state].coordinates)){
                          continue;
                      }
                      result.push(
                        <AnyReactComponent
                        lat = {points[nation][state].coordinates.latitude} //string and true dont need {}
                        lng = {points[nation][state].coordinates.longitude}
                        >
                            <StateCard 
                            state = {state}
                            confirmed={points[nation][state].confirmed} 
                            deaths={points[nation][state].deaths} 
                            recovered={points[nation][state].recovered} />
                        </AnyReactComponent>

                      )
                  }
              }
          }
      }
      console.log(result);
      return result;

  }
}

export default Map;