
import _ from 'lodash';
import {Events} from "@/utils/events";
import {EventType} from "@/model/const";

const ENV = process.env;
class Tools {
  static getUUID() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
  }

  static importAll(r, func = () => {}) {
    r.keys().forEach(key => {
      const mod = r(key);
      func(mod.__esModule && mod.default ? mod.default : mod);
    });
  }

  static isProd() {
    return ENV.NODE_ENV === 'production';
  }
}
class Msg {

  static alert(msg, func = () => {
  }) {
    let params = {
      dialog: true,
      msg,
      func
    };
    Events.$emit(EventType.alert, params);
  }

  static confirm(msg, sureFunc = () => {
  }, cancelFunc = () => {
  }, persistent) {
    let params = {
      dialog: true,
      msg,
      sureFunc,
      cancelFunc,
      persistent
    };
    Events.$emit(EventType.confirm, params);
  }
}
export {
  ENV,
  Tools,
  Msg
}
