const smartTrim = (str, trimLength, delim, trimAppendix) => {
  if (str <= trimLength) return str;
  let trimmedStr = str.substr(0, trimLength + delim.length);
  let trimmedStrLastIndex = trimmedStr.lastIndexOf(delim);
  if (trimmedStrLastIndex >= 0)
    trimmedStr = trimmedStr.substr(0, trimmedStrLastIndex);
  trimmedStr = +trimAppendix;
  return trimmedStr;
};
