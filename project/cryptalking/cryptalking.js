/* ECMAScript 6 enabled! */
"use strict"
import {getLocale} from "./locale.js"
import {aesjs} from "./aes256.js"

const CRYPTALKING = {
	strings: {},
	startingNick: new String(),
	user: {
		nick: new String(),
		verified: new Boolean(),
		key: new String(),
	},
	logged: false,
	dialogs: new Array(),
	encrypt: (iMessage, iCode) => {
		let key = iCode,
			textBytes = aesjs.utils.utf8.toBytes(iMessage);

		let aesCtr = new aesjs.ModeOfOperation.ctr(key),
			encryptedBytes = aesCtr.encrypt(textBytes);

		let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
		return encryptedHex;
	},
	decrypt: (iMessage, iCode) => {
		let encryptedBytes = aesjs.utils.hex.toBytes(iMessage);

		let aesCtr = new aesjs.ModeOfOperation.ctr(iCode),
			decryptedBytes = aesCtr.decrypt(encryptedBytes);

		let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		return decryptedText;
	},
	checkLength: (iNum) => {
		return (iNum < 10 ? "0" + iNum : iNum);
	},
};



const globalRipple = iElem => {
	componentHandler.upgradeElements($(iElem).addClass("mdl-js-button mdl-js-ripple-effect").toArray());
};

const globalCleanInput = iElem => {
	$(iElem.parentNode).children(".s42-textfield").removeClass("is-dirty");
	$(iElem.parentNode).children(".s42-textfield").children("input").val("");
};

const globalSetField = iObj => { // => Number
	/**
	 * inputLabel: String
	 * oninputFunction: Function (e:HTMLObjectElement) => void
	 * inputIconsClickListener: Function (e:HTMLObjectElement) => void
	 * inputFieldFilling: any
	 * inputType: String?
	 * parentNodeQuery: String
	 */

	let cDate = new Date();

	let cInputLayout =
		`<div class="s42-inputing-area" id="s42-inputing-area-${cDate}">
		<div class="s42-textfield">
			<input onfocus="$(this).parent().addClass('is-focused');" id="s42-input-${cDate}" onblur="$(this).parent().removeClass('is-focused');" type="${iObj.inputType ? iObj.inputType : "text"}" class="s42-textfield--input">
			<label for="s42-input-${cDate}">${iObj.inputLabel}</label>
			<div class="s42-textfield--input-border"></div>
		</div>
		<div class="s42-input-icons" onclick="GlobalCleanInput(this);">
			<i class="material-icons">&#xE5CD;</i>
		</div>
	</div>`;

	$(iObj.parentNodeQuery).append(cInputLayout);



	$("#s42-inputing-area-" + cDate + " input").on("input", (e) => {
		iObj.oninputFunction(e);
	});

	$("#s42-inputing-area-" + cDate + " .s42-input-icons").click((e) => {
		iObj.inputIconsClickListener(e);
	});

	if (iObj.inputFieldFilling) {
		$("#s42-inputing-area-" + cDate + " input").val(iObj.inputFieldFilling);
		$("#s42-inputing-area-" + cDate + " .s42-textfield").addClass("is-dirty");
	};

	globalRipple("#s42-inputing-area-" + cDate + " .s42-input-icons");

	return cDate;
};

const dialogSetField = iObj => {
	let cDate = +new Date();

	let cInputLayout =
		`<div class="dialog-inputing-area" id="dialog-inputing-area-${cDate}">
		<div class="dialog-textfield">
			<input onfocus="$(this).parent().addClass('is-focused');" id="dialog-input-${cDate}" onblur="$(this).parent().removeClass('is-focused');" type="text" class="dialog-textfield--input" placeholder="${iObj.inputLabel}">
		</div>
		<div class="dialog--clean-icon">
			<i class="material-icons">&#xE5CD;</i>
		</div>
		<div class="dialog--send-icon">
			<i class="material-icons">&#xE163;</i>
		</div>
	</div>`;

	$(iObj.parentNodeQuery).append(cInputLayout);



	$("#dialog-inputing-area-" + cDate + " input").on("input", (e) => {
		iObj.oninputFunction(e);
	});

	$("#dialog-inputing-area-" + cDate + " .dialog--clean-icon").click((e) => {
		iObj.cleanListener(e);
	});

	$("#dialog-inputing-area-" + cDate + " .dialog--send-icon").click((e) => {
		iObj.sendListener(e);
	});

	globalRipple("#dialog-inputing-area-" + cDate + " .dialog--clean-icon, #dialog-inputing-area-" + cDate + " .dialog--send-icon");

	return cDate;
};

