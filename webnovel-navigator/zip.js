/*
 * zip.js — 순수 JavaScript ZIP 생성기 (STORE 방식, 무압축)
 * 외부 라이브러리 없이 오프라인에서 .zip 을 만들기 위한 최소 구현.
 * UTF-8 파일명을 지원한다.
 */
(function (global) {
  // CRC32 테이블 (한 번만 생성)
  const CRC_TABLE = (function () {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  const encoder = new TextEncoder();

  /**
   * files: [{ name: string, content: string }]
   * @returns {Blob} application/zip
   */
  function createZip(files) {
    const chunks = [];
    const central = [];
    let offset = 0;

    function pushU16(arr, v) { arr.push(v & 0xff, (v >>> 8) & 0xff); }
    function pushU32(arr, v) {
      arr.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
    }

    for (const file of files) {
      const nameBytes = encoder.encode(file.name);
      const dataBytes = encoder.encode(file.content);
      const crc = crc32(dataBytes);
      const size = dataBytes.length;

      // 로컬 파일 헤더
      const local = [];
      pushU32(local, 0x04034b50);   // signature
      pushU16(local, 20);           // version needed
      pushU16(local, 0x0800);       // flags: UTF-8 파일명
      pushU16(local, 0);            // compression: store
      pushU16(local, 0);            // mod time
      pushU16(local, 0);            // mod date
      pushU32(local, crc);
      pushU32(local, size);         // compressed size
      pushU32(local, size);         // uncompressed size
      pushU16(local, nameBytes.length);
      pushU16(local, 0);            // extra len

      const localHeader = new Uint8Array(local);
      chunks.push(localHeader, nameBytes, dataBytes);

      // 중앙 디렉터리 레코드
      const cen = [];
      pushU32(cen, 0x02014b50);
      pushU16(cen, 20);             // version made by
      pushU16(cen, 20);             // version needed
      pushU16(cen, 0x0800);         // flags
      pushU16(cen, 0);              // compression
      pushU16(cen, 0);              // time
      pushU16(cen, 0);              // date
      pushU32(cen, crc);
      pushU32(cen, size);
      pushU32(cen, size);
      pushU16(cen, nameBytes.length);
      pushU16(cen, 0);              // extra len
      pushU16(cen, 0);              // comment len
      pushU16(cen, 0);              // disk number
      pushU16(cen, 0);              // internal attrs
      pushU32(cen, 0);              // external attrs
      pushU32(cen, offset);         // local header offset
      central.push(new Uint8Array(cen), nameBytes);

      offset += localHeader.length + nameBytes.length + dataBytes.length;
    }

    // 중앙 디렉터리 크기/오프셋 계산
    const centralStart = offset;
    let centralSize = 0;
    for (const c of central) centralSize += c.length;

    // End of central directory
    const end = [];
    pushU32(end, 0x06054b50);
    pushU16(end, 0);                // disk
    pushU16(end, 0);                // disk with central dir
    pushU16(end, files.length);     // entries on this disk
    pushU16(end, files.length);     // total entries
    pushU32(end, centralSize);
    pushU32(end, centralStart);
    pushU16(end, 0);                // comment len

    const all = [...chunks, ...central, new Uint8Array(end)];
    return new Blob(all, { type: "application/zip" });
  }

  global.SimpleZip = { createZip };
})(window);
