export function fileSize(a,b,c,d,e){
 return (b=Math,c=b.log,d=1024,e=c(a)/c(d)|0,a/b.pow(d,e)).toFixed(2)
 +' '+(e?'KMGTPEZY'[--e]+'iB':'Bytes')
}

export function getDateTimeString() {
	// Returns a string in format YYYYMMDDHHmmss
	const date = new Date()
	const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
	const dd = date.getDate().toString();
	const HH = date.getHours().toString();
	const MM = date.getMinutes().toString();
	const ss = date.getSeconds().toString();

	return [date.getFullYear(), mm.length===2 ? '' : '0', mm, dd.length===2 ? '' : '0', dd, HH, MM, ss].join('');
}

export function getFileExtension(fname) {
	 return fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
}