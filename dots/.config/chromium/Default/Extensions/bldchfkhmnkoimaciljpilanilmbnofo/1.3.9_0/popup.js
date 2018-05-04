document.addEventListener('DOMContentLoaded', function () {
    var fadeEffect = function () {
        return {
            init: function (id, flag, target) {
                this.elem = document.getElementById(id);
                clearInterval(this.elem.si);
                this.target = target ? target : flag ? 100 : 0;
                this.flag = flag || -1;
                this.alpha = this.elem.style.opacity ? parseFloat(this.elem.style.opacity) * 100 : 0;
                this.elem.si = setInterval(function () {
                    fadeEffect.tween()
                }, 20);
            },
            tween: function () {
                if (this.alpha == this.target) {
                    clearInterval(this.elem.si);
                } else {
                    var value = Math.round(this.alpha + ((this.target - this.alpha) * .05)) + (1 * this.flag);
                    this.elem.style.opacity = value / 100;
                    this.elem.style.filter = 'alpha(opacity=' + value + ')';
                    this.alpha = value
                }
            }
        }
    }();

    //Set the onchange and onkeydown functions for the input fields
    inputs = document.getElementsByClassName('data_field');
    for (i = 0; i < inputs.length; i++) {
        inputs[i].onkeydown = inputs[i].onchange = function () {}
    }

    //Get the stored values
    var port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.postMessage({
        recover: 1
    });
    port.onMessage.addListener(function (msg) {
        if (typeof (msg['search']) !== 'undefined') {
            document.getElementById('search')
                .value = msg['search'];
        }
        if (typeof (msg['replace']) !== 'undefined') {
            document.getElementById('replace')
                .value = msg['replace'];
        }
        if (msg['case'] === "1") {
            document.getElementById('case').checked = true;
        }
        if (msg['type'] === "1") {
            document.getElementById('type').checked = true;
        }
        if (msg['regex'] === "1") {
            document.getElementById('regex').checked = true;
        }
    });
    document.querySelector('#next')
        .addEventListener('click', function () {
            clickHandler(0)
        });
    document.querySelector('#all')
        .addEventListener('click', function () {
            clickHandler(1)
        });
    document.getElementById('search')
        .addEventListener('keyup', function () {
            storeTerms(event)
        });
    document.getElementById('replace')
        .addEventListener('keyup', function () {
            storeTerms(event)
        });
    document.getElementById('search')
        .addEventListener('blur', function () {
            storeTerms(event)
        });
    document.getElementById('replace')
        .addEventListener('blur', function () {
            storeTerms(event)
        });
    document.getElementById('search')
        .addEventListener('change', function () {
            storeTerms(event)
        });
    document.getElementById('replace')
        .addEventListener('change', function () {
            storeTerms(event)
        });
    document.getElementById('case')
        .addEventListener('change', function () {
            storeTerms(event)
        });
    document.getElementById('type')
        .addEventListener('change', function () {
            storeTerms(event)
        });
    document.getElementById('regex')
        .addEventListener('change', function () {
            storeTerms(event)
        });
    document.getElementById('help')
        .addEventListener('click', openHelp);

});

function clickHandler(all) {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('content').style.display = "none";
    var s = document.getElementById('search')
        .value;
    var r = document.getElementById('replace')
        .value;
    var g = all ? 'g' : '';
    var c = document.getElementById('case')
        .checked ? g : g + 'i';
    var t = document.getElementById('type')
        .checked;
    var re = document.getElementById('regex')
        .checked;
    console.log(c);
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, {
            search: s,
            replace: r,
            matchcase: c,
            type: t,
            regex: re
        }, function (response) {
            document.getElementById('loader').style.display = "none";
            document.getElementById('content').style.display = "block";
        });
    });
};

function storeTerms(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        //if the user presses enter we want to trigger the search replace
        clickHandler();
    } else {
        var s = document.getElementById('search')
            .value;
        var r = document.getElementById('replace')
            .value;
        var c = document.getElementById('case')
            .checked ? 1 : 0;
        var t = document.getElementById('type')
            .checked ? 1 : 0;
        var re = document.getElementById('regex')
            .checked ? 1 : 0;
        var port = chrome.extension.connect({
            name: "Sample Communication"
        });
        port.postMessage({
            recover: 0,
            search: s,
            replace: r,
            'case': c,
            type: t,
            regex: re
        });
        port.onMessage.addListener(function (msg) {
            console.log("message received" + msg);
        });
    }
}

function openHelp() {
    chrome.tabs.create({
        url: "help.html"
    });
}