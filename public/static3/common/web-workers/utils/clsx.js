function clsx() {
	let i = 0,
    tmp,
    str='',
    len = arguments.length;
	for (; i < len; i++) {
		if (tmp = arguments[i]) {
			if (typeof tmp === 'string') {
				str += (str && ' ') + tmp;
			}
		}
	}
	return str;
}
