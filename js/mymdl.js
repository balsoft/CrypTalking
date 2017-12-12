const HEADER_COLOR = ($(".s42-header").length > 1 ? $($(".s42-header")[0]).css("background-color") : $(".s42-header").css("background-color"));
const DRAWER_WIDTH = parseInt($(".s42-drawer__body").css("width"));

function OpenDrawer() {
	$(".s42-drawer__body").css({
		left: -DRAWER_WIDTH, "transition-duration": "600ms"
	});
	$(".s42-drawer").show()
	$(".s42-drawer__obfuscator").fadeIn(600);
	$(".s42-drawer__body").css("left", 0);
};

function CloseDrawer(){
	$(".s42-drawer__obfuscator").fadeOut(5e2, ()=>{ $(".s42-drawer").hide(); });
	$(".s42-drawer__body").css({
		left: -DRAWER_WIDTH + "px", "transition-duration": "600ms"
	});
};

function ShowSettings() {
	if (checkerSettings) {
		$(".s42-settings-field").slideDown(4e2);
		$(".s42-settings-field__obfuscator").show();
		checkerSettings = false;
	} else {
		$(".s42-settings-field").slideUp(4e2);
		$(".s42-settings-field__obfuscator").hide();
		checkerSettings = true;
	}
};

function CloseSettings() {
	$(".s42-settings-field").slideUp(4e2);
	$(".s42-settings-field__obfuscator").hide();
	checkerSettings = true;
};

function S42Tabs(elem) {
	$(".s42-tab__label").hide();
	$(elem).children(".s42-tab__label").css("display", "block");
};

function ShowUndercut() {
	$(".s42-undercut__obfuscator").fadeIn(9e2);
	$(".s42-undercut").show();
	$(".s42-undercut").css("transform", "translateY(" + -$(".s42-undercut").height() + "px)");
};

function CloseUndercut() {
	$(".s42-undercut__obfuscator").fadeOut(9e2);
	$(".s42-undercut").css("transform", "translateY(" + $(".s42-undercut").height() + "px)");
};

function ShowSnackbar() {
	if ($(".s42-bottom-navigation")[0] === undefined) {
		if ($(window).width() < 500) {
			$(".s42-snackbar").css("transform", "translateY(-40px)");
			$(".s42.mdl-button--fab").css("transform", "translateY(-40px)");
		} else {
			$(".s42-snackbar").css("transform", "translateY(-56px)");
			$(".s42.mdl-button--fab").css("transform", "translateY(-56px)");
		};

		setTimeout(()=>{
			$(".s42-snackbar").css("transform", "translateY(0)");
			$(".s42.mdl-button--fab").css("transform", "translateY(0)");
		}, 3e3)
	} else {
		if ($(window).width() < 500) {
			$(".s42-snackbar").css("transform", "translateY(-96px)");
			$(".s42.mdl-button--fab").css("transform", "translateY(-40px)");
		} else if ($(window).width() > 500 & $(window).width() < 700) {
			$(".s42-snackbar").css("transform", "translateY(-112px)");
			$(".s42.mdl-button--fab").css("transform", "translateY(-56px)");
		} else {
			$(".s42-snackbar").css("transform", "translateY(-56px)");
			$(".s42.mdl-button--fab").css("transform", "translateY(-56px)");
		};
		setTimeout(()=>{
			$(".s42-snackbar").css("transform", "translateY(0)");
			$(".s42.mdl-button--fab").css("transform", "translateY(0)");
		}, 3e3)
	}
};

function CloseSnackbar() {
	$(".s42-snackbar").css("transform", "translateY(0)");
	$(".s42.mdl-button--fab").css("transform", "translateY(0)");
};

