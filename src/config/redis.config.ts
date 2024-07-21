import Redis from 'ioredis'
import { Query } from 'mongoose';
import util from 'util';
import { ICacheParams } from '../interfaces/utils.interface';


const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

// redisClient.get = util.promisify(redisClient.get)
redisClient.hget = util.promisify(redisClient.hget)

//Take a copy of original exec()
const exec = Query.prototype.exec;

//Create a function cache to ensure that only the query data I chose is cached.
Query.prototype.cache = function (options: ICacheParams = {} ): Query<any, any> {
    this.useCache = true;
    this.hashKey = typeof options.hashKey != "string" ? JSON.stringify(options.hashKey || '') : options.hashKey
    this.key = typeof options.key != "string" ? JSON.stringify(options.key || '') : options.key
    return this;
}
//Cache data when Any exec query happens
Query.prototype.exec = async function() {
    //If not chose cache find().cache() return the original implementation of exec
    if(!this.useCache){
        return exec.apply(this,arguments);
    }

    //Replace callack redisClient.get(()=>{}) with util.promisify
    redisClient.hget = util.promisify(redisClient.hget)
    //Make key unique { _id: '123', collection: "users"} { userId: '123', collection: "posts"} for each model it has a userId
    const key = this.key
    
    // const cachedData = await redisClient.get(key);
    //See if we have a value for key in redis
    // userId: 123 ==> {{ _id: '123', collection: "users"}, { userId: '123', collection: "posts"}}
    //To clear specific user posts not all cached Data
    // "hashKey" ==> userId && "key" ==> {{ _id: '123', collection: "users"}, { userId: '123', collection: "posts"}}

    const cachedData = await redisClient.hget(this.hashKey,key);
    
    if (cachedData) {
        //JSON.parse(cachedData) ==> plain object not mongoose document  
        //Query.prototype.exec expects to return document not plain object, to convert it to document use new this.model to new instance 
        const doc =  JSON.parse(cachedData);
        return Array.isArray(doc) 
                ? doc.map((document)=> new this.model(document))
                : new this.model(doc)
    }
    const result = await exec.apply(this);
    redisClient.hset(this.hashKey, key, JSON.stringify(result),'EX',+process.env.REDIS_CACHE_EXP_TIME);
    // redisClient.set(key, JSON.stringify(result),'EX',+process.env.REDIS_CACHE_EXP_TIME);
    return result;
};


export default redisClient;