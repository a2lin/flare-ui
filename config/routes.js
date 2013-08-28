exports.routes = function (map) {
    map.resources('schedules');
    map.post('/query', 'schedules#searchSOLR');
    map.get('/query/subjcodes', 'schedules#getSubjCodes')

    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};