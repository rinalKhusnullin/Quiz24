this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2;
	var QuizLogin = /*#__PURE__*/function () {
	  function QuizLogin() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizLogin);
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizLogin: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizLogin: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.reload();
	  }
	  babelHelpers.createClass(QuizLogin, [{
	    key: "reload",
	    value: function reload() {
	      this.render();
	    }
	  }, {
	    key: "auth",
	    value: function auth(login, password) {
	      var _this = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.user.auth', {
	          data: {
	            login: login,
	            password: password
	          }
	        }).then(function (response) {
	          console.log(response);
	          if (response.status === "success") {
	            if (response.data.status === "success") {
	              resolve(true);
	              document.location.href = '/';
	            } else {
	              resolve(false);
	              _this.failAuth();
	            }
	          } else {
	            console.log(response.message);
	          }
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this2 = this;
	      var LoginContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"login-container-node\">\n\t\t\t\t<h1 class=\"title\">\u0412\u043E\u0439\u0442\u0438</h1>\n\t\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label class=\"label\">\u041B\u043E\u0433\u0438\u043D</label>\n\t\t\t\t\t<div class=\"control has-icons-left has-icons-right\">\n\t\t\t\t\t\t<input id=\"login-input\" class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u043E\u0433\u0438\u043D\" value=\"\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t\t\t<i class=\"fas fa-user\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label class=\"label\">\u041F\u0430\u0440\u043E\u043B\u044C</label>\n\t\t\t\t\t<p class=\"control has-icons-left\">\n\t\t\t\t\t\t<input id=\"password-input\" class=\"input\" type=\"password\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t\t\t<i class=\"fas fa-lock\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<article class=\"message is-danger\" id=\"error-container\"></article>\n\t\n\t\t\t\t<div class=\"mb-2\">\u0415\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u043D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 <a href=\"/registration\" class=\"is-underlined\">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0435\u0433\u043E</a>\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class=\"field is-grouped\">\n\t\t\t\t\t<div class=\"control login-button\">\n\t\t\t\t\t\t<button id=\"submit-button\" class=\"button is-link\">\u0412\u043E\u0439\u0442\u0438</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      var loginInput = LoginContainerNode.querySelector('#login-input');
	      var passwordInput = LoginContainerNode.querySelector('#password-input');
	      var submitButton = LoginContainerNode.querySelector('#submit-button');
	      submitButton.onclick = function () {
	        submitButton.classList.add('is-loading');
	        _this2.auth(loginInput.value, passwordInput.value).then(function (isSuccess) {
	          if (isSuccess) {
	            submitButton.innerHTML = "<i class=\"fa-solid fa-check\"></i>";
	            submitButton.classList.add('is-success');
	          }
	          submitButton.classList.remove('is-loading');
	        });
	      };
	      this.rootNode.appendChild(LoginContainerNode);
	    }
	  }, {
	    key: "failAuth",
	    value: function failAuth() {
	      var errorContainer = document.getElementById('error-container');
	      var loginInput = document.getElementById('login-input');
	      var passwordInput = document.getElementById('password-input');
	      if (!errorContainer.hasChildNodes()) {
	        errorContainer.appendChild(main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["<div class=\"message-body\">\n\t\t\t\t\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 <strong>\u041B\u043E\u0433\u0438\u043D</strong> \u0438\u043B\u0438 <strong>\u041F\u0430\u0440\u043E\u043B\u044C</strong>\n\t\t\t</div>"]))));
	      }
	      var inputs = [loginInput, passwordInput];
	      inputs.forEach(function (input) {
	        input.classList.add('is-danger');
	        input.oninput = function () {
	          inputs.forEach(function (input) {
	            input.classList.remove('is-danger');
	          });
	          errorContainer.innerHTML = "";
	        };
	      });
	    }
	  }]);
	  return QuizLogin;
	}();

	exports.QuizLogin = QuizLogin;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
