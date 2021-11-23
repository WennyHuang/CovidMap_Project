import axios from 'axios';

export const MapService = {
    getUSCovidData: () =>{
        return axios.get('https://disease.sh/v3/covid-19/jhucsse/counties');
    },
};

