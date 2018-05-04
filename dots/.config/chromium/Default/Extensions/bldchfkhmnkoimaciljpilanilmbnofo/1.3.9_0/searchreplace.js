function RegExEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function isWordpress() {
    if (typeof (jQuery) !== 'undefined') {
        if (jQuery('body').attr('class').match('wp-admin').length) {
            return true;
        }
    }
    return false;
}

function Replace(inputs, search, replace, matchcase) {
    for (i = 0; i < inputs.length; i++) {
        inputs[i].value = inputs[i].value.replace(new RegExp(search, matchcase), replace);
        inputs[i].focus();
        inputs[i].blur();
    }
}

function ReplaceWP(inputs, search, replace, matchcase) {
    for (i = 0; i < inputs.length; i++) {
        inputs[i].innerHTML = inputs[i].innerHTML.replace(new RegExp(search, matchcase), replace);
    }
}

function ReplaceGmail(search, replace, matchcase) {
    document.querySelectorAll('div[aria-label="Message Body"]')[0].innerText = document.querySelectorAll('div[aria-label="Message Body"]')[0].innerText.replace(new RegExp(search, matchcase), replace);
    document.querySelectorAll('input[name="subjectbox"]')[0].value = document.querySelectorAll('input[name="subjectbox"]')[0].value.replace(new RegExp(search, matchcase), replace);
}

function ReplaceStandard(search, replace, matchcase, type, regex) {
    console.log(matchcase);
    var iframes = document.querySelectorAll('iframe');
    if (type) {
        var allInputs = document.getElementsByTagName('input');
        if (allInputs.length > 0) {
            Replace(allInputs, search, replace, matchcase);
        }

        var textAreas = document.getElementsByTagName('textarea');
        if (textAreas.length > 0) {
            Replace(textAreas, search, replace, matchcase);
        }
        if (iframes.length) {
            for (i = 0; i < iframes.length; i++) {
                if (iframes[0].src.match('^http://' + window.location.host) || !iframes[0].src.match('^https?')) {
                    iframeInputs = iframes[0].contentDocument.documentElement.getElementsByTagName('input');
                    if (iframeInputs.length > 0) {
                        Replace(iframeInputs, search, replace, matchcase);
                    }
                    iframeTextAreas = iframes[0].contentDocument.documentElement.getElementsByTagName('textarea');
                    if (iframeTextAreas.length > 0) {
                        Replace(iframeTextAreas, search, replace, matchcase);
                    }
                }
            }
        }
    } else {
        var body = document.getElementsByTagName('body')[0];
        if (iframes.length) {
            for (i = 0; i < iframes.length; i++) {
                if (iframes[0].src.match('^http://' + window.location.host) || !iframes[0].src.match('^https?')) {
                    content = iframes[0].contentDocument.documentElement.innerHTML;
                    iframes[0].contentDocument.documentElement.innerHTML = content.replace(new RegExp(search, matchcase), replace);
                }
            }
            var allElements = document.getElementsByTagName('*');
            for (var i = 0; i < allElements.length; i++) {
                if (!allElements[i].tagName.match('/HEAD|SCRIPT|BODY|STYLE|IFRAME/')) {
                    if (!allElements[i].innerHTML.match('<iframe([\s\S]*|.*)</iframe>')) {

                        var searchStr = allElements[i].innerHTML;
                        var resultStr = searchStr.replace(new RegExp(search, matchcase), replace);
                        allElements[i].innerHTML = resultStr;
                        
                        //Replace Next should only match once
                        if (matchcase === 'i' && searchStr !== resultStr) {
                            return;
                        }
                    }
                }
            }
        } else {
            body.innerHTML = body.innerHTML.replace(new RegExp(search, matchcase), replace);
        }
    }

}


function tinyMCEPostEdit(search, replace, matchcase) {
    if (typeof (jQuery) !== 'undefined') {
        try {
            var mceIframe = jQuery('.mce-edit-area').children('iframe')[0];
            var mceIframeBody = mceIframe.contentDocument.documentElement.getElementsByTagName('body')[0];
            var replaceArr = [];
            replaceArr.push(mceIframeBody);;
            ReplaceWP(replaceArr, search, replace, matchcase);
            mceIframeBody.focus();
        } catch (err) {
            console.log(err);
        }
    } else {
        alert('JQuery not found. Cannot replace text');
    }
}

function SearchReplace(search, replace, matchcase, type, regex) {

    var search = !regex ? RegExEscape(search) : search;
    if (typeof (jQuery) !== 'undefined' && window.location.href.indexOf('wordpress') > -1) {
        if (jQuery('.mce-tinymce').length) {
            tinyMCEPostEdit(search, replace, matchcase);
        } else {
            ReplaceStandard(search, replace, matchcase, type, regex);
        }
    } else if (window.location.href.indexOf('mail.google.com') > -1) {
        if (window.location.hash.indexOf('compose') > -1 || window.location.hash.indexOf('#drafts') > -1 || window.location.hash.indexOf('#inbox') > -1) {
            ReplaceGmail(search, replace, matchcase);
        }
    } else {
        ReplaceStandard(search, replace, matchcase, type, regex);
    }
}

chrome.extension.onRequest.addListener(

    function (request, sender, sendResponse) {
        if (request.recover) {
            search = sessionStorage.getItem('search');
            replace = sessionStorage.getItem('replace');
            sendResponse({
                s: search,
                r: replace
            });
        } else if (request.store) {
            sessionStorage.setItem('search', request.search);
            sessionStorage.setItem('replace', request.replace);
        } else if (request.search) {
            sessionStorage.setItem('search', request.search);
            sessionStorage.setItem('replace', request.replace);
            SearchReplace(request.search, request.replace, request.matchcase, request.type, request.regex);
            sendResponse({
                response: 'done'
            });
        }
    });