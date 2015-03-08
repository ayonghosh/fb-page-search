/*
* Author: Ayon Ghosh
* Date: 6 March 2015
*/

var app = app || {};


// main controller for the app
app.main = (function () {
    // Facebook Graph API access token (required for search)
    var GRAPH_ACCESS_TOKEN = "504345849637006|JnXuxPCSQVBTojMPbC6KtrEMZts";
    
    var self = this;
    
    // function to initialize the app
    function init() {
        self.searchBoxEl = document.getElementById("search");
        self.searchBtnEl = document.getElementById("search-btn");
        self.resultsTmpl = document.getElementById("result-list-tmpl");
        self.resultsListEl = document.getElementById("results-list");
        
        // read last saved ratings from local storage
        self.ratingMap = {};
        if (localStorage && typeof localStorage.getItem === "function") {
            self.ratingMap = localStorage.getItem("ratings");
            if (self.ratingMap) {
                self.ratingMap = JSON.parse(self.ratingMap);
            }
        }
        
        app.utils.attachEventListener(self.searchBtnEl, "click", search);
        app.utils.attachEventListener(self.resultsListEl, "click", getPageDetails);
    }
    
    // search all pages corresponding to a query term
    function search() {
        showLoading(self.resultsListEl);
        
        var searchConfig = {
            method: "GET", 
            url: "https://graph.facebook.com/search?q=" + self.searchBoxEl.value + "&type=page&access_token=" + GRAPH_ACCESS_TOKEN,
            success: showResults
        };
        app.utils.doAjax(searchConfig);
    }
    
    // displays list of collapsed results
    function showResults(xhr) {
        var json = JSON.parse(xhr.responseText);
        var results = json.data;
        
        for (var i = 0; i < results.length; i++) {
            var key = results[i].id;
            if (typeof key === "string") {
                key = +results[i].id;
            }
            
            if (key !== NaN && self.ratingMap) {
                results[i].rating = self.ratingMap[results[i].id] || 0;
            }
        }
        
        var html = app.utils.tmpl(document.getElementById("result-list-tmpl").innerHTML, {"results": results});
        self.resultsListEl.innerHTML = html;
    }
    
    // loads details of a result
    function getPageDetails(event) {
        var src = event.target;
        while (src && src.className !== "result") {
            src = src.parentNode;
        }
        var pageId = src ? src.getAttribute("data-id") : "";
        if (!pageId) {
            return;
        }
        var id = src.id;
        var detailsEl = document.getElementById(id).querySelector(".details");
        if (detailsEl.innerHTML.length > 0) {
            return;
        }
        
        if (pageId) {
            var config = {
                method: "GET", 
                url: "https://graph.facebook.com/" + pageId, 
                success: function (xhr) {
                    showPageDetails(xhr, detailsEl);
                }
            };
            app.utils.doAjax(config);
        }
    }
    
    // app-specific logic to be invoked when a star is clicked on a rating component
    function rate(targetEl, starVal) {
        var src = targetEl;
        while (src && src.className !== "result") {
            src = src.parentNode;
        }
        var pageId = src ? src.getAttribute("data-id") : "";
        if (!pageId) {
            return;
        }
        
        if (self.ratingMap === null) {
            self.ratingMap = {};
        }
        self.ratingMap[pageId] = starVal;

        if (localStorage && typeof localStorage.setItem === "function") {
            localStorage.setItem("ratings", JSON.stringify(self.ratingMap));
        }
    }
    
    // displays certain details of a search result
    function showPageDetails(xhr, detailsEl) {
        var json = JSON.parse(xhr.responseText);
        
        if (detailsEl) {
            detailsEl.innerHTML = app.utils.tmpl(document.getElementById("page-details").innerHTML, {"details": json});
            detailsEl.style.height = "400px";   // animate
        }
    }
    
    // shows a placeholder "Loading..." message while data is being fetched
    function showLoading(el) {
        el.innerHTML = "Loading...";
    }
    
    // expose public functions
    return {
        "init": init, 
        "rate": rate
    }
})();


// initialize the app
app.main.init();