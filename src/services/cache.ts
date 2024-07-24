import redisClient from "../config/redis.config"

const clearCache = async (hashKey: string): Promise<void> => {
    //Called when there are changes in data cached
    redisClient.del(JSON.stringify(hashKey))
    .then((data)=> {
    	console.log('clearCache data:', data)
        if(data){
            console.log(`${hashKey} was deleted successfully`)
        }
    })
    .catch(err => console.log(`error in deleting cache: `, err));
    
}

export {
    clearCache
}