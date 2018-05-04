/*
 * I hope you drink coffee before you dive into this code,
 * too much nested conditions to handle different cases, care while you edit
 *
*/

var KeyboardNav = (function () {

  //Declaring general variables including os/browser listing
  var getMachine,
      activeIdentifier,
      selOsIdentifier,
      getOsListMaxIndex,
      currentSel,
      currentPos,
      getMaxIndex,
      getMaxIndexRight,
      getMaxIndexLeft,
      getCurrentWrapperMaxIndex,
      getCurrentSelParentIndex,
      getPrevWrapperMaxIndex,
      getPrevWrapperMaxBrowIndex,
      getNextWrapperMaxIndex,
      getNextWrapperMaxBrowIndex,
      getMasterIndex,
      getMasterBrowser,
      getDevicesWrapper, //get if it is realdroid listing or normal listing

      //Selector - caching variables
      mlwFirstChild, //Mobile listing wrapper
      nmlwFirstChild, //Not mobile listing wrapper
      prevBrowMoveLeft, 
      prevMoveLeft,
      nextMoveRight,
      nextMoveBrowserRight,
      moveLeftIfRealDroidLayout,

      //Check variables
      checkIfOsList,


      //Just tweak the below variables and you are good to go
      //Set the selection class name
      activeIdentifier = 'sel',  //for overall active selector
      selOsIdentifier = 'selos', //for active os selector

      getNonEmptyQuickLaunch,
      checkIfDisableOverlayVisible; //Quick launch

  return {
    init : init,
    calculations : calculations,
    quickLaunchOnDelete : quickLaunchOnDelete
  };

  function init() {
    uiBindings();
  }

  function uiBindings() {
    $('body').on('keydown', function(e) {
      var acceptedKeys = [37, 38, 39, 40];

      //check if browser list not seen
      //this is imp else enter key will be disabled in live session
      if($('#browserOSListing:visible').length !== 1) {
        return;
      }

      //if enter button clicked, don't calculate
      if($.inArray(e.which, acceptedKeys) > -1) {
        calculations();
      }

      //If new user has overlay then disable the keyboard functionality
      if(checkIfDisableOverlayVisible === 1 && checkIfOsList !== 1) {
        currentSel.addClass(activeIdentifier);
        return;
      } else if($('#content .ctm-modal-overlay.screen-size-overlay:visible').length === 1) {
        //check if screen size option is popped up then disable keyboard navigation
        currentSel.addClass(activeIdentifier);
        return;
      }

      //handle key cases
      switch(e.which) {
        //enter key
        case 13:
          startLiveSession();
          e.preventDefault();
          break;

        //esc key
        case 27:
          closeSwitchModal();
          e.preventDefault();
          break;

        //left key
        case 37:
          moveLeft();
          e.preventDefault();
          break;

        //up key
        case 38:
          moveUp();
          e.preventDefault();
          break;

        //right key
        case 39:
          moveRight();
          e.preventDefault();
          break;

        //down key
        case 40:
          moveDown();
          e.preventDefault();
          break;

        //default not req
      }
    });
  }

  function startLiveSession() {
    //On enter key start the session or select os
    $('.item.' + activeIdentifier +':visible').trigger('click');

    if(getMachine == '#quickLaunchWrapper') {
      $('.ql-item.sel a').trigger('click');
    }
  }

  function quickLaunchOnDelete(getDeletedElm, getDeletedElmIndex) {
    if(getDeletedElmIndex < getNonEmptyQuickLaunch) {
      $('#quickLaunchWrapper').find('li').eq(getDeletedElmIndex).addClass(activeIdentifier);
    } else {
      $('#quickLaunchWrapper').find('li').eq(getNonEmptyQuickLaunch).addClass(activeIdentifier);
    }
  }

  function getParent() {
    //get parent element of browser list
    return '#' + $('#browser-list').find(' > div.show').attr('id');
  }

  function closeSwitchModal() {
    if($('#content .ctm-modal-overlay:not(".screen-size-overlay"):visible').length === 1) {
      Dock.hideSwitcher();
    } else {
      return false;
    }
  }

  function calculations() {
    getMachine = getParent(); //mobile, desktop or mac

    //Get current device wrapper id
    if(getMachine == '#androidListingWrapper' || getMachine == '#mobileListingWrapper') {
      getDevicesWrapper = getMachine;
    }
     
    //calculations, what happens on EVERY click except the enter key press
    //----- Calculations start
    currentSel = $('#browserOSListing .' + activeIdentifier);
    currentPos = currentSel.index();


    getOsListMaxIndex = currentSel.parents('.os-list').find('li').length - 1;

    getMasterBrowser = currentSel.parents('.browser');

    /*
     * Technically only getMasterIndex = getMasterBrowser.index(); is required
     * but I've to subtract -1 because dom changes for overlay messages
     * if user purchases a lite plan and hence the index is returned with an offset
     * of 1 because of the overlay element being rendered before the .browser elements
    */

    //This is the ugliest part in this script, handle with care
    //starts
    var getClass = $('.os-list-container').find('.selos').data('os');
    if(getClass == 'win8.1') getClass = 'win8-1';
    if($('#browser-list').find('.section.' + getClass + ' > .disable-overlay').length > 0) {
      getMasterIndex = getMasterBrowser.index() - 1;
    } else {
      getMasterIndex = getMasterBrowser.index();
    }

    //ends

    getMaxIndex = currentSel.parent().find('li').length - 1;
    getMaxIndexLeft = currentSel.parent().prev().children('.item').length - 1;
    getMaxIndexRight = currentSel.parent().next().children('.item').length - 1;


    getCurrentWrapperMaxIndex = currentSel.parents('.items-container').children('ul').length - 1;
    getCurrentSelParentIndex = currentSel.parent().index();


    getPrevWrapperMaxIndex = getMasterBrowser.prev().find('.items').length - 1;
    getPrevWrapperMaxBrowIndex = getMasterBrowser.prev().find('.items').eq(getPrevWrapperMaxIndex).find('li').length - 1;


    getNextWrapperMaxIndex = getMasterBrowser.next().not('.dummy').find('.items').length - 1;
    getNextWrapperMaxBrowIndex = getMasterBrowser.next().find('.items').eq(0).find('li').length - 1;

    //---- Calculations ends

    
    //Caching -- long selectors cached, so that you don't have to repeat them every where
    mlwFirstChild = currentSel.parent().next().children('.item:first-child');
    nmlwFirstChild = currentSel.parents('.browser').next().find('.items:first-child .item:first-child');
    prevBrowMoveLeft = currentSel.parents('.browser').prev().find('.items').eq(getPrevWrapperMaxIndex).children('.item'); //Have also used in move up
    prevMoveLeft = currentSel.parent().prev().children('.item');
    nextMoveRight = currentSel.parent().next().children('.item');
    nextMoveBrowserRight = currentSel.parents('.browser').next().find('.items').children('.item');
    moveLeftIfRealDroidLayout = currentSel.parents('#browser-list').prev('.os-list-container').find('.' + selOsIdentifier);
    if(getMachine == '#quickLaunchWrapper') {
      getNonEmptyQuickLaunch = $('#quickLaunchWrapper').find('ul li:not(:empty)').length - 1;
    }

    //Special selectors
    checkIfOsList = currentSel.parents('.os-list-container').length;

    //Check if any overlay message is visible
    checkIfDisableOverlayVisible = $('#browser-list .disable-overlay:visible').length;

    removeSel(); //remove selected option from anywhere in modal after calculations complete
  }

  function removeSel() {
    //Removes active selector from anywhere i.e browser/os list
    $('#browserOSListing .' + activeIdentifier).removeClass(activeIdentifier);
  }

  //Trigger this function when user clicks up key
  function moveUp() {
   //Triggers if user is trying to click up key on browser list but NOT Emulator list
   if(getMasterIndex <= 0 && currentPos <= 0 && getMaxIndexLeft == -1 && getMachine != '#mobileListingWrapper') {
      currentSel.addClass(activeIdentifier);
    } else {
      //Check if user is clicking an up key in OS list
      if(checkIfOsList > 0) {
        //If current selection is first os then prevent moving up
        if(currentPos <= 0) {
          currentSel.addClass(activeIdentifier);
        } else {
          //Move up until user reaches first OS in the list
          currentSel.prev().addClass(activeIdentifier);
        }
      } else {
        //If user is not in mobile/real mobile
        if(getMachine != getDevicesWrapper && getMachine != '#quickLaunchWrapper') {
          if(currentPos > 0) {
            currentSel.prev().addClass(activeIdentifier);
          } else {
            if(getMaxIndexLeft < 0) {
              prevBrowMoveLeft.eq(getPrevWrapperMaxBrowIndex).addClass(activeIdentifier);
            } else {
              currentSel.parent().prev().children('.item').eq(getMaxIndexLeft).addClass(activeIdentifier);
            }
          }
        } else if(getMachine == '#quickLaunchWrapper') {
          if((currentPos - 4) < getNonEmptyQuickLaunch && !(currentPos < 4) ) {
            currentSel.parent().find('li').eq(currentPos - 4).addClass(activeIdentifier);
          } else {
            if(getNonEmptyQuickLaunch >= 4 && getNonEmptyQuickLaunch < 8) {
              if($('#quickLaunchWrapper li:eq(' + (currentPos + 3) + '):empty').length === 1) {
                currentSel.prev().addClass(activeIdentifier);
              } else {
                $('#quickLaunchWrapper li').eq(currentPos + 3).addClass(activeIdentifier);
              }
            } else if(getNonEmptyQuickLaunch >= 8 && getNonEmptyQuickLaunch < 12) {
              if($('#quickLaunchWrapper li:eq(' + (currentPos + 7) + '):empty').length !== 1) {
                $('#quickLaunchWrapper li').eq(currentPos + 7).addClass(activeIdentifier);
              } else if($('#quickLaunchWrapper li:eq(' + (currentPos + 3) + '):empty').length !== 1) {
                $('#quickLaunchWrapper li').eq(currentPos + 3).addClass(activeIdentifier);
              } else {
                currentSel.addClass(activeIdentifier);
              }
            } else {
              currentSel.prev().addClass(activeIdentifier);
            }
          }
        } else {
          //If user is in mobile
          if(currentPos > 1) { //If user clicks up until he reaches first device in entire list
            if(currentSel.prev().hasClass('mob-vendor')) {
              currentSel.prev().prev().addClass(activeIdentifier);
            } else {
              currentSel.prev().addClass(activeIdentifier);
            }
          } else if(currentPos == 1 && getMasterIndex === 0 && getMaxIndexLeft == -1) {
            //if user is one very first device, so prevent moving up
            currentSel.addClass(activeIdentifier);
          } else {
            //Sensitive area for mobile navigation, don't tweak without understanding
            if(getMaxIndexLeft < 0) {
              //Check if user is in real mobile section
              if(currentSel.parents('#androidListingWrapper').length > 0) {
                if(currentSel.parents('.android.mobile') && getPrevWrapperMaxIndex == -1) {
                  //Using :last for many columns so that it doesn't break if tablet goes two columns
                  $(getMachine + ' .realdroid.tablet .items-container:last .items:last .item:last').addClass(activeIdentifier);
                } else {
                  prevBrowMoveLeft.eq(getPrevWrapperMaxBrowIndex).addClass(activeIdentifier);
                }
              } else {
                prevBrowMoveLeft.eq(getPrevWrapperMaxBrowIndex).addClass(activeIdentifier);
              }
            } else {
              currentSel.parent().prev().children('.item').eq(getMaxIndexLeft).addClass(activeIdentifier);
            }
          }
        }
      }
    }
  }


  //Trigger on move down
  function moveDown() {
    //If clicking down in browser list
    if(getNextWrapperMaxIndex == -1 && getMaxIndexRight == -1 && currentPos >= getMaxIndex && currentSel.parents('.os-list-container').length === 0 ) {
      if(currentSel.parents('.realdroid').length > 0) {
        //If user navigating in real droid
        currentSel.parents('.realdroid').next().next().find('.items-container:first .items:first .item:first').next().addClass(activeIdentifier);
      } else {
        currentSel.addClass(activeIdentifier);
      }
    } else {
        //If navigating in os list
        if(checkIfOsList > 0) {
          if(currentPos >= getOsListMaxIndex) {
            currentSel.addClass(activeIdentifier);
          } else {
            currentSel.next().addClass(activeIdentifier);
          }
        } else if(getMachine == '#quickLaunchWrapper') {
          if((currentPos + 4) > getNonEmptyQuickLaunch) {
            if(getNonEmptyQuickLaunch >= 4 && getNonEmptyQuickLaunch < 8) {
              if($('#quickLaunchWrapper li:eq(' + (currentPos - 3) + '):empty').length == 1) {
                $('#quickLaunchWrapper li').eq(currentPos + 1).addClass(activeIdentifier);
              } else {
                if(currentPos === 3 || currentPos == 7) {
                  currentSel.addClass(activeIdentifier);
                } else {
                  $('#quickLaunchWrapper li').eq(currentPos - 3).addClass(activeIdentifier);
                }
              }
            } else if(getNonEmptyQuickLaunch >= 8 && getNonEmptyQuickLaunch < 12) {
              if($('#quickLaunchWrapper li:eq(' + (currentPos - 7) + '):empty').length == 1) {
                $('#quickLaunchWrapper li').eq(currentPos - 3).addClass(activeIdentifier);
              } else {
                if($('#quickLaunchWrapper li:eq(' + (currentPos + 4) + '):empty').length == 1) {
                  currentSel.addClass(activeIdentifier);
                } else {
                  $('#quickLaunchWrapper li').eq(currentPos - 7).addClass(activeIdentifier);
                }
              }
            } else if(getNonEmptyQuickLaunch < 4) {
              if($('#quickLaunchWrapper li:eq(' + (currentPos + 1) + '):empty').length == 1) {
                currentSel.addClass(activeIdentifier);
              } else {
                currentSel.next().addClass(activeIdentifier);
              }
            }
          } else {
            currentSel.parent().find('li').eq(currentPos + 4).addClass(activeIdentifier);
          }
        } else {
          //If reached last option
          if(currentPos < getMaxIndex) {
            //If not mobile
            if(getMachine != getDevicesWrapper) {
              currentSel.next().addClass(activeIdentifier);
            } else {
              if(currentSel.next().hasClass('mob-vendor')) {
                currentSel.next().next().addClass(activeIdentifier);
              } else {
                currentSel.next().addClass(activeIdentifier);
              }
            }
          } else {
            //If normal navigation on keydown
            if(getMaxIndexRight >= 0) {
              //if not mobile
              if(getMachine != getDevicesWrapper) {
                mlwFirstChild.addClass(activeIdentifier);
              } else {
                if(mlwFirstChild.hasClass('mob-vendor')) {
                  mlwFirstChild.next().addClass(activeIdentifier);
                } else {
                  mlwFirstChild.addClass(activeIdentifier);
                }
              }
            } else {
              //If not mobile
              if(getMachine != getDevicesWrapper) {
                nmlwFirstChild.addClass(activeIdentifier);
              } else {
                if(nmlwFirstChild.hasClass('mob-vendor')) {
                  nmlwFirstChild.next().addClass(activeIdentifier);
                } else {
                  nmlwFirstChild.addClass(activeIdentifier);
                }
              }
            }
        }
      }
    }
  }


  //Invoke on left
  function moveLeft() {
    //if reached first column in browser list
    if(getMasterIndex <= 0 && getMaxIndexLeft == -1 && getMachine != '#quickLaunchWrapper') {
      //if in os list
      if(checkIfOsList > 0) {
        currentSel.addClass(activeIdentifier);
      } else {
        moveLeftIfRealDroidLayout.addClass(activeIdentifier);
      }
    } else if(getMachine == '#quickLaunchWrapper') {
      if(checkIfOsList > 0) {
        currentSel.addClass(activeIdentifier);
      } else {
        if(currentPos <= 0) {
          //this is a special case for handling extension keyboard navigation
          //remove if we include os list in extension
          if(currentSel.parents('#browser-list').hasClass('extension-browser-list')) {
            currentSel.addClass(activeIdentifier);
          } else {
            moveLeftIfRealDroidLayout.addClass(activeIdentifier);
          }
        } else {
          currentSel.prev().addClass(activeIdentifier);
        }  
      }
    } else {
      //If in first column for any browser
      if(getCurrentSelParentIndex <= 0) {
        if(currentPos >= getPrevWrapperMaxBrowIndex) {
          //Go to current OS selected from first browser list column
          if(currentSel.parents('#androidListingWrapper').length > 0 && getPrevWrapperMaxBrowIndex == -1) {
            moveLeftIfRealDroidLayout.addClass(activeIdentifier);
          } else {
            prevBrowMoveLeft.eq(getPrevWrapperMaxBrowIndex).addClass(activeIdentifier);
          }
        } else {
          //If mobile list
          if(prevBrowMoveLeft.eq(currentPos).hasClass('mob-vendor') && getMachine == getDevicesWrapper) {
            prevBrowMoveLeft.eq((currentPos + 1)).addClass(activeIdentifier);
          } else {
            prevBrowMoveLeft.eq(currentPos).addClass(activeIdentifier);
          }
        }
      } else {
        //If in mobile list
        if(prevMoveLeft.eq(currentPos).hasClass('mob-vendor') && getMachine == getDevicesWrapper) {
          prevMoveLeft.eq((currentPos + 1)).addClass(activeIdentifier);
        } else {
          //If in mobile list
          /*
           * TBH, I used to love the way it was programmed previously
           * but as and when the design changed the script got very very weird
           * and hence code is going way bad. Wish you luck whoever codes on this 
           * in coming years... lel :D
          */
          if(prevMoveLeft.eq(currentPos).hasClass('mob-vendor') && getMachine == getDevicesWrapper) {
            prevMoveLeft.eq((currentPos + 1)).addClass(activeIdentifier);
          } else {
            if(currentSel.parents('#androidListingWrapper').length > 0) {
              if(currentPos > getMaxIndexLeft) {
                prevMoveLeft.eq(getMaxIndexLeft).addClass(activeIdentifier);
              } else {
                prevMoveLeft.eq(currentPos).addClass(activeIdentifier);  
              }
            } else {
              prevMoveLeft.eq(currentPos).addClass(activeIdentifier);
            }
          }
        }
      }
    }
  }

  //On right key
  function moveRight() {
    /* return nothing if user click on os list and then clicks right button on a 
    browser listing which is disabled, example lite plan handling */
    if((checkIfDisableOverlayVisible === 1 || (getNonEmptyQuickLaunch < 0 && $('#quickLaunchWrapper:visible').length > 0)) && checkIfOsList === 1) {
      currentSel.addClass(activeIdentifier);
      return;
    }

    //If on last listing item and NOT in mobile list
    if(getNextWrapperMaxIndex == -1 && getMaxIndexRight == -1 && currentSel.parents('.os-list-container').length === 0 && getMachine != '#quickLaunchWrapper') {
      currentSel.addClass(activeIdentifier);
    } else {
      //If in OS list
      if(checkIfOsList > 0) {
        if(getMachine == '#androidListingWrapper' || getMachine == '#mobileListingWrapper') {
          $(getDevicesWrapper + ' ul.browser:first .items:first .item:first').next().addClass(activeIdentifier);
        } else if(getMachine == '#quickLaunchWrapper') {
          $(getMachine + ' ul li.ql-item:first').addClass(activeIdentifier);
        } else {
          $(getMachine + ' ul.browser:first .items:first .item:first').addClass(activeIdentifier);
        }       
      } else if(getMachine == '#quickLaunchWrapper' && !(checkIfOsList > 0)) {
        if(currentPos == getNonEmptyQuickLaunch) {
          currentSel.addClass(activeIdentifier);
        } else {
          currentSel.next().addClass(activeIdentifier);
        }
      } else {
        //If in browser list
        if(getCurrentSelParentIndex < getCurrentWrapperMaxIndex) {
          if(currentPos > getMaxIndexRight) {
            currentSel.parent().next().children('.item').eq(getMaxIndexRight).addClass(activeIdentifier);
          } else {
            //If mobie click right
            if(nextMoveRight.eq(currentPos).hasClass('mob-vendor') && getMachine == getDevicesWrapper) {
              nextMoveRight.eq((currentPos + 1)).addClass(activeIdentifier);
            } else {
              nextMoveRight.eq(currentPos).addClass(activeIdentifier);
            }
          }
        } else {
          if(currentPos >= getNextWrapperMaxBrowIndex) {
            //Going to another browser first column
            nextMoveBrowserRight.eq(getNextWrapperMaxBrowIndex).addClass(activeIdentifier);
          } else {
            //Mobile navigating
            if(nextMoveBrowserRight.eq(currentPos).hasClass('mob-vendor') && getMachine == getDevicesWrapper) {
              nextMoveBrowserRight.eq((currentPos + 1)).addClass(activeIdentifier);
            } else {
              nextMoveBrowserRight.eq(currentPos).addClass(activeIdentifier);
            }
          }
        }
      }
    }
  }
})();

//tired of commenting...

//That completes keyboard nav, play on \m/