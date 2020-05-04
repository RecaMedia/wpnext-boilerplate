module.exports = (argList => {
	let arg = {}, a, opt, thisOpt, curOpt;
	for (a = 0; a < argList.length; a++) {
		thisOpt = argList[a].trim();
		opt = thisOpt.replace(/^\-+/,'');
		if (opt === thisOpt) {
			if (curOpt) arg[curOpt] = opt;
			curOpt = null;
		} else {
			curOpt = opt;
			arg[curOpt] = true;
		}
	}
	return arg;
})(process.argv);