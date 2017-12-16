/* ECMAScript 6 enabled! */
"use strict"

import {
	getLocale
} from "./locale.js"

import {
	aesjs
} from "./aes256.js"

import {
	makeDialog,
	dialogSetField,
	makeSnackbar
} from "./dialog.js"

import {
	getKeyPair
} from "./keys.js"

import {
	emits,
	callsback
} from "./utils.js"

/**
 * Main cryptalking object
 */
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
	isDark: JSON.parse(localStorage.getItem('isDark')) || false
};

updateTheme()
if (CRYPTALKING.isDark) $("switch--dark-theme").click()


const globalRipple = iElem => {
	componentHandler.upgradeElements($(iElem).addClass("mdl-js-button mdl-js-ripple-effect").toArray());
};

const globalCleanInput = iElem => {
	$(iElem.parentNode).children(".s42-textfield").removeClass("is-dirty");
	$(iElem.parentNode).children(".s42-textfield").children("input").val("");
};
/**
 * 
 * @param {object} iObj
 * @param {String} iObj.inputLabel
 * @param {function(HTMLObjectElement) => void} iObj.oninputFunction 
 * @param {function(HTMLObjectElement) => void} iObj.inputIconsClickListener
 * @param {any} iObj.inputFieldFilling
 * @param {String} iObj.inputType
 * @param {String} iObj.parentNodeQuery
 * @returns {Number}
 */
function globalSetField(iObj) {
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

const upgrade = iElem => {
	componentHandler.upgradeElements($(iElem).toArray());
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

				newConnections.forEach(async(item, index) => {
					if (await makeDialog({
							headDialogText: CRYPTALKING.strings.connect.newconnectionheader,
							bodyDialogText: CRYPTALKING.strings.connect.newconnectionfromuser.replace(/__NICK__/, item.initiator) + (item.verified ? CRYPTALKING.strings.connect.verificated : CRYPTALKING.strings.connect.notverificated),
							closeBtnText: CRYPTALKING.strings.decline,
							acceptBtnText: CRYPTALKING.strings.accept,
							acceptBtnAction: ";",
						})) {
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

function updateTheme() {
	if (CRYPTALKING.isDark) {
		$("body").addClass("is-dark");
		$("meta[data-id='theme-color']").attr("content", "#333333");
	} else {
		$("body").removeClass("is-dark");
		$("meta[data-id='theme-color']").attr("content", "#004D40");
	};
}

$("#switch--dark-theme").on("change", (e) => {
	CRYPTALKING.isDark = e.currentTarget.checked
	localStorage.setItem('isDark', CRYPTALKING.isDark)
	updateTheme()
});



window.onbeforeunload = () => {};

window.addEventListener("load", async() => {

	CRYPTALKING.strings = await getLocale()
	if ($("body").hasClass("is-dark")) $("#switch--dark-theme")[0].click();
	if (/firefox/gi.test(navigator.userAgent)) $(".s42-dialog").css({
		height: "-moz-fit-content",
		position: "relative"
	});
	$("#main-content").hide();
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

	let keys = getKeyPair()

	CRYPTALKING.publicKey = keys.publicKey
	CRYPTALKING.privateKey = keys.privateKey

	// TODO: rewrite with websockets
	const init = await fetch("/project/cryptalking?init", {
		body: "hi there",
		method: "POST"
	})

	$("#starting").fadeOut(5e2, () => {
		$("#starting").remove();
	});
	await callsback(setTimeout)(4e2)

	if (init.ok) {

		$("#initial-card__input-area").hide();
		$("#initial-card__login-area").html('<button class="mdl-button mdl-button--raised" id="initial-card__login-area__btn">' + CRYPTALKING.strings.login + " <i>" + init.responseText + '</i></button>');


		globalRipple("#initial-card__login-area__btn");
		$("#initial-card__login-area__btn").click(async(e) => {
			const cont = await fetch("/project/cryptalking?cont", {
				method: "POST",
				body: await init.text()
			})
			if (cont.status == 200) {
				const contResponse = await cont.text()
				makeSnackbar(CRYPTALKING.strings.welcome + contResponse.split("\n")[0]);
				SignedIn(contResponse.split("\n"));
			} else {
				makeSnackbar(CRYPTALKING.strings.error);
			};
		});
	} else if (init.status == 401) {
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
		$("#initial-card__login-area__btn").click(async(e) => {
			const cont = await fetch("/project/cryptalking?cont", {
				method: "POST",
				body: CRYPTALKING.startingNick
			})
			if (cont.status == 200) {
				const contResponse = await cont.text()
				makeSnackbar(CRYPTALKING.strings.welcome + contResponse.split("\n")[0]);
				SignedIn(contResponse.split("\n"));
			} else if (cont.status == 403) {
				makeSnackbar(CRYPTALKING.strings.usernamereserved);
			} else {
				makeSnackbar(CRYPTALKING.strings.error);
			};
		});
		$("#initial-card__login-area__sign-in--btn").click((e) => {
			window.location = "/login?ref=/project/cryptalking";
		});
	} else {
		$("#initial-card").html(`
		<div class="mdl-card__title">
			<h2 class="mdl-card__title-text">${CRYPTALKING.strings.error}</h2>
		</div>
		<div class="mdl-card__supporting-text">
			${CRYPTALKING.strings.error_critical}
			<pre>
${init.status}: ${init.statusText}
${await init.text()}
			</pre>
		</div>
	  `)
	}
});