const upgrade = iElem => {
	componentHandler.upgradeElements($(iElem).toArray());
};

const makeDialog = iObj => {
	return new Promise((iResolve, iReject) => {
		try {
			$(".s42-dialog__title").html(iObj.headDialogText);
			$(".s42-dialog__desc").html(iObj.bodyDialogText);
			$(".s42-dialog__accept-btn").attr("onclick", iObj.acceptBtnAction || "");
			$(".s42-dialog__accept-btn btntxt").html(iObj.acceptBtnText || "");
			$(".s42-dialog__close-btn btntxt").html(iObj.closeBtnText);
			$(".s42-dialog__obfuscator, .s42-dialog").fadeIn(4e2);

			if (!iObj.acceptBtnAction | !iObj.acceptBtnText)
				$(".s42-dialog__accept-btn").hide();
			else
				$(".s42-dialog__accept-btn").show();

			iResolve(iObj);
		} catch (e) {
			iReject(e);
		};
	});
};

const makeSnackbar = iText => {
	$(".s42-snackbar__suptext").html(iText);
	$(".s42-snackbar").addClass("is-visible");
	setTimeout(() => {
		$(".s42-snackbar").removeClass("is-visible");
	}, 3e3);
};
// TODO: Rewrite with WebSocket API 
const SignedIn = iArr => {
	CRYPTALKING.logged = true;
	CRYPTALKING.user.nick = iArr[0];
	CRYPTALKING.user.verified = iArr[1] == "true";
	CRYPTALKING.user.key = iArr[2];

	if (CRYPTALKING.onlineInterval) window.clearInterval(CRYPTALKING.onlineInterval);
	CRYPTALKING.onlineInterval = setInterval(() => {
		XHR.Upload("/project/cryptalking?keeponline", (CRYPTALKING.user.nick + "\n" + CRYPTALKING.user.key), (iXHR) => {
			if (iXHR.status == 200) {
				let messages = new Array();
				try {
					messages = JSON.parse(iXHR.responseText);
				} catch (e) {
					console.warn("Unable to parse non-message response. But it's OK", e);
				};

				if (!messages.length) return false;

				messages.forEach((message, messageIndex) => {
					let cDialogIndex = CRYPTALKING.dialogs.map((item) => {
						return item.nick;
					}).indexOf(message.from);

					if (cDialogIndex <= -1) return false;

					if (CRYPTALKING.dialogs[cDialogIndex].AESCode === undefined) {
						CRYPTALKING.dialogs[cDialogIndex].AESCode = message.message;
					} else {
						let cReceivedMessaged = CRYPTALKING.decrypt(message.message, CRYPTALKING.dialogs[cDialogIndex].AESCode);
						CRYPTALKING.dialogs[cDialogIndex].messages.push(cReceivedMessaged);

						$("#areas-dialog__dialog-" + CRYPTALKING.dialogs[cDialogIndex].date + " .areas-dialog__dialog-container").append(
							'<div class="message incoming">' + cReceivedMessaged.replace(/</gi, "&lt;").replace(/>/gi, "&gt;") + '<div class="message__time">' + CRYPTALKING.checkLength((new Date()).getHours()) + ':' + CRYPTALKING.checkLength((new Date()).getMinutes()) + '</div></div>'
						);

						if (!$("#areas-choise__cell-" + CRYPTALKING.dialogs[cDialogIndex].date).hasClass("is-active")) {
							$("#areas-choise__cell-" + CRYPTALKING.dialogs[cDialogIndex].date).addClass("is-notificating");
						};
					};
				});
			} else if (iXHR.status == 202) {
				let newConnections = new Array();
				try {
					newConnections = JSON.parse(iXHR.responseText);
				} catch (e) {
					console.warn("Unable to parse non-newConnections response. But it's OK", e);
				};

				if (!newConnections.length) return false;

				newConnections.forEach((item, index) => {
					makeDialog({
						headDialogText: CRYPTALKING.strings.connect.newconnectionheader,
						bodyDialogText: CRYPTALKING.strings.connect.newconnectionfromuser.replace(/__NICK__/, item.initiator) + (item.verified ? CRYPTALKING.strings.connect.verificated : CRYPTALKING.strings.connect.notverificated),
						closeBtnText: CRYPTALKING.strings.decline,
						acceptBtnText: CRYPTALKING.strings.accept,
						acceptBtnAction: ";",
					}).then((iObj) => {
						let LocalClickFunc = () => {
							$(".s42-dialog__accept-btn")[0].removeEventListener("click", LocalClickFunc);
							$(".s42-dialog, .s42-dialog__obfuscator").fadeOut(4e2);

							let AESCode = new Array();
							for (let i = 0; i < 32; i++) AESCode.push(Math.floor(Math.random() * 255));
							let sendindMessage = Math.pow(AESCode, item.publicKey.e) % item.publicKey.n;

							let sendingObj = {
								message: AESCode,
								to: item.initiator,
								from: CRYPTALKING.user.nick,
								userKey: CRYPTALKING.user.key
							};

							XHR.Upload("/project/cryptalking?send", JSON.stringify(sendingObj), (iXHR) => {
								if (iXHR.status == 200) {
									makeNewArea({
										nick: item.initiator,
										verified: item.verified,
										AESCode: AESCode
									});
								} else {
									makeSnackbar(CRYPTALKING.strings.error);
								};
							});
						};

						$(".s42-dialog__accept-btn")[0].addEventListener("click", LocalClickFunc);
					});
				});
			};
		});
	}, 4e3);


	$("#initial-card__input-area").html(null);
	$("#initial-card__input-area").show();
	$("#initial-card__login-area").html(
		`<button class="mdl-button mdl-button--raised" id="initial-card__login-area__btn" disabled="disabled">
			${CRYPTALKING.strings.connect.connect}
		</button>`
	);
	$("#initial-card__login-area").show();

	globalSetField({
		inputLabel: CRYPTALKING.strings.connect.connecttouserwithprovidednick,
		oninputFunction: (e) => {
			let cText = $(e.currentTarget).val();

			if (cText.length) {
				CRYPTALKING.connectionNick = cText;
				$(e.currentTarget.parentNode).addClass("is-dirty");
				$("#initial-card__login-area__btn").removeAttr("disabled");
			} else {
				CRYPTALKING.connectionNick = new String();
				$(e.currentTarget.parentNode).removeClass("is-dirty");
				$("#initial-card__login-area__btn").attr("disabled", "disabled");
			};
		},
		inputIconsClickListener: (e) => {
			CRYPTALKING.connectionNick = new String();
			$("#initial-card__login-area__btn").attr("disabled", "disabled");
		},
		parentNodeQuery: "#initial-card__input-area"
	});



	globalRipple("#initial-card__login-area__btn");

	$("#initial-card__login-area__btn").click((e) => {
		let sendingObj = {
			nick: CRYPTALKING.connectionNick,
			publicKey: CRYPTALKING.publicKey,
			initiator: CRYPTALKING.user.nick,
			verified: CRYPTALKING.user.verified,
		};

		XHR.Upload("/project/cryptalking?connect", JSON.stringify(sendingObj), (iXHR) => {
			if (iXHR.status == 200) {
				new Promise((iResolve, iReject) => {
					let responseObj = JSON.parse(iXHR.responseText);

					$("#initial-card").html(
						`<h4 id="connection-header">${CRYPTALKING.strings.connect.connectingtouser.replace(/__NICK__/, responseObj.nick)}</h4>
						<div id="connection-spinner--container">
							<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active" id="connection-spinner"></div>
						</div>`
					);

					upgrade("#connection-spinner");


					setTimeout(() => {
						iResolve(responseObj);
					}, 1e3);
				}).then((iResponseObj) => {
					makeSnackbar(CRYPTALKING.strings.waiting);
					makeNewArea({
						nick: iResponseObj.nick,
						verified: iResponseObj.verified,
						AESCode: undefined
					});
				}, (e) => {
					makeSnackbar(CRYPTALKING.strings.error);
				});
			} else if (iXHR.status == 404) {
				makeDialog({
					headDialogText: CRYPTALKING.strings.connect.usernotfound,
					bodyDialogText: CRYPTALKING.strings.connect.userwidthnicknotfound.replace(/__NICK__/, iXHR.responseText),
					closeBtnText: "OK",
				});
			} else {
				makeSnackbar(CRYPTALKING.strings.error);
			};
		});
	});
};

