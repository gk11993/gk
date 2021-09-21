
module.exports = {
	capture: "shell screencap -p /sdcard/screenshot.png",
	dumpXml: "shell uiautomator dump /sdcard/window_dump.xml",
	pull: "pull /sdcard/screenshot.png ",
	install: "install xxx.apk",
	uninstall: "uninstall com.tencent.mobileqq",
	getName: "uninstall com.tencent.mobileqq",
	run: "shell am start -n 包名/入口",
	clear: "shell pm clear 包名",
	click: "shell input tap ",
	getAllName: "shell pm list packages -3",

	sendKey: "shell input text msg"
}