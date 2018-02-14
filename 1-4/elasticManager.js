
function dropIndex(client) {
    return client.indices.delete({
        index: 'test',
    });
}

function createIndex(client, index) {
    console.log('create')
    return client.indices.create({
        index: index,
        mapping: {
            house: {
                name: {
                    type: 'string'
                }
            }
        }
    });
}

function addToIndex(client) {
    return client.index({
        index: 'test',
        type: 'house',
        id: '1',
        body: {
            name: 'huhu'
        }
    });
}

function search(client) {
    return client.search({
        index: 'test',
        q: 'huhu'
    }).then(log);
}

function getFromIndex(client) {
    return client.get({
        id: 1,
        index: 'test',
        type: 'house',
    }).then(log);

}


module.exports = {
    createIndex: createIndex,
    dropIndex: dropIndex,
    addToIndex: addToIndex,
    search: search,
    getFromIndex: getFromIndex,
};