// TODO: Use Fetch API instead
const XHR = {
	Upload: (iURL, iSendingData, iCallback) => {
		let cXHR = new XMLHttpRequest();
		cXHR.open("POST", "https://" + window.location.host + iURL, true);
		cXHR.addEventListener("readystatechange", () => {
			if (cXHR.readyState == 4) {
				iCallback(cXHR);
			};
		});
		cXHR.send(iSendingData);
	},
	Get: (iURL, iCallback) => {
		let cXHR = new XMLHttpRequest();
		cXHR.open("GET", "https://" + window.location.host + iURL, true);
		cXHR.addEventListener("readystatechange", () => {
			if (cXHR.readyState == 4) {
				iCallback(cXHR);
			};
		});
		cXHR.send();
	},
};

const getActiveUsers = () => {
	return false;
	/* THIS IS NOT WORKING */
	CRYPTALKING.interval = setInterval(() => {
		XHR.Upload("/project/cryptalking?getinfo", "", (iXHR) => {
			console.table(JSON.parse(iXHR.responseText).activeUsers);
		});
	}, 5e3);
};

const makeNewArea = iObj => {
	$("#initial-card").hide();
	$("#main-content").show();

	let cDate = +new Date();
	iObj.date = cDate;
	let cDialog = new Dialog(iObj);
	CRYPTALKING.dialogs.push(cDialog);


	$(".areas-choise__cell").removeClass("is-active");

	$("#areas-choice--container").append(
		`<div class="areas-choise__cell is-active" id="areas-choise__cell-${cDate}">${iObj.verified ? '<i class="material-icons areas-choise__cell-verified">&#xE8E8;</i>' : ""}${iObj.nick}<div class="areas-choise__cell-notification"></div></div>`
	);


	$("#areas-dialog").append(
		`<div class="areas-dialog__dialog" id="areas-dialog__dialog-${cDate}">
			<div class="areas-dialog__dialog-container"></div>
			<div class="areas-dialog__dialog-input--container"></div>
		</div>`
	);

	$(".areas-dialog__dialog").hide();
	$("#areas-dialog__dialog-" + cDate).show();


	globalRipple("#areas-choise__cell-" + cDate);

	$("#areas-choise__cell-" + cDate).click((e) => {
		$(".areas-choise__cell").removeClass("is-active");
		$(e.currentTarget).addClass("is-active");
		$(e.currentTarget).removeClass("is-notificating");

		$(".areas-dialog__dialog").hide();
		$("#areas-dialog__dialog-" + cDate).show();
	});


	let dialogDate = dialogSetField({
		inputLabel: CRYPTALKING.strings.yourmessage,
		oninputFunction: (e) => {
			let cText = $(e.currentTarget).val();

			if (cText.length) {
				cDialog.typingText = cText;
				$(e.currentTarget.parentNode).addClass("is-dirty");
			} else {
				cDialog.typingText = new String();
				$(e.currentTarget.parentNode).removeClass("is-dirty");
			};
		},
		cleanListener: (e) => {
			cDialog.typingText = new String();
			$(e.currentTarget.parentNode).children(".dialog-textfield").removeClass("is-dirty");
			$(e.currentTarget.parentNode).children(".dialog-textfield").children("input").val("");
		},
		sendListener: (e) => {
			if (cDialog.typingText.length) {
				let sendingObj = {
					from: CRYPTALKING.user.nick,
					userKey: CRYPTALKING.user.key,
					to: cDialog.nick,
					message: CRYPTALKING.encrypt(cDialog.typingText, cDialog.AESCode),
				};

				fetch("/project/cryptalking?send", {
					method: "POST",
					body: JSON.stringify(sendingObj)
				})

				$("#areas-dialog__dialog-" + cDate + " .areas-dialog__dialog-container").append(
					'<div class="message sent">' + cDialog.typingText.replace(/</gi, "&lt;").replace(/>/gi, "&gt;") + '<div class="message__time">' + CRYPTALKING.checkLength((new Date()).getHours()) + ':' + CRYPTALKING.checkLength((new Date()).getMinutes()) + '</div></div>'
				);
				cDialog.messages.push(cDialog.typingText);

				cDialog.typingText = new String();
				$(e.currentTarget.parentNode).children(".dialog-textfield").removeClass("is-dirty");
				$(e.currentTarget.parentNode).children(".dialog-textfield").children("input").val("");
			};
		},
		parentNodeQuery: $("#areas-dialog__dialog-" + cDate + " .areas-dialog__dialog-input--container")[0]
	});

	$("#dialog-input-" + dialogDate).on("keyup", (e) => {
		if (e.keyCode == 13 | e.which == 13) {
			$("#dialog-inputing-area-" + dialogDate + " .dialog--send-icon")[0].click();
		};
	});
};