function MakeS42Menu(leftPosition, topPosition, contentArr, additionalSettingsObj) {
	$("#s42-menu__obfuscator").remove();
	$("#s42-menu").remove();


	if (additionalSettingsObj && additionalSettingsObj.parentNode) {
		$(additionalSettingsObj.parentNode).append(`<div id="s42-menu__obfuscator" onmousedown="RemoveMenu();" ontouchstart="RemoveMenu();"></div>`)
		$(additionalSettingsObj.parentNode).append(`<div id="s42-menu"></div>`);
	} else {
		$("body").append(`<div id="s42-menu__obfuscator" onmousedown="RemoveMenu();" ontouchstart="RemoveMenu();"></div>`)
		$("body").append(`<div id="s42-menu"></div>`);
	};


	for (let i = 0; i < contentArr.length; i++) {
		if (contentArr[i].class == "separator") {
			let separator = document.createElement("div");
				separator.className = "s42-menu__separator";
			$("#s42-menu").append(separator);
		} else if (contentArr[i].class == "item") {
			let item = document.createElement("div");
				item.className = "s42-menu__item";
				item.setAttribute("onclick", contentArr[i].content + "; RemoveMenu();");
				item.innerHTML = contentArr[i].text;
			let ripple = document.createElement("div");
				ripple.className = "menu-ripple__container";
			item.appendChild(ripple);
			if (contentArr[i].custom !== undefined) {
				for (let key in contentArr[i].custom) {
					if (contentArr[i].custom.hasOwnProperty(key)) {
						item.setAttribute(key, contentArr[i].custom[key])
					};
				};
			};
			$("#s42-menu").append(item);
		} else if (contentArr[i].class == "item-a") {
			let item = document.createElement("div");
				item.className = "s42-menu__item";
			let ripple = document.createElement("div");
				ripple.className = "menu-ripple__container";
			let a = document.createElement("a");
				a.className = "s42-menu__item-a";
				a.innerHTML = contentArr[i].text;
				a.setAttribute("href", contentArr[i].href);
				a.setAttribute("target", contentArr[i].target);
			a.appendChild(ripple);
			if (contentArr[i].custom !== undefined) {
				for (let key in contentArr[i].custom) {
					if (contentArr[i].custom.hasOwnProperty(key)) {
						a.setAttribute(key, contentArr[i].custom[key])
					};
				};
			};
			item.addEventListener("click", function(){
				$(this.parentNode).remove()
			})
			item.appendChild(a);
			$("#s42-menu").append(item);
		} else if (contentArr[i].class == "head") {
			if ("ontouchstart" in window) {
				let head = document.createElement("div");
					head.className = "s42-menu__head";
					head.innerHTML = contentArr[i].text;
				contentArr[i].bold ? head.className = "s42-menu__head--bold" : undefined;
				if (contentArr[i].text) contentArr[i].text.replace(/<i class="material-icons" style="display: inline; line-height: 20px; font-size: 14px;">&#xE317;<\/i>/gi, "").length > 60 ? head.setAttribute("style", "overflow-x: hidden; overflow-y: scroll; height: 50px;") : undefined;

				$("#s42-menu").prepend(head);
			};
		};
	};
	
	let id;
	$("#s42-menu .menu-ripple__container").mousedown(function(e){
		if ("ontouchstart" in window) return false;
		let translateX = e.clientX - $(this).offset().left;
		let translateY = e.clientY - $(this).offset().top;
			id = (new Date()).getMilliseconds();
		$(this).html(`<div class="menu-ripple" id="ripple${id}" style="transform: translate(-50%, -50%) translate(${translateX}px, ${translateY}px);">`)
		$("#ripple"+ id).css({
			height: $(this).width() * 2,
			width: $(this).width() * 2
		})
	});
	$("#s42-menu .menu-ripple__container").on("touchstart", function(e){
		let translateX = e.originalEvent.touches[0].clientX - $(this).offset().left;
		let translateY = e.originalEvent.touches[0].clientY - $(this).offset().top;
			id = (new Date()).getMilliseconds();
		$(this).html(`<div class="menu-ripple" id="ripple${id}" style="transform: translate(-50%, -50%) translate(${translateX}px, ${translateY}px);">`)

		$("#ripple"+ id).css({
			height: $(this).width() * 2,
			width: $(this).width() * 2
		})
	});
	$("#s42-menu .menu-ripple__container").on("touchend", function(){
		$("#ripple" + id).fadeOut(300);
	})
	$("#s42-menu .menu-ripple__container").on("touchcancel", function(){
		$("#ripple" + id).fadeOut(300);
	})
	$("#s42-menu .menu-ripple__container").mouseup(function(){
		$("#ripple" + id).fadeOut(300);
	})
	$("#s42-menu .menu-ripple__container").mouseleave(function(){
		$("#ripple" + id).fadeOut(300);
	})

	$("#s42-menu").contextmenu(function(){
		return false;
	});
	$("#s42-menu__obfuscator").contextmenu(function(){
		RemoveMenu();
		return false;
	});
	if ("ontouchstart" in window) {
		$("#s42-menu__obfuscator").css({
			display: "block", "background-color": "rgba(0,0,0,.6)", 
		});
		$("#s42-menu").css("display", "block");
		$(".s42-menu__item").css({
			height: "39px", "line-height": "39px"
		});
		$(".s42-menu__separator").css("display", "none");
		if ($("#s42-menu").width() < 280) {
			$("#s42-menu").css({
				width: "280px", left: "calc(50% - 140px)", top: ($(window).height() - $("#s42-menu").height())/2
			})
		} else if ($("#s42-menu").width() > 320) {
			$("#s42-menu").css({
				width: "320px", left: "calc(50% - 160px)", top: ($(window).height() - $("#s42-menu").height())/2
			})
		} else {
			$("#s42-menu").css({
				left: ($(window).width() - $("#s42-menu").width())/2 + "px", top: ($(window).height() - $("#s42-menu").height())/2
			})
		}
	} else {
		$("#s42-menu__obfuscator").css("display", "block");
		$("#s42-menu").css("display", "block");

		if ($("#s42-menu").width() > $(window).width() - leftPosition) {
			$("#s42-menu").css("left", $(window).width() - $("#s42-menu").width() - 2 + "px")
		} else {
			$("#s42-menu").css("left", leftPosition);
		};

		if ($("#s42-menu").height() > $(window).height() - 34 - topPosition) {
			$("#s42-menu").css("top", topPosition - $("#s42-menu").height() - 34 + "px")
		} else {
			$("#s42-menu").css("top", topPosition)
		};
	}
};

function RemoveMenu() {
	$("#s42-menu__obfuscator").remove();
	$("#s42-menu").remove();
};

function SetBottomNavigation(elem) {
	$(".s42-bottom-navigation__button *").css("color", "#555");
	$(".s42-bottom-navigation__button div").css("font-size", "12px");
	$(elem).children("*").css("color", $(".s42-header").css("color"));
	$(elem).children("div").css("font-size", "14px");
};

function CleanInput(elem) {
	$(elem).hide();
	$(elem).parent().children(".mdl-textfield").removeClass("is-dirty");
	$(elem).parent().children(".mdl-textfield").removeClass("is-invalid");
	$(elem).parent().children(".mdl-textfield").children(".mdl-textfield__input").val("");
};

let S42Table = inData => {
	const MDLCHECKBOXSTYLE = `.mdl-checkbox{position:relative;z-index:1;vertical-align:middle;display:inline-block;box-sizing:border-box;width:100%;height:24px;margin:0;padding:0}S42TABLECONTAINER .mdl-checkbox.is-upgraded{padding-left:24px}S42TABLECONTAINER .mdl-checkbox__input{line-height:24px}S42TABLECONTAINER .mdl-checkbox.is-upgraded .mdl-checkbox__input{position:absolute;width:0;height:0;margin:0;padding:0;opacity:0;-ms-appearance:none;-moz-appearance:none;-webkit-appearance:none;appearance:none;border:none}S42TABLECONTAINER .mdl-checkbox__box-outline{position:absolute;top:3px;left:0;display:inline-block;box-sizing:border-box;width:16px;height:16px;margin:0;cursor:pointer;overflow:hidden;border:2px solid rgba(0,0,0,.54);border-radius:2px;z-index:2}S42TABLECONTAINER .mdl-checkbox.is-checked .mdl-checkbox__box-outline{border:2px solid rgb(MDLCHECKBOXCOLOR)}S42TABLECONTAINER .mdl-checkbox.is-disabled .mdl-checkbox__box-outline,fieldset[disabled] .mdl-checkbox .mdl-checkbox__box-outline{border:2px solid rgba(0,0,0,.26);cursor:auto}S42TABLECONTAINER .mdl-checkbox__focus-helper{position:absolute;top:3px;left:0;display:inline-block;box-sizing:border-box;width:16px;height:16px;border-radius:50%;background-color:transparent}S42TABLECONTAINER .mdl-checkbox.is-focused .mdl-checkbox__focus-helper{box-shadow:0 0 0 8px rgba(0,0,0,.1);background-color:rgba(0,0,0,.1)}S42TABLECONTAINER .mdl-checkbox.is-focused.is-checked .mdl-checkbox__focus-helper{box-shadow:0 0 0 8px rgba(MDLCHECKBOXCOLOR,.26);background-color:rgba(MDLCHECKBOXCOLOR,.26)}S42TABLECONTAINER .mdl-checkbox__tick-outline{position:absolute;top:0;left:0;height:100%;width:100%;-webkit-mask:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==");mask:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==");background:0 0;transition-duration:.28s;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-property:background}S42TABLECONTAINER .mdl-checkbox.is-checked .mdl-checkbox__tick-outline{background:rgb(MDLCHECKBOXCOLOR)url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K")}S42TABLECONTAINER .mdl-checkbox.is-checked.is-disabled .mdl-checkbox__tick-outline,fieldset[disabled] .mdl-checkbox.is-checked .mdl-checkbox__tick-outline{background:rgba(0,0,0,.26)url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K")}S42TABLECONTAINER .mdl-checkbox__label{position:relative;cursor:pointer;font-size:16px;line-height:24px;margin:0}S42TABLECONTAINER .mdl-checkbox.is-disabled .mdl-checkbox__label,fieldset[disabled] .mdl-checkbox .mdl-checkbox__label{color:rgba(0,0,0,.26);cursor:auto}S42TABLECONTAINER .mdl-checkbox__ripple-container{position:absolute;z-index:2;top:-6px;left:-10px;box-sizing:border-box;width:36px;height:36px;border-radius:50%;cursor:pointer;overflow:hidden;-webkit-mask-image:-webkit-radial-gradient(circle,white,black)}S42TABLECONTAINER .mdl-checkbox__ripple-container .mdl-ripple{background:rgb(MDLCHECKBOXCOLOR)}S42TABLECONTAINER .mdl-checkbox.is-disabled .mdl-checkbox__ripple-container,fieldset[disabled] .mdl-checkbox .mdl-checkbox__ripple-container{cursor:auto}S42TABLECONTAINER .mdl-checkbox.is-disabled .mdl-checkbox__ripple-container .mdl-ripple,fieldset[disabled] .mdl-checkbox .mdl-checkbox__ripple-container .mdl-ripple{background:0 0}S42TABLECONTAINER .s42-snackbar__close-btn{position:absolute;top:2px;right:2px;background-color:transparent;}`;



	// clipboard.js
		/*!
		* clipboard.js v1.5.12
		* https://zenorocha.github.io/clipboard.js
		*
		* Licensed MIT © Zeno Rocha
		*/
		!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Clipboard=t()}}(function(){var t,e,n;return function t(e,n,o){function i(a,c){if(!n[a]){if(!e[a]){var s="function"==typeof require&&require;if(!c&&s)return s(a,!0);if(r)return r(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return i(n?n:t)},u,u.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e,n){var o=t("matches-selector");e.exports=function(t,e,n){for(var i=n?t:t.parentNode;i&&i!==document;){if(o(i,e))return i;i=i.parentNode}}},{"matches-selector":5}],2:[function(t,e,n){function o(t,e,n,o,r){var a=i.apply(this,arguments);return t.addEventListener(n,a,r),{destroy:function(){t.removeEventListener(n,a,r)}}}function i(t,e,n,o){return function(n){n.delegateTarget=r(n.target,e,!0),n.delegateTarget&&o.call(t,n)}}var r=t("closest");e.exports=o},{closest:1}],3:[function(t,e,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var e=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===e||"[object HTMLCollection]"===e)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){var e=Object.prototype.toString.call(t);return"[object Function]"===e}},{}],4:[function(t,e,n){function o(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!c.string(e))throw new TypeError("Second argument must be a String");if(!c.fn(n))throw new TypeError("Third argument must be a Function");if(c.node(t))return i(t,e,n);if(c.nodeList(t))return r(t,e,n);if(c.string(t))return a(t,e,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function i(t,e,n){return t.addEventListener(e,n),{destroy:function(){t.removeEventListener(e,n)}}}function r(t,e,n){return Array.prototype.forEach.call(t,function(t){t.addEventListener(e,n)}),{destroy:function(){Array.prototype.forEach.call(t,function(t){t.removeEventListener(e,n)})}}}function a(t,e,n){return s(document.body,t,e,n)}var c=t("./is"),s=t("delegate");e.exports=o},{"./is":3,delegate:2}],5:[function(t,e,n){function o(t,e){if(r)return r.call(t,e);for(var n=t.parentNode.querySelectorAll(e),o=0;o<n.length;++o)if(n[o]==t)return!0;return!1}var i=Element.prototype,r=i.matchesSelector||i.webkitMatchesSelector||i.mozMatchesSelector||i.msMatchesSelector||i.oMatchesSelector;e.exports=o},{}],6:[function(t,e,n){function o(t){var e;if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName)t.focus(),t.setSelectionRange(0,t.value.length),e=t.value;else{t.hasAttribute("contenteditable")&&t.focus();var n=window.getSelection(),o=document.createRange();o.selectNodeContents(t),n.removeAllRanges(),n.addRange(o),e=n.toString()}return e}e.exports=o},{}],7:[function(t,e,n){function o(){}o.prototype={on:function(t,e,n){var o=this.e||(this.e={});return(o[t]||(o[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){function o(){i.off(t,o),e.apply(n,arguments)}var i=this;return o._=e,this.on(t,o,n)},emit:function(t){var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),o=0,i=n.length;for(o;i>o;o++)n[o].fn.apply(n[o].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),o=n[t],i=[];if(o&&e)for(var r=0,a=o.length;a>r;r++)o[r].fn!==e&&o[r].fn._!==e&&i.push(o[r]);return i.length?n[t]=i:delete n[t],this}},e.exports=o},{}],8:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","select"],r);else if("undefined"!=typeof o)r(n,e("select"));else{var a={exports:{}};r(a,i.select),i.clipboardAction=a.exports}}(this,function(t,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=n(e),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),c=function(){function t(e){o(this,t),this.resolveOptions(e),this.initSelection()}return t.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action=e.action,this.emitter=e.emitter,this.target=e.target,this.text=e.text,this.trigger=e.trigger,this.selectedText=""},t.prototype.initSelection=function t(){this.text?this.selectFake():this.target&&this.selectTarget()},t.prototype.selectFake=function t(){var e=this,n="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return e.removeFake()},this.fakeHandler=document.body.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[n?"right":"left"]="-9999px",this.fakeElem.style.top=(window.pageYOffset||document.documentElement.scrollTop)+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,document.body.appendChild(this.fakeElem),this.selectedText=(0,i.default)(this.fakeElem),this.copyText()},t.prototype.removeFake=function t(){this.fakeHandler&&(document.body.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(document.body.removeChild(this.fakeElem),this.fakeElem=null)},t.prototype.selectTarget=function t(){this.selectedText=(0,i.default)(this.target),this.copyText()},t.prototype.copyText=function t(){var e=void 0;try{e=document.execCommand(this.action)}catch(n){e=!1}this.handleResult(e)},t.prototype.handleResult=function t(e){e?this.emitter.emit("success",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)}):this.emitter.emit("error",{action:this.action,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})},t.prototype.clearSelection=function t(){this.target&&this.target.blur(),window.getSelection().removeAllRanges()},t.prototype.destroy=function t(){this.removeFake()},a(t,[{key:"action",set:function t(){var e=arguments.length<=0||void 0===arguments[0]?"copy":arguments[0];if(this._action=e,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function t(){return this._action}},{key:"target",set:function t(e){if(void 0!==e){if(!e||"object"!==("undefined"==typeof e?"undefined":r(e))||1!==e.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&e.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(e.hasAttribute("readonly")||e.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=e}},get:function t(){return this._target}}]),t}();t.exports=c})},{select:6}],9:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","./clipboard-action","tiny-emitter","good-listener"],r);else if("undefined"!=typeof o)r(n,e("./clipboard-action"),e("tiny-emitter"),e("good-listener"));else{var a={exports:{}};r(a,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=a.exports}}(this,function(t,e,n,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function s(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}var l=i(e),u=i(n),f=i(o),d=function(t){function e(n,o){r(this,e);var i=a(this,t.call(this));return i.resolveOptions(o),i.listenClick(n),i}return c(e,t),e.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action="function"==typeof e.action?e.action:this.defaultAction,this.target="function"==typeof e.target?e.target:this.defaultTarget,this.text="function"==typeof e.text?e.text:this.defaultText},e.prototype.listenClick=function t(e){var n=this;this.listener=(0,f.default)(e,"click",function(t){return n.onClick(t)})},e.prototype.onClick=function t(e){var n=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new l.default({action:this.action(n),target:this.target(n),text:this.text(n),trigger:n,emitter:this})},e.prototype.defaultAction=function t(e){return s("action",e)},e.prototype.defaultTarget=function t(e){var n=s("target",e);return n?document.querySelector(n):void 0},e.prototype.defaultText=function t(e){return s("text",e)},e.prototype.destroy=function t(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)},e}(u.default);t.exports=d})},{"./clipboard-action":8,"good-listener":4,"tiny-emitter":7}]},{},[9])(9)});
	// clipboard.js end



	// function returning boolean darkness primaryColor
	let Dark = iHEX => {
		iHEX[0] == "#" ? iHEX = iHEX.slice(1) : undefined;
		iHEX.length == 3 ? iHEX = iHEX[0] + iHEX[0] + iHEX[1] + iHEX[1] + iHEX[2] + iHEX[2] : undefined;
		let red = parseInt(iHEX[0] + iHEX[1], 16);
			red /= 255;
		let green = parseInt(iHEX[2] + iHEX[3], 16);
			green /= 255;
		let blue = parseInt(iHEX[4] + iHEX[5], 16);
			blue /= 255;
		let max = Math.max(red, green, blue),
			min = Math.min(red, green, blue);
		let hue, sat, lgt = (max + min) / 2;
		if (min == max) {
			hue = sat = 0;
		} else {
			let diff = max - min;
			sat = lgt > 0.5 ? diff / (2 - min - max) : diff / (max + min);
			switch (max) {
				case red:
					hue = (green - blue) / diff + (green < blue ? 6 : 0);
				break;
				case green:
					hue = (blue - red) / diff + 2;
				break;
				case blue:
					hue = (red - green) / diff + 4;
				break;
			};
			hue *= 60
			hue = Math.floor(hue);
		}
		return lgt < 0.68;
	};



	// minimized func converting HEX into RGB
	let HEXtoRGB = iHEX => iHEX.slice(iHEX[0] == "#").length == 3 ? parseInt(iHEX.slice(iHEX[0] == "#")[0] + iHEX.slice(iHEX[0] == "#")[0], 16) + "," + parseInt(iHEX.slice(iHEX[0] == "#")[1] + iHEX.slice(iHEX[0] == "#")[1], 16) + "," + parseInt(iHEX.slice(iHEX[0] == "#")[2] + iHEX.slice(iHEX[0] == "#")[2], 16) : (iHEX.slice(iHEX[0] == "#").length == 6 ? parseInt(iHEX.slice(iHEX[0] == "#")[0] + iHEX.slice(iHEX[0] == "#")[1], 16) + "," + parseInt(iHEX.slice(iHEX[0] == "#")[2] + iHEX.slice(iHEX[0] == "#")[3], 16) + "," + parseInt(iHEX.slice(iHEX[0] == "#")[4] + iHEX.slice(iHEX[0] == "#")[5], 16) : "0,0,0");



	// adding to table unique attr and filling certain one
	let timeState = new Date();
		timeState = timeState.getMinutes().toString() + timeState.getSeconds() + timeState.getMilliseconds();
	
	let tableLength = new Number();
	let tableHead = new String();
	if (inData.head) {
		tableLength = inData.head.length;
		let headTDs = new String();
		inData.head.forEach((item)=>{
			if (typeof item == "object") {
				headTDs += '<td class="s42-table__num-cell">' + item + '</td>';
			} else {
				headTDs += "<td>" + item + "</td>";
			};
		});
		inData.body.forEach((item)=>{
			if (item.length > tableLength) {
				tableLength = item.length;
				headTDs += "<td></td>";
			};
		});
		tableHead = `<thead class="s42-table__head"><tr>${inData.markable ? `<td><label s42-ripple class="mdl-checkbox mdl-js-checkbox ${inData.head[0] !== "DISSELECT" ? "is-checked" : ""} is-upgraded" for="checkbox-head" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" id="checkbox-head" class="mdl-checkbox__input" checked=""><span class="mdl-checkbox__focus-helper"></span><span class="mdl-checkbox__box-outline"><span class="mdl-checkbox__tick-outline"></span></span></label></td>` : ""}${headTDs}</tr></thead>`
	};

	

	let tableBody = new String();
	if (inData.body) {
		let rows = new String();
		inData.body.forEach((row, num)=>{
			let currRow = new String();
			row.forEach((cell)=>{
				if (typeof cell == "object") {
					currRow += '<td class="s42-table__num-cell">' + cell + '</td>';
				} else {
					currRow += "<td>" + cell + "</td>";
				};
			});

			if (row.length < tableLength) {
				for (let i = 0; i < (tableLength - row.length); i++) {
					currRow += "<td></td>";
				};
			};

			rows += "<tr" + (inData.markable ? (row[0] !== "DISSELECT" ? " class='is-checked'" : " class=''") : "") + ">" + (inData.markable ? `<td><label s42-ripple class="mdl-checkbox mdl-js-checkbox ${row[0] !== "DISSELECT" ? "is-checked" : ""} is-upgraded" for="checkbox-row${num}" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" id="checkbox-row${num}" class="mdl-checkbox__input" checked=""><span class="mdl-checkbox__focus-helper"></span><span class="mdl-checkbox__box-outline"><span class="mdl-checkbox__tick-outline"></span></span></label></td>` : "") + currRow + "</tr>";
		});
		tableBody += `<tbody class="s42-table__body">${rows}</tbody>`;
	};

	let tableContainer = 
	`<div class="s42-table--container" data-time="${timeState}">
		<div class="s42-table--header">${inData.name}</div>
		<table class="s42-table">` +
			tableHead +
			tableBody +
		'</table>' + 
		(
			!inData.notCopy ?
			`<button class="mdl-button s42-table--copy-btn" data-clipboard-target=".s42-table--container[data-time='${timeState}'] .s42-table--copy-text-field" s42-ripple>${ /ru/gi.test(navigator.language) ? "Копировать" : "Copy" }</button>
			<button class="mdl-button s42-table--copy-data-btn" data-clipboard-target=".s42-table--container[data-time='${timeState}'] .s42-table--copy-data-field" s42-ripple>${ /ru/gi.test(navigator.language) ? "Данные" : "Copy data" }</button>`
			:
			''
		) + (
			!inData.notShare ?
			`<button class="mdl-button s42-table--share-btn" data-clipboard-target=".s42-table--container[data-time='${timeState}'] .s42-table--copy-link-field" s42-ripple>${ /ru/gi.test(navigator.language) ? "Поделиться" : "Share" }</button>`
			:
			''
		) +
		`<div class="s42-snackbar">
			<div class="s42-snackbar__suptext" onclick="CloseSnackbar()">${ /ru/gi.test(navigator.language) ? "Скопировано" : "Copied" }</div>
			<button class="mdl-button mdl-js-button mdl-js-ripple-effect s42-snackbar__close-btn" s42-ripple onclick="CloseSnackbar()">OK</button>
		</div>
	</div>`;
	$(inData.parentObj).html(tableContainer);



	
	if (!inData.notCopy) {
		new Clipboard($(".s42-table--container[data-time='" + timeState + "'] .s42-table--copy-btn")[0]);
		new Clipboard($(".s42-table--container[data-time='" + timeState + "'] .s42-table--copy-data-btn")[0]);

		{ // copy-data-field
			let headStr = new String();
			inData.head.forEach((item)=>{
				if (typeof item == "object") {
					headStr += '[' + (typeof item[0] !== "string" ? item[0] : '"' + item[0] + '"') + '], '
				} else {
					headStr += (typeof item !== "string" ? item : '"' + item + '"') + ', '
				};
			});
			headStr = headStr.slice(0, headStr.length - 2);

			let bodyStr = new String();
			inData.body.forEach((row)=>{
				bodyStr += '\t[';
				row.forEach((cell)=>{
					if (typeof cell == "object") {
						bodyStr += '[' + (typeof cell[0] !== "string" ? cell[0] : '"' + cell[0] + '"') + '], '
					} else {
						bodyStr += (typeof cell !== "string" ? cell : '"' + cell + '"') + ', '
					};
				})
				bodyStr = bodyStr.slice(0, bodyStr.length - 2);
				bodyStr += '],\n\t';
			});

			let outData = 'S42Table({\n\tprimaryColor: "' + inData.primaryColor + '",\n' +
						'\tmarkable: ' + inData.markable + ',\n' +
						'\tname: "' + inData.name + '",\n' +
						'\thead: [\n\t\t' + headStr + '\n\t],\n' +
						'\tbody: [\n\t' + bodyStr + '\n\t],\n' +
						'\tnotCopy: ' + (inData.notCopy ? true : false) + ',\n' +
						'\tnotShare: ' + (inData.notShare ? true : false) + ',\n' +
						'\tparentObj: $("' + ($(inData.parentObj)[0].id !== "" ? "#" + $(inData.parentObj)[0].id : "." + $(inData.parentObj)[0].className.replace(/\s/gi, ".")) + '")[0]\n})';

			$(".s42-table--container[data-time='" + timeState + "'] .s42-table").append(`<pre class="s42-table--copy-field s42-table--copy-data-field">` + outData + `</pre>`);
		};

		{ // copy-text-field
			let maxLength = new Number();
			inData.head.forEach((item)=>{
				if (typeof item == "object") {
					if (item[0].toString().length > maxLength) maxLength = item[0].toString().length;
				} else {
					if (item.toString().length > maxLength) maxLength = item.toString().length;
				};
			});
			inData.body.forEach((row)=>{
				row.forEach((cell)=>{
					if (typeof cell == "object") {
						if (cell[0].toString().length > maxLength) maxLength = cell[0].toString().length;
					} else {
						if (cell.toString().length > maxLength) maxLength = cell.toString().length;
					};
				});
			});

			let FTL = (inVal, inBool) => { // Format to length
				inVal = inVal.toString();
				let currLength = inVal.length;

				if (inBool) {
					for (let i = 0; i <= (maxLength - currLength + 1); i++) {
						inVal = " " + inVal
					};
				} else {
					for (let i = 0; i <= (maxLength - currLength + 1); i++) {
						inVal += " ";
					};
				};

				return inVal.toString();
			};

			let arrOfIndexes = new Array();
			let headStr = new String();
			inData.head.forEach((item, index)=>{
				if (typeof item == "object") {
					headStr += FTL(item[0], true) + " | ";
					arrOfIndexes[index] = true;
				} else {
					headStr += FTL(item, false) + " | ";
					arrOfIndexes[index] = false;
				};
			});
			headStr = headStr.slice(0, headStr.length - 3);

			let bodyStr = new String();
			inData.body.forEach((row)=>{
				row.forEach((cell, index)=>{
					if (typeof cell == "object") {
						bodyStr += FTL(cell[0], true) + " | ";
					} else if (arrOfIndexes[index]) {
						bodyStr += FTL(cell, true) + " | ";
					} else {
						bodyStr += FTL(cell, false) + " | ";
					};
				});
				bodyStr = bodyStr.slice(0, bodyStr.length - 3);
				bodyStr += "\n";
			});

			let outData = headStr + "\n" + bodyStr;

			$(".s42-table--container[data-time='" + timeState + "'] .s42-table").append(`<pre class="s42-table--copy-field s42-table--copy-text-field">` + outData + `</pre>`);
		};
	};
	if (!inData.notShare) {
		new Clipboard($(".s42-table--container[data-time='" + timeState + "'] .s42-table--share-btn")[0]);

		{ // copy-link-field
			let headStr = new String();
			inData.head.forEach((item)=>{
				if (typeof item == "object") {
					headStr += '[' + (typeof item[0] !== "string" ? item[0] : '"' + item[0] + '"') + '],'
				} else {
					headStr += (typeof item !== "string" ? item : '"' + item + '"') + ','
				};
			});
			headStr = headStr.slice(0, headStr.length - 1);

			let bodyStr = new String();
			inData.body.forEach((row)=>{
				bodyStr += '[';
				row.forEach((cell)=>{
					if (typeof cell == "object") {
						bodyStr += '[' + (typeof cell[0] !== "string" ? cell[0] : '"' + cell[0] + '"') + '],'
					} else {
						bodyStr += (typeof cell !== "string" ? cell : '"' + cell + '"') + ','
					};
				})
				bodyStr = bodyStr.slice(0, bodyStr.length - 1);
				bodyStr += '],';
			})
			bodyStr = bodyStr.slice(0, bodyStr.length - 1);

			let outtaLink = "https://serguun42.ru/list#pc=" + encodeURIComponent(inData.primaryColor) + "&m=" + (inData.markable ? "1" : "0") + "&n=" + encodeURIComponent(inData.name) + "&h=" + encodeURIComponent(headStr) + "&b=" + encodeURIComponent(bodyStr) + "&nc=" + (inData.notCopy ? "1" : "0") + "&ns=" + (inData.notShare ? "1" : "0");

			$(".s42-table--container[data-time='" + timeState + "'] .s42-table").append(`<pre class="s42-table--copy-field s42-table--copy-link-field">` + outtaLink + `</pre>`);
		};
	};



	// styles and colors
	let currS42TableStyle = MDLCHECKBOXSTYLE
											.replace(/MDLCHECKBOXCOLOR/gi, HEXtoRGB(inData.primaryColor))
											.replace(/S42TABLECONTAINER/gi, ".s42-table--container[data-time='" + timeState + "']");
		currS42TableStyle += `
		.s42-table--container[data-time='${timeState}'] button {color: ${inData.primaryColor}}
		.s42-table--container[data-time='${timeState}'] .menu-ripple {background-color: rgba(${HEXtoRGB(inData.primaryColor)}, 0.3)}
		`;

	if (!Dark(inData.primaryColor)) {
		currS42TableStyle += `
		.s42-table--container[data-time='${timeState}'] {background-color: #333; color: #FFF;}
		.s42-table--container[data-time='${timeState}'] .s42-table {background-color: #333;box-shadow: 0 5px 20px 0 rgba(160, 160, 160, 0.42);}
		.s42-table--container[data-time='${timeState}'] .s42-table * {color: #FFF}
		.s42-table--container[data-time='${timeState}'] .mdl-button {background-color: #333;}
		.s42-table--container[data-time='${timeState}'] .mdl-checkbox__box-outline {border: 2px solid rgba(255, 255, 255, 0.6);}
		.s42-table--container[data-time='${timeState}'] .s42-snackbar__close-btn {background-color: transparent; color: ${inData.primaryColor}}
		.s42-table--container[data-time='${timeState}'] .menu-ripple {background-color: rgba(${HEXtoRGB(inData.primaryColor)}, 0.3)}
		`;
	} else {
		currS42TableStyle += `
		.s42-table--container[data-time='${timeState}'] .s42-snackbar {background-color: ${inData.primaryColor}; color: #333}
		.s42-table--container[data-time='${timeState}'] .s42-snackbar__close-btn {color: #FFF}
		.s42-table--container[data-time='${timeState}'] .s42-snackbar__close-btn .menu-ripple {background-color: rgba(255, 255, 255, 0.3)}
		`;
	};
	$(".s42-table--container[data-time='" + timeState + "']").append("<style>" + currS42TableStyle + "</style>");



	// checking for width
	if ($(".s42-table--container[data-time='" + timeState + "'] .s42-table__head").width() > $(".s42-table").width()) {
		$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
			width: "calc(100% - 32px)",
			"overflow-x": "scroll",
		});
	} else {
		$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
			width: "fit-content",
			"overflow-x": "hidden",
		});
	};

	window.addEventListener("resize", ()=>{ S42Table.setWidth(timeState); });



	// ripple effect init 
	let S42TableRipple = () => {
		$(".s42-table--container[data-time='" + timeState + "'] .menu-ripple__container").remove();

		setTimeout(()=>{
			$(".s42-table--container[data-time='" + timeState + "'] [s42-ripple]").append(`<div class="menu-ripple__container"></div>`);

			let id;
			$(".s42-table--container[data-time='" + timeState + "'] .menu-ripple__container").mousedown(function(e){
				if ("ontouchstart" in window) return false;
				let translateX = e.clientX - $(this).offset().left;
				let translateY = e.clientY - $(this).offset().top;
					id = (new Date()).getMilliseconds();
				$(this).html(`<div class="menu-ripple" id="ripple${id}" style="transform: translate(-50%, -50%) translate(${translateX}px, ${translateY}px);">`)
				$("#ripple"+ id).css({
					height: $(this).width() * 2,
					width: $(this).width() * 2
				});
			});
			$(".s42-table--container[data-time='" + timeState + "'] .menu-ripple__container").on("touchstart", function(e){
				let translateX = e.originalEvent.touches[0].clientX - $(this).offset().left;
				let translateY = e.originalEvent.touches[0].clientY - $(this).offset().top;
					id = (new Date()).getMilliseconds();
				$(this).html(`<div class="menu-ripple" id="ripple${id}" style="transform: translate(-50%, -50%) translate(${translateX}px, ${translateY}px);">`)

				$("#ripple"+ id).css({
					height: $(this).width() * 2,
					width: $(this).width() * 2
				});
			});
			$(".s42-table--container[data-time='" + timeState + "'] .menu-ripple__container").on("touchend", function(){
				$("#ripple" + id).fadeOut(300);
			});
			$(".s42-table--container[data-time='" + timeState + "'] .menu-ripple__container").on("touchcancel", function(){
				$("#ripple" + id).fadeOut(300);
			});
			$(".s42-table--container[data-time='" + timeState + "'] .menu-ripple__container").mouseup(function(){
				$("#ripple" + id).fadeOut(300);
			});
			$(".s42-table--container[data-time='" + timeState + "'] .menu-ripple__container").mouseleave(function(){
				$("#ripple" + id).fadeOut(300);
			});
		}, 1e2);
	};



	// summary and multiplication for nums cells
	let summaryArr = new Array(tableLength);
		summaryArr.fill("");
	let multArr = new Array(tableLength);
		multArr.fill("");
	let maxArr = new Array(tableLength);
		maxArr.fill("");
	let minArr = new Array(tableLength);
		minArr.fill("");
	let averArr = new Array(tableLength);
		averArr.fill("");
	let arrHeadNumCells = new Array();
	for (let i = 0; i < $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head .s42-table__num-cell").length; i++) {
		arrHeadNumCells[i] = $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head .s42-table__num-cell")[i];
	};
	if (arrHeadNumCells.length !== 0) {
		let arrHeadCells = new Array();
		for (let i = 0; i < $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head td").length; i++) {
			arrHeadCells[i] = $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head td")[i];
		}
		arrHeadNumCells.forEach((item)=>{
			let indexCell = arrHeadCells.indexOf(item);

			let rowsArr = new Array();
			for (let i = 0; i < $(".s42-table--container[data-time='" + timeState + "'] .s42-table__body tr").length; i++) {
				rowsArr[i] = $(".s42-table--container[data-time='" + timeState + "'] .s42-table__body tr")[i];
			}

			let currSum = new Number();
			let currMult = new Number(1);
			let currMax = new Number();
			let currMin = Infinity;
			let currAver = new Number();
			let currAverChecker = new Number();
			
			rowsArr.forEach((row)=>{
				let cellsArr = new Array();
				for (let i = 0; i < $(row).children("td").length; i++) {
					cellsArr[i] = $(row).children("td")[i];
				}
				$(cellsArr[indexCell]).addClass("s42-table__num-cell");
				if (!isNaN(parseFloat(cellsArr[indexCell].innerHTML))) {
					currSum += parseFloat(cellsArr[indexCell].innerHTML);
					currMult *= parseFloat(cellsArr[indexCell].innerHTML);

					if (parseFloat(cellsArr[indexCell].innerHTML) > currMax) currMax = parseFloat(cellsArr[indexCell].innerHTML);
					if (parseFloat(cellsArr[indexCell].innerHTML) < currMin) currMin = parseFloat(cellsArr[indexCell].innerHTML);
					currAver += parseFloat(cellsArr[indexCell].innerHTML);
					currAverChecker++;
				};
			});
			summaryArr[indexCell] = currSum.toString().split(".")[1] ? (currSum.toString().split(".")[1].length > 3 ? currSum.toFixed(3) : currSum) : currSum;
			multArr[indexCell] = currMult.toString().split(".")[1] ? (currMult.toString().split(".")[1].length > 3 ? currMult.toFixed(3) : currMult) : currMult;
			maxArr[indexCell] = currMax.toString().split(".")[1] ? (currMax.toString().split(".")[1].length > 3 ? currMax.toFixed(3) : currMax) : currMax;
			minArr[indexCell] = currMin.toString().split(".")[1] ? (currMin.toString().split(".")[1].length > 3 ? currMin.toFixed(3) : currMin) : currMin;
			currAver /= currAverChecker;
			averArr[indexCell] = currAver.toString().split(".")[1] ? (currAver.toString().split(".")[1].length > 3 ? currAver.toFixed(3) : currAver) : currAver;
		});

		if (inData.markable) {
			summaryArr.shift();
			multArr.shift();
			maxArr.shift();
			minArr.shift();
			averArr.shift();
			if (summaryArr.length < tableLength) {
				summaryArr.push("");
				multArr.push("");
				maxArr.push("");
				minArr.push("");
				averArr.push("");
			};
		};
		let outtaCells = new String();
		let outtaCellsMinMax = new String();
		let outtaCellsAver = new String();
		summaryArr.forEach((item, num)=>{
			outtaCells += `<td class="s42-table__num-cell"><span pos="0">${item}</span><span pos="1">${multArr[num]}</span></td>`;
			outtaCellsMinMax += `<td class="s42-table__num-cell"><span pos="0">${maxArr[num]}</span><span pos="1">${minArr[num]}</span></td>`;
			outtaCellsAver += `<td class="s42-table__num-cell"><span>${averArr[num]}</span></td>`;
		});

		$(".s42-table--container[data-time='" + timeState + "'] .s42-table__body").append(
			`<tr class="s42-table__sum-row sum-row" nextpos="1">
				${inData.markable ? `<td>
					<div class="s42-table__sum-btn" s42-ripple>
						<i class="material-icons" pos="0" style="color: ${inData.primaryColor}">&#xE147;</i>
						<i class="material-icons" pos="1" style="color: ${inData.primaryColor}">&#xE5C9;</i>
					</div>
				</td>` : undefined}
				${outtaCells}
			</tr>
			<tr class="s42-table__sum-row min-max">
				${inData.markable ? `<td>
					<div class="s42-table__sum-btn" s42-ripple>
						<i class="material-icons" pos="0" style="color: ${inData.primaryColor}">&#xE8E5;</i>
						<i class="material-icons" pos="1" style="color: ${inData.primaryColor}">&#xE8E3;</i>
					</div>
				</td>` : undefined}
				${outtaCellsMinMax}
			</tr>
			<tr class="s42-table__sum-row aver">
				${inData.markable ? `<td>
					<div class="s42-table__sum-btn" s42-ripple>
						<i class="material-icons" style="color: ${inData.primaryColor}">&#xE8E4;</i>
					</div>
				</td>` : undefined}
				${outtaCellsAver}
			</tr>`
		);
	};



	// selecting and (DE|DIS)selecting rows and whole table
	let S42TableSelect = (e) => {
		let self = e.currentTarget;

		if ($(self).hasClass("is-checked")) {
			$(self).removeClass("is-checked");
			$(self.parentNode.parentNode).removeClass("is-checked");

			if ($(self).attr("for") == "checkbox-head") {
				$(".s42-table--container[data-time='" + timeState + "'] .mdl-checkbox").removeClass("is-checked");
				$(".s42-table--container[data-time='" + timeState + "'] .s42-table__body tr:not(.s42-table__sum-row)").removeClass("is-checked");
			} else if (!$(".s42-table--container[data-time='" + timeState + "'] .mdl-checkbox:not([for='checkbox-head'])").hasClass("is-checked")) {
				$(".s42-table--container[data-time='" + timeState + "'] [for='checkbox-head']").removeClass("is-checked");
			};
		} else {
			$(self).addClass("is-checked");
			$(self.parentNode.parentNode).addClass("is-checked");

			if ($(self).attr("for") == "checkbox-head") {
				$(".s42-table--container[data-time='" + timeState + "'] .mdl-checkbox").addClass("is-checked");
				$(".s42-table--container[data-time='" + timeState + "'] .s42-table__body tr:not(.s42-table__sum-row)").addClass("is-checked");
			} else {
				$(".s42-table--container[data-time='" + timeState + "'] [for='checkbox-head']").addClass("is-checked");				
			};
		};

		// summary and multiplication for nums cells
		let summaryArr = new Array(tableLength);
			summaryArr.fill("");
		let multArr = new Array(tableLength);
			multArr.fill("");
		let maxArr = new Array(tableLength);
			maxArr.fill("");
		let minArr = new Array(tableLength);
			minArr.fill("");
		let averArr = new Array(tableLength);
			averArr.fill("");
		let arrHeadNumCells = new Array();
		for (let i = 0; i < $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head .s42-table__num-cell").length; i++) {
			arrHeadNumCells[i] = $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head .s42-table__num-cell")[i];
		}
		if (arrHeadNumCells.length !== 0) {
			let arrHeadCells = new Array();
			for (let i = 0; i < $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head td").length; i++) {
				arrHeadCells[i] = $(".s42-table--container[data-time='" + timeState + "'] .s42-table__head td")[i];
			}
			arrHeadNumCells.forEach((item)=>{
				let indexCell = arrHeadCells.indexOf(item);

				let rowsArr = new Array();
				for (let i = 0; i < $(".s42-table--container[data-time='" + timeState + "'] .s42-table__body tr.is-checked").length; i++) {
					rowsArr[i] = $(".s42-table--container[data-time='" + timeState + "'] .s42-table__body tr.is-checked")[i];
				}

				let currSum = new Number();
				let currMult = new Number(1);
				let currMax = new Number();
				let currMin = Infinity;
				let currAver = new Number();
				let currAverChecker = new Number();
				
				rowsArr.forEach((row)=>{
					let cellsArr = new Array();
					for (let i = 0; i < $(row).children("td").length; i++) {
						cellsArr[i] = $(row).children("td")[i];
					}
					$(cellsArr[indexCell]).addClass("s42-table__num-cell");
					if (!isNaN(parseFloat(cellsArr[indexCell].innerHTML))) {
						currSum += parseFloat(cellsArr[indexCell].innerHTML);
						currMult *= parseFloat(cellsArr[indexCell].innerHTML);

						if (parseFloat(cellsArr[indexCell].innerHTML) > currMax) currMax = parseFloat(cellsArr[indexCell].innerHTML);
						if (parseFloat(cellsArr[indexCell].innerHTML) < currMin) currMin = parseFloat(cellsArr[indexCell].innerHTML);
						currAver += parseFloat(cellsArr[indexCell].innerHTML);
						currAverChecker++
					};
				})
				summaryArr[indexCell] = currSum.toString().split(".")[1] ? (currSum.toString().split(".")[1].length > 3 ? currSum.toFixed(3) : currSum) : currSum;
				multArr[indexCell] = currMult.toString().split(".")[1] ? (currMult.toString().split(".")[1].length > 3 ? currMult.toFixed(3) : currMult) : currMult;
				maxArr[indexCell] = currMax.toString().split(".")[1] ? (currMax.toString().split(".")[1].length > 3 ? currMax.toFixed(3) : currMax) : currMax;
				minArr[indexCell] = currMin.toString().split(".")[1] ? (currMin.toString().split(".")[1].length > 3 ? currMin.toFixed(3) : currMin) : currMin;
				currAver /= currAverChecker;
				averArr[indexCell] = currAver.toString().split(".")[1] ? (currAver.toString().split(".")[1].length > 3 ? currAver.toFixed(3) : currAver) : currAver;
			})

			if (inData.markable) {
				summaryArr.shift();
				multArr.shift();
				maxArr.shift();
				minArr.shift();
				averArr.shift();
				if (summaryArr.length < tableLength) {
					summaryArr.push("");
					multArr.push("");
					maxArr.push("");
					minArr.push("");
					averArr.push("");
				};
			};
			let outtaCells = new String();
			let outtaCellsMinMax = new String();
			let outtaCellsAver = new String();
			summaryArr.forEach((item, num)=>{
				outtaCells += `<td class="s42-table__num-cell"><span pos="0">${item}</span><span pos="1">${multArr[num]}</span></td>`;
				outtaCellsMinMax += `<td class="s42-table__num-cell"><span pos="0">${maxArr[num]}</span><span pos="1">${minArr[num]}</span></td>`;
				outtaCellsAver += `<td class="s42-table__num-cell"><span>${averArr[num]}</span></td>`;
			})

			$(".s42-table--container[data-time='" + timeState + "'] .s42-table__body .s42-table__sum-row.sum-row").attr("nextpos", 1);
			$(".s42-table--container[data-time='" + timeState + "'] .s42-table__body .s42-table__sum-row.sum-row").html(
				`${inData.markable ? `<td>
					<div class="s42-table__sum-btn" s42-ripple>
						<i class="material-icons" pos="0" style="color: ${inData.primaryColor}">&#xE147;</i>
						<i class="material-icons" pos="1" style="color: ${inData.primaryColor}">&#xE5C9;</i>
					</div>
				</td>` : undefined}
				${outtaCells}`
			);

			$(".s42-table--container[data-time='" + timeState + "'] .s42-table__body .s42-table__sum-row.min-max").html(
				`${inData.markable ? `<td>
					<div class="s42-table__sum-btn" s42-ripple>
						<i class="material-icons" pos="0" style="color: ${inData.primaryColor}">&#xE8E5;</i>
						<i class="material-icons" pos="1" style="color: ${inData.primaryColor}">&#xE8E3;</i>
					</div>
				</td>` : undefined}
				${outtaCellsMinMax}`
			);

			$(".s42-table--container[data-time='" + timeState + "'] .s42-table__body .s42-table__sum-row.aver").html(
				`${inData.markable ? `<td>
					<div class="s42-table__sum-btn" s42-ripple>
						<i class="material-icons" style="color: ${inData.primaryColor}">&#xE8E4;</i>
					</div>
				</td>` : undefined}
				${outtaCellsAver}`
			);

			$(".s42-table--container[data-time='" + timeState + "'] .s42-table__sum-btn").click((e)=>{
				let sumRow = ".s42-table--container[data-time='" + timeState + "'] .s42-table__sum-row ";
				$(sumRow + '[pos="0"], ' + sumRow + '[pos="1"]').hide();
				$(sumRow + '[pos="' + $(sumRow).attr("nextpos") + '"]').show();
				$(sumRow).attr("nextpos") == "1" ? $(sumRow).attr("nextpos", 0) : $(sumRow).attr("nextpos", 1);
				
				$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
					width: "",
					"overflow-x": "",
				})
				if ($(".s42-table--container[data-time='" + timeState + "'] .s42-table__head").width() > $(".s42-table").width()) {
					$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
						width: "calc(100% - 32px)",
						"overflow-x": "scroll",
					})
				} else {
					$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
						width: "fit-content",
						"overflow-x": "hidden",
					});
				};
			});

			setTimeout(()=>{ S42TableRipple(); }, 2e2);
		};
	};

	$(".s42-table--container[data-time='" + timeState + "'] .mdl-checkbox").mouseup((e)=>{
		if (!("ontouchstart" in window)) S42TableSelect(e);
	});
	
	$(".s42-table--container[data-time='" + timeState + "'] .mdl-checkbox").on("touchend", (e)=>{
		S42TableSelect(e);
	});

	$(".s42-table--container[data-time='" + timeState + "'] .s42-table__sum-btn").click((e)=>{
		let sumRow = ".s42-table--container[data-time='" + timeState + "'] .s42-table__sum-row ";
		$(sumRow + '[pos="0"], ' + sumRow + '[pos="1"]').hide();
		$(sumRow + '[pos="' + $(sumRow).attr("nextpos") + '"]').show();
		$(sumRow).attr("nextpos") == "1" ? $(sumRow).attr("nextpos", 0) : $(sumRow).attr("nextpos", 1);
		
		$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
			width: "",
			"overflow-x": "",
		});
		if ($(".s42-table--container[data-time='" + timeState + "'] .s42-table__head").width() > $(".s42-table").width()) {
			$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
				width: "calc(100% - 32px)",
				"overflow-x": "scroll",
			});
		} else {
			$(".s42-table--container[data-time='" + timeState + "'] .s42-table").css({
				width: "fit-content",
				"overflow-x": "hidden",
			});
		};
	});

	if (!inData.markable & ($(".s42-table--container[data-time='" + timeState + "'] .s42-table__num-cell").length !== 0)) {
		$(".s42-table--container[data-time='" + timeState + "'] style").append("\n.s42-table--container[data-time='" + timeState + "'] .s42-table__sum-row td *{color:rgba(" + HEXtoRGB(inData.primaryColor) + ",1)}")

		$(".s42-table--container[data-time='" + timeState + "']").append(`<button class="mdl-button s42-table--sum-btn" s42-ripple style="color: rgb(${HEXtoRGB(inData.primaryColor)});"><span pos="0">${(/ru/gi.test(navigator.language) ? "Сумма, макс., ср." : "Summ, max, aver")}</span><span pos="1">${(/ru/gi.test(navigator.language) ? "Произв, мин., ср." : "Mult, min, aver")}</span></button>`);

		$(".s42-table--container[data-time='" + timeState + "'] .s42-table--sum-btn").click((e)=>{
			let sumRow = ".s42-table--container[data-time='" + timeState + "'] .s42-table__sum-row ";
			$(sumRow + '[pos="0"], ' + sumRow + '[pos="1"]').hide();
			$(".s42-table--container[data-time='" + timeState + "'] .s42-table--sum-btn [pos='0'], .s42-table--container[data-time='" + timeState + "'] .s42-table--sum-btn [pos='1']").hide();
			$(sumRow + '[pos="' + $(sumRow).attr("nextpos") + '"]').show();
			$(".s42-table--container[data-time='" + timeState + "'] .s42-table--sum-btn [pos='" + $(sumRow).attr("nextpos") + "']").show()
			$(sumRow).attr("nextpos") == "1" ? $(sumRow).attr("nextpos", 0) : $(sumRow).attr("nextpos", 1);
			
			S42Table.setWidth(timeState);
		});
	};



	// table snackbar functions
	let S42TableShowSnackbar = () => {
		if ($(".s42-bottom-navigation")[0] === undefined) {
			if ($(window).width() < 500) {
				$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css("transform", "translateY(-40px)");
				$(".s42.mdl-button--fab").css("transform", "translateY(-40px)")
			} else {
				$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css("transform", "translateY(-56px)");
				$(".s42.mdl-button--fab").css("transform", "translateY(-56px)")
			};

			setTimeout(()=>{
				$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css("transform", "translateY(0)");
				$(".s42.mdl-button--fab").css("transform", "translateY(0)");
			}, 3e3);
		} else {
			if ($(window).width() < 500) {
				$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css({
					transform: "translateY(-96px)"
				});
				$(".s42.mdl-button--fab").css("transform", "translateY(-40px)")
			} else if ($(window).width() > 500 & $(window).width() < 700) {
				$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css("transform", "translateY(-112px)");
				$(".s42.mdl-button--fab").css("transform", "translateY(-56px)")
			} else {
				$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css("transform", "translateY(-56px)");
				$(".s42.mdl-button--fab").css("transform", "translateY(-56px)")
			};
			setTimeout(()=>{
				$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css("transform", "translateY(0)");
				$(".s42.mdl-button--fab").css("transform", "translateY(0)");
			}, 3e3);
		};
	};

	let S42TableCloseSnackbar = () => {
		$(".s42-table--container[data-time='" + timeState + "'] .s42-snackbar").css("transform", "translateY(0)");
		$(".s42.mdl-button--fab").css("transform", "translateY(0)");
	};



	// copy button listeners
	$(".s42-table--container[data-time='" + timeState + "'] .s42-table--copy-data-btn").click((e)=>{ S42TableShowSnackbar(); });

	$(".s42-table--container[data-time='" + timeState + "'] .s42-table--share-btn").click((e)=>{ S42TableShowSnackbar(); });

	$(".s42-table--container[data-time='" + timeState + "'] .s42-table--copy-btn").click((e)=>{ S42TableShowSnackbar();	});


	// ripple effect
	S42TableRipple();


	return timeState;
};

