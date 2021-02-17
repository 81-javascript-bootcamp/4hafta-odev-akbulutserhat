export const searchMovieByTitle = (movie, searchValue) => {
    return movie.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
}

export const makeBgActive = (movie) => {
    document.querySelector(`tr[data-id='${movie.id}']`).style.background = "#d7f0f7";
    document.querySelector(`tr[data-id='${movie.id}']`).style.boxShadow = "5px 5px 5px 5px gray";
}
