function cs142MakeMultiFilter (originalArray) {
    var currentArray = originalArray.slice();

    function arrayFilterer(filterCriteria, callback) {
        if (arguments.length === 0 || filterCriteria === undefined) {
            return currentArray;
        }

        var newArray = [];
        for (var i = 0; i < currentArray.length; i++) {
            if (filterCriteria(currentArray[i])) {
                newArray.push(currentArray[i]);
            }
        }
        currentArray = newArray

        if (typeof callback === "function") {
            callback.call(originalArray, currentArray);
        }

        return arrayFilterer;
    }

    return arrayFilterer;
}