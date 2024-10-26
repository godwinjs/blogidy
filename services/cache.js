const mongoose = require('mongoose');
const redis = require('redis')

const exec = mongoose.Query.prototype.exec;

//redis
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl);

// client.isReady = boolean
(async () => {
    try {
        await client.connect()
    }catch (err) {
        console.log(err, "error connecting to redis")
    }
})()


mongoose.Query.prototype.exec = async function () {
    // if the query is not cached return the exec() function
    if (!this.useCache) {
        console.log('serving from mongoDB')
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify({ ...this.getQuery(), collection: this.mongooseCollection.name});
    // redis: get cached data that exist in the redisDB for this query [req.user.id]
    const cacheValue = await client.hGet(this.hashKey, key)

    // if cashed data exists, res to this req with the cached data
    if(cacheValue) {
      console.log('serving data for hash ' + this.hashKey+ ": " + key +' from redis cache')
      const mongoDocCache = JSON.parse(cacheValue);

    // if mongoDocCache is an array of mongo doc map over the array, create a mongo doc for it, and return.
    // else if it's a single object, create a mongo doc for it and return.
      return Array.isArray(mongoDocCache) ? mongoDocCache.map( doc => new this.model(doc)) : new this.model(mongoDocCache) ;
    }

    // if not, respond to the request with the data from mongoDB and update/cache the data for the query in redisDB
    const result = await exec.apply(this, arguments);
    client.hSet(this.hashKey, key, JSON.stringify(result), "EX", 10)
    console.log('servingd ata for hash ' + this.hashKey+ ": " + key +' from mongoDB')

    return result;
};

mongoose.Query.prototype.cache = function ( options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    //  to make sure that this function is chainable
    // i.e Blog.find({}).cache().limit(10)
    return this;
}

module.exports = {
    clearHash (hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}