export const MapUtils = {
    getCovidPoints: function(countyLevelPoints) {
        // sanity check
        if (!countyLevelPoints) {
            return {};
        }
        const states = {
            type: 'states',


        };
        const nations = {
            type: 'nations',
        };
        //aggregate data by state
        for (const point of countyLevelPoints) {
            //sanity check
            if (Number.isNaN(point.stats.confirmed)) {
                console.error('got dirty data', point);
                continue;
            }
            //ignore other sanity check
            //initialize country
            states[point.country] = states[point.country] || {}

            if (states[point.country][point.province] === undefined){
                states[point.country][point.province] = {
                    confirmed:0,
                    deaths:0,
                    recovered:0,
                }
            }
        
        if (states[point.country][point.province].coordinates === undefined) {
            states[point.country][point.province].coordinates = point.coordinates;
        }
        // sum up
        states[point.country][point.province].confirmed += point.stats.confirmed;
        states[point.country][point.province].deaths += point.stats.deaths;
        states[point.country][point.province].recovered += point.stats.recovered;
        }
        // zoom level
        // 1-4 nation level
        // 5-9 state level
        // 10-20 county level
        const result = {};
        let zoomLevel = 1;
        for (; zoomLevel <= 4;zoomLevel++){
            result[zoomLevel] = nations;
        }
        for (; zoomLevel <= 9;zoomLevel++){
            result[zoomLevel] = states;
        }
        for (; zoomLevel <= 20;zoomLevel++){
            result[zoomLevel] = countyLevelPoints;
        }
        return result;
    },
    isInBoundary: function (bounds, coordinates) {
        return coordinates && bounds && bounds.nw && bounds.se && ((coordinates.longitude >= bounds.nw.lng && coordinates.longitude <= bounds.se.lng) || (coordinates.longitude <= bounds.nw.lng && coordinates.longitude >= bounds.se.lng))
            && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat) || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat));
    },

};