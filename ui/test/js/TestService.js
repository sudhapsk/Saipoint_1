System.register([], function (_export) {
    'use strict';

    /**
     * The TestService provides common utilities to be used by unit tests.
     */
    function TestService($q) {

        var service = {};

        /**
         * This method is intended for encoding *key* or *value* parts of query component. We need a custom
         * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
         * encoded per http://tools.ietf.org/html/rfc3986:
         *    query       = *( pchar / "/" / "?" )
         *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
         *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
         *    pct-encoded   = "%" HEXDIG HEXDIG
         *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
         *                     / "*" / "+" / "," / ";" / "="
         *
         *
         * NOTE: This was copied from angular.js.  Angular uses custom URI encoding when
         * issuing HTTP requests.  To test the mock $httpBackend, we need to check that
         * URLs are hit with certain query parameters.  This method can be used to
         * encode URI components included in query strings.
         */
        service.encodeUriQuery = function (val, pctEncodeSpaces) {
            return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
        };

        /**
         * Get the query parameter string value from the given FilterValue object
         * @param {FilterValue} filterValue The FilterValue object
         * @param {String} [prop] If defined, get this property off the FilterValue value
         * @returns {String} Query Parameter value of the FilterValue
         */
        service.getQueryParamString = function (filterValue, prop) {
            var paramValue = undefined;
            if (filterValue) {
                var newVal = angular.copy(filterValue);
                if (prop) {
                    if (angular.isArray(newVal.value)) {
                        newVal.value = newVal.value.map(function (val) {
                            return val[prop];
                        });
                    } else {
                        newVal.value = newVal.value[prop];
                    }
                }
                paramValue = service.encodeUriQuery(angular.toJson(newVal));
            }

            return paramValue;
        };

        /**
         * Create a promise that will be rejected if reject is true and resolved otherwise.
         *
         * @param {Boolean} reject  Whether to reject the promise or resolve it.
         * @param {Object} resolveData Object to resolve promise with if resolved
         * @param {Object} rejectData Object to reject with if rejected
         *
         * @return A promise that is rejected or resolved.
         */
        service.createPromise = function (reject, resolveData, rejectData) {
            var deferred = $q.defer();
            if (reject) {
                deferred.reject(rejectData);
            } else {
                deferred.resolve(resolveData);
            }
            return deferred.promise;
        };

        /**
         * Create a spy function that returns a promise that will be rejected if
         * reject is true and resolved otherwise.  The returned function also
         * has the following functions that can be called to change behavior:
         *
         *   o makeReject(boolean): Change whether the promise is rejected or resolved.
         *   o setResolveData(Object): Set the data to be returned if resolved.
         *   o setRejectData(Object): Set the data to be returne if rejected.
         *
         * @param {Boolean} reject  Whether to reject the promise or resolve it.
         * @param {Object} resolveData  The data to return when responding.
         * @param {Object} rejectData  The data to return when rejecting.
         *
         * @return A function that returns a promise that is rejected or resolved.
         */
        service.createPromiseSpy = function (reject, resolveData, rejectData) {
            var spy = jasmine.createSpy(),
                self = this;

            /**
             * Add a property that tells the spy whether to reject or not.
             */
            spy.reject = reject;

            /**
             * The data to be passed to the resolve() method if resolving.
             */
            spy.resolveData = resolveData;

            /**
             * The data to be passed to the reject() method if rejecting.
             */
            spy.rejectData = rejectData;

            /**
             * Set whether the promise returned by this function rejects or resolves.
             *
             * @param {Boolean} reject  Whether to reject or resolve the promise.
             */
            spy.makeReject = function (reject) {
                spy.reject = reject;
            };

            /**
             * Set the data to be passed to the resolve() method if resolving.
             */
            spy.setResolveData = function (data) {
                spy.resolveData = data;
            };

            /**
             * Set the data to be passed to the reject() method if rejecting.
             */
            spy.setRejectData = function (data) {
                spy.rejectData = data;
            };

            return spy.and.callFake(function () {
                return self.createPromise(spy.reject, spy.resolveData, spy.rejectData);
            });
        };

        /**
         * A success response to return from createResponseXX() methods.  This
         * can be manipulated by the caller.
         */
        service.response = {
            status: 200,
            data: {}
        };

        /**
         * An error response to return from createResponseXX() methods.  This
         * can be manipulated by the caller.
         */
        service.errorResponse = {
            status: 500,
            data: {
                message: 'Shut her down Clancy ... she\'s pumping mud!'
            }
        };

        /**
         * Create a promise that either resolves or rejects a successful HTTP
         * response or error HTTP response.
         *
         * @param {Boolean} reject  Reject the promise if true.
         */
        service.createResponsePromise = function (reject) {
            var deferred = $q.defer();
            if (reject) {
                deferred.reject(service.errorResponse);
            } else {
                deferred.resolve(service.response);
            }
            return deferred.promise;
        };

        /**
         * Create a function that will return a promise that either resolves or
         * rejects a successful HTTP response or error HTTP response.
         *
         * @param {Boolean} reject  Reject the promise if true.
         */
        service.createResponseFunction = function (reject) {
            return function () {
                return service.createResponsePromise(reject);
            };
        };

        /**
         * Return a spy that gets called if the given promise succeeds.
         */
        service.spyOnSuccess = function (promise) {
            var spy = jasmine.createSpy();
            promise.then(spy);
            return spy;
        };

        /**
         * Return a spy that gets called if the given promise fails.
         */
        service.spyOnFailure = function (promise) {
            var spy = jasmine.createSpy();
            promise.then(null, spy);
            return spy;
        };

        return service;
    }

    return {
        setters: [],
        execute: function () {
            _export('default', TestService);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRlc3RTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxJQUFJLFVBQVUsU0FBUztJQUF2Qzs7Ozs7SUFLQSxTQUFTLFlBQVksSUFBSTs7UUFFckIsSUFBSSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUJkLFFBQVEsaUJBQWlCLFVBQVMsS0FBSyxpQkFBaUI7WUFDcEQsT0FBTyxtQkFBbUIsS0FDMUIsUUFBUSxTQUFTLEtBQ2pCLFFBQVEsU0FBUyxLQUNqQixRQUFRLFFBQVEsS0FDaEIsUUFBUSxTQUFTLEtBQ2pCLFFBQVEsUUFBUyxrQkFBa0IsUUFBUTs7Ozs7Ozs7O1FBUy9DLFFBQVEsc0JBQXNCLFVBQUMsYUFBYSxNQUFTO1lBQ2pELElBQUksYUFBVTtZQUNkLElBQUksYUFBYTtnQkFDYixJQUFJLFNBQVMsUUFBUSxLQUFLO2dCQUMxQixJQUFJLE1BQU07b0JBQ04sSUFBSSxRQUFRLFFBQVEsT0FBTyxRQUFRO3dCQUMvQixPQUFPLFFBQVEsT0FBTyxNQUFNLElBQUksVUFBQyxLQUFROzRCQUNyQyxPQUFPLElBQUk7OzJCQUVaO3dCQUNILE9BQU8sUUFBUSxPQUFPLE1BQU07OztnQkFHcEMsYUFBYSxRQUFRLGVBQWUsUUFBUSxPQUFPOzs7WUFHdkQsT0FBTzs7Ozs7Ozs7Ozs7O1FBWVgsUUFBUSxnQkFBZ0IsVUFBUyxRQUFRLGFBQWEsWUFBWTtZQUM5RCxJQUFJLFdBQVcsR0FBRztZQUNsQixJQUFJLFFBQVE7Z0JBQ1IsU0FBUyxPQUFPO21CQUVmO2dCQUNELFNBQVMsUUFBUTs7WUFFckIsT0FBTyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFrQnBCLFFBQVEsbUJBQW1CLFVBQVMsUUFBUSxhQUFhLFlBQVk7WUFDakUsSUFBSSxNQUFNLFFBQVE7Z0JBQ2QsT0FBTzs7Ozs7WUFLWCxJQUFJLFNBQVM7Ozs7O1lBS2IsSUFBSSxjQUFjOzs7OztZQUtsQixJQUFJLGFBQWE7Ozs7Ozs7WUFRakIsSUFBSSxhQUFhLFVBQVMsUUFBUTtnQkFDOUIsSUFBSSxTQUFTOzs7Ozs7WUFNakIsSUFBSSxpQkFBaUIsVUFBUyxNQUFNO2dCQUNoQyxJQUFJLGNBQWM7Ozs7OztZQU10QixJQUFJLGdCQUFnQixVQUFTLE1BQU07Z0JBQy9CLElBQUksYUFBYTs7O1lBR3JCLE9BQU8sSUFBSSxJQUFJLFNBQVMsWUFBVztnQkFDL0IsT0FBTyxLQUFLLGNBQWMsSUFBSSxRQUFRLElBQUksYUFBYSxJQUFJOzs7Ozs7OztRQVFuRSxRQUFRLFdBQVc7WUFDZixRQUFRO1lBQ1IsTUFBTTs7Ozs7OztRQU9WLFFBQVEsZ0JBQWdCO1lBQ3BCLFFBQVE7WUFDUixNQUFNO2dCQUNGLFNBQVM7Ozs7Ozs7Ozs7UUFVakIsUUFBUSx3QkFBd0IsVUFBUyxRQUFRO1lBQzdDLElBQUksV0FBVyxHQUFHO1lBQ2xCLElBQUksUUFBUTtnQkFDUixTQUFTLE9BQU8sUUFBUTttQkFFdkI7Z0JBQ0QsU0FBUyxRQUFRLFFBQVE7O1lBRTdCLE9BQU8sU0FBUzs7Ozs7Ozs7O1FBU3BCLFFBQVEseUJBQXlCLFVBQVMsUUFBUTtZQUM5QyxPQUFPLFlBQVc7Z0JBQ2QsT0FBTyxRQUFRLHNCQUFzQjs7Ozs7OztRQU83QyxRQUFRLGVBQWUsVUFBUyxTQUFTO1lBQ3JDLElBQUksTUFBTSxRQUFRO1lBQ2xCLFFBQVEsS0FBSztZQUNiLE9BQU87Ozs7OztRQU1YLFFBQVEsZUFBZSxVQUFTLFNBQVM7WUFDckMsSUFBSSxNQUFNLFFBQVE7WUFDbEIsUUFBUSxLQUFLLE1BQU07WUFDbkIsT0FBTzs7O1FBR1gsT0FBTzs7O0lBSlAsT0FBTztRQUNILFNBQVM7UUFDVCxTQUFTLFlBQVk7WUFDakIsUUFBUSxXQUlMOzs7R0FEWiIsImZpbGUiOiJUZXN0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBUaGUgVGVzdFNlcnZpY2UgcHJvdmlkZXMgY29tbW9uIHV0aWxpdGllcyB0byBiZSB1c2VkIGJ5IHVuaXQgdGVzdHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBUZXN0U2VydmljZSgkcSkge1xyXG5cclxuICAgIHZhciBzZXJ2aWNlID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBpbnRlbmRlZCBmb3IgZW5jb2RpbmcgKmtleSogb3IgKnZhbHVlKiBwYXJ0cyBvZiBxdWVyeSBjb21wb25lbnQuIFdlIG5lZWQgYSBjdXN0b21cclxuICAgICAqIG1ldGhvZCBiZWNhdXNlIGVuY29kZVVSSUNvbXBvbmVudCBpcyB0b28gYWdncmVzc2l2ZSBhbmQgZW5jb2RlcyBzdHVmZiB0aGF0IGRvZXNuJ3QgaGF2ZSB0byBiZVxyXG4gICAgICogZW5jb2RlZCBwZXIgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NjpcclxuICAgICAqICAgIHF1ZXJ5ICAgICAgID0gKiggcGNoYXIgLyBcIi9cIiAvIFwiP1wiIClcclxuICAgICAqICAgIHBjaGFyICAgICAgICAgPSB1bnJlc2VydmVkIC8gcGN0LWVuY29kZWQgLyBzdWItZGVsaW1zIC8gXCI6XCIgLyBcIkBcIlxyXG4gICAgICogICAgdW5yZXNlcnZlZCAgICA9IEFMUEhBIC8gRElHSVQgLyBcIi1cIiAvIFwiLlwiIC8gXCJfXCIgLyBcIn5cIlxyXG4gICAgICogICAgcGN0LWVuY29kZWQgICA9IFwiJVwiIEhFWERJRyBIRVhESUdcclxuICAgICAqICAgIHN1Yi1kZWxpbXMgICAgPSBcIiFcIiAvIFwiJFwiIC8gXCImXCIgLyBcIidcIiAvIFwiKFwiIC8gXCIpXCJcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgLyBcIipcIiAvIFwiK1wiIC8gXCIsXCIgLyBcIjtcIiAvIFwiPVwiXHJcbiAgICAgKlxyXG4gICAgICpcclxuICAgICAqIE5PVEU6IFRoaXMgd2FzIGNvcGllZCBmcm9tIGFuZ3VsYXIuanMuICBBbmd1bGFyIHVzZXMgY3VzdG9tIFVSSSBlbmNvZGluZyB3aGVuXHJcbiAgICAgKiBpc3N1aW5nIEhUVFAgcmVxdWVzdHMuICBUbyB0ZXN0IHRoZSBtb2NrICRodHRwQmFja2VuZCwgd2UgbmVlZCB0byBjaGVjayB0aGF0XHJcbiAgICAgKiBVUkxzIGFyZSBoaXQgd2l0aCBjZXJ0YWluIHF1ZXJ5IHBhcmFtZXRlcnMuICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCB0b1xyXG4gICAgICogZW5jb2RlIFVSSSBjb21wb25lbnRzIGluY2x1ZGVkIGluIHF1ZXJ5IHN0cmluZ3MuXHJcbiAgICAgKi9cclxuICAgIHNlcnZpY2UuZW5jb2RlVXJpUXVlcnkgPSBmdW5jdGlvbih2YWwsIHBjdEVuY29kZVNwYWNlcykge1xyXG4gICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cclxuICAgICAgICByZXBsYWNlKC8lNDAvZ2ksICdAJykuXHJcbiAgICAgICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxyXG4gICAgICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxyXG4gICAgICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cclxuICAgICAgICByZXBsYWNlKC8lMjAvZywgKHBjdEVuY29kZVNwYWNlcyA/ICclMjAnIDogJysnKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBxdWVyeSBwYXJhbWV0ZXIgc3RyaW5nIHZhbHVlIGZyb20gdGhlIGdpdmVuIEZpbHRlclZhbHVlIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHtGaWx0ZXJWYWx1ZX0gZmlsdGVyVmFsdWUgVGhlIEZpbHRlclZhbHVlIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtwcm9wXSBJZiBkZWZpbmVkLCBnZXQgdGhpcyBwcm9wZXJ0eSBvZmYgdGhlIEZpbHRlclZhbHVlIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBRdWVyeSBQYXJhbWV0ZXIgdmFsdWUgb2YgdGhlIEZpbHRlclZhbHVlXHJcbiAgICAgKi9cclxuICAgIHNlcnZpY2UuZ2V0UXVlcnlQYXJhbVN0cmluZyA9IChmaWx0ZXJWYWx1ZSwgcHJvcCkgPT4ge1xyXG4gICAgICAgIGxldCBwYXJhbVZhbHVlO1xyXG4gICAgICAgIGlmIChmaWx0ZXJWYWx1ZSkge1xyXG4gICAgICAgICAgICBsZXQgbmV3VmFsID0gYW5ndWxhci5jb3B5KGZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkobmV3VmFsLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbC52YWx1ZSA9IG5ld1ZhbC52YWx1ZS5tYXAoKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWwudmFsdWUgPSBuZXdWYWwudmFsdWVbcHJvcF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGFyYW1WYWx1ZSA9IHNlcnZpY2UuZW5jb2RlVXJpUXVlcnkoYW5ndWxhci50b0pzb24obmV3VmFsKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyYW1WYWx1ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBwcm9taXNlIHRoYXQgd2lsbCBiZSByZWplY3RlZCBpZiByZWplY3QgaXMgdHJ1ZSBhbmQgcmVzb2x2ZWQgb3RoZXJ3aXNlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVqZWN0ICBXaGV0aGVyIHRvIHJlamVjdCB0aGUgcHJvbWlzZSBvciByZXNvbHZlIGl0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlc29sdmVEYXRhIE9iamVjdCB0byByZXNvbHZlIHByb21pc2Ugd2l0aCBpZiByZXNvbHZlZFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlamVjdERhdGEgT2JqZWN0IHRvIHJlamVjdCB3aXRoIGlmIHJlamVjdGVkXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBBIHByb21pc2UgdGhhdCBpcyByZWplY3RlZCBvciByZXNvbHZlZC5cclxuICAgICAqL1xyXG4gICAgc2VydmljZS5jcmVhdGVQcm9taXNlID0gZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlRGF0YSwgcmVqZWN0RGF0YSkge1xyXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgaWYgKHJlamVjdCkge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVqZWN0RGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdmVEYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgc3B5IGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlamVjdGVkIGlmXHJcbiAgICAgKiByZWplY3QgaXMgdHJ1ZSBhbmQgcmVzb2x2ZWQgb3RoZXJ3aXNlLiAgVGhlIHJldHVybmVkIGZ1bmN0aW9uIGFsc29cclxuICAgICAqIGhhcyB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyB0aGF0IGNhbiBiZSBjYWxsZWQgdG8gY2hhbmdlIGJlaGF2aW9yOlxyXG4gICAgICpcclxuICAgICAqICAgbyBtYWtlUmVqZWN0KGJvb2xlYW4pOiBDaGFuZ2Ugd2hldGhlciB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCBvciByZXNvbHZlZC5cclxuICAgICAqICAgbyBzZXRSZXNvbHZlRGF0YShPYmplY3QpOiBTZXQgdGhlIGRhdGEgdG8gYmUgcmV0dXJuZWQgaWYgcmVzb2x2ZWQuXHJcbiAgICAgKiAgIG8gc2V0UmVqZWN0RGF0YShPYmplY3QpOiBTZXQgdGhlIGRhdGEgdG8gYmUgcmV0dXJuZSBpZiByZWplY3RlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlamVjdCAgV2hldGhlciB0byByZWplY3QgdGhlIHByb21pc2Ugb3IgcmVzb2x2ZSBpdC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNvbHZlRGF0YSAgVGhlIGRhdGEgdG8gcmV0dXJuIHdoZW4gcmVzcG9uZGluZy5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWplY3REYXRhICBUaGUgZGF0YSB0byByZXR1cm4gd2hlbiByZWplY3RpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZWplY3RlZCBvciByZXNvbHZlZC5cclxuICAgICAqL1xyXG4gICAgc2VydmljZS5jcmVhdGVQcm9taXNlU3B5ID0gZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlRGF0YSwgcmVqZWN0RGF0YSkge1xyXG4gICAgICAgIHZhciBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpLFxyXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWRkIGEgcHJvcGVydHkgdGhhdCB0ZWxscyB0aGUgc3B5IHdoZXRoZXIgdG8gcmVqZWN0IG9yIG5vdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzcHkucmVqZWN0ID0gcmVqZWN0O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgZGF0YSB0byBiZSBwYXNzZWQgdG8gdGhlIHJlc29sdmUoKSBtZXRob2QgaWYgcmVzb2x2aW5nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNweS5yZXNvbHZlRGF0YSA9IHJlc29sdmVEYXRhO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgZGF0YSB0byBiZSBwYXNzZWQgdG8gdGhlIHJlamVjdCgpIG1ldGhvZCBpZiByZWplY3RpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3B5LnJlamVjdERhdGEgPSByZWplY3REYXRhO1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHdoZXRoZXIgdGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhpcyBmdW5jdGlvbiByZWplY3RzIG9yIHJlc29sdmVzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSByZWplY3QgIFdoZXRoZXIgdG8gcmVqZWN0IG9yIHJlc29sdmUgdGhlIHByb21pc2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3B5Lm1ha2VSZWplY3QgPSBmdW5jdGlvbihyZWplY3QpIHtcclxuICAgICAgICAgICAgc3B5LnJlamVjdCA9IHJlamVjdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdGhlIGRhdGEgdG8gYmUgcGFzc2VkIHRvIHRoZSByZXNvbHZlKCkgbWV0aG9kIGlmIHJlc29sdmluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzcHkuc2V0UmVzb2x2ZURhdGEgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIHNweS5yZXNvbHZlRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHRoZSBkYXRhIHRvIGJlIHBhc3NlZCB0byB0aGUgcmVqZWN0KCkgbWV0aG9kIGlmIHJlamVjdGluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzcHkuc2V0UmVqZWN0RGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgc3B5LnJlamVjdERhdGEgPSBkYXRhO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzcHkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jcmVhdGVQcm9taXNlKHNweS5yZWplY3QsIHNweS5yZXNvbHZlRGF0YSwgc3B5LnJlamVjdERhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgc3VjY2VzcyByZXNwb25zZSB0byByZXR1cm4gZnJvbSBjcmVhdGVSZXNwb25zZVhYKCkgbWV0aG9kcy4gIFRoaXNcclxuICAgICAqIGNhbiBiZSBtYW5pcHVsYXRlZCBieSB0aGUgY2FsbGVyLlxyXG4gICAgICovXHJcbiAgICBzZXJ2aWNlLnJlc3BvbnNlID0ge1xyXG4gICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgIGRhdGE6IHt9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW4gZXJyb3IgcmVzcG9uc2UgdG8gcmV0dXJuIGZyb20gY3JlYXRlUmVzcG9uc2VYWCgpIG1ldGhvZHMuICBUaGlzXHJcbiAgICAgKiBjYW4gYmUgbWFuaXB1bGF0ZWQgYnkgdGhlIGNhbGxlci5cclxuICAgICAqL1xyXG4gICAgc2VydmljZS5lcnJvclJlc3BvbnNlID0ge1xyXG4gICAgICAgIHN0YXR1czogNTAwLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgbWVzc2FnZTogJ1NodXQgaGVyIGRvd24gQ2xhbmN5IC4uLiBzaGVcXCdzIHB1bXBpbmcgbXVkISdcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgcHJvbWlzZSB0aGF0IGVpdGhlciByZXNvbHZlcyBvciByZWplY3RzIGEgc3VjY2Vzc2Z1bCBIVFRQXHJcbiAgICAgKiByZXNwb25zZSBvciBlcnJvciBIVFRQIHJlc3BvbnNlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVqZWN0ICBSZWplY3QgdGhlIHByb21pc2UgaWYgdHJ1ZS5cclxuICAgICAqL1xyXG4gICAgc2VydmljZS5jcmVhdGVSZXNwb25zZVByb21pc2UgPSBmdW5jdGlvbihyZWplY3QpIHtcclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIGlmIChyZWplY3QpIHtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHNlcnZpY2UuZXJyb3JSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHNlcnZpY2UucmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IGVpdGhlciByZXNvbHZlcyBvclxyXG4gICAgICogcmVqZWN0cyBhIHN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZSBvciBlcnJvciBIVFRQIHJlc3BvbnNlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVqZWN0ICBSZWplY3QgdGhlIHByb21pc2UgaWYgdHJ1ZS5cclxuICAgICAqL1xyXG4gICAgc2VydmljZS5jcmVhdGVSZXNwb25zZUZ1bmN0aW9uID0gZnVuY3Rpb24ocmVqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VydmljZS5jcmVhdGVSZXNwb25zZVByb21pc2UocmVqZWN0KTtcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBhIHNweSB0aGF0IGdldHMgY2FsbGVkIGlmIHRoZSBnaXZlbiBwcm9taXNlIHN1Y2NlZWRzLlxyXG4gICAgICovXHJcbiAgICBzZXJ2aWNlLnNweU9uU3VjY2VzcyA9IGZ1bmN0aW9uKHByb21pc2UpIHtcclxuICAgICAgICB2YXIgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4oc3B5KTtcclxuICAgICAgICByZXR1cm4gc3B5O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBhIHNweSB0aGF0IGdldHMgY2FsbGVkIGlmIHRoZSBnaXZlbiBwcm9taXNlIGZhaWxzLlxyXG4gICAgICovXHJcbiAgICBzZXJ2aWNlLnNweU9uRmFpbHVyZSA9IGZ1bmN0aW9uKHByb21pc2UpIHtcclxuICAgICAgICB2YXIgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgc3B5KTtcclxuICAgICAgICByZXR1cm4gc3B5O1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGVzdFNlcnZpY2U7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
