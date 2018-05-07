//初始化数据
function mvvm(vm) {
	//绑定数据
	this.data = vm.data;
	//绑定域
	let el = document.getElementById(vm.el);
	//初始化订阅器
	let dep = new Dep();
	eachElDo(el, vm)
	//循环获取所有dom树
	function eachElDo(el, vm) {
		//data属性
		attrHandler_data(el, vm);
		//事件处理
		attrHandler_event(el, vm)
		for (var i = 0; i < el.children.length; i++) {
			eachElDo(el.children[i], vm);
		}
	}
	//数据绑定（data）
	function attrHandler_data(el, vm) {
		if (el.getAttribute("data")) {
			let action = {
				update: () => {
					switch (el.localName) {
						case "input":
							el.value = vm.data[el.getAttribute("data")];
							break;
						case "div":
							break;
						default:
							el.innerText = vm.data[el.getAttribute("data")];
					}
				}
			}
			//输入(事件)绑定
			switch (el.localName) {
				case "input":
					el.addEventListener('input', () => {
						vm.data[el.getAttribute("data")] = el.value;
					})
					break;
				case "div":
					break;
				default:
					el.addEventListener('onchange', () => {
						vm.data[el.getAttribute("data")] = el.innerText;
					})
			}
			//添加观察者
			dep.addSub(action);
		}
	}
	//初始化发布器
	observe(this.data, dep);
	//事件管理
	function attrHandler_event(el, vm) {
		//绑定所有符合条件的元素
		for (var i = 0; i < el.attributes.length; i++) {
			if (/@/i.test(el.attributes[i].nodeName)) {
				let myEvent = el.attributes[i].nodeName.replace("@", "")
				el.addEventListener(myEvent, () => {
					vm.action[el.getAttribute('@' + myEvent)]();
				}, false)
			}
		}
	}
	//发布器
	function observe(data, dep) {
		if (!data || typeof data !== 'object') {
			return;
		}
		// 获取data中的所有属性（say）
		Object.keys(data).forEach((key) => {
			defineReactive(data, key, data[key], dep);
		});
	};
	//为该对象设置属性，添加getter，setter，绑定订阅者
	function defineReactive(data, key, val, dep) {
		// 监听子属性
		observe(val);
		//设置访问器及属性
		Object.defineProperty(data, key, {
			// 可枚举
			enumerable: true,
			// 不能再define
			configurable: false,
			//设置getter
			get: () => {
				return val;
			},
			//设置setter
			set: (newVal) => {
				//console.log(val, '=>', newVal);
				//更新值
				val = newVal;
				// 通知所有订阅者
				dep.notify();
			}
		});
	}
	//订阅器
	function Dep() {
		//订阅数组
		this.subs = [];
		//添加订阅
		this.addSub = (sub) => {
			this.subs.push(sub);
		};
		//删除订阅
		this.delSub = (key) => {
			// 	//delete this.sub[key];
		};
		//触发回调,通知所有订阅者，触发update()
		this.notify = () => {
			this.subs.forEach((sub) => {
				sub.update();
			});
		}
	};
	return vm;
}
