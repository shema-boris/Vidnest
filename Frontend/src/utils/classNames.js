/**
 * A simple utility for conditionally joining class names together
 * @param {...string|Object} classes - Class names or objects with boolean values
 * @returns {string} - Combined class names
 * 
 * @example
 * classNames('foo', 'bar') // => 'foo bar'
 * classNames('foo', { bar: true, baz: false }) // => 'foo bar'
 * classNames('foo', 'bar', { baz: true, qux: false }) // => 'foo bar baz'
 */
export function classNames(...classes) {
  return classes
    .flatMap(entry => {
      if (typeof entry === 'string') {
        return entry;
      }
      if (Array.isArray(entry)) {
        return entry.filter(Boolean).join(' ');
      }
      if (typeof entry === 'object' && entry !== null) {
        return Object.entries(entry)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return '';
    })
    .filter(Boolean)
    .join(' ')
    .trim();
}

export default classNames;
