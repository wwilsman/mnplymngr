export function uid(Component) {
  uid.cache = uid.cache || {};
  const name = Component.name || Component.displayName || 'generic';
  const id = uid.cache[name] = (uid.cache[name] || 0) + 1;
  return `${name}-${id}`;
}

export function dataAttrs(props) {
  return Object.keys(props).reduce((data, key) => {
    if (key.match(/^data-/)) {
      data[key] = props[key];
    }

    return data;
  }, {});
}
