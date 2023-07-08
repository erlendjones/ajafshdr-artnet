export function tcToMs(value_dirty = "", colonBased = false) {
  let valuePre;
  let value;
  if (colonBased) {
    value = value_dirty.split(":");
    value.reverse();
  } else {
    valuePre = value_dirty.split(".");
    value = valuePre[0].split(":");
    value.push(valuePre[1] || "0");
    value.reverse();
  }

  let sum = 0;
  let negativeFlag = false;
  for (let i = 0; i < value.length; i++) {
    //console.log('negativeFlag');
    if (value[i].toString().indexOf("-") > -1) {
      console.log("negativeFlag");
      negativeFlag = true;
      value[i] = parseInt(value[i]) * -1 + "";
    }
    if (i === 0) {
      sum += isNaN(parseInt(value[i])) ? 0 : parseInt(value[i]) * 40;
    }
    if (i === 1) {
      sum += isNaN(parseInt(value[i])) ? 0 : parseInt(value[i]) * 1000;
    }
    if (i === 2) {
      sum += isNaN(parseInt(value[i])) ? 0 : parseInt(value[i]) * 1000 * 60;
    }
    if (i === 3) {
      sum += isNaN(parseInt(value[i]))
        ? 0
        : parseInt(value[i]) * 1000 * 60 * 60;
    }
    if (i === 4) {
      sum += isNaN(parseInt(value[i]))
        ? 0
        : parseInt(value[i]) * 1000 * 60 * 60 * 24;
    }
  }

  if (negativeFlag && sum > 0) {
    sum *= -1;
  }
  return sum;
}

export function tcToMs1000(value_dirty = "") {
  const valuePre = value_dirty.split(".");
  const value = valuePre[0].split(":");
  value.push(valuePre[1] || "0");
  value.reverse();

  let sum = 0;
  let negativeFlag = false;
  for (let i = 0; i < value.length; i++) {
    //console.log('negativeFlag');
    if (value[i].toString().indexOf("-") > -1) {
      console.log("negativeFlag");
      negativeFlag = true;
      value[i] = parseInt(value[i]) * -1 + "";
    }
    if (i === 0) {
      sum += isNaN(parseInt(value[i])) ? 0 : parseInt(value[i]) * 1;
    }
    if (i === 1) {
      sum += isNaN(parseInt(value[i])) ? 0 : parseInt(value[i]) * 1000;
    }
    if (i === 2) {
      sum += isNaN(parseInt(value[i])) ? 0 : parseInt(value[i]) * 1000 * 60;
    }
    if (i === 3) {
      sum += isNaN(parseInt(value[i]))
        ? 0
        : parseInt(value[i]) * 1000 * 60 * 60;
    }
    if (i === 4) {
      sum += isNaN(parseInt(value[i]))
        ? 0
        : parseInt(value[i]) * 1000 * 60 * 60 * 24;
    }
  }

  if (negativeFlag && sum > 0) {
    sum *= -1;
  }
  return sum;
}
