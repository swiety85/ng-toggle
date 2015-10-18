describe('Toggle-active directive', function(){

    var $scope,
        $compile,
        $document,
        $timeout;

    beforeEach(angular.mock.module('ngToggle'));
    beforeEach(angular.mock.inject([
        '$rootScope', '$compile', '$document', '$timeout',
        function($rootScope, $$compile, $$document, $$timeout){
            $scope = $rootScope.$new();
            $compile = $$compile;
            $document = $$document;
            $timeout = $$timeout;
        }
    ]));


    it('should hide toggle-show directive on init', function(){

        var el = $compile('<div ng-toggle><div ng-toggle-show></div></div>')($scope);
        $scope.$digest();

        expect($(el).children().hasClass('ng-hide')).toBe(true);
    });

    it('should provide toggleActive method on controller and scope', function(){

        var el = $compile('<div ng-toggle><div ng-toggle-show></div></div>')($scope);
        $scope.$digest();

        expect(el.controller('ngToggle').toggleActive).toBeDefined();
        expect(el.children().scope().toggleActive).toBeDefined();
        expect(el.children().scope().toggleActive).toBe(el.controller('ngToggle').toggleActive);
    });

    it('should define "default" namespace in isActiveMap if its not defined na directive', function(){

        var el = $compile('<div ng-toggle><div ng-toggle-show></div></div>')($scope);
        $scope.$digest();

        expect(el.controller('ngToggle').isActiveMap).toBeDefined();
        expect(el.controller('ngToggle').isActiveMap['default']).toBeDefined();
        expect(el.controller('ngToggle').isActiveMap['default']).toBe(false);
    });

    it('should isActiveMap should react on toggleAcitive method', function(){

        var el = $compile('<div ng-toggle><div ng-toggle-show></div></div>')($scope);
        $scope.$digest();

        expect(el.controller('ngToggle').isActiveMap['default']).toBe(false);
        el.controller('ngToggle').toggleActive();
        expect(el.controller('ngToggle').isActiveMap['default']).toBe(true);
        el.controller('ngToggle').toggleActive();
        expect(el.controller('ngToggle').isActiveMap['default']).toBe(false);
    });

    it('should change toggleShow visibility on toggleAcitive method', function(){

        var el = $compile('<div ng-toggle><div ng-toggle-show></div></div>')($scope);
        $scope.$digest();

        expect($(el).children().hasClass('ng-hide')).toBe(true);
        el.controller('ngToggle').toggleActive();
        $scope.$digest();
        expect($(el).children().hasClass('ng-hide')).toBe(false);
        el.controller('ngToggle').toggleActive();
        $scope.$digest();
        expect($(el).children().hasClass('ng-hide')).toBe(true);
    });

    it('should isActiveMap should react on toggleAcitive method with different namespaces', function(){

        var el = $compile('<div ng-toggle><div ng-toggle-show="namespace1"></div>' +
            '<div ng-toggle-show="namespace2"></div></div>')($scope);
        $scope.$digest();

        expect(el.controller('ngToggle').isActiveMap['namespace1']).toBe(false);
        expect(el.controller('ngToggle').isActiveMap['namespace2']).toBe(false);
        el.controller('ngToggle').toggleActive();
        expect(el.controller('ngToggle').isActiveMap['namespace1']).toBe(false);
        expect(el.controller('ngToggle').isActiveMap['namespace2']).toBe(false);
        el.controller('ngToggle').toggleActive('namespace1');
        expect(el.controller('ngToggle').isActiveMap['namespace1']).toBe(true);
        expect(el.controller('ngToggle').isActiveMap['namespace2']).toBe(false);
        el.controller('ngToggle').toggleActive('namespace1');
        el.controller('ngToggle').toggleActive('namespace2');
        expect(el.controller('ngToggle').isActiveMap['namespace1']).toBe(false);
        expect(el.controller('ngToggle').isActiveMap['namespace2']).toBe(true);
    });

    it('should change toggleShow visibility on toggleAcitive method with different namespaces', function(){

        var el = $compile('<div ng-toggle><div ng-toggle-show="namespace1"></div>' +
        '<div ng-toggle-show="namespace2"></div></div>')($scope);
        $scope.$digest();

        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(true);
        el.controller('ngToggle').toggleActive();
        $scope.$digest();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(true);
        el.controller('ngToggle').toggleActive('namespace1');
        $scope.$digest();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(false);
        expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(true);
        el.controller('ngToggle').toggleActive('namespace1');
        el.controller('ngToggle').toggleActive('namespace2');
        $scope.$digest();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(false);
    });

    it('should use toggleHideClass to add class when toggleShow is not active', function () {
        var el = $compile('<div ng-toggle><div ng-toggle-show ng-toggle-hide-class="custom-hide"></div></div>')($scope);
        $scope.$digest();

        expect($(el).children('[ng-toggle-show]').hasClass('ng-hide')).toBe(false);
        expect($(el).children('[ng-toggle-show]').hasClass('custom-hide')).toBe(true);
        el.controller('ngToggle').toggleActive();
        $scope.$digest();
        expect($(el).children('[ng-toggle-show]').hasClass('custom-hide')).toBe(false);
    });

    it('should use toggleShowClass to add class when toggleShow is active', function () {
        var el = $compile('<div ng-toggle><div ng-toggle-show ng-toggle-show-class="custom-show" ng-toggle-hide-class="">' +
            '</div></div>')($scope);
        $scope.$digest();

        expect($(el).children('[ng-toggle-show]').hasClass('ng-hide')).toBe(false);
        expect($(el).children('[ng-toggle-show]').hasClass('custom-show')).toBe(false);
        el.controller('ngToggle').toggleActive();
        $scope.$digest();
        expect($(el).children('[ng-toggle-show]').hasClass('custom-show')).toBe(true);
        el.controller('ngToggle').toggleActive();
        $scope.$digest();
        expect($(el).children('[ng-toggle-show]').hasClass('custom-show')).toBe(false);
    });

    it('should deactivate all areas on document click outside of toggle-show directive', function () {
        var el = angular.element('<div ng-toggle><div ng-toggle-show="namespace1"></div>' +
            '<div ng-toggle-show="namespace2"></div></div>');
        $('body').append(el);
        $compile(el)($scope);

        $scope.$digest();

        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(true);
        el.controller('ngToggle').toggleActive('namespace1');
        $scope.$digest();
        $timeout.flush();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(false);
        expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(true);
        el.controller('ngToggle').toggleActive('namespace2');
        $scope.$digest();
        $timeout.flush();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(false);
        $('body').trigger('click');
        $scope.$digest();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        //expect($(el).children('[ng-toggle-show="namespace2"]').hasClass('ng-hide')).toBe(true);
    });

    it('should show toggleShow directive on activate method with different namespaces', function () {
        var el = $compile('<div ng-toggle><div ng-toggle-show="namespace1"></div>' +
        '<div ng-toggle-show="namespace2"></div></div>')($scope);
        $scope.$digest();

        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        el.scope().activate('namespace1');
        $scope.$digest();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(false);
    });

    it('should hide toggleShow directive on deactivate method with different namespaces', function () {
        var el = $compile('<div ng-toggle><div ng-toggle-show="namespace1"></div>' +
        '<div ng-toggle-show="namespace2"></div></div>')($scope);
        $scope.$digest();

        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
        el.scope().toggleActive('namespace1');
        $scope.$digest();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(false);
        el.scope().deactivate('namespace1');
        $scope.$digest();
        expect($(el).children('[ng-toggle-show="namespace1"]').hasClass('ng-hide')).toBe(true);
    });

    it('should provide method isActive that returns current state of ngToggle directive for given namespace',
    function () {

        var el = $compile('<div ng-toggle><div ng-toggle-show="namespace1"></div>' +
        '<div ng-toggle-show="namespace2"></div></div>')($scope);
        $scope.$digest();

        expect(el.scope().isActive('namespace1')).toBe(false);
        expect(el.scope().isActive('namespace2')).toBe(false);
        el.scope().toggleActive('namespace1');
        $timeout.flush();
        expect(el.scope().isActive('namespace1')).toBe(true);
        expect(el.scope().isActive('namespace2')).toBe(false);
        el.scope().toggleActive('namespace2');
        $timeout.flush();
        expect(el.scope().isActive('namespace1')).toBe(false);
        expect(el.scope().isActive('namespace2')).toBe(true);
        el.scope().toggleActive('namespace1');
        $timeout.flush();
        expect(el.scope().isActive('namespace1')).toBe(true);
        expect(el.scope().isActive('namespace2')).toBe(false);
    });
});