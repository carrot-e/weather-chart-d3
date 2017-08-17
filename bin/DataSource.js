const axios = require('axios');
const _ = require('lodash');

class DataSource {
    get() {
        // return axios.get('http://api.wunderground.com/api/ed044d75b91fb500/hourly10day/q/CA/Kiev.json')
        return axios.get('http://api.wunderground.com/api/ed044d75b91fb500/hourly/q/CA/Kiev.json')
            .then(data => {
                return _.map(data.data.hourly_forecast,
                    d => {
                        return {
                            temp: _.parseInt(_.get(d, 'temp.metric')),
                            time: new Date(_.get(d, 'FCTTIME.epoch') * 1000)
                        };
                    }
                );
            });
    }
}

module.exports = DataSource;