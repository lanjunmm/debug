/**
 * 对原生方法进行包装然后替换
 * @param source The object that contains a method to be wrapped.
 * @param name The name of method to be wrapped
 * @param replacement The function that should be used to wrap the given method
 */
export function _replace(source: object, name: string, replacement: (...args: any[]) => any): void {
    const original = source[name];

    function doReplace() {
        const wrapFunc = replacement(original);
        wrapFunc.__originFunc__=original;
        wrapFunc.__replaced__=true;
        source[name] = wrapFunc;
    }

    if (original) {
        // if original func existed
        if (!(name in source)) return
        doReplace()
        return
    } else if (original === null || original === undefined) {
        // such as window.onerror whose initial value would be null
        // so just do the replacement
        doReplace()
        return
    }
}

/** 将source.name替换为原生方法*/
export function _unReplace(source: object, name: string) {
    if(!(name in source)||(!source[name].__replaced__)) return;
    const {__originFunc__} = source[name];
    source[name] = __originFunc__;
}
export function _newuuid(): string {
    return Math.random()
        .toString(16)
        .split('.')[1]
}