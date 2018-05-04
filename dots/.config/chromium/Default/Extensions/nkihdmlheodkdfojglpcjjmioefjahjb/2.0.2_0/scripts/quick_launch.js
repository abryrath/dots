var quickLaunch = (function() {
  var quickLaunchWrapper = $('#quickLaunchWrapper');
  var browserList = $('#browserOSListing');
  var dragAddDelete = browserList.find(".drag-add, .drag-delete, .ql-link");
  var emptyQuickLaunch = quickLaunchWrapper.find('.empty-quick-launch');
  var getDeletedElm;
  var localWarning = false;
  var desktopBrowserOrder = ['ie', 'edge', 'safari','chrome', 'firefox', 'opera', 'yandex'];
  var mobileOsOrder = [['realdroid', 'android'], ['realios', 'ios'], ['winphone']];

  return {
    init : init,
    filterRequiredBrowserVersionToSelect: filterRequiredBrowserVersionToSelect,
    appendQuickLaunch: appendQuickLaunch,
    formattedOsAndBrowser: formattedOsAndBrowser,
    localWarning: localWarning
  };

  function init() {
    uiBindings();
  }

  function uiBindings() {
    appendQuickLaunch();
    maxQuickLaunchLimitReached();
    startSession();
    dragControls();
    checkQuickLaunchItems();
  }

  function maxQuickLaunchLimitReached() {
    if(quickLaunchWrapper.find('.ql-item').length === 12) {
      $('.drag-add').addClass('ql-full').find('p').text('Quick Launch is full');
    } else {
      $('.drag-add').removeClass('ql-full').find('p').text('Drag to add to Quick Launch');
    }
  }

  function startSession() {
    quickLaunchWrapper.on('click', '.ql-browser-link', function(e) {
      e.preventDefault();
      if(!$(this).parent().hasClass('disabled')) {
        quickLaunchWrapper.find('li').removeClass('sel');
        $(this).parent().addClass('sel');
        BrowserList.validateAndStartSession($(this));
      }
    });
  }

  function dragControls() {
    browserList.on("mouseover", function() {
      $('#browser-list .item:not(.mob-vendor, .disabled), #quickLaunchWrapper .ql-item').draggable({
        revert: true,
        helper: "clone",
        start: dragStart,
        stop: dragStop
      });

      dragAddDelete.droppable({
        drop: dragDropped,
        hoverClass: "active-drop"
      });
    });
  }

  function dragStart() {
    if(quickLaunchWrapper.find('.ql-item').length === 12) {
      $('.drag-add').addClass('threshold-reached');
      data = { os: $(this).data('os'), browser: $(this).data('browser'), browser_version: $(this).data('browser-version'), device: $(this).data('device') };
      $('.drag-add').find('p').text(Messages.qsBrowsersMaxLimitReached);
      $.post('/quick_start_browsers/log_max_limit_reached', data, function() {});
    } else {
      $('.drag-add').addClass('active-drag');
    }
  }

  function dragStop() {
    $('.drag-add').removeClass('active-drag').removeClass('threshold-reached');

    maxQuickLaunchLimitReached();
  }

  function validateDropFromBrowserListing($element) {

    if(quickLaunchWrapper.find('.ql-item').length === 12) {
      return false;
    }

    var formattedEle = { 'os': $element.data('os'), 'browser': $element.data('browser'), 'browser_version': $element.data('browser-version'), 'device': $element.data('device') };
    if($element.attr('data-browser-version')) {
      formattedEle.version_name = getBrowserVersionFromBrowserListElement($element);
    }

    validatorObj = new QuickLaunchValidator(formattedEle);
    validatorObj.validate();

    if (!validatorObj.isValid) {
      errorCallback({ 'responseText': JSON.stringify({ 'errors': validatorObj.errors }) });
      return false;
    }

    return true;
  }

  function dragDropped(event, ui) {
    var $element = ui.draggable,
        abortDrop = false;
    getDeletedElm = $element;
    getDeletedElmIndex = $element.index();

    //Initial validations on drop of element from browser-listing
    if ($('#quickLaunchWrapper:visible').length === 0 && !validateDropFromBrowserListing($element)) {
      abortDrop = true;

    // Dragging an element from quickLaunchWrapper to QuickLaunch menu item in OS List
    } else if($element.parents('#quickLaunchWrapper').length > 0 && $(event.target).hasClass('ql-link')) {
      abortDrop = true;
    }

    //quickfix for user deleting default elements too fast.
    if ($('#quickLaunchWrapper:visible').length > 0 && quickLaunchWrapper.find('.ql-item').length === 10 && !BrowserStack.quick_start_edited) {
      abortDrop = true;
    }

    if (abortDrop) {
      $element.draggable({
        revert: true
      });
      return;
    } else {
      $element.draggable({
        revert: false
      });
    }

    if($element.parents('#quickLaunchWrapper').length > 0) {
      //remove the damn browser
      removeFromQuickLaunch($element);
    } else {
      //add the damn browser
      addToQuickLaunch($element);
    }
  }

  function addToQuickLaunch($element) {
    var data = {
      os: $element.attr('data-os'),
      browser: $element.attr('data-browser').toLowerCase()
    };

    if($.inArray(data.browser, ['mobile', 'tablet']) > -1 ) {
      data.device = $element.attr('data-device');
    } else {
      data.browser_version = getBrowserVersionFromBrowserListElement($element);
    }

    Messages.showMessage('qsBrowserAddSuccess', 'success', formattedOsAndBrowser(data), 2000);
    $.ajax({
      url: '/quick_start_browsers',
      type: 'post',
      dataType: 'json',
      data: {
        quick_start_browser: data
      },
      success: createSuccessCallback,
      error: errorCallback
    });
  }

  function removeFromQuickLaunch($element) {
    $element.remove();
    $('#quickLaunchWrapper ul').append('<li />'); //adding temporary li till we get a response

    var $anchor = $element.find('a');
    var browserIndex = $anchor.attr('data-id') !== '' ? $anchor.attr('data-id') : getDeletedElmIndex;

    Messages.showMessage('qsBrowserRemoveSuccess', 'success', quickLaunch.formattedOsAndBrowser(convertQuickLaunchElementToObject($element.find('a'))), 2000);
    //quick fix for instantly showing empty thing.
    if(quickLaunchWrapper.find('.quick-launch-items li:not(:empty)').length == 1 ) {
      emptyQuickLaunch.removeClass('hide').addClass('show');
      $('.drag-delete').addClass('hide');
      $('#browserOSListing').find('.sel').removeClass('sel');
      $('#os-list').find('.ql-link').addClass('sel');
      quickLaunchWrapper.find('li').remove();
    }
    $.ajax({
      url: '/quick_start_browsers/' + browserIndex,
      type: 'delete',
      dataType: 'json',
      success: deleteSuccessCallback,
      error: errorCallback
    });
  }

  function convertQuickLaunchElementToObject($element) {
    var formattedEle = { 'os': $element.data('os'), 'browser': $element.data('browser'), 'browser_version': $element.data('browser-version'), 'device': $element.data('device') };

    if(!formattedEle.device && formattedEle.browser_version && formattedEle.browser_version.toString().match(/aurora|dev|beta/i)) {
      var browser_version_array = formattedEle.browser_version.split(' ');
      formattedEle.version_name = browser_version_array[browser_version_array.length - 1];
    }

    return formattedEle;
  }

  function checkQuickLaunchItems() {
    //if 0 than show no items view for quick launch
    if(quickLaunchWrapper.find('.quick-launch-items li:not(:empty)').length > 0) {
      emptyQuickLaunch.removeClass('show').addClass('hide');
      $('.drag-delete').removeClass('hide');
    } else {
      quickLaunchWrapper.find('li').remove();
      emptyQuickLaunch.removeClass('hide').addClass('show');
      $('.drag-delete').addClass('hide');
      $('#browserOSListing').find('.sel').removeClass('sel');
      $('#os-list').find('.ql-link').addClass('sel');
    }
  }

  // Works only for html elements of browser-list.
  function getBrowserVersionFromBrowserListElement(browserListElement) {
    var version;
    var isMetro = browserListElement.attr('data-browser-version').indexOf('Metro') > -1;
    if(browserListElement.attr('data-named-version') && !isMetro) {
      var named_version_array = browserListElement.attr('data-named-version').split('_');
      version = named_version_array[named_version_array.length - 1];
    }
    else if (isMetro) {
      version = browserListElement.attr('data-browser-version');
    }
    else {
      var browser_version_array = browserListElement.attr('data-browser-version').split(' ');
      version = browser_version_array[0];
    }
    return version;
  }

  function getVersionToDisplay(qsBrowser) {
    //ios hack. dont hate me.
    //if( BrowserStack.user.show_real_ios && (qsBrowser.os === 'ios' || qsBrowser.os === 'realios') && parseFloat(qsBrowser.device.split('-')[1]) > 8) {
    //  return '8';
    //}
    return (qsBrowser.device.split('-')[1] % 1 === 0) ? ~~qsBrowser.device.split('-')[1] : qsBrowser.device.split('-')[1];
  }

  function toggleRealAndEmulator(params) {
    if(params) {
      var targetOs = params.os;
      switch(params.os.toLowerCase()) {
        case 'android': targetOs = 'realdroid'; break;
        case 'realdroid': targetOs = 'android'; break;
        case 'ios': targetOs = 'realios'; break;
        case 'realios': targetOs = 'ios'; break;
      }
      if(BrowserStack.browserVersion[targetOs] && BrowserStack.browserVersion[targetOs][params.browser.toLowerCase()] && $.inArray(params.device, BrowserStack.browserVersion[targetOs][params.browser.toLowerCase()]) >= 0) {
        params.os = targetOs;
      }
    }
  }

  function appendQuickLaunch() {
    BrowserStack.quick_start = sortQuickStartBrowsers(BrowserStack.quick_start);
    quickLaunchWrapper.find('li').remove();
    var quickLaunchElms = 12; //max items for quick launch
    var cacheObject = BrowserStack.quick_start;
    quickLaunch.localWarning = false;

    for(var i = 0; i < quickLaunchElms; i++) {
      var qlDisabled = false;
      var tooltipMessage = '';
      var getVerNo, getVerName, element,
          qsBrowser = cacheObject[i],
          appendParagraph,
          nameAndVersion;

      if(typeof qsBrowser !== 'undefined') {
        toggleRealAndEmulator(qsBrowser);
        var paramHash = {
          'tabindex' : '-1',
          'href' : '#',
          'data-id' : (qsBrowser.id !== null ? qsBrowser.id : ''),
          'data-os' : qsBrowser.os,
          'data-browser' : capitalizeBrowser(qsBrowser.browser),
          'data-browser-version' : ((!qsBrowser.device && (!qsBrowser.version_name) || (qsBrowser.version_name && qsBrowser.version_name === 'latest')) ? qsBrowser.browser_version : (!qsBrowser.device && qsBrowser.version_name && qsBrowser.version_name !== 'latest') ? qsBrowser.browser_version + ' ' + qsBrowser.version_name : qsBrowser.device.split('-')[1]),
          'data-start-element' : 'quick_launch',
          'class' : 'ql-browser-link'
        };

        if(!qsBrowser.device) {
          getVerNo = (qsBrowser.browser_version % 1 === 0) ? ~~qsBrowser.browser_version : qsBrowser.browser_version;
          getVerName = (qsBrowser.version_name && qsBrowser.version_name !== null) ? '<br><span' + ((qsBrowser.version_name === 'latest') ? ' class="ql-latest"' : '') + '>' + capitalizeBrowser(qsBrowser.version_name) + '</span>' : '';
          if (!getVerNo) {
            getVerNo = '';
          }
          else if(String(getVerNo).indexOf('Metro') > -1) {
            //handle metro case.
            var verNoArray = getVerNo.split(' ');
            getVerNo = ~~verNoArray[0];
            getVerName = '<br><span>' + verNoArray[1] + '</span>';
          }
        } else {
          var noLocal = false,
              getDevice = qsBrowser.device,
              getDeviceName = (qsBrowser.os === 'android' || qsBrowser.os === 'realdroid') ? qsBrowser.device.split('-')[0].substr(qsBrowser.device.split('-')[0].indexOf(' ')+1) : getDevice.split('-')[0];

          getVerNo = getVersionToDisplay(qsBrowser);
          getVerName = (qsBrowser.version_name && qsBrowser.version_name !== null) ? '<br><span>' + capitalizeBrowser(qsBrowser.version_name) + '</span>' : '';

          if(qsBrowser.os == 'android') {
            BrowserStack.emulatorLocalNotSupported.forEach(function(no_local_device) {
              if(qsBrowser.device.indexOf(no_local_device) > -1) {
                noLocal = true;
                quickLaunch.localWarning = true;
              }
            });
          }

          var mobileParams = {
            'data-device-name' : getDeviceName,
            'data-device' : getDevice
          };
        }

        if(!BrowserStack.quick_start[i].device) {
          // Always show the OS Name regardless of whether there
          // is another browser with the same version.
          appendParagraph = Constants.platformNames[qsBrowser.os];
        } else {
          appendParagraph = getDeviceName + (noLocal ? ' *' : '');
        }

        disabledFreeTrial = false;
        if(BrowserStack.user.freeUser && BrowserStack.user.freeUserWithLimitedAccess) {
          if(checkIfDisabledForFreeTrial(qsBrowser.os, qsBrowser.browser, qsBrowser.browser_version, qsBrowser.device, qsBrowser.version_name)){
            disabledFreeTrial = true;
            if (qsBrowser.browser === 'mobile' || qsBrowser.browser === 'tablet'){
              browser_desc = CommonBrowserListBindings.getDisabledDeviceInfo(qsBrowser.os, qsBrowser.device);
            } else {
              browser_desc = CommonBrowserListBindings.getDisabledBrowserInfo(qsBrowser.browser, qsBrowser.browser_version, qsBrowser.os);
            }
          }
        }

        element = $('<li/>', {'class': 'ql-item'}).append(
          $('<a/>', (!qsBrowser.device) ? paramHash : $.extend({}, paramHash, mobileParams)).append(
            $('<div/>').append(
              $('<i></i><p class="ql-os-browser"><span>' + ( getVerName.toLowerCase().match(/techpreview/) ? "TP </span>" : (getVerNo + '</span>' + getVerName)) + '</p><p class="ql-small-txt">' + appendParagraph + '</p>')
            )
          )
        );
        if(!getVerNo) {
          qlDisabled = true;
          tooltipMessage = Messages.getParsedMessage(Messages.browserVersionNotAvailable, {browserVersion: capitalizeBrowser(qsBrowser.version_name), browser: capitalizeBrowser(qsBrowser.browser)});
        }
        else if(['android', 'realdroid', 'realios', 'ios', 'winphone'].indexOf(qsBrowser.os) > -1 && $('.disable-overlay-mobile').length > 0) {
          tooltipMessage = Messages.getParsedMessage(Messages.notAvailableOnLitePlan, {device: qsBrowser.device.split('-')[0], os: (Constants.platformNames[qsBrowser.os] + ' ' + qsBrowser.device.split('-')[1])});
        }
        else if ((qsBrowser.os === 'realdroid' || qsBrowser.os === 'realios') && !BrowserStack.user.show_real_mobile) {
          tooltipMessage = Messages.realDevicesNotAvailable;
        }
        else if (disabledFreeTrial) {
          tooltipMessage = Messages.getParsedMessage(Messages.limitedAccessFreeTrialToolTip, {browserDesc: browser_desc});
        }
        if(tooltipMessage !== '') {
          element.addClass('disabled').attr({
            'data-hover': 'tooltip',
            'data-tooltip': tooltipMessage
          }).lightTooltip();
        }
        $('.quick-launch-items ul').append(element);
      } else {
        $('.quick-launch-items ul').append('<li></li>');
      }
    }
    $( "a[data-browser-version*='techpreview']" ).find('.ql-os-browser').html("<span>TP</span>");
    checkQuickLaunchItems();
  }

  function checkIfDisabledForFreeTrial(os, browser, browser_version, device, version_name) {
    if (browser === 'mobile' || browser === 'tablet') {
      var enabled_device_for_free_users = (os in BrowserStack.limitedFreeTrialMobileDevice) && ($.inArray(device, BrowserStack.limitedFreeTrialMobileDevice[os]) !== -1);
      return !enabled_device_for_free_users;
    } else {
      var browser_name = browser.toLowerCase();
      if(version_name !== 'undefined' && (version_name === 'beta' || version_name === 'dev' || version_name === 'aurora') )
        browser_version = browser_version + " " + version_name;
      var enabled_browser_for_free_users = (os in BrowserStack.limitedFreeTrialBrowserVersion) && (browser_name in BrowserStack.limitedFreeTrialBrowserVersion[os]) &&  ($.inArray(browser_version, BrowserStack.limitedFreeTrialBrowserVersion[os][browser_name]) !== -1);
      return !enabled_browser_for_free_users;
    }
  }

  function deleteSuccessCallback(response) {
    BrowserStack.quick_start = response.data;
    if(!BrowserStack.quick_start_edited) {
      BrowserStack.quick_start_edited = true;
      appendQuickLaunch();
    }
    commonSuccessCallback(response);
  }

  function createSuccessCallback(response) {
    BrowserStack.quick_start = response.data;
    appendQuickLaunch();
    BrowserStack.quick_start_edited = true;
    commonSuccessCallback(response);
  }

  function commonSuccessCallback(response) {
    // Messages.showMessage(response.message, 'success', null, 2000);
    maxQuickLaunchLimitReached();
    if($('#quickLaunchWrapper:visible').length > 0) {
      KeyboardNav.calculations();
      KeyboardNav.quickLaunchOnDelete(getDeletedElm, getDeletedElmIndex);

      if(quickLaunchWrapper.find('.quick-launch-items li:not(:empty)').length <= 0) {
        $('#browserOSListing').find('.sel').removeClass('sel');
        $('#os-list').find('.selos').addClass('sel');
      }
    }
    //bust extension cache
    if (browserExtension.type == 'firefox') {
      browserExtension.sendMessage({type: "bustUICache"});
    } else if(browserExtension.type == 'chrome') {
      Common.burstExtensionPopupCache();
    }
  }

  function errorCallback(response) {

    var status = response.status;
    var response = JSON.parse(response.responseText);
    appendQuickLaunch();
    maxQuickLaunchLimitReached();

    if (status && status == 401) {
      window.location.reload();
    } else if(typeof(response.errors) !== 'undefined') {
      $.each(response.errors, function(err, err_text) {
        Messages.showMessage(err_text, 'error');
        return false;
      });
    } else {
      Messages.showMessage('Error! Something went wrong.', 'error');
    }
  }

  function filterRequiredBrowserVersionToSelect(browserVersion, os) {
    var filterAttribute = CommonBrowserListBindings.getDeviceType(os) == 'mobile' ? 'device' : 'browser-version';

    return quickLaunchWrapper.find('a').filter(function(idx) {
      var filterAttributeValue = $(this).data(filterAttribute);
      return (typeof(filterAttributeValue) != 'undefined' && filterAttributeValue.toString().toLowerCase() == browserVersion.toLowerCase() && $(this).data('os') == os);
    });
  }

  function capitalizeBrowser(string) {
    //fail safe
    if(typeof string === 'undefined') {
      return '';
    }
    return string.length == 2 ? string.toUpperCase() : string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function sortQuickStartBrowsers(browsers) {
    var sortedBrowsers = [],
        mobileBrowsers = [],
        desktopBrowsers = [];

    $.each(browsers, function(idx, ele) {
      if (['mobile', 'tablet'].indexOf(ele.browser) >= 0)
        mobileBrowsers.push(ele);
      else
        desktopBrowsers.push(ele);
    });

    return $.merge(sortMobileQuickStartBrowsers(mobileBrowsers), sortDesktopQuickStartBrowsers(desktopBrowsers));
  }

  function sortMobileQuickStartBrowsers(mobileBrowsers) {
    var sortedMobileBrowsers = [];

    $.each(mobileOsOrder, function(idx, osArray) {
      var currentPriorityBrowsers = mobileBrowsers.filter(function(ele, idx) {
        return osArray.indexOf(ele.os.toLowerCase()) >= 0;
      });

      $.merge(sortedMobileBrowsers, currentPriorityBrowsers.sort(function(x, y) { return parseFloat(y.device.split('-')[1]) - parseFloat(x.device.split('-')[1]) }));
    });

    return sortedMobileBrowsers;
  }

  function sortDesktopQuickStartBrowsers(desktopBrowsers) {
    var sortedDesktopBrowsers = [];

    $.each(desktopBrowserOrder, function(idx, browserName) {
      var currentPriorityBrowsers = desktopBrowsers.filter(function(ele, idx) {
        return ele.browser.toLowerCase() == browserName.toLowerCase();
      });

      $.merge(sortedDesktopBrowsers, currentPriorityBrowsers.sort(function(x, y) { return parseFloat(y.browser_version) - parseFloat(x.browser_version) }));
    });
    return sortedDesktopBrowsers;
  }

  function formattedOsAndBrowser(qlItem) {
    if (['mobile', 'tablet'].indexOf(qlItem.browser.toLowerCase()) >= 0) {
      var deviceNameArray = qlItem.device.split('-');
      return { 'os': Constants.platformNames[qlItem.os] + ' ' + deviceNameArray[1].replace(/\.0$/, ''), 'browser': deviceNameArray[0] };
    } else {
      return { 'os': Constants.platformNames[qlItem.os], 'browser': capitalizeBrowser(qlItem.browser) + ' ' + sanitizeDesktopBrowserNumber(qlItem) };
    }
  }

  function sanitizeDesktopBrowserNumber(qlItem) {
    browserVersion = qlItem.version_name || qlItem.browser_version;
    //split to handle metro cases.
    var browserVersionArray = browserVersion.toString().split(' ');
    if(!isNaN(parseFloat(browserVersionArray[0]))) {
      $.each(browserVersionArray, function(i) {
        browserVersionArray[i] = capitalize(browserVersionArray[i].replace(/\.0$/, ''));
      });
    }
    else {
      browserVersionArray[0] = capitalize(browserVersionArray[0].toString());
    }
    return browserVersionArray.join(' ');
  }
})();

quickLaunch.init();
