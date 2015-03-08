/*
* Author: Ayon Ghosh
* Date: 6 March 2015
*/

var app = app || {};

// pluggable UI components
app.components = {
    // star rating component
    "starRating": {
        "onClick": function (event, callback) {
            event.stopPropagation();
        
            var src = event.target;
            var starVal = +src.getAttribute("data-val");
            
            var starEl = src.parentNode;
            if (starEl.tagName !== "UL") {  // if clicked outside the stars
                starEl = starEl.querySelector("ul");
            }
            
            if (starEl) {
                // update UI of the component
                var starEls = starEl.querySelectorAll("li");
                for (var i = 0; i < starEls.length; i++) {
                    starEls[i].className = (i < starVal) ? "active" : "";
                }
            }
            
            // invoke callback
            if (starVal !== NaN) {
                callback(src, starVal);
            }
        }
    }
};