S42Table.setWidth = inTimeState => {
	$(".s42-table--container[data-time='" + inTimeState + "'] .s42-table").css({
		width: "",
		"overflow-x": "",
	});
	if (!$(".s42-table--container[data-time='" + inTimeState + "'] .s42-table__body").width()) return false;
	if ($(".s42-table--container[data-time='" + inTimeState + "'] .s42-table__head").width() > $(".s42-table").width()) {
		$(".s42-table--container[data-time='" + inTimeState + "'] .s42-table").css({
			width: "calc(100% - 32px)",
			"overflow-x": "scroll",
		});
	} else {
		$(".s42-table--container[data-time='" + inTimeState + "'] .s42-table").css({
			width: "fit-content",
			"overflow-x": "hidden",
		});
	};
};

let checkerSettings = true;

$(".s42-settings-field__obfuscator").click(()=>{ CloseSettings(); });

$(".s42-drawer__obfuscator").click(()=>{ "ontouchstart" in window ? undefined : CloseDrawer(); });

$(".s42-undercut__obfuscator").click(()=>{ CloseUndercut(); });

$(".s42-undercut__obfuscator").on("touchstart", ()=>{ CloseUndercut(); });

$(".s42-dialog__obfuscator").click(()=>{ $(".s42-dialog__obfuscator, .s42-dialog").fadeOut(3e2); });

