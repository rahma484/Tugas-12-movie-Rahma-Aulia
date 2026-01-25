const cache = require('../config/node-cache')
const tmdb = require('../config/tmdb')
const createMovie = require('../models/movie-model')

const searchMovie = async(req,res)=>{
    const query = req.query.query
    if(!query){
        return res.status(500).json({msg:'Query is required!!'})
    }

    if(cache.has(query)){
        console.log(`Data Fetch from cache`);
        return res.status(200).json(cache.get(query))
    }

    try{
        const response = await tmdb.get('/search/movie', {
            params:{query}
        })
        const movieResult = response.data.results.map(createMovie)
        console.log(`Data Fetch from tmdb server`);
        cache.set(query,movieResult)
        return res.status(200).json(movieResult)
        
    }
    catch(error){
        console.log(error);
        
    }
}

const getPopularMovies = async (req, res) =>{
    const cacheKey = 'popular_movies';

    if (cache.has(cacheKey)) {
        console.log(`Data Popular Fetch From Cache`);
        return res.status(200).json(cache.get(cacheKey));
    }
    try{
        const response = await tmdb.get('/movie/popular');
        const movieResult = response.data.results.map(createMovie);

        console.log(`Data Popular Fetch From tmdb Server`);
        cache.set(cacheKey, movieResult);
        return res.status(200).json(movieResult);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ msg : 'gagal mengambil data populer'});
    }
}

module.exports = {searchMovie, getPopularMovies}