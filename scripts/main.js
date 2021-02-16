import data from "./data.js";
import {searchMovieByTitle, makeBgActive} from "./helpers.js";

class MoviesApp {
    constructor(options) {
        const {root, searchInput, searchForm, 
            yearHandler, yearSubmitter, yearBox, 
            genreHandler, genreSubmitter, genreBox} = options;
        this.$tableEl = document.getElementById(root);
        this.$tbodyEl = this.$tableEl.querySelector("tbody");

        this.$searchInput = document.getElementById(searchInput);
        this.$searchForm   = document.getElementById(searchForm);

        this.yearHandler = yearHandler;
        this.$yearSubmitter = document.getElementById(yearSubmitter);
        this.$yearBox = document.getElementById(yearBox);

        this.genreHandler = genreHandler;
        this.$genreSubmitter = document.getElementById(genreSubmitter);
        this.$genreBox = document.getElementById(genreBox);
    }

    createMovieEl(movie){
        const {image, title, genre, year,id} = movie;
        return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`
    }

    findYearCount(year) {
        return data.filter((movie) => movie.year == year).length;
    }

    findGenreCount(genre) {
        return data.filter((movie) => movie.genre == genre).length;
    }

    createDynamicButton(type,id,name,value,count) {
        return  `<div class="form-check">
            	    <input class="form-check-input" type="${type}" name="${name}" id="${name}${id}" value="${value}">
                    <label class="form-check-label" for="${name}${id}">
                        ${value} (${count})
                    </label>
                </div>`
    }

    createYearRadioButton(movie,index) {
        const {year,id} = movie;
        // tekrar edenleri tespit edip fonksiyondan hiç bir şey dönmeden çıkıldı.
        if(data.findIndex(movie => movie.year === year) !== index) return;
        const count = this.findYearCount(year);
        return this.createDynamicButton("radio",id,this.yearHandler,year,count);
    }

    createGenreCheckbox(movie,index) {
        const {genre,id} = movie;
        // tekrar edenleri tespit edip fonksiyondan hiç bir şey dönmeden çıkıldı.
        if(data.findIndex(movie => movie.genre === genre) !== index) return;
        const count = this.findGenreCount(genre);
        return this.createDynamicButton("checkbox",id,this.genreHandler,genre,count);
    }

    fillTable(){
        /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
        const moviesArr = data.map((movie) => {
           return this.createMovieEl(movie)
        }).join("");
        this.$tbodyEl.innerHTML = moviesArr;
    }

    fillYearBox() {
        const yearsHTML = data.reduce((acc,cur,index) => {
            // Tekrar edenler undefined olarak döndüğü için onları yazdırmama kontrolü
            if(!this.createYearRadioButton(cur,index)) return acc;
            return acc + this.createYearRadioButton(cur,index);
        },"");

        this.$yearBox.innerHTML = yearsHTML;
    }

    fillGenreBox() {
        const genresHTML = data.reduce((acc,cur,index) => {
            // Tekrar edenler undefined olarak döndüğü için onları yazdırmama kontrolü
            if(!this.createGenreCheckbox(cur,index)) return acc;
            return acc + this.createGenreCheckbox(cur,index);
        },"");

        this.$genreBox.innerHTML = genresHTML;
    }

    reset(){
        this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
            item.style.background = "transparent";
            item.style.boxShadow = "";
        })
    }

    resetCheckBoxes() {
        Array.from(document.querySelectorAll(`input[name='${this.genreHandler}']:checked`)).map(tag => tag.checked = false);
    }

    resetRadioButton() {
      document.querySelector(`input[name='${this.yearHandler}']:checked`).checked = false;
    }


    handleSearch(){
        this.$searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.reset();
            this.resetCheckBoxes();
            this.resetRadioButton();
            const searchValue = this.$searchInput.value;
            const matchedMovies = data.filter((movie) => {
                return searchMovieByTitle(movie, searchValue);
            }).forEach(makeBgActive)

            this.$searchInput.value = "";
        });
    }

    handleYearFilter(){
        this.$yearSubmitter.addEventListener("click", () => {
            this.reset();
            this.resetCheckBoxes();
            const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`).value;
            const matchedMovies = data.filter((movie) => {
                return movie.year === selectedYear;
            }).forEach(makeBgActive)
        });
    }

    handleGenreFilter() {
        this.$genreSubmitter.addEventListener("click",() => {
            this.reset();
            this.resetRadioButton();
            // Seçilen checkboxların değerleri çekilip arraye atıldı.
            const selectedGenres = Array.from(document.querySelectorAll(`input[name='${this.genreHandler}']:checked`))
                                    .map((tag) => tag.value);

            data.filter(movie => selectedGenres.some((genre) => genre == movie.genre)).forEach(makeBgActive)
        });
    }

    init(){
        this.fillTable();
        this.fillYearBox();
        this.fillGenreBox();
        this.handleSearch();
        this.handleYearFilter();
        this.handleGenreFilter();
    }
}

let myMoviesApp = new MoviesApp({
    root: "movies-table",
    searchInput: "searchInput",
    searchForm: "searchForm",
    yearHandler: "year",
    genreHandler: "genre",
    yearSubmitter: "yearSubmitter",
    yearBox: "yearBox",
    genreSubmitter : "genreSubmitter",
    genreBox: "genreBox"
});

myMoviesApp.init();
