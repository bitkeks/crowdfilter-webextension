/*
 * Show the icon (page_action) in the address bar.
 * Clicking on it shows a popup.
 */
function show_page_action() {
    // Enable popup for current tab
    browser.tabs.query({active: true, currentWindow: true})
        .then(function(tabs) {
            browser.pageAction.show(tabs[0].id);
        })
        .catch(onError);
}

/*
 * Inject an injector script into the page.
 */
function inject(injector) {
    browser.tabs.executeScript({
        file: "/js/injectors/" + injector + ".js"
    }).then(function(result) {
    }, onError);
}


function url_catcher(details) {
    fetchConfigFilters();
    // Check each filter
    let url = details.url;
    let regexp;
    for (const key of Object.keys(filters)) {
        regexp = new RegExp(filters[key], "i");
        console.log(url, regexp, url.match(regexp));
        if (url.match(regexp) != null) {
            show_page_action();
            inject(key);
            break;
        }
    };
}

// only in background scripts!
browser.webRequest.onCompleted.addListener(
    url_catcher,
    {  // Filter
        urls: [
            "https://github.com/*/*",
            "https://www.heise.de/forum/heise-online/News-Kommentare/*"
        ]
    }
);