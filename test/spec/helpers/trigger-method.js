define(['lodash', 'helpers/trigger-method'], function(_, triggerMethod){
	'use strict';

	var obj;

	beforeEach(function(){

		obj = {

			trigger: function(){

			},

			onFoo: function(){},

			onFooBar: function(){}

		};

		_.extend(obj, {
			triggerMethod: triggerMethod
		});

	});

	describe('triggerMethod', function(){		
		
		it('should trigger an event if trigger method exists', function(){

			spyOn(obj, 'trigger');

			obj.triggerMethod('foo');

			expect(obj.trigger.calls.count()).toEqual(1);

		});

		it('should pass the name of the event as the first argument for the "trigger" method', function(){

			spyOn(obj, 'trigger');

			obj.triggerMethod('foo');

			expect(obj.trigger.calls.mostRecent().args).toEqual(['foo']);

		});

		it('should call the onMethodName if it exists', function(){
			
			spyOn(obj, 'onFoo');

			obj.triggerMethod('foo');

			expect(obj.onFoo.calls.count()).toEqual(1);

		});

		it('should convert event names to camelCase methodNames this.triggerMethod("foo:bar") will trigger the "foo:bar" event and call the "onFooBar" method ', function(){

			spyOn(obj, 'onFooBar');

			obj.triggerMethod('foo:bar');

			expect(obj.onFooBar.calls.count()).toEqual(1);

		});

		it('should pass arguments', function(){

			spyOn(obj, 'trigger');

			obj.triggerMethod('foo', 12, 'what the hell up');

			expect(obj.trigger.calls.mostRecent().args).toEqual(['foo', 12, 'what the hell up']);

		});

	});

});