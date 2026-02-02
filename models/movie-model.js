const createMovie = (movie)=>{
    return{
        title : movie.title,
        overview : movie.overview,
        background : movie.backdrop_path
    }
}

module.exports = createMovie