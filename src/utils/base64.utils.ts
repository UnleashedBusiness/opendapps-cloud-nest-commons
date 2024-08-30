export default class Base64Utils {
  public static getOriginalSize(base64EncodedString: string): number {
    if (base64EncodedString === undefined) {
      return 0;
    }
    const length = base64EncodedString.length;
    const paddingLength = length - base64EncodedString.substring(0, base64EncodedString.indexOf('=')).length;
    return 3 * (length / 4) - paddingLength;
  }
}
