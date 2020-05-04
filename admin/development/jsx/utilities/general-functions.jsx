const inDevelopment = function() {
  if (DEVMODE != undefined) {
    if (DEVMODE) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

const getFieldTypeFromFile = function(url) {
  if (url) {
    let filename = url.split('/').pop();
    let type = filename.split('.').shift();
    return type;
  }
  return "";
}

const objectInArraySort = function(array) {
  function compare(a,b) {
    if (a.slug < b.slug)
      return -1;
    if (a.slug > b.slug)
      return 1;
    return 0;
  }
  array.sort(compare);
  return array;
}

const capitalizeFirstLetter = function([ first, ...rest ]) {
  if (first != undefined) {
    return [ first.toUpperCase(), ...rest ].join('');
  } else {
    return "";
  }
}

const capitalize = function(name) {
  let name_parts = name.split(' ');
  let final_parts = [];
  let final_name;
  if (Array.isArray(name_parts)) {
    name_parts.map((word) => {
      final_parts.push(capitalizeFirstLetter(word));
    });
    final_name = final_parts.join(' ');
  } else {
    final_name = name_parts;
  }
  return final_name;
}

const updateFieldTypeIndex = function(items) {
  if (Array.isArray(items)) {
    items.map((item, i) => {
      item.meta = Object.assign({}, item.meta, {
        ui_index: i
      });
    });
    return items;
  } else {
    return items;
  }
}

const dashesToSpacesAndCaps = function(word) {
  let name = word.split("-").join(" ");
  if (name != "") {
    return capitalize(name);
  } else {
    return name;
  }
}

const underscoresToSpacesAndCaps = function(word) {
  let name = word.split("_").join(" ");
  if (name != "") {
    return capitalize(name);
  } else {
    return name;
  }
}

const spacesToDashes = function(word) {
  return word.split(" ").join("-").toLowerCase();
}

const spacesToUnderscores = function(word) {
  return word.split(" ").join("_").toLowerCase();
}

const reservedWords = function(word) {
  let reserved = ['stashes','stash','forms','form','core'];
  reserved.map((r_word,i) => {
    if (r_word == word) {
      return true;
    }
  });
  return false;
}

export default {
  inDevelopment,
  capitalize,
  dashesToSpacesAndCaps,
  getFieldTypeFromFile,
  objectInArraySort,
  spacesToDashes,
  spacesToUnderscores,
  underscoresToSpacesAndCaps,
  updateFieldTypeIndex,
  reservedWords
}