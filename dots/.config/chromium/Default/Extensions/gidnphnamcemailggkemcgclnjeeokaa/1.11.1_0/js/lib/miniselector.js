//The MIT License
//
//Copyright (C) 2012 Priyank Vyas
//              2015 Matthew Silverstein
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.

//Modified by Matt Silverstein, original source at https://github.com/caplin/SuperSelector

miniSelector = function(eElement, oConfig)
{
    this.targetElement = eElement;
    this.currentElement = eElement;
    this.completed = false;
    this.selectors = [];
    this.selectorPrefix = oConfig.selectorPrefix;
    this.selectorSuffix = oConfig.selectorSuffix;
    this.customAttributes = oConfig.customAttributes;
    this.disableConfig = oConfig.disableConfig;
    this.ignoreIdPrefixes = oConfig.ignoreIdPrefixes;
    this.ignoreClassPrefixes = oConfig.ignoreClassPrefixes;
};

miniSelector.prototype.calculateSelector = function()
{
    var prefix = this.selectorPrefix || '';
    var suffix = this.selectorSuffix || '';

    this.traverseAndCalc(this.targetElement);

    return prefix + this.selectors.reverse().join(' > ') + suffix;
};

miniSelector.prototype.traverseAndCalc = function(eElement)
{
    var sId = eElement.getAttribute("id");
    var sClass = eElement.getAttribute("class");
    var aCustomAttributes = [];

    for (var i = 0; i < this.customAttributes.length; i++) {
        var attributeType = this.customAttributes[i];
        var attributeVal = eElement.getAttribute(attributeType);
        if (attributeVal) { aCustomAttributes.push([attributeType,attributeVal]); };
    }

    while (this.completed == false && this.currentElement != null)
    {
        sId = this.currentElement.getAttribute("id");
        sClass = this.currentElement.getAttribute("class");

        if(sId != null && sId != "" && this.isAllowedId(sId))			/* ID CODE PATH */
        {
            this.calculateIdSelector(sId);
        }
        else if (aCustomAttributes.length)
        {
            this.calculateCustomAttributeSelector(aCustomAttributes);
        }
        else if (sClass != null && sClass != "")			/* CLASS CODE PATH */
        {
            this.calculateClassSelector(sClass);
        }
        else
        {
            this.calculateTagSelector(); 					/* TAGNAME CODE PATH */
        }

        this.currentElement = this.currentElement.parentElement;
    }

    return this.selectors;
};

miniSelector.prototype.calculateIdSelector = function (sElementId)
{
    if(document.getElementById(sElementId) != null)
    {
        this.selectors.push("#" + sElementId);
        this.completed = true;
    }
};

miniSelector.prototype.calculateContentSelector = function() {
};

miniSelector.prototype.calculateCustomAttributeSelector = function(aCustomAttributes) {

    for (var i = 0; i < aCustomAttributes.length; i++) {
        var customAttributeArr = aCustomAttributes[i];
        var customAttributeSelector = "[" + customAttributeArr[0] + "=\"" + customAttributeArr[1] + "\"]";
        var queryResults = document.querySelectorAll(customAttributeSelector);

        if (queryResults.length === 1) {
            this.selectors.push(customAttributeSelector);
            this.completed = true;
            return;
        }
    }

    this.calculateTagSelector();
};

miniSelector.prototype.calculateClassSelector = function(sClass)
{
    var selectorForClass = this._generateSelectorClassesString(sClass);	/* remove dupe */
    if(selectorForClass != "")
    {
        this.selectors.push("." + selectorForClass);

        var foundElementsInDom = document.getElementsByClassName(selectorForClass);
        if (foundElementsInDom.length == 1)
        {
            this.completed = true;
        }
    }
    else
    {
        this.calculateTagSelector();
    }
};

