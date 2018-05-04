var CommonBrowserListBindings = (function() {

  var itemToAdd;
  var backgroundFade; //Private Data Properties
  var currentBackground;
  var ffMessengerApi;

  return {
    init: init,
    getDeviceType: getDeviceType,
    filterRequiredBrowserVersionToSelect: filterRequiredBrowserVersionToSelect,
    getDisabledBrowserInfo: getDisabledBrowserInfo,
    getDisabledDeviceInfo: getDisabledDeviceInfo
  };

  function init() {
    BrowserList.init();
    uiBindings();
    KeyboardNav.init();
  }

  function uiBindings() {
    var $browserOSListing = $('#browserOSListing');

    $browserOSListing.on("click", "#os-list .item.ql-link", function(e) {
      $('#mobileListingWrapper, #androidListingWrapper, #iosListingWrapper, #desktopListingWrapper, #desktopListingWrapperMac').removeClass('show').addClass('hide');
      $('#quickLaunchWrapper').removeClass('hide').addClass('show');
      KeyboardNav.calculations(); //very imp
      if( $(this).hasClass('selos') ){ $(this).addClass('selos sel'); return; }
      $browserOSListing.find('.os .item').removeClass('selos');
      $(this).addClass('selos sel');


      var currentBackground;
      //if block to avoid race condition when loader and ql both trigger bg change.
      if(!API.startSession) {
        setTimeout(function() {
          $('.gallery-item').not(currentBackground).removeClass('is-active');
          $('.gallery-item.is-active').removeClass('top');
        },100);
        currentBackground = $('.gallery-item[data-quick-launch]').addClass('is-active top');
      }
      if(quickLaunch.localWarning) {
        showLocalWarning();
      }
      else {
        hideLocalWarning();
      }
    });

    //select operating system from os list
    $browserOSListing.on("click", "#os-list .item:not(.ql-link)", function(e){
      KeyboardNav.calculations(); //very imp
      
      if( $(this).hasClass('selos') ){ $(this).addClass('selos sel'); return; } //handles double key press events

      //check git history if issues arrise when switchign to fade animation for background images.
      var dataOS = $(this).attr('data-os'),
        currentOS = $('#browserOSListing').find('.os .item.selos').attr('data-os');

      BrowserList.triggerEventsOnOSChange(dataOS, currentOS);

      var lastSelectedBrowser = $browserOSListing.find('#browser-list > .section.show .browser .selos');

      $browserOSListing.find('.os .item').removeClass('selos');
      $(this).addClass('selos sel');

      //show desktop listing wrapper and mobilelisting wrapper both?
      $('#desktopListingWrapper, #desktopListingWrapperMac, #mobileListingWrapper').removeClass('hide').addClass('show');
      $browserOSListing.find('.col-wrapper').removeClass('is-quick-launch');

      //hide quick launch
      $('div.quick-start').removeClass('show').addClass('hide');

      var $this = $(this);
      var browserListParams = {
        os: $this.data('os'),
        os_version: $this.data('os-version')
      };

      if(browserListParams.os == 'android' && BrowserStack.user.show_real_mobile) {
        populateRealAndroidList(browserListParams, 7);
      } else if(browserListParams.os == 'ios' && BrowserStack.user.show_real_ios) {
        populateRealiosList(browserListParams, 7);
      } else {
        populateBrowserList(browserListParams, 16);
      }

      showHideTabletColumnForMobile(browserListParams.os);
      selectAppropriateBrowserInNewList(lastSelectedBrowser, $this);

      e.preventDefault();
    });

    //clicking on browser item
    $browserOSListing.on("click", ".browser-list .items-container .items .item:not(.mob-vendor)", function(e){
      
      if($(this).hasClass("disabled")) {
        showMessageForDisabledBrowser(this);
        return;
      }

      BrowserList.validateAndStartSession($(this));
      e.preventDefault();
    });

    var urlParams = $.deparam.querystring();
    if(typeof urlParams.quickLaunch !== 'undefined') {
      $('#os-list .ql-link').click();
      return;
    }
    if(!$('body').hasClass('extension-popup')) {
      BrowserList.setInitialSelections();
    }
  }

  function setInitialSelections() {
  }
  
  function getDisabledBrowserInfo(browser, browser_version, os) {
    var os_name = BrowserStack.osNameMapping[os];
    browser_version = browser_version + "";
    bv = browser_version.replace('.0', '');
    var browser_desc = browser + " " + bv + " (" + os_name + ") ";
    return browser_desc;
  }

  function getDisabledDeviceInfo(os, device) {
    var os_name = BrowserStack.osNameMapping[os];
    var dev_name = device.split("-")[0];
    var browser_desc = dev_name + " (" + os_name + ") ";
    return browser_desc;
  }

  function showMessageForDisabledBrowser(sel) {
    var os =  $(sel).data("os");
    var browser = $(sel).data("browser");
    var browser_version = $(sel).data("browser-version");

    if (browser === 'Mobile' || browser === 'Tablet'){
      var device = $(sel).data("device");
      browser_desc = getDisabledDeviceInfo(os, device);
    } else {
      browser_desc = getDisabledBrowserInfo(browser, browser_version, os);
    } 

    StartStop.showNotification({key: "limitedAccessFreeTrial", type: 'error', data: {browserDesc: browser_desc}, time: 10000});
  }

  function populateRealiosList(params, colHeight) {

    var os = params.os,
      deviceType = getDeviceType(os),
      browsers,
      decidedClasses,
      data,
      isDesktop,
      numVendorsPerList,
      browserVersionsSliced,
      $itemsContainer;

    //wtf - $mainContainer scope is rekt
    getDeviceBasedContainer(os);

    $mainContainer = $('#iosListingWrapper');
    $mainContainer.find('.items-container').empty();

    //all right now! let's hard code shit and make life hard for whoever works on this in the future.
    //future developer working on browser-list.js : don't blame me. i am forced to do this.

    var osToDisplay = ['ios', 'realios'];

    for(var i in osToDisplay) {
      os = osToDisplay[i];
      browsers = BrowserStack.browserVersion[os];
      $.each(browsers, function (brName, brVersions) {
        decidedClasses = decideClasses(brVersions.length, colHeight);
        data = null;
        isDesktop = (deviceType === 'desktop');

        var browserName = BrowserStack.browserOrder.filter(function (val, i) {
          return val.toLowerCase() == brName;
        });
        numVendorsPerList = brName === 'mobile' ? 3 : 0; //0 for tablet
        if (os == 'winphone') numVendorsPerList = 0;
        var devices = (os == 'ios' || os == 'realios') ? $.extend([], brVersions).reverse() : $.extend([], brVersions).reverse();
        browserVersionsSliced = sliceBrowserVersionsForMobile(devices, os, numVendorsPerList, brName);
        data = {
          'devices': browserVersionsSliced,
          'os': os,
          'browser': browserName,
          'grouping_permitted': os.toLowerCase() != 'ios',
          'items-class': decidedClasses.itemsClass,
          deviceName: function () {
            return function (text, render) {
              var grouping_permitted = render(text).toLowerCase() != 'ios' && render(text).toLowerCase() != 'realios';
              var device = this.device;
              return (grouping_permitted ? device.slice(device.indexOf(' ') + 1, device.indexOf('-')) : device.substr(0, device.indexOf('-')));
            };
          },
          vendorName: function () {
            return function (text, render) {
              var vendorDisplayName = render(text).split(' ')[0];
              if (vendorDisplayName.indexOf('iPhone') > -1 || vendorDisplayName.indexOf('iPad') > -1) {
                vendorDisplayName = 'Apple';
              }
              return "<li class='mob-vendor item'>" + vendorDisplayName + "</li>";
            };
          },
          resolution: function () {
            return function (text, render) {
              var iOS = render(text).toLowerCase() == 'ios' || render(text).toLowerCase() == 'realios';
              var resolution = (this.device.split('-')[2] === undefined) ? this.device.split('-')[1] : this.device.split('-')[2];
              return iOS ? "<span class='item-resolution'></span>" : "<span class='item-resolution'>" + resolution + "</span>";
            };
          },
          deviceBaseName: function () {
            return function (text, render) {
              return render(text).toLowerCase() == 'ios' ? this.device.split(' ')[0] : this.device.split(' ')[1];
            };
          },
          versionInfo: function () {
            return function (text, render) {
              return "<span class='dropdownrightinfo'>" + ( render(text) == 'opera' ? "" : this.device.split('-')[1].replace('.0', '')) + "</span>";
            };
          }
        };
        $itemsContainer = $mainContainer.find('.' + brName+'.' + os + ' .items-container');
        $itemsContainer.empty().html(Mustache.to_html(isDesktop ? desktopTemplate : mobileTemplate, data));
        assignNamedVersions($itemsContainer.find('[data-os]'));
      });
    }

    hideLocalWarning();
  }

  function populateRealAndroidList(params, colHeight) {

    var os = params.os,
      deviceType = getDeviceType(os),
      browsers,
      decidedClasses,
      data,
      isDesktop,
      numVendorsPerList,
      browserVersionsSliced,
      $itemsContainer;

    //wtf - $mainContainer scope is rekt
    getDeviceBasedContainer(os);

    $mainContainer = $('#androidListingWrapper');
    $mainContainer.find('.items-container').empty();

    //all right now! let's hard code shit and make life hard for whoever works on this in the future.
    //future developer working on browser-list.js : don't blame me. i am forced to do this.

    var osToDisplay = ['android', 'realdroid'];

    for(var i in osToDisplay) {
      os = osToDisplay[i];
      browsers = BrowserStack.browserVersion[os];
      $.each(browsers, function (brName, brVersions) {
        decidedClasses = decideClasses(brVersions.length, colHeight);
        data = null;
        isDesktop = (deviceType === 'desktop');

        var browserName = BrowserStack.browserOrder.filter(function (val, i) {
          return val.toLowerCase() == brName;
        });
        numVendorsPerList = brName === 'mobile' ? 3 : 0; //0 for tablet
        if (os == 'winphone') numVendorsPerList = 0;
        var devices = (os == 'android' || os == 'realdroid') ? $.extend([], brVersions) : $.extend([], brVersions).reverse();
        browserVersionsSliced = sliceBrowserVersionsForMobile(devices, os, numVendorsPerList, brName);
        data = {
          'devices': browserVersionsSliced,
          'os': os,
          'browser': browserName,
          'grouping_permitted': os.toLowerCase() != 'ios',
          'items-class': decidedClasses.itemsClass,
          deviceName: function () {
            return function (text, render) {
              if(typeof(BrowserStack.deviceNames[this.device]) != 'undefined') {
                return BrowserStack.deviceNames[this.device];
              }
              var grouping_permitted = render(text).toLowerCase() != 'ios';
              var device = this.device;
              var no_local = false;
              if(os == 'android') {
                BrowserStack.emulatorLocalNotSupported.forEach(function(no_local_device) {
                  if(device.indexOf(no_local_device) > -1) {
                    no_local = true;
                  }
                });
              }
              return (grouping_permitted ? device.slice(device.indexOf(' ')+1, device.indexOf('-')) : device.substr(0, device.indexOf('-'))) + (no_local ? ' *' : '');
            };
          },
          vendorName: function () {
            return function (text, render) {
              var vendorDisplayName = render(text).split(' ')[0];
              if (vendorDisplayName.indexOf('iPhone') > -1 || vendorDisplayName.indexOf('iPad') > -1) {
                vendorDisplayName = 'Apple';
              }

              var free_user_with_limited_access = BrowserStack.user.freeUser && BrowserStack.user.freeUserWithLimitedAccess;             
              if(free_user_with_limited_access) {
                var browser = data['browser'][0].toLowerCase();
                var os = data['os'];
                var limited_free_trial_vendor = (data["os"] !== "android") && (os in BrowserStack.limitedFreeTrialManufacturers) && (browser in BrowserStack.limitedFreeTrialManufacturers[os]) && ($.inArray(vendorDisplayName, BrowserStack.limitedFreeTrialManufacturers[os][browser]) !== -1);
                var enabled = free_user_with_limited_access && limited_free_trial_vendor;
                if(!enabled)
                  return "<li class='mob-vendor item disabled'>" + vendorDisplayName + "</li>"
              }
              
              return "<li class='mob-vendor item'>" + vendorDisplayName + "</li>";
            };
          },
          resolution: function () {
            return function (text, render) {
              var iOS = render(text).toLowerCase() == 'ios';
              var resolution = (this.device.split('-')[2] === undefined) ? this.device.split('-')[1] : this.device.split('-')[2];
              return iOS ? "<span class='item-resolution'></span>" : "<span class='item-resolution'>" + resolution + "</span>";
            };
          },
          deviceBaseName: function () {
            return function (text, render) {
              return render(text).toLowerCase() == 'ios' ? this.device.split(' ')[0] : this.device.split(' ')[1];
            };
          },
          disabled_browser_class: function() {
            return function(text, render) {
              var free_user_with_limited_access = BrowserStack.user.freeUser && BrowserStack.user.freeUserWithLimitedAccess;
              var device_name = this.device;
              var enabled_device_for_free_users = (data["os"] !== "android") && (data["os"] in BrowserStack.limitedFreeTrialMobileDevice) && ($.inArray(device_name, BrowserStack.limitedFreeTrialMobileDevice[data["os"]]) !== -1);
              var disabledClass = (free_user_with_limited_access && !enabled_device_for_free_users) ? "disabled" : "";
              return disabledClass;
            };
          },
          versionInfo: function () {
            return function (text, render) {
              return "<span class='dropdownrightinfo'>" + ( render(text) == 'opera' ? "" : this.device.split('-')[1].replace('.0', '')) + "</span>";
            };
          }
        };
        $itemsContainer = $mainContainer.find('.' + brName+'.' + os + ' .items-container');
        $itemsContainer.empty().html(Mustache.to_html(isDesktop ? desktopTemplate : mobileTemplate, data));
        assignNamedVersions($itemsContainer.find('[data-os]'));
      });
    }
    showLocalWarning();
  }

  function populateBrowserList(params, colHeight) {

    var os = params.os,
      os_version = params.os_version,
      deviceType = getDeviceType(os),
      browsers = BrowserStack.browserVersion[os],
      decidedClasses,
      data,
      isDesktop,
      browserVersions,
      numVendorsPerList,
      browserVersionsSliced,
      $itemsContainer;

    $mainContainer = getDeviceBasedContainer(os);

    // empty the panels before populating:
    $mainContainer.find('.items-container').empty();

    $.each(browsers, function (brName, brVersions) {
      decidedClasses = decideClasses(brVersions.length, colHeight);
      data = null;
      isDesktop = (deviceType === 'desktop');

      var browserName = BrowserStack.browserOrder.filter(function(val, i) {
        return val.toLowerCase() == brName;
      });

      if(isDesktop) {
        browserVersions = sliceListByHeight($.extend([], brVersions).reverse(), colHeight);
        data = {
          'browser-versions': browserVersions,
          'os': os,
          'os-version': os_version,
          'browserName': browserName,
          'items-class': decidedClasses.itemsClass,
          disabled_browser_class: function() {
            return function(text, render) {
              var free_user_with_limited_access = BrowserStack.user.freeUser && BrowserStack.user.freeUserWithLimitedAccess;
              var browser_name = data["browserName"][0].toLowerCase();
              var browser_version = this.browser;
              var enabled_browser_for_free_users = (data["os"] in BrowserStack.limitedFreeTrialBrowserVersion) && (browser_name in BrowserStack.limitedFreeTrialBrowserVersion[data["os"]]) &&  ($.inArray(browser_version, BrowserStack.limitedFreeTrialBrowserVersion[data["os"]][browser_name]) !== -1);
              var disabledClass = (free_user_with_limited_access && !enabled_browser_for_free_users) ? "disabled" : "";
              return disabledClass;
            };
          },
          preformat_ui_version: function() {
            return function(text, render) {
              text = render(this.browser).replace('.0', '');
              var text_params = text.split(' ');
              if(text_params.length > 1)
                return "<a href='#' class='item-link' tabindex='-1'>" + text_params[0] + "<span class='badge versiontag'>" + text_params[1] + "</span></a>";
              else
                return "<a href='#' class='item-link' tabindex='-1'>" + render(this.browser).replace('.0', '') + (this.latest ? "<span class='badge latest'>Latest</span>" : "") + "</a>";
            };
          }
        };
      }
      else {
        numVendorsPerList = brName === 'mobile' ? 3 : 0; //0 for tablet
        if(os == 'winphone') numVendorsPerList = 0;
        var devices = (os == 'android' || os == 'realdroid') ? $.extend([], brVersions) : $.extend([], brVersions).reverse();
        browserVersionsSliced = sliceBrowserVersionsForMobile(devices, os, numVendorsPerList, brName);
        data = {
          'devices': browserVersionsSliced,
          'os': os,
          'browser': browserName,
          'grouping_permitted': os.toLowerCase() != 'ios',
          'items-class': decidedClasses.itemsClass,
          deviceName: function() {
            return function(text, render) {
              if(typeof(BrowserStack.deviceNames[this.device]) != 'undefined') {
                return BrowserStack.deviceNames[this.device];
              }
              var grouping_permitted = render(text).toLowerCase() != 'ios';
              var device = this.device;
              var no_local = false;
              if(os == 'android') {
                BrowserStack.emulatorLocalNotSupported.forEach(function(no_local_device) {
                  if(device.indexOf(no_local_device) > -1) {
                    no_local = true;
                  }
                });
              }
              return (grouping_permitted ? device.slice(device.indexOf(' ')+1, device.indexOf('-')) : device.substr(0, device.indexOf('-'))) + (no_local ? ' *' : '');
            };
          },
          disabled_browser_class: function() {
            return function(text, render) {
              var free_user_with_limited_access = BrowserStack.user.freeUser && BrowserStack.user.freeUserWithLimitedAccess;
              var device_name = this.device;
              var enabled_device_for_free_users = (data["os"] in BrowserStack.limitedFreeTrialMobileDevice) && ($.inArray(device_name, BrowserStack.limitedFreeTrialMobileDevice[data["os"]]) !== -1);
              var disabledClass = (free_user_with_limited_access && !enabled_device_for_free_users) ? "disabled" : "";
              return disabledClass;
            };
          },
          vendorName: function() {
            return function(text, render) {
              var vendorDisplayName = render(text).split(' ')[0];
              if(vendorDisplayName.indexOf('iPhone') > -1 || vendorDisplayName.indexOf('iPad') > -1) {
                vendorDisplayName = 'Apple';
              }

              var free_user_with_limited_access = BrowserStack.user.freeUser && BrowserStack.user.freeUserWithLimitedAccess;             
              if(free_user_with_limited_access) {
                var browser = data['browser'][0].toLowerCase();
                var os = data['os'];
                var limited_free_trial_vendor = (os in BrowserStack.limitedFreeTrialManufacturers) && (browser in BrowserStack.limitedFreeTrialManufacturers[os]) && ($.inArray(vendorDisplayName, BrowserStack.limitedFreeTrialManufacturers[os][browser]) !== -1);
                var enabled = free_user_with_limited_access && limited_free_trial_vendor;
                if(!enabled)
                  return "<li class='mob-vendor item disabled'>" + vendorDisplayName + "</li>"
              }

              return "<li class='mob-vendor item'>" + vendorDisplayName + "</li>";
            };
          },
          resolution: function() {
            return function(text, render) {
              var iOS = render(text).toLowerCase() == 'ios';
              var resolution = (this.device.split('-')[2] === undefined) ? this.device.split('-')[1] : this.device.split('-')[2];
              return iOS ? "<span class='item-resolution'></span>" : "<span class='item-resolution'>" + resolution + "</span>";
            };
          },
          deviceBaseName: function() {
            return function(text, render) {
              return render(text).toLowerCase() == 'ios' ? this.device.split(' ')[0] : this.device.split(' ')[1];
            };
          },
          versionInfo: function() {
            return function(text, render) {
              return "<span class='dropdownrightinfo'>" + ( render(text) == 'opera' ? "" : this.device.split('-')[1].replace('.0', '')) + "</span>";
            };
          }
        };
      }

      $itemsContainer = $mainContainer.find('.' + brName+' .items-container');
      $itemsContainer.empty().html(Mustache.to_html(isDesktop ? desktopTemplate : mobileTemplate, data));
      assignNamedVersions($itemsContainer.find('[data-os]'));
    });
    redefineLayoutAttributes($mainContainer, os);
    if(os == 'android') {
      showLocalWarning();
    }
    else {
      hideLocalWarning();
    }
  }

  function getDeviceType(os) {
    return $.inArray(os, Constants.desktopOS) < 0 ? 'mobile' : 'desktop';
  }

  function getDeviceBasedContainer(os) {
    var deviceType = getDeviceType(os),
      $mainContainer = getBrowserSection(deviceType, os);
    showOrHideDeviceType(deviceType, os);
    assignOSClass($mainContainer, os);
    return $mainContainer;
  }

  function getBrowserSection(deviceType, os) {
    if (deviceType != 'desktop') {
      return $('div .browser-list .section.' + deviceType);
    }
    else if (typeof(os) != 'undefined' && os.indexOf('mac') > -1) {
      return $('#desktopListingWrapperMac');
    }
    else {
      return $('#desktopListingWrapper');
    }
  }

  function showOrHideDeviceType(deviceType, os) {
    if (deviceType === 'desktop') {
      $('#quickLaunchWrapper, #mobileListingWrapper, #androidListingWrapper, #iosListingWrapper').removeClass('show').addClass('hide');
      if(typeof(os) != 'undefined' && os.indexOf('mac') > -1) {
        $('#desktopListingWrapper').removeClass('show').addClass('hide');
        $('#desktopListingWrapperMac').removeClass('hide').addClass('show');
      } else {
        $('#desktopListingWrapper').removeClass('hide').addClass('show');
        $('#desktopListingWrapperMac').removeClass('show').addClass('hide');
      }
    }
    else {
      $('#quickLaunchWrapper, #desktopListingWrapper, #desktopListingWrapperMac').removeClass('show').addClass('hide');
      if(os == 'android' && BrowserStack.user.show_real_mobile) {
        $('#mobileListingWrapper').removeClass('show').addClass('hide');
        $('#iosListingWrapper').removeClass('show').addClass('hide');
        $('#androidListingWrapper').removeClass('hide').addClass('show');
      } else if(os == 'ios' && BrowserStack.user.show_real_ios) {
        $('#mobileListingWrapper').removeClass('show').addClass('hide');
        $('#androidListingWrapper').removeClass('show').addClass('hide');
        $('#iosListingWrapper').removeClass('hide').addClass('show');
      } else {
        $('#iosListingWrapper').removeClass('show').addClass('hide');
        $('#androidListingWrapper').removeClass('show').addClass('hide');
        $('#mobileListingWrapper').removeClass('hide').addClass('show');
      }
    }
  }

  function assignOSClass($mainContainer, os) {
    $mainContainer.removeClass('macml macmav maclion macsl macyos macelc win8 win8-1 win7 winxp win10');
    $mainContainer.removeClass('windows mac ios android opera');
    $('#browser-list').removeClass('macml macmav maclion macsl macyos macelc win8 win8-1 win7 winxp win10');
    $('#browser-list').removeClass('windows mac ios android opera');
    if (os.indexOf('win') != -1) {
      $mainContainer.addClass('windows');
      $('#browser-list').addClass('windows');
    }
    else if (os.indexOf('mac') != -1) {
      $mainContainer.addClass('mac');
      $('#browser-list').addClass('mac');
    }
    else {
      $mainContainer.addClass(os);
      $('#browser-list').addClass(os);
    }
    var osClass = os.replace('.', '-');
    $mainContainer.addClass(osClass);
    $('#browser-list').addClass(osClass);
  }

  function decideClasses(length, colHeight) {
    var numCols = Math.ceil(length / colHeight),
      decidedClasses = { itemsClass: "items" };
    if (numCols > 1) { decidedClasses.itemsClass += ' multi'; }
    return decidedClasses;
  }

  function sliceListByHeight(list, height) {
    var latestStable = list.filter(function(val) {
      return val.match(/^[\d.]+$/);
    })[0];
    var browsers = list.map(function(browser) {
      return (browser == latestStable) ? { browser: browser, latest: true } : { browser : browser };
    });
    var sliced = [];
    while(browsers.length > 0) sliced.push(browsers.splice(0, height));
    return sliced;
  }

  function assignNamedVersions(obj) {
    if (obj instanceof jQuery) {
      var $items = $(obj);
      $items.each(function() {
        var $el = $(this);
        $el.attr('data-named-version', getNamedVersion($el.data()));
      });
    } else {
      obj.named_version = getNamedVersion(obj);
    }
  }

  function getNamedVersion(dat) {
    var key;
    var _browserVersion = dat.browserVersion || dat.browser_version;
    if (typeof _browserVersion === 'string' && _browserVersion.match(/Desktop/))
      return;
    if (dat.browser && _browserVersion)
      key = dat.os + '_' + dat.browser.toLowerCase() + '_' + _browserVersion.toString().match(/[.0-9]+/);
    else if (dat.device)
      key = dat.os + '_' + dat.browser.toLowerCase() + '_' + dat.device;
    return key && BrowserStack.namedVersionsMap[key];
  }

  function redefineLayoutAttributes( $mainContainer, os ){
    var $itemsCol = os.indexOf('mac') >= 0 ? $mainContainer.find('.browser:not(.ie) .items') : $mainContainer.find('.browser .items');
    if(getDeviceType(os) === 'mobile') { $mainContainer.attr({ 'has-col': 3, 'has-browsers': 2}); }
    else { $mainContainer.attr({'has-col': $itemsCol.length, 'has-browsers': $itemsCol.closest('.browser').length}); }
  }

  function sliceBrowserVersionsForMobile(brVersions, os, numVendorsPerList, brName) {
    var browserVersionsSliced = [],
      tempArr = [],
      vendorPrev,
      temp,
      spIndex,
      mobVendor,
      mobName,
      devBaseName,
      isGroupingPermitted = os != 'ios',
      i = 0 ,
      j = 0,
      bvLength = brVersions.length;

    while(i < bvLength) {
      tempArr[j] = brVersions[i];
      temp = brVersions[i].split("-");
      spIndex = temp[0].indexOf(" ");
      mobVendor = temp[0].substring(0, spIndex);
      mobName = isGroupingPermitted ? temp[0].substring(spIndex + 1) : temp[0];
      devBaseName = mobName.substring(0, mobName.lastIndexOf(' '));
      tempArr[j] = {
        device: brVersions[i],
        latest: isNamedVersionLatest({os: os, browser: brName, device: brVersions[i]})
      };
      if (mobVendor.length > 0 && (!vendorPrev || (mobVendor != vendorPrev))) {
        tempArr[j].firstOfVendor = true;
      }
      vendorPrev = mobVendor;
      i++; j++;
    }

    if(browserVersionsSliced.length === 0) { browserVersionsSliced[0] = tempArr; }

    if(isGroupingPermitted) {
      // get the groups by vendors:
      var index = tempArr.filter(function(device, i) {
        return device.firstOfVendor;
      }).map(function(val) {
        return tempArr.indexOf(val);
      });
      var groups = index.map(function(val, i) {
        var end = index[i+1];
        if(typeof end == 'undefined') {
          end = tempArr.length;
        }
        return tempArr.slice(val, end);
      });

      // divide in optimal groups, max length: 12
      var sub_group = [];
      browserVersionsSliced = [];

      if(BrowserStack.user.show_real_mobile) {
        if(os == 'android') {
          var maxLength = 6;
        }
        if(os == 'realdroid') {
          var maxLength = 5;
        }

        if(os == 'ios') {
          var maxLength = 4;
        }
      } else {
        var maxLength = 12;
      }
      //var maxLength = ((os == 'android' || os == 'realdroid') &&  BrowserStack.user.show_real_mobile) ? 7 : 12;
      groups.forEach(function(val, i) {
        if(val.length + sub_group.length > maxLength) {
          browserVersionsSliced.push(sub_group);
          sub_group = val;
        } else sub_group = sub_group.concat(val);
      });
      browserVersionsSliced[browserVersionsSliced.length] = sub_group;

    }

    return browserVersionsSliced;
  }

  function showHideTabletColumnForMobile(os) {
    var $mobileListingWrapper = $('#mobileListingWrapper');
    $mobileListingWrapper.find('.dummy').remove();
    $('#browser-list #iosListingWrapper .dummy').remove();
    var $mobileListTablet = $mobileListingWrapper.find('.tablet');
    if (os == 'android') {
      $mobileListTablet.removeClass('hide').addClass('show');
    } else if (os == 'ios' || os == 'realdroid') {
      $mobileListTablet.removeClass('hide').addClass('show').after("<ul class='pull-left item-list browser dummy'><li class='item-head'></li><li class='items-container'><ul class='items'></ul></li></ul>");
    } else if (os == 'winphone') {
      $mobileListTablet.removeClass('show').addClass('hide').after("<ul class='pull-left item-list browser dummy'><li class='item-head'></li><li class='items-container'><ul class='items multi'></ul><ul class='items multi'></ul></li></ul>");
    }

    if(BrowserStack.user.show_real_ios && os == 'ios') {
      $('#browser-list #iosListingWrapper .realios.tablet').after("<ul class='pull-left item-list browser small-item-list realios dummy'><li class='item-head'>&nbsp;</li><li class='items-container'><ul class='items'></ul></li></ul>");
      $('#browser-list #iosListingWrapper .ios.tablet').after("<ul class='pull-left item-list browser small-item-list ios dummy'><li class='items-container'><ul class='items'></ul></li></ul>");
    }
  }

  function isNamedVersionLatest(obj) {
    var namedVersion = (obj instanceof jQuery) ? $(obj).data('named-version') : getNamedVersion(obj);
    //real visible thne dont shot latest.
    if($('#androidListingWrapper').length && obj.os === 'android') {
      return false;
    }
    return (namedVersion && namedVersion.match(/_latest$/)) ? true : false;
  }

  function selectAppropriateBrowserInNewList($lastSelectedBrowser, $currentSelectedOS) {
    if ($lastSelectedBrowser.length == 0) { return; }  // Happens on page load.

    var newOS = $currentSelectedOS.data('os'),
      newOSType = getDeviceType(newOS),
      oldOSType = getDeviceType($lastSelectedBrowser.data('os')),
      newbrowserToSelect = [];

    if ((newOSType == oldOSType) && (oldOSType == 'desktop')) {
      newbrowserToSelect = filterRequiredBrowserVersionToSelect($lastSelectedBrowser.data('browser'), $lastSelectedBrowser.data('browser-version'));
    }

    if (newbrowserToSelect.length == 0) {
      newbrowserToSelect = filterRequiredBrowserVersionToSelect(Constants.defaultSettings[newOS].browser, Constants.defaultSettings[newOS].version, newOSType);
    }

    newbrowserToSelect.addClass('sel');
  }

  function filterRequiredBrowserVersionToSelect(browser, browserVersion, osType) {
    browser = browser.toLowerCase();
    var filterAttribute = osType == 'mobile' ? 'device' : 'browser-version';

    return $mainContainer.find('.browser.' + browser + ' .items-container li').filter(function(idx) {
      return $(this).data(filterAttribute) == browserVersion;
    });
  }

  function showLocalWarning() {
    $('#local-warning').addClass('show').removeClass('hide');
  }

  function hideLocalWarning() {
    $('#local-warning').addClass('hide').removeClass('show');
  }

})();
