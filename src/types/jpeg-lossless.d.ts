declare module 'jpeg-lossless-decoder-js' {
  export namespace lossless {
    class Decoder {
      columns: number;
      rows: number;
      decode(
        buf: ArrayBuffer | ArrayBufferLike,
        offset?: number,
        length?: number
      ): ArrayBuffer;
    }
  }
}
