'use strict';
angular.module('ngToggle', [])
    .directive('ngToggleShow', [function () {
        return {
            require: '^ngToggle',
            /**
             * Toggling the class 'ng-hide' on toggleShow directive element relating to the state given by
             * ngToggle.controller.
             * @class toggleShow.scope
             * @requires ngToggle.controller
             */
            link: function (scope, element, attrs, ctrl) {
                var namespace = attrs.ngToggleShow || 'default',
                    toggleHideClass = angular.isString(attrs.ngToggleHideClass) ? attrs.ngToggleHideClass : 'ng-hide',
                    toggleShowClass = attrs.ngToggleShowClass || '';

                ctrl.isActiveMap[namespace] = false;

                scope.$watch(function () {
                    return ctrl.isActiveMap[namespace];
                }, function (isActive) {
                    if (isActive) {
                        element.removeClass(toggleHideClass);
                        element.addClass(toggleShowClass);
                    }
                    else {
                        element.addClass(toggleHideClass);
                        element.removeClass(toggleShowClass);
                    }
                });
            }
        };
    }])
    .directive('ngToggle', ['$document', '$timeout', function ($document, $timeout) {

        /**
         * Triggers event on DOM element. Similar to $(obj).trigger(evt) with jQuery.
         * It supports Internet Explorer also.
         * @param {DOMElement} obj DOM element to fire event on
         * @param {String} evt Event name
         * @method _triggerEvent
         * @private
         */
        function _triggerEvent(obj, evt) {
            var evObj,
                fireOnThis = obj;

            if (window.document.createEvent) {
                evObj = window.document.createEvent('MouseEvents');
                evObj.initEvent(evt, true, false);
                fireOnThis.dispatchEvent(evObj);
            }
            // for Internet Explorer
            else if (window.document.createEventObject) {
                evObj = window.document.createEventObject();
                fireOnThis.fireEvent('on' + evt, evObj);
            }
            else {
                throw 'Trigger event for this browser is not supported';
            }
        }

        return {
            /**
             * @class ngToggle.scope
             */
            scope: true,
            /**
             * @class ngToggle.controller
             */
            controller: ['$scope', '$attrs', '$element', function ($scope, $attrs, $element) {
                var ctrl = this;

                /**
                 * Map of isActive state with relation to namespace. If namespace is not explicitly defined
                 * then namespace is set to string: 'default'.
                 * @type {Object}
                 * @property isActiveMap
                 */
                ctrl.isActiveMap = {};

                /**
                 * Register single document click to change state of toggle active to false.
                 * @param {String} namespace Namespace under which toggle active is working
                 * @method _registerDocumentClick
                 * @private
                 */
                function _registerDocumentClick(namespace) {
                    namespace = namespace || 'default';

                    $timeout(function () {
                        $document.one('click', function (event) {
                            var containsTarget = 0,
                                toggleShowEl,
                                i;

                            if (!ctrl.isActiveMap[namespace]) {
                                return;
                            }
                            if (namespace === 'default') {
                                toggleShowEl = $element[0].querySelectorAll('[ng-toggle-show=""]');
                            }
                            else {
                                toggleShowEl = $element[0].querySelectorAll('[ng-toggle-show="' + namespace + '"]');
                            }

                            for(i=toggleShowEl.length-1; i>=0; i--) {
                                if (toggleShowEl.item(i).contains(event.target)) {
                                    containsTarget++;
                                }
                            }
                            if (containsTarget) {
                                _registerDocumentClick(namespace);
                                return;
                            }

                            ctrl.isActiveMap[namespace] = false;
                            if($scope.$root && ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')){
                                $scope.$apply();
                            }
                        });
                    });
                }


                /**
                 * Change a state of isActive to opposite. If isActive state is on true,
                 * it registers document click event to deactivate back.
                 * @param {String} namespace Namespace under which toggle active is working
                 * @method toggleActive
                 */
                ctrl.toggleActive = function toggleActive(namespace) {
                    namespace = namespace || 'default';

                    ctrl.isActiveMap[namespace] = !ctrl.isActiveMap[namespace];

                    $timeout(function () {
                        _triggerEvent($document[0], 'click');
                    });

                    if (ctrl.isActiveMap[namespace]) {
                        _registerDocumentClick(namespace);
                    }
                };
                /**
                 * Change active state to false. If namespace is given, the state is changed for this namespace,
                 * if not then state for 'default' namespace is changed.
                 * @param {String} namespace Namespace under which toggle active is working
                 * @return {Boolean}
                 * @method deactivate
                 * @for ngToggle.scope
                 */
                $scope.deactivate = function (namespace) {
                    namespace = namespace || 'default';

                    ctrl.isActiveMap[namespace] = false;
                    $timeout(function () {
                        _triggerEvent($document[0], 'click');
                    });
                };
                /**
                 * Change active state to true. If namespace is given, the state is changed for this namespace,
                 * if not then state for 'default' namespace is changed.
                 * @param {String} namespace Namespace under which toggle active is working
                 * @return {Boolean}
                 * @method activate
                 * @for ngToggle.scope
                 */
                $scope.activate = function (namespace) {
                    namespace = namespace || 'default';

                    ctrl.isActiveMap[namespace] = true;
                    $timeout(function () {
                        _triggerEvent($document[0], 'click');
                    });
                    _registerDocumentClick(namespace);
                };
                /**
                 * The same as toggleActive.
                 * @param namespace Namespace under which toggle active is working
                 * @method toggleActive
                 * @for toggleActive.scope
                 */
                $scope.toggleActive = ctrl.toggleActive;
                /**
                 * Return information if given element is active in given ngToggle directive
                 * @param {String} namespace Namespace under which toggle active is working
                 * @return {Boolean}
                 * @method isActive
                 * @for ngToggle.scope
                 */
                $scope.isActive = function (namespace) {
                    namespace = namespace || 'default';

                    return ctrl.isActiveMap[namespace];
                };

            }]
        };
    }]);