miniSelector.prototype.calculateTagSelector = function()
{
    var sTagName = this.currentElement.tagName;
    var eParent = this.currentElement.parentElement;
    var pChildElementsToConsider = (eParent == null ? [] : eParent.children);
    var pTagElementsToConsider = (eParent == null ? [] : getFirstLevelTagElements(eParent, sTagName));

    if(sTagName.toLowerCase() == "body")
    {
        this.selectors.push(sTagName.toLowerCase());
    }

    else if(pTagElementsToConsider.length == 1)
    {
        this.selectors.push(sTagName.toLowerCase());
    }

    else
    {
        for (var i = 0; i < pTagElementsToConsider.length; i++)
        {
            if (pTagElementsToConsider[i] == this.currentElement)
            {
                this.selectors.push(sTagName.toLowerCase() + ":nth-of-type(" + (i+1) + ")");
            }
        }
    }

    // Because getElementsByTagName is recursive
    function getFirstLevelTagElements(parentNode, tag) {
        var result = [];
        var nodes = parentNode.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName === tag) result.push(nodes[i]);
        }
        return result;
    }
};

miniSelector.prototype.isAllowedId = function(sIdName)
{
    if (this.disableConfig)
    {
        return true;
    }
    for (var i = 0; i < this.ignoreIdPrefixes.length; i++)
    {
        if (sIdName.toLowerCase().indexOf(this.ignoreIdPrefixes[i].toLowerCase()) == 0 &&
            this.ignoreIdPrefixes[i] != "")
        {
            return false;
        }
    }
    return true;
};

miniSelector.prototype.isAllowedClass = function(sName)
{
    if (this.disableConfig)
    {
        return true;
    }
    for (var i = 0; i < this.ignoreClassPrefixes.length; i++)
    {
        //if (this.ignoreClassPrefixes[i].toLowerCase() == sName.toLowerCase())
        if (sName.toLowerCase().indexOf(this.ignoreClassPrefixes[i].toLowerCase()) == 0 &&
            this.ignoreClassPrefixes[i] != "")
        {
            return false;
        }
    }
    return true;
};

/*
 * Private
 */

miniSelector.prototype._generateSelectorClassesString = function(sClassName)
{
    var pValidClasses = this._returnValidClasses(sClassName);
    var eParent =  this.currentElement.parentElement;

    /* See if we can get a class selector within the current element's parent which is unique */
    for (var i = 0; i < pValidClasses.length; i++)
    {
        if (eParent.getElementsByClassName(pValidClasses[i]).length == 1 &&
            eParent.getElementsByClassName(pValidClasses[i])[0] == this.currentElement)
        {
            return pValidClasses[i];
        }
    }

    /* See if we can get a class + eq(X) selector inside the current element's parent */
    var className = pValidClasses[0]; // TODO - do we want to restrict this to the first class only for performance?
    var immediateDescendants = eParent.children;
    for (var i = 0; i < immediateDescendants.length; i ++)
    {
        if (immediateDescendants[i].classList && immediateDescendants[i].classList.contains(className) && immediateDescendants[i] == this.currentElement)
        {
            return className + ":nth-child(" + (i+1) + ")";
        }
    }

    // Return empty string and force calculateTagSelector
    return '';
};

/* Filter classes against the ignore classes list */
miniSelector.prototype._returnValidClasses = function(className)
{
    var classes = className.split(" ");
    var pClassesToReturn = [];

    for (var i = 0; i < classes.length; i++)
    {
        if(this.isAllowedClass(classes[i]))
        {
            if(this._classDoesNotAlreadyExistInArray(classes[i], pClassesToReturn))
            {
                pClassesToReturn.push(classes[i]);
            }
        }
    }
    return pClassesToReturn;
};

/* Assert that sClass does not exist in pClassArray */
miniSelector.prototype._classDoesNotAlreadyExistInArray = function(sClass, pClassArray)
{
    for (var x = 0; x < pClassArray.length; x++)
    {
        if(sClass.toLowerCase() == pClassArray[x].toLowerCase())
        {
            return false;
        }
    }
    return true;
};

module.exports = miniSelector;
