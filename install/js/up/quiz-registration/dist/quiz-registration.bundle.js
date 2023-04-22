this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject;
	var QuizRegistration = /*#__PURE__*/function () {
	  function QuizRegistration() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizRegistration);
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizRegistration: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizRegistration: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.reload();
	  }
	  babelHelpers.createClass(QuizRegistration, [{
	    key: "registration",
	    value: function registration() {
	      var _this = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.user.registerUser', {
	          data: {
	            login: _this.login.value,
	            email: _this.email.value,
	            password: _this.password.value,
	            confirmPassword: _this.confirmPassword.value
	          }
	        }).then(function (response) {
	          console.log(response);
	          resolve(response.data);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "reload",
	    value: function reload() {
	      this.render();
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this2 = this;
	      this.rootNode.innerHTML = "";
	      var RegistrationFormNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"reg box\">\n\t\t\t\t<h1 class=\"title\">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</h1>\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label class=\"label\">\u041B\u043E\u0433\u0438\u043D</label>\n\t\t\t\t\t<div class=\"control has-icons-left has-icons-right\">\n\t\t\t\t\t\t<input class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u043E\u0433\u0438\u043D\" value=\"\" id=\"login-input\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t\t\t<i class=\"fas fa-user\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"help is-danger\" id=\"login-helper\"></p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"field\">\n\t\t\t\t<label class=\"label\">Email</label>\n\t\t\t\t\t<p class=\"control is-expanded has-icons-left has-icons-right\">\n\t\t\t\t\t\t<input class=\"input\" type=\"email\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 Email\" value=\"\" id=\"email-input\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t  \t\t<i class=\"fas fa-envelope\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t  \t</p>\n\t\t\t\t  \t<p class=\"help is-danger\" id=\"email-helper\"></p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label class=\"label\">\u041F\u0430\u0440\u043E\u043B\u044C</label>\n\t\t\t\t\t<p class=\"control has-icons-left\">\n\t\t\t\t\t\t<input class=\"input\" type=\"password\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C\" id=\"password-input\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t\t\t<i class=\"fas fa-lock\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class=\"help is-danger\" id=\"password-helper\"></p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label class=\"label\">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F</label>\n\t\t\t\t\t<p class=\"control has-icons-left\">\n\t\t\t\t\t\t<input class=\"input\" type=\"password\" placeholder=\"\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C\" id=\"confirm-password-input\">\n\t\t\t\t\t\t<span class=\"icon is-small is-left\">\n\t\t\t\t\t\t\t<i class=\"fas fa-lock\"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class=\"help is-danger\" id=\"confirm-password-helper\"></p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"mb-2\"><a href=\"/login\" class=\"is-underlined\">\u0412\u043E\u0439\u0434\u0438\u0442\u0435</a>, \u0435\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</div>\n\t\t\t\t<div class=\"field is-grouped\">\n\t\t\t\t\t<div class=\"control reg-button\">\n\t\t\t\t\t\t<button class=\"button is-link\" id=\"registration-button\">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.login = RegistrationFormNode.querySelector('#login-input');
	      this.email = RegistrationFormNode.querySelector('#email-input');
	      this.password = RegistrationFormNode.querySelector('#password-input');
	      this.confirmPassword = RegistrationFormNode.querySelector('#confirm-password-input');
	      this.loginHelper = RegistrationFormNode.querySelector('#login-helper');
	      this.emailHelper = RegistrationFormNode.querySelector('#email-helper');
	      this.passwordHelper = RegistrationFormNode.querySelector('#password-helper');
	      this.confirmPasswordHelper = RegistrationFormNode.querySelector('#confirm-password-helper');
	      var SubmitButton = RegistrationFormNode.querySelector('#registration-button');
	      this.login.oninput = function () {
	        _this2.loginHelper.textContent = '';
	        _this2.login.classList.remove('is-danger');
	      };
	      this.email.oninput = function () {
	        _this2.emailHelper.textContent = '';
	        _this2.email.classList.remove('is-danger');
	      };
	      this.password.oninput = function () {
	        _this2.passwordHelper.textContent = '';
	        _this2.password.classList.remove('is-danger');
	      };
	      this.confirmPassword.oninput = function () {
	        _this2.confirmPasswordHelper.textContent = '';
	        _this2.confirmPassword.classList.remove('is-danger');
	      };
	      SubmitButton.onclick = function () {
	        SubmitButton.classList.add('is-loading');
	        _this2.registration().then(function (answer) {
	          if (answer.status === 'success') {
	            SubmitButton.innerHTML = "<i class=\"fa-solid fa-check\"></i>";
	            SubmitButton.classList.add('is-success');
	            window.location.href = '/';
	          } else {
	            _this2.resetInputs();
	            _this2.showErrors(answer.message);
	          }
	          SubmitButton.classList.remove('is-loading');
	        });
	      };
	      this.rootNode.appendChild(RegistrationFormNode);
	    }
	  }, {
	    key: "showErrors",
	    value: function showErrors(errorMessage) {
	      errorMessage = errorMessage.toLowerCase();
	      var errors = errorMessage.split('<br>');
	      for (var i = 0; i < errors.length; i++) {
	        if (errors[i].includes('логин')) {
	          this.login.classList.add('is-danger');
	          this.loginHelper.textContent = errors[i];
	        } else if (errors[i].includes('пароль')) {
	          this.password.classList.add('is-danger');
	          this.passwordHelper.textContent = errors[i];
	        } else if (errors[i].includes('email')) {
	          this.email.classList.add('is-danger');
	          this.emailHelper.textContent = errors[i];
	        } else if (errors[i].includes('подтверждение пароля')) {
	          this.confirmPassword.classList.add('is-danger');
	          this.confirmPasswordHelper.textContent = errors[i];
	        }
	      }
	    }
	  }, {
	    key: "resetInputs",
	    value: function resetInputs() {
	      [this.login, this.password, this.email, this.confirmPassword].forEach(function (node) {
	        node.classList.remove('is-danger');
	      });
	      [this.loginHelper, this.passwordHelper, this.emailHelper, this.confirmPasswordHelper].forEach(function (node) {
	        node.textContent = '';
	      });
	    }
	  }]);
	  return QuizRegistration;
	}();

	exports.QuizRegistration = QuizRegistration;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