$(".s42-dialog__obfuscator").on("touchstart", ()=>{ $(".s42-dialog__obfuscator, .s42-dialog").fadeOut(3e2); s
});

$(".s42-dialog__obfuscator").contextmenu(()=>{ $(".s42-dialog__obfuscator, .s42-dialog").fadeOut(3e2); return false; });

$(".s42-dialog__close-btn").click(()=>{	$(".s42-dialog__obfuscator, .s42-dialog").fadeOut(300); });

$(".s42-dialog").contextmenu(()=>{ return false; });

$(".s42-header").contextmenu(()=>{ return false; });

$(".s42-drawer").contextmenu(()=>{ return false; });

$(".s42-options-button").contextmenu((e)=>{ $(e.currentTarget)[0].onclick(); });

$(".s42-bottom-navigation__button").click((e)=>{ SetBottomNavigation(e.currentTarget) });

$(".s42-bottom-navigation__button").contextmenu(()=>{ return false; });

$(".s42-drawer-button").contextmenu((e)=>{
	if (/s42-drawer__body/gi.test($(e.currentTarget).parent().attr("class"))) {
		$(e.currentTarget)[0].click()
	} else {
		let contentArr = [
			{class: "head", text: (/ru/gi.test(navigator.language) ? "Меню" : "Menu"), bold: true},
			{class: "item", text: (/ru/gi.test(navigator.language) ? "Обновить" : "Reload"), content: "location.reload()"},
			{class: "separator"}
		];

		for (let i = 0; i < $(".s42-drawer__body a").length; i++) {
			if (/javascript/ig.test($(".s42-drawer__body a")[i].getAttribute("href"))) {
				contentArr[contentArr.length] = {class: "item-a", text: $(".s42-drawer__body a")[i].innerText, href: $(".s42-drawer__body a")[i].getAttribute("href")}
			} else {
				contentArr[contentArr.length] = {class: "item-a", text: $(".s42-drawer__body a")[i].innerText, href: $(".s42-drawer__body a")[i].getAttribute("href"), target: "_self"};
			};
		};

		if (!($(e.currentTarget).attr("contentarr") === undefined)) {
			let drawerButtonArr = JSON.parse($(e.currentTarget).attr("contentarr"));
			for (let i = 0; i < drawerButtonArr.length; i++) contentArr[contentArr.length] = drawerButtonArr[i];
		};

		if (!($(e.currentTarget).attr("newcontentarr") === undefined)) {
			contentArr = JSON.parse($(e.currentTarget).attr("newcontentarr"));
		};

		if ($(e.currentTarget).attr("nos42menu") === undefined) {
			MakeS42Menu(e.clientX, e.clientY, contentArr);
		} else {
			$(e.currentTarget)[0].onclick();
		};
	};
});

