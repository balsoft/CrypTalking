/*for unsupportable/old browsers | для неподдерживаемых/старых браузеров*/
window.onload = function () {
	setTimeout(function () {
		if (!(document.getElementById("starting") === undefined | document.getElementById("starting") === null)) {
			if (/ru/gi.test(navigator.language)) {
				document.querySelector(".s42-dialog__title").innerHTML = "Внимание";
				document.querySelector(".s42-dialog__desc").innerHTML = "Видимо, ваш браузер устарел, либо вы используете старое устройство. Советую использвать другой браузер";
				document.querySelector(".s42-dialog").style.height = "228px";
			} else {
				document.querySelector(".s42-dialog__title").innerHTML = "Attention";
				document.querySelector(".s42-dialog__desc").innerHTML = "It's like your browser's unsupportable or you're using unsupportable device. Recommend to change your browser";
				document.querySelector(".s42-dialog").style.height = "248px";
			}
			document.querySelector(".s42-dialog__accept-btn").outerHTML = ""
			document.querySelector(".s42-dialog__close-btn span").innerHTML = "ОК";
			document.querySelector(".s42-dialog__close-btn").onclick = function () {
				window.location.reload()
			};
			document.querySelector(".s42-dialog__obfuscator").style.display = "block";
			document.querySelector(".s42-dialog").style.display = "block";
			document.querySelector(".s42-dialog").style.zIndex = "21";
			document.getElementById("starting").style.backgroundColor = "#DDD"
		}
	}, 1e3)
}