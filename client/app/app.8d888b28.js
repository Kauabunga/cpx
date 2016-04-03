"use strict";function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}angular.module("cpxApp",["cpxApp.auth","cpxApp.admin","cpxApp.constants","ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","validation.match","ngStorage","ngMaterial"]).config(["$urlRouterProvider","$locationProvider",function(a,b){a.otherwise("/"),b.html5Mode(!0)}]),angular.module("cpxApp.admin",["cpxApp.auth","ui.router"]),angular.module("cpxApp.auth",["cpxApp.constants","cpxApp.util","ngCookies","ui.router"]).config(["$httpProvider",function(a){a.interceptors.push("authInterceptor")}]),angular.module("cpxApp.util",[]),function(){angular.module("cpxApp.auth").run(["$rootScope","$state","Auth",function(a,b,c){a.$on("$stateChangeStart",function(a,d){d.authenticate&&("string"==typeof d.authenticate?c.hasRole(d.authenticate,_.noop).then(function(d){return d?void 0:(a.preventDefault(),c.isLoggedIn(_.noop).then(function(a){b.go(a?"main":"login")}))}):c.isLoggedIn(_.noop).then(function(c){c||(a.preventDefault(),b.go("main"))}))})}])}();var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();!function(){var a=function(){function a(b){_classCallCheck(this,a),this.users=b.query()}return a.$inject=["User"],_createClass(a,[{key:"delete",value:function(a){a.$remove(),this.users.splice(this.users.indexOf(a),1)}}]),a}();angular.module("cpxApp.admin").controller("AdminController",a)}(),angular.module("cpxApp").config(["$stateProvider",function(a){a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginController",controllerAs:"vm"}).state("logout",{url:"/logout?referrer",referrer:"main",template:"",controller:["$state","Auth",function(a,b){var c=a.params.referrer||a.current.referrer||"main";b.logout(),a.go(c)}]}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupController",controllerAs:"vm"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsController",controllerAs:"vm",authenticate:!0})}]).run(["$rootScope",function(a){a.$on("$stateChangeStart",function(a,b,c,d){"logout"===b.name&&d&&d.name&&!d.authenticate&&(b.referrer=d.name)})}]),angular.module("cpxApp.admin").config(["$stateProvider",function(a){a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminController",controllerAs:"admin",authenticate:"admin"})}]),function(a,b){a.module("cpxApp.constants",[]).constant("appConfig",{userRoles:["guest","user","admin"]})}(angular);var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();!function(){var a=function(){function a(b,c,d,e,f){var g=this;_classCallCheck(this,a),this.$http=b,this.awesomeThings=[],this.bicSearchQuery="",this.searchBic=e.search,this.searchBusinessnames=f.search,e.createSearchIndex(),b.get("/api/things").then(function(a){g.awesomeThings=a.data,d.syncUpdates("thing",g.awesomeThings)}),c.$on("$destroy",function(){d.unsyncUpdates("thing")})}return a.$inject=["$http","$scope","socket","bic","businessnames"],_createClass(a,[{key:"addThing",value:function(){this.newThing&&(this.$http.post("/api/things",{name:this.newThing}),this.newThing="")}},{key:"deleteThing",value:function(a){this.$http["delete"]("/api/things/"+a._id)}}]),a}();angular.module("cpxApp").controller("MainController",a)}(),angular.module("cpxApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"main"})}]);var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),SettingsController=function(){function a(b){_classCallCheck(this,a),this.errors={},this.submitted=!1,this.Auth=b}return a.$inject=["Auth"],_createClass(a,[{key:"changePassword",value:function(a){var b=this;this.submitted=!0,a.$valid&&this.Auth.changePassword(this.user.oldPassword,this.user.newPassword).then(function(){b.message="Password successfully changed."})["catch"](function(){a.password.$setValidity("mongoose",!1),b.errors.other="Incorrect password",b.message=""})}}]),a}();angular.module("cpxApp").controller("SettingsController",SettingsController),function(){function a(a,b,c,d,e,f,g){var h=f.safeCb,i={},j=e.userRoles||[];c.get("token")&&"/logout"!==a.path()&&(i=g.get());var k={login:function(a,e){return b.post("/auth/local",{email:a.email,password:a.password}).then(function(a){return c.put("token",a.data.token),i=g.get(),i.$promise}).then(function(a){return h(e)(null,a),a})["catch"](function(a){return k.logout(),h(e)(a.data),d.reject(a.data)})},logout:function(){c.remove("token"),i={}},createUser:function(a,b){return g.save(a,function(d){return c.put("token",d.token),i=g.get(),h(b)(null,a)},function(a){return k.logout(),h(b)(a)}).$promise},changePassword:function(a,b,c){return g.changePassword({id:i._id},{oldPassword:a,newPassword:b},function(){return h(c)(null)},function(a){return h(c)(a)}).$promise},getCurrentUser:function(a){if(0===arguments.length)return i;var b=i.hasOwnProperty("$promise")?i.$promise:i;return d.when(b).then(function(b){return h(a)(b),b},function(){return h(a)({}),{}})},isLoggedIn:function(a){return 0===arguments.length?i.hasOwnProperty("role"):k.getCurrentUser(null).then(function(b){var c=b.hasOwnProperty("role");return h(a)(c),c})},hasRole:function l(a,b){var l=function(a,b){return j.indexOf(a)>=j.indexOf(b)};return arguments.length<2?l(i.role,a):k.getCurrentUser(null).then(function(c){var d=c.hasOwnProperty("role")?l(c.role,a):!1;return h(b)(d),d})},isAdmin:function(){return k.hasRole.apply(k,[].concat.apply(["admin"],arguments))},getToken:function(){return c.get("token")}};return k}a.$inject=["$location","$http","$cookies","$q","appConfig","Util","User"],angular.module("cpxApp.auth").factory("Auth",a)}(),function(){function a(a,b,c,d,e){var f;return{request:function(a){return a.headers=a.headers||{},c.get("token")&&e.isSameOrigin(a.url)&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status&&((f||(f=d.get("$state"))).go("login"),c.remove("token")),b.reject(a)}}}a.$inject=["$rootScope","$q","$cookies","$injector","Util"],angular.module("cpxApp.auth").factory("authInterceptor",a)}();var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),LoginController=function(){function a(b,c){_classCallCheck(this,a),this.user={},this.errors={},this.submitted=!1,this.Auth=b,this.$state=c}return a.$inject=["Auth","$state"],_createClass(a,[{key:"login",value:function(a){var b=this;this.submitted=!0,a.$valid&&this.Auth.login({email:this.user.email,password:this.user.password}).then(function(){b.$state.go("main")})["catch"](function(a){b.errors.other=a.message})}}]),a}();angular.module("cpxApp").controller("LoginController",LoginController),function(){function a(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}a.$inject=["$resource"],angular.module("cpxApp.auth").factory("User",a)}(),angular.module("cpxApp").service("bic",["$q","$http","$window","$log","$timeout",function(a,b,c,d,e){var f=this;this.bicStore={},this.bicIndex=void 0,e(this.getSearchIndex),this.search=function(a){return f.getSearchIndex().then(function(b){return _(b.search(a)).map(function(a){return f.getBicByRef(a.ref)}).value()})},this.getSearchIndex=function(){return f.bicIndex?a.when(f.bicIndex):f.createSearchIndex()},this.createSearchIndex=function(){return f.createBicIndex?f.createBicIndex:f.createBicIndex=f.getBics().then(function(a){var b=lunr(function(){this.ref("code"),this.field("code"),this.field("desc"),this.field("industryName"),this.field("divisionName"),this.field("className"),this.field("keywordsFlattened"),this.field("definitionPlainText")});return b.pipeline.add(lunr.trimmer,lunr.stopWordFilter,lunr.stemmer),_.forEach(a,function(a){a.keywordsFlattened=a.keywords&&a.keywords.join(" ")||"",b.add(a),f.bicStore[a.code.toString()]=a}),f.bicIndex=b})},this.getBicByRef=function(a){return f.bicStore[a]},this.getBics=function(){return c._bic||b.get("/api/bics",{cache:!0}).then(function(a){return a.data})}}]),angular.module("cpxApp").service("businessnames",["$http","$q",function(a,b){this.search=function(c){return c?a.get("/api/businessnames/"+c).then(function(a){return a.data}):b.when([])}}]),angular.module("cpxApp").directive("footer",function(){return{templateUrl:"components/footer/footer.html",restrict:"E",link:function(a,b){b.addClass("footer")}}}),angular.module("cpxApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}});var NavbarController=function a(b){_classCallCheck(this,a),this.menu=[{title:"Home",state:"main"}],this.isCollapsed=!0,this.isLoggedIn=b.isLoggedIn,this.isAdmin=b.isAdmin,this.getCurrentUser=b.getCurrentUser};NavbarController.$inject=["Auth"],angular.module("cpxApp").controller("NavbarController",NavbarController),angular.module("cpxApp").directive("navbar",function(){return{templateUrl:"components/navbar/navbar.html",restrict:"E",controller:"NavbarController",controllerAs:"nav"}}),angular.module("cpxApp").controller("OauthButtonsCtrl",["$window",function(a){this.loginOauth=function(b){a.location.href="/auth/"+b}}]),angular.module("cpxApp").directive("oauthButtons",function(){return{templateUrl:"components/oauth-buttons/oauth-buttons.html",restrict:"EA",controller:"OauthButtonsCtrl",controllerAs:"OauthButtons",scope:{classes:"@"}}}),angular.module("cpxApp").factory("socket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}]);var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),SignupController=function(){function a(b,c){_classCallCheck(this,a),this.user={},this.errors={},this.submitted=!1,this.Auth=b,this.$state=c}return a.$inject=["Auth","$state"],_createClass(a,[{key:"register",value:function(a){var b=this;this.submitted=!0,a.$valid&&this.Auth.createUser({name:this.user.name,email:this.user.email,password:this.user.password}).then(function(){b.$state.go("main")})["catch"](function(c){c=c.data,b.errors={},angular.forEach(c.errors,function(c,d){a[d].$setValidity("mongoose",!1),b.errors[d]=c.message})})}}]),a}();angular.module("cpxApp").controller("SignupController",SignupController),function(){function a(a){var b={safeCb:function(a){return angular.isFunction(a)?a:angular.noop},urlParse:function(a){var b=document.createElement("a");return b.href=a,b},isSameOrigin:function(c,d){return c=b.urlParse(c),d=d&&[].concat(d)||[],d=d.map(b.urlParse),d.push(a.location),d=d.filter(function(a){return c.hostname===a.hostname&&c.port===a.port&&c.protocol===a.protocol}),d.length>=1}};return b}a.$inject=["$window"],angular.module("cpxApp.util").factory("Util",a)}(),angular.module("cpxApp").run(["$templateCache",function(a){a.put("app/account/login/login.html",'<navbar></navbar><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from<code>server/config/seed.js</code>. Default account is<code>test@example.com</code>/<code>test</code></p><p>Admin account is<code>admin@example.com</code>/<code>admin</code></p></div><div class=col-sm-12><form name=form ng-submit=vm.login(form) novalidate class=form><div class=form-group><label>Email</label><input type=email name=email ng-model=vm.user.email class="form-control"></div><div class=form-group><label>Password</label><input type=password name=password ng-model=vm.user.password class="form-control"></div><div class="form-group has-error"><p ng-show="form.email.$error.required &amp;&amp; form.password.$error.required &amp;&amp; vm.submitted" class=help-block>Please enter your email and password.</p><p class=help-block>{{ vm.errors.other }}</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-login">Login</button> <a ui-sref=signup class="btn btn-default btn-lg btn-register">Register</a></div><hr><div class=row><div class="col-sm-4 col-md-3"><oauth-buttons classes=btn-block></oauth-buttons></div></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<navbar></navbar><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form name=form ng-submit=vm.changePassword(form) novalidate class=form><div class=form-group><label>Current Password</label><input type=password name=password ng-model=vm.user.oldPassword mongoose-error="" class="form-control"><p ng-show=form.password.$error.mongoose class=help-block>{{ vm.errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword ng-model=vm.user.newPassword ng-minlength=3 required class="form-control"><p ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) &amp;&amp; (form.newPassword.$dirty || vm.submitted)" class=help-block>Password must be at least 3 characters.</p></div><div class=form-group><label>Confirm New Password</label><input type=password name=confirmPassword ng-model=vm.user.confirmPassword match=vm.user.newPassword ng-minlength=3 required class="form-control"><p ng-show="fvm.orm.confirmPassword.$error.match &amp;&amp; vm.submitted" class=help-block>Passwords must match.</p></div><p class=help-block>{{ vm.message }}</p><button type=submit class="btn btn-lg btn-primary">Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<navbar></navbar><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form name=form ng-submit=vm.register(form) novalidate class=form><div ng-class="{ &quot;has-success&quot;: form.name.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.name.$invalid &amp;&amp; vm.submitted }" class=form-group><label>Name</label><input name=name ng-model=vm.user.name required class="form-control"><p ng-show="form.name.$error.required &amp;&amp; vm.submitted" class=help-block>A name is required</p></div><div ng-class="{ &quot;has-success&quot;: form.email.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.email.$invalid &amp;&amp; vm.submitted }" class=form-group><label>Email</label><input type=email name=email ng-model=vm.user.email required mongoose-error="" class="form-control"><p ng-show="form.email.$error.email &amp;&amp; vm.submitted" class=help-block>Doesn\'t look like a valid email.</p><p ng-show="form.email.$error.required &amp;&amp; vm.submitted" class=help-block>What\'s your email address?</p><p ng-show=form.email.$error.mongoose class=help-block>{{ vm.errors.email }}</p></div><div ng-class="{ &quot;has-success&quot;: form.password.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.password.$invalid &amp;&amp; vm.submitted }" class=form-group><label>Password</label><input type=password name=password ng-model=vm.user.password mongoose-error="" ng-minlength=3 required class="form-control"><p ng-show="(form.password.$error.minlength || form.password.$error.required) &amp;&amp; vm.submitted" class=help-block>Password must be at least 3 characters.</p><p ng-show=form.password.$error.mongoose class=help-block>{{ vm.errors.password }}</p></div><div ng-class="{ &quot;has-success&quot;: form.confirmPassword.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.confirmPassword.$invalid &amp;&amp; vm.submitted }" class=form-group><label>Confirm Password</label><input type=password name=confirmPassword ng-model=vm.user.confirmPassword match=vm.user.password ng-minlength=3 required class="form-control"><p ng-show="form.confirmPassword.$error.match &amp;&amp; vm.submitted" class=help-block>Passwords must match.</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-register">Sign up</button> <a ui-sref=login class="btn btn-default btn-lg btn-login">Login</a></div><hr><div class=row><div class="col-sm-4 col-md-3"><oauth-buttons classes=btn-block></oauth-buttons></div></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<navbar></navbar><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li ng-repeat="user in admin.users" class=list-group-item><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span><a ng-click=admin.delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/main/main.html",'<!--navbar--><md-content><form class=bic-autocomplete-test><md-autocomplete md-selected-item=main.selectedBic md-search-text=main.bicSearchQuery md-autoselect=true md-items="bicItem in main.searchBic(main.bicSearchQuery)" md-min-length=1 md-delay=100 md-item-text="bicItem.name+ &quot;: &quot; + bicItem.desc" placeholder="Search for a bic" md-match-case-insensitive=true md-menu-class=autocomplete-bic-template><md-item-template><span class=bic-autocomplete-item><strong md-highlight-text=main.bicSearchQuery md-highlight-flags=^i class=bic-item-title>{{bicItem.code}}: {{bicItem.desc}}</strong><span class=bic-item-definition>{{bicItem.definitionPlainText}}</span></span></md-item-template><md-not-found>No bic matching "{{main.bicSearchQuery}}" were found.</md-not-found></md-autocomplete></form></md-content><md-content><form class=businessnames-autocomplete-test><md-autocomplete md-selected-item=main.selectedBusinessname md-search-text=main.businessnameSearchQuery md-autoselect=true md-items="businessnameItem in main.searchBusinessnames(main.businessnameSearchQuery)" md-min-length=1 md-delay=100 md-item-text="businessnameItem.name + &quot; (&quot; + businessnameItem.businessNumber + &quot;)&quot;" placeholder="Search for a business name" md-match-case-insensitive=true md-menu-class=autocomplete-businessname-template><md-item-template><span class=businessname-autocomplete-item><strong md-highlight-text=main.businessnameSearchQuery md-highlight-flags=^i class=businessname-item-title>{{businessnameItem.name}} ({{businessnameItem.businessNumber}})</strong><span class=businessname-item-definition>{{businessnameItem.address}}</span></span></md-item-template><md-not-found>No businessname matching "{{main.businessnameSearchQuery}}" were found.</md-not-found></md-autocomplete></form></md-content><md-content><h1 class=page-header>Features:</h1><ul ng-repeat="thing in main.awesomeThings" class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6"><li><a href=# tooltip={{thing.info}}>{{thing.name}}<button type=button ng-click=main.deleteThing(thing) class=close>&times;</button></a></li></ul></md-content><md-content><form class=thing-form><label>Syncs in realtime across clients</label><p class=input-group><input placeholder="Add a new thing here." ng-model=main.newThing class="form-control"><span class=input-group-btn><button type=submit ng-click=main.addThing() class="btn btn-primary">Add New</button></span></p></form></md-content><!--footer-->'),a.put("components/footer/footer.html",'<div class=container><p>Angular Fullstack v3.1.1 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div>'),a.put("components/navbar/navbar.html",'<div ng-controller=NavbarController class="navbar navbar-default navbar-static-top"><div class=container><div class=navbar-header><button type=button ng-click="nav.isCollapsed = !nav.isCollapsed" class=navbar-toggle><span class=sr-only>Toggle navigation</span><span class=icon-bar></span><span class=icon-bar></span><span class=icon-bar></span></button><a href="/" class=navbar-brand>cpx</a></div><div id=navbar-main collapse=nav.isCollapsed class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-repeat="item in nav.menu" ui-sref-active=active><a ui-sref={{item.state}}>{{item.title}}</a></li><li ng-show=nav.isAdmin() ui-sref-active=active><a ui-sref=admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-hide=nav.isLoggedIn() ui-sref-active=active><a ui-sref=signup>Sign up</a></li><li ng-hide=nav.isLoggedIn() ui-sref-active=active><a ui-sref=login>Login</a></li><li ng-show=nav.isLoggedIn()><p class=navbar-text>Hello {{ nav.getCurrentUser().name }}</p></li><li ng-show=nav.isLoggedIn() ui-sref-active=active><a ui-sref=settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=nav.isLoggedIn()><a ui-sref=logout>Logout</a></li></ul></div></div></div>'),a.put("components/oauth-buttons/oauth-buttons.html",'<a ng-class=classes ng-click=OauthButtons.loginOauth(&quot;facebook&quot;) class="btn btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a><a ng-class=classes ng-click=OauthButtons.loginOauth(&quot;google&quot;) class="btn btn-google"><i class="fa fa-google-plus"></i> Connect with Google+</a><a ng-class=classes ng-click=OauthButtons.loginOauth(&quot;twitter&quot;) class="btn btn-twitter"><i class="fa fa-twitter"></i> Connect with Twitter</a>')}]);