$("a").contextmenu((e)=>{
	if ($(e.currentTarget).attr("nos42menu") !== undefined) return false;
	let contentArr = new Array();
	if (/ru/gi.test(navigator.language)) {
		contentArr = [
			{class: "head", text: /\.\.\//gi.test($(e.currentTarget).attr("href")) ? '<i class="material-icons" style="display: inline; line-height: 20px; font-size: 14px;">&#xE317;</i>&nbsp;' + window.location : $(e.currentTarget).attr("href")},
			{class: "item-a", text: "Открыть в новой вкладке", href: $(e.currentTarget).attr("href"), target: "_blank"},
			{class: "item", text: "Открыть в текущей вкладке", content: "window.location = '" + $(e.currentTarget).attr("href") + "'"}
		];
	} else {
		contentArr = [
			{class: "head", text: /\.\.\//gi.test($(e.currentTarget).attr("href")) ? '<i class="material-icons" style="display: inline; line-height: 20px; font-size: 14px;">&#xE317;</i>&nbsp;' + window.location : $(e.currentTarget).attr("href")},
			{class: "item-a", text: "Open in a new tab", href: $(e.currentTarget).attr("href"), target: "_blank"},
			{class: "item", text: "Open in the current tab", content: "window.location = '" + $(e.currentTarget).attr("href") + "'"}
		];
	};

	if (!($(e.currentTarget).attr("contentarr") === undefined)) {
		let aArr = JSON.parse($(e.currentTarget).attr("contentarr"));
		for (let i = 0; i < aArr.length; i++) {
			contentArr[contentArr.length] = aArr[i]
		};
	};

	if (!($(e.currentTarget).attr("newcontentarr") === undefined)) {
		contentArr = JSON.parse($(e.currentTarget).attr("newcontentarr"));
	};

	if ($(e.currentTarget).attr("nos42menu") === undefined) {
		MakeS42Menu(e.clientX, e.clientY, contentArr);
	} else {
		$(e.currentTarget)[0].onclick();
	};
	return false;
});

window.addEventListener("keydown", (e)=>{
	if (e.code == "Escape" | e.key == "Escape") {
		CloseDrawer();
		$(".s42-dialog__obfuscator, .s42-dialog").fadeOut(3e2)
		CloseSettings();
		CloseUndercut();
		RemoveMenu();
	};
});

window.addEventListener("orientationchange", ()=>{ CloseDrawer() });

(()=>{
	if (!document.querySelector(".s42-drawer")) return false;

	let cStartPoint = new Number(),
		cStartOffset = new Number(),
		cMovingPoint = new Number(),
		cDrawerWidth = $(".s42-drawer__body").width(),
		cClosed = false;

	$(".s42-drawer").on("touchstart", (e)=>{
		if (cClosed) return false;

		cStartPoint = (e.originalEvent.touches[0] || {clientX: 0}).clientX;
		cStartOffset = cStartPoint - DRAWER_WIDTH - parseInt($(".s42-drawer__body").css("left"));
		$(".s42-drawer__body").css("transition-duration", "1ms");
	});

	$(".s42-drawer").on("touchmove", (e)=>{
		if (cClosed) return false;

		cMovingPoint = (e.originalEvent.touches[0] || {clientX: 0}).clientX;
		if (cMovingPoint - cStartOffset <= 0) {
			CloseDrawer();
			cClosed = true;
			setTimeout(()=>{ cClosed = false; }, 601);
		} else {
			if (cMovingPoint - DRAWER_WIDTH - cStartOffset <= 0) {
				$(".s42-drawer__body").css({
					left: cMovingPoint - DRAWER_WIDTH - cStartOffset
				});
			};
		};
	});

	$(".s42-drawer").on("touchend", ()=>{
		let cEndedPoint = DRAWER_WIDTH + cStartOffset - cMovingPoint;
			cEndedPoint < 0 ? cEndedPoint = 0 : undefined;
			cEndedPoint > DRAWER_WIDTH ? cEndedPoint = DRAWER_WIDTH : undefined;
		if (cEndedPoint > DRAWER_WIDTH / 3) {
			CloseDrawer();
		} else {
			$(".s42-drawer__body").css("transition-duration", "600ms");
			$(".s42-drawer__body").css("left", 0);
		};
	});

	$(".s42-drawer").on("touchend", ()=>{
		let cEndedPoint = DRAWER_WIDTH + cStartOffset - cMovingPoint;
			cEndedPoint < 0 ? cEndedPoint = 0 : undefined;
			cEndedPoint > DRAWER_WIDTH ? cEndedPoint = DRAWER_WIDTH : undefined;
		if (cEndedPoint > DRAWER_WIDTH / 3) {
			CloseDrawer();
		} else {
			$(".s42-drawer__body").css("transition-duration", "600ms");
			$(".s42-drawer__body").css("left", 0);
		};
	});
	
})();

(()=>{
	if (window.location.hostname == "s42.ucoz.org" | window.location.hostname == "sergio42.ru") {
		window.location.hostname = "serguun42.ru"
	};

	// if (window.location.protocol == "http:") window.location.protocol = "https:";

	if (window.location.hostname == "sergio42.ru") {
		(function(i, s, o, g, r, a, m) {
			console.log("pageviewed");
			i["GoogleAnalyticsObject"] = r;
			i[r] = i[r] || function(){
				(i[r].q = i[r].q || []).push(arguments)
			},
			i[r].l = 1 * new Date();
			a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");
		ga("create", "UA-91547074-1", "auto");
		ga("send", "pageview");
	} else if (window.location.hostname == "serguun42.ru") {
		(function(i, s, o, g, r, a, m) {
			console.log("pageviewed");
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function(){
				(i[r].q = i[r].q || []).push(arguments)
			},
			i[r].l = 1 * new Date();
			a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");
		ga("create", "UA-101931912-1", "auto");
		ga("send", "pageview");
	};
})();

/*
<div class="s42-header">
	<div onclick="OpenDrawer()" class="mdl-js-button mdl-js-ripple-effect s42-drawer-button"><i class="material-icons">&#xE5D2;</i></div>
	<div class="s42-header__title">
		<span>__TITLE_HERE__</span>
	</div>
	<div onclick="ShowSettings()" class="mdl-js-button mdl-js-ripple-effect s42-options-button"><i class="material-icons">&#xE5D4;</i></div>
</div>
<div class="s42-settings-field__obfuscator"></div>
<div class="s42-settings-field">
	<div class="setting mdl-js-button mdl-js-ripple-effect">
		<i class="material-icons">&#xE5D5;</i>
		<div class="setting__desc">Lorem ipsum</div>
	</div>
	<div class="setting mdl-js-button mdl-js-ripple-effect">
		<i class="material-icons">&#xE5D5;</i>
		<div class="setting__desc">Lorem ipsum</div>
	</div>
</div>
<div class="s42-drawer">
	<div class="s42-drawer__obfuscator"></div>
	<div class="s42-drawer__body">
		<div onclick="CloseDrawer()" class="mdl-js-button mdl-js-ripple-effect s42-drawer-button">
			<i class="material-icons" style="color: #666;">&#xE5C4;</i>
		</div>
		<a href="../">Главная</a>
		<a href="../guide/">Список продуктов</a>
	</div>
</div>



<div class="s42-tabs-select-area">
	<div class="s42-tsa">
		<div class="s42-tsa__tab mdl-js-button mdl-js-ripple-effect" onclick="S42Tabs(this)"><div class="s42-tab__label"></div>ЗАДАЧА 1</div>
		<div class="s42-tsa__tab mdl-js-button mdl-js-ripple-effect" onclick="S42Tabs(this)"><div class="s42-tab__label"></div>ЗАДАЧА 2</div>
		<div class="s42-tsa__tab mdl-js-button mdl-js-ripple-effect" onclick="S42Tabs(this)"><div class="s42-tab__label"></div>ЗАДАЧА 3</div>
		<div class="s42-tsa__tab mdl-js-button mdl-js-ripple-effect" onclick="S42Tabs(this)"><div class="s42-tab__label"></div>ЗАДАЧА 4</div>
	</div>
</div>



<div class="s42 mdl-button mdl-button--fab mdl-js-button mdl-js-ripple-effect" onclick="ShowUndercut()">
	<i class="material-icons">&#xE88F;</i>
</div>



<div class="s42-snackbar">
	<div class="s42-snackbar__suptext" onclick="CloseSnackbar()">Lorem ipsum dolor</div>
	<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="s42-snackbar__cancel-btn" onclick="CloseSnackbar()">SIT AMET</button>
</div>



<div class="s42-input">
	<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
		<input class="mdl-textfield__input" type="text" oninput="MainInput(this)" pattern="-?[0-9]*(\.[0-9]+)?-?\.?-?,?-?[0-9]*(,[0-9]+)?" id="input___">
		<label class="mdl-textfield__label" for="input___"></label>
		<span class="mdl-textfield__error">Это не число!</span>
	</div>
	<div class="mdl-js-button mdl-js-ripple-effect s42-input-icons" onclick="CleanInput(this)">
		<i class="material-icons">&#xE5CD;</i>
	</div>
</div>
function MainInput(iElem) {
	if ($(iElem).val().length) {
		$(iElem).parent().parent().children(".s42-input-icons").show()
	} else {
		$(iElem).parent().parent().children(".s42-input-icons").hide()
	}
}



<div class="s42-dialog__obfuscator"></div>
<div class="s42-dialog">
	<h3 class="s42-dialog__title"></h3>
	<div class="s42-dialog__desc"></div>
	<div class="s42-dialog__actions">
		<button class="mdl-button s42-dialog__close-btn" s42-ripple><span></span></button>
		<button class="mdl-button s42-dialog__accept-btn" s42-ripple><span></span></button>
	</div>
</div>

const MakeDialog = iObj => {
	$(".s42-dialog__title").html(iObj.headDialogText);
	$(".s42-dialog__desc").html(iObj.bodyDialogText);
	$(".s42-dialog__accept-btn").attr("onclick", iObj.acceptBtnAction);
	$(".s42-dialog__accept-btn span").html(iObj.acceptBtnText);
	$(".s42-dialog__close-btn span").html(iObj.closeBtnText);
	$(".s42-dialog__obfuscator, .s42-dialog").fadeIn(4e2);
}

$("[s42-ripple]").append(`<div class="menu-ripple__container"></div>`);

let id;
$(".menu-ripple__container").mousedown(function(e){
	if ("ontouchstart" in window) return false;
	let translateX = e.clientX - $(this).offset().left;
	let translateY = e.clientY - $(this).offset().top;
		id = (new Date()).getMilliseconds();
	$(this).html(`<div class="menu-ripple" id="ripple${id}" style="transform: translate(-50%, -50%) translate(${translateX}px, ${translateY}px);">`)
	$("#ripple"+ id).css({
		height: $(this).width() * 2,
		width: $(this).width() * 2
	})
});
$(".menu-ripple__container").on("touchstart", function(e){
	let translateX = e.originalEvent.touches[0].clientX - $(this).offset().left;
	let translateY = e.originalEvent.touches[0].clientY - $(this).offset().top;
		id = (new Date()).getMilliseconds();
	$(this).html(`<div class="menu-ripple" id="ripple${id}" style="transform: translate(-50%, -50%) translate(${translateX}px, ${translateY}px);">`)
	$("#ripple"+ id).css({
		height: $(this).width() * 2,
		width: $(this).width() * 2
	})
});
$(".menu-ripple__container").on("touchend", function(){
	$("#ripple" + id).fadeOut(300);
});
$(".menu-ripple__container").on("touchcancel", function(){
	$("#ripple" + id).fadeOut(300);
});
$(".menu-ripple__container").mouseup(function(){
	$("#ripple" + id).fadeOut(300);
});
$(".menu-ripple__container").mouseleave(function(){
	$("#ripple" + id).fadeOut(300);
});

.menu-ripple__container {
	height: 100%;
	width: 100%;
	overflow: hidden;
	border-radius: inherit;
	position: absolute;
	top: 0px;
	left: 0px;
}

.menu-ripple {
	background-color: rgba(0, 0, 0, 0.3);
	height: 15px;
	width: 15px;
	border-radius: 50%;
	position: relative;
	transition: transform .3s cubic-bezier(0,0,.2,1),
				width .3s cubic-bezier(0,0,.2,1),
				height .3s cubic-bezier(0,0,.2,1),
				-webkit-transform .3s cubic-bezier(0,0,.2,1);
}



<div class="s42-undercut__obfuscator"></div>
<div class="s42-undercut">
	<div class="s42-undercut__close-button mdl-js-button mdl-js-ripple-effect" onclick="CloseUndercut()">
		<i class="material-icons">&#xE5CD;</i>
	</div>
	<div class="s42-undercut__desc">

	</div>
</div>

function ShowUndercutS() {
	$(".s42-undercut__obfuscator-inf").fadeIn(900);
	$(".s42-undercut").css("display", "block")
	$(".s42-undercut").animate({
		top: 0
	}, 800);
	$(".s42-undercut__close-button").attr("onclick", "CloseUndercutS()");
	$("#usb__label").css("opacity", 0);
	checkerUndercut = true;
}

function CloseUndercutS() {
	$(".s42-undercut__obfuscator-inf").fadeOut(900);
	$(".s42-undercut").animate({
		top: "100%"
	}, 800);
	setTimeout(function() {
		$(".s42-undercut").css("display", "none")
	}, 800);
}

$(".s42-undercut__desc").on("scroll", function(){
	if ($(".s42-undercut__desc").scrollTop() > 0) {
		$("#title-of-desc").css("box-shadow", "0px 0px 12px 0px #333");
	} else {
		$("#title-of-desc").css("box-shadow", "none");
	}
})

{ // onmouse events
	let startCoor = 0;
	let startMove = false;

	document.getElementById("title-of-desc").addEventListener("mousedown", function(e) {
		startCoor = e.clientY - $("#title-of-desc").offset().top;
		startMove = true;
	})

	document.getElementById("title-of-desc").addEventListener("mousemove", function(e) {
		if (e.clientY - startCoor < $(window).height() - 20 & e.clientY - startCoor > 0 & startMove) {
			$(".s42-undercut").css("top", (e.clientY - startCoor).toString() + "px");
		} else if ((e.clientY - startCoor) < 0 & startMove) {
			$(".s42-undercut").css("top", "0px")
		} else if (e.clientY - startCoor > $(window).height() - 20 & startMove) {
			$(".s42-undercut__obfuscator-inf").fadeOut(200);
			$(".s42-undercut").css({
				"top": "100%", "display": "none"
			})
			return false;
		}
	})

	document.getElementById("title-of-desc").addEventListener("mouseup", function(e) {
		if (e.clientY - startCoor < $(window).height()/2) {
			$(".s42-undercut").animate({
				top: "0px"
			}, 300);
		} else {
			$(".s42-undercut__obfuscator-inf").fadeOut(300);
			$(".s42-undercut").animate({
				top: "100%"
			}, 300);
			setTimeout(function() {
				$(".s42-undercut").css("display", "none")
			}, 300);
		}
		startMove = false;
	})

	document.getElementById("title-of-desc").addEventListener("mouseleave", function(e) {
		if (e.clientY - startCoor < $(window).height()/2) {
			$(".s42-undercut").animate({
				top: "0px"
			}, 300);
		} else {
			$(".s42-undercut__obfuscator-inf").fadeOut(300);
			$(".s42-undercut").animate({
				top: "100%"
			}, 300);
			setTimeout(function() {
				$(".s42-undercut").css("display", "none")
			}, 300);
		}
		startMove = false;
	})
}

{ // ontouch events
	let startCoor = 0;

	document.getElementById("title-of-desc").addEventListener("touchstart", function(e) {
		startCoor = e.touches[0].clientY - $("#title-of-desc").offset().top;
	})

	document.getElementById("title-of-desc").addEventListener("touchmove", function(e) {
		if (e.touches[0].clientY - startCoor < $(window).height() - 20 & e.touches[0].clientY - startCoor > 0) {
			$(".s42-undercut").css("top", (e.touches[0].clientY - startCoor).toString() + "px");
		} else if ((e.touches[0].clientY - startCoor) < 0) {
			$(".s42-undercut").css("top", "0px")
		} else if (e.touches[0].clientY - startCoor > $(window).height() - 20) {
			$(".s42-undercut__obfuscator-inf").fadeOut(200);
			$(".s42-undercut").css({
				"top": "100%", "display": "none"
			})
			return false;
		}
	})

	document.getElementById("title-of-desc").addEventListener("touchend", function(e) {
		if (e.changedTouches[0].clientY - startCoor < $(window).height()/2) {
			$(".s42-undercut").animate({
				top: "0px"
			}, 300);
		} else {
			$(".s42-undercut__obfuscator-inf").fadeOut(300);
			$(".s42-undercut").animate({
				top: "100%"
			}, 300);
			setTimeout(function() {
				$(".s42-undercut").css("display", "none")
			}, 300);
		}
	})
}

window.onkeydown = function(e) {
	if (e.code == "Escape" | e.key == "Escape") {
		CloseDrawer();
		CloseUndercut();
	};
}

window.onload = function() {
	$(".s42-obfuscator").css("bottom", -$(".s42-obfuscator").height() + "px");
}
*/

/* styles for long-undercut

.s42-undercut {
	-webkit-transition: bottom .9s ease-out 0s;
	-moz-transition: bottom .9s ease-out 0s;
	transition: bottom .9s ease-out 0s;
	left: 0px;
	top: 100%;
	width: 100%;
	height: 100%;
}

.s42-undercut__obfuscator-inf {
	display: none;
	position: fixed;
	z-index: 10;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.6);
	border: none;
	outline: none;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

.s42-undercut__title {
	-moz-user-select: text;
	-ms-user-select: text;
	-webkit-user-select: text;
	user-select: text;
	z-index: 11;
	border: none;
	outline: none;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

.s42-undercut__close-button {
	z-index: 11;
}

.s42-undercut__desc {
	overflow-y: scroll;
	overflow-x: hidden;
	max-height: calc(100vh - 64px);
	-moz-user-select: text;
	-ms-user-select: text;
	-webkit-user-select: text;
	user-select: text;
}

@media (min-width: 500px) and (max-width: 779px) {
	.s42-undercut {
		width: 100%;
		left: 0;
	}
}

@media (min-width: 780px) {
	.s42-undercut {
		width: 780px !important;
		left: calc(50% - 390px);
	}
}

@media all and (min-width: 1100px) {
	.s42-undercut {
		height: calc(100% - 44px);
		margin-top: 22px;
		margin-bottom: 22px;
		border-radius: 3px;
	}

	.s42-undercut__desc {
		max-height: calc(100% - 96px);		
	}
}

*/