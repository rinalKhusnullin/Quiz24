this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject;
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
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.user.auth', {
	          data: {
	            login: login,
	            password: password
	          }
	        }).then(function (response) {
	          console.log(response);
	          if (response.status === "success") {
	            // Авторизация прошла успешно
	            console.log('success');
	          } else {
	            // Ошибка авторизации
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
	      var _this = this;
	      var LoginContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"login-container-node\">\n\t\t\t\t<h1 class=\"title\">\u0412\u043E\u0439\u0442\u0438</h1>\n\t\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label class=\"label\">\u041B\u043E\u0433\u0438\u043D</label>\n\t\t\t\t\t<div class=\"control has-icons-left has-icons-right\">\n\t\t\t\t\t\t<input id=\"login-input\" class=\"input is-success\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u043E\u0433\u0438\u043D\" value=\"\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t\t\t<i class=\"fas fa-user\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class=\"icon is-small is-right\">\n\t\t\t\t\t\t\t<i class =\"fas fa-check\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"help is-success\">This username is available</p>\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label class=\"label\">\u041F\u0430\u0440\u043E\u043B\u044C</label>\n\t\t\t\t\t<p class=\"control has-icons-left\">\n\t\t\t\t\t\t<input id=\"password-input\" class=\"input\" type=\"password\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t\t\t<i class=\"fas fa-lock\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class=\"mb-2\">\u0415\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u043D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0435\u0433\u043E \u0442\u0443\u0442 - <a href=\"/registration\" class=\"\">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</a>\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class=\"field is-grouped\">\n\t\t\t\t\t<div class=\"control login-button\">\n\t\t\t\t\t\t<button id=\"submit-button\" class=\"button is-link\">\u0412\u043E\u0439\u0442\u0438</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      var loginInput = LoginContainerNode.querySelector('#login-input');
	      var passwordInput = LoginContainerNode.querySelector('#password-input');
	      var submitButton = LoginContainerNode.querySelector('#submit-button');
	      submitButton.onclick = function () {
	        _this.auth(loginInput.value, passwordInput.value);
	      };
	      this.rootNode.appendChild(LoginContainerNode);
	    }
	  }]);
	  return QuizLogin;
	}();

	exports.QuizLogin = QuizLogin;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
