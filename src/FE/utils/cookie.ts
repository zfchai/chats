const Cookies = {
  getItem: function (sKey: string) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
              encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$',
          ),
          '$1',
        ),
      ) || null
    );
  },
  setItem: function (
    sKey: string,
    sValue: string,
    vEnd: number | string | Date,
    sPath?: string,
    sDomain?: string,
    bSecure?: string,
  ) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd;
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + new Date(vEnd).toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '');
    return true;
  },
  removeItem: function (sKey: string, sPath?: string, sDomain?: string) {
    if (!sKey || !this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '');
    return true;
  },
  hasItem: function (sKey: string) {
    return new RegExp(
      '(?:^|;\\s*)' +
        encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
        '\\s*\\=',
    ).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },
};

export default Cookies;
