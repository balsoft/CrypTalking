/**
 * Promisify an event
 * @param {{once: function(String, Function), removeListener: function(String, Function)}} emitter 
 * @param {String} event 
 * @returns {Promise<any>}
 */
export function emits(emitter, event) {
    var listener = null;

    var promise = new Promise(function (resolve, reject) {
        listener = function () {
            var args = null;

            if (arguments.length === 1)
                args = arguments[0];
            else {
                args = [];

                for (var i = 0; i < arguments.length; i++)
                    args.push(arguments[i]);
            }

            event === 'error' ? reject(args) : resolve(args);
        };

        emitter.once(event, listener);
    });

    promise.cancel = function () {
        emitter.removeListener(event, listener);
    };

    return promise;
};
/**
 * callbacks()
 *
 * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) -- into
 * an ES6-compatible Promise. Promisify provides a default callback of the form (error, result)
 * and rejects when `error` is truthy. You can also supply settings object as the second argument.
 *
 * @param {function} original - The function to promisify
 * @param {object} settings - Settings object
 * @param {object} settings.thisArg - A `this` context to use. If not set, assume `settings` _is_ `thisArg`
 * @param {bool} settings.multiArgs - Should multiple arguments be returned as an array?
 * @return {function} A promisified version of `original`
 */
export function callsback(original, settings) {

    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var returnMultipleArguments = settings && settings.multiArgs;

        var target = void 0;
        if (settings && settings.thisArg) {
            target = settings.thisArg;
        } else if (settings) {
            target = settings;
        }

        // Return the promisified function
        return new Promise(function (resolve, reject) {

            // Append the callback bound to the context
            args.push(function callback(err) {

                if (err) {
                    return reject(err);
                }

                for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    values[_key2 - 1] = arguments[_key2];
                }

                if (false === !!returnMultipleArguments) {
                    return resolve(values[0]);
                }

                resolve(values);
            });

            // Call the function
            var response = original.apply(target, args);

            // If it looks like original already returns a promise,
            // then just resolve with that promise. Hopefully, the callback function we added will just be ignored.
            resolve(response);
        });
    };
}