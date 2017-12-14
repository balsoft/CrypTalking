function makeDialog(iObj) {
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

function dialogSetField(iObj) {
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


function makeSnackbar(iText) {
    $(".s42-snackbar__suptext").html(iText);
    $(".s42-snackbar").addClass("is-visible");
    setTimeout(() => {
        $(".s42-snackbar").removeClass("is-visible");
    }, 3e3);
};

export {
    makeDialog,
    dialogSetField,
    makeSnackbar
}