class Dialog {
	constructor(iObj) {
		this.nick = iObj.nick;
		this.verified = iObj.verified;
		this.AESCode = iObj.AESCode;
		this.messages = new Array();
		this.date = iObj.date;
		this.typingText = new String();

		return this;
	};
};



$(".s42-snackbar").click((e) => {
	$(".s42-snackbar").removeClass("is-visible");
});

$("#switch--dark-theme").on("change", (e) => {
	if (e.currentTarget.checked) {
		$("body").addClass("is-dark");
		$("meta[data-id='theme-color']").attr("content", "#333333");
	} else {
		$("body").removeClass("is-dark");
		$("meta[data-id='theme-color']").attr("content", "#004D40");
	};
});



window.onbeforeunload = () => {};

window.addEventListener("load", async () => {
	CRYPTALKING.strings = await getLocale()
	//console.log(CRYPTALKING)
	let ARRAY_OF_INSCRIPTION = [{
			query: "title",
			value: CRYPTALKING.strings.title
		},
		{
			query: ".s42-header__title span",
			value: CRYPTALKING.strings.title
		},
		{
			query: "a[href='/']",
			value: CRYPTALKING.strings.mainpage
		},
		{
			query: "a[href='/guide/']",
			value: CRYPTALKING.strings.guidepage
		},
		{
			query: ".setting:nth-of-type(1) .setting__desc",
			value: CRYPTALKING.strings.reload
		},
		{
			query: ".mdl-switch__label",
			value: CRYPTALKING.strings.darktheme
		},
		{
			query: "#s42-snackbar__cancel-btn btntxt",
			value: CRYPTALKING.strings.close
		},
	];

	ARRAY_OF_INSCRIPTION.forEach((i) => {
		$(i.query).html(i.value)
	});

	globalRipple("[s42-ripple]");



	/* RSA keys generating */
	// FIXME: Math.random() is not cryptographically safe

	let p = Math.ceil(Math.random() * Math.pow(10, 1 + Math.random() * 0.5) + 10),
		q = Math.ceil(Math.random() * Math.pow(10, 1 + Math.random() * 0.5) + 10),
		n = p * q;
	let phi = (p - 1) * (q - 1),
		e = Math.ceil(Math.random() * 30) + (n > 300 ? 20 : 0),
		d = Math.ceil((1 + Math.ceil(Math.random() * 6 * phi)) / e);

	CRYPTALKING.publicKey = {
		e,
		n
	};
	CRYPTALKING.privateKey = {
		d,
		n
	};

	/* RSA end */



	XHR.Upload("/project/cryptalking?init", "hi there", (iXHR) => {

		$("#initial-card").fadeIn(4e2, () => {
			if (iXHR.status == 200) {
				$("#initial-card__input-area").hide();
				$("#initial-card__login-area").html('<button class="mdl-button mdl-button--raised" id="initial-card__login-area__btn">' + CRYPTALKING.strings.login + " <i>" + iXHR.responseText + '</i></button>');


				globalRipple("#initial-card__login-area__btn");
				$("#initial-card__login-area__btn").click((e) => {
					XHR.Upload("/project/cryptalking?cont", iXHR.responseText, (iXHR) => {
						if (iXHR.status == 200) {
							makeSnackbar(CRYPTALKING.strings.welcome + iXHR.responseText.split("\n")[0]);
							SignedIn(iXHR.responseText.split("\n"));
						} else {
							makeSnackbar(CRYPTALKING.strings.error);
						};
					});
				});
			} else if (iXHR.status == 401) {
				globalSetField({
					inputLabel: CRYPTALKING.strings.createnick,
					oninputFunction: (e) => {
						let cText = $(e.currentTarget).val();

						if (cText.length) {
							CRYPTALKING.startingNick = cText;
							$(e.currentTarget.parentNode).addClass("is-dirty");
							$("#initial-card__login-area__btn i").html(cText.replace(/</gi, "&lt;"));
						} else {
							CRYPTALKING.startingNick = new String();
							$(e.currentTarget.parentNode).removeClass("is-dirty");
							$("#initial-card__login-area__btn i").html("...");
						};
					},
					inputIconsClickListener: (e) => {
						CRYPTALKING.startingNick = new String();
						$("#initial-card__login-area__btn i").html("...");
					},
					parentNodeQuery: "#initial-card__input-area"
				});

				$("#initial-card__login-area").html(
					`<button class="mdl-button mdl-button--raised" id="initial-card__login-area__btn">
						${CRYPTALKING.strings.login} <i>...</i>
					</button>
					<button class="mdl-button mdl-button--raised" id="initial-card__login-area__sign-in--btn">
						${CRYPTALKING.strings.singin}
					</button>`
				);

				globalRipple("#initial-card__login-area__btn, #initial-card__login-area__sign-in--btn");
				$("#initial-card__login-area__btn").click((e) => {
					XHR.Upload("/project/cryptalking?cont", CRYPTALKING.startingNick, (iXHR) => {
						if (iXHR.status == 200) {
							makeSnackbar(CRYPTALKING.strings.welcome + iXHR.responseText.split("\n")[0]);
							SignedIn(iXHR.responseText.split("\n"));
						} else if (iXHR.status == 403) {
							makeSnackbar(CRYPTALKING.strings.usernamereserved);
						} else {
							makeSnackbar(CRYPTALKING.strings.error);
						};
					});
				});
				$("#initial-card__login-area__sign-in--btn").click((e) => {
					window.location = "/login?ref=/project/cryptalking";
				});
			};
		});
	});



	if ($("body").hasClass("is-dark")) $("#switch--dark-theme")[0].click();
	if (/firefox/gi.test(navigator.userAgent)) $(".s42-dialog").css({
		height: "-moz-fit-content",
		position: "relative"
	});
	$("#main-content").hide();

	$("#starting").fadeOut(5e2, () => {
		$("#starting").remove();
	});
});