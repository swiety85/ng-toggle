# ng-toggle
AngularJS directives for toggling show element and hide on click outside

## Usage

Toggle active module providing toggleActive and toggleShow directives. Both these directives can not work
separately - toggleShow directive should be nested into toggleActive directive. These directives
are very helpful when you need something like dropdown - its showed when you click button and hides when you
click outside. ToggleActive directive provides "toggleActive", "activate", "deactivate" methods on its scope,
that is used to change states of (toggleShow) area visibility.

```javascript
<div class="menu" toggle-active>
    <button ng-click="toggleActive()">Show dropdown</button>
    <div class="menu-dropdown" toggle-show>
        Sample content
    </div>
</div>
```

When you have more then one dropdown in the same DOM element, you can use "namespace" feature provided
by toggleActive directive. When we assign a value (namespace) in toggleShow directive attribute we can call
"toggleActive" method passing this namespace as a param. Then it will toggle state on only this one toggleShow area.

```javascript
 <div class="menu" toggle-active>
    <button ng-click="toggleActive('dropdown1')">Show dropdown 1</button>
    <button ng-click="toggleActive('dropdown2')">Show dropdown 2</button>
    <div toggle-show="dropdown1">
        Sample content 1
    </div>
    <div toggle-show="dropdown2">
        Sample content 2
    </div>
</div>
```

Checking current state of toggleActive can be done with "isActive" method.