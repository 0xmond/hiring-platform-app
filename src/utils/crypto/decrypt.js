import CryptoJS from "crypto-js";

export const decrypt = (encrypedData) => {
  return CryptoJS.AES.decrypt(encrypedData, process.env.CRYPTO_KEY).toString(
    CryptoJS.enc.Utf8
  );
};
