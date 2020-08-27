
class Link {
  constructor(model) {
    this.href = ""; // link href
    this.objectId = 0;
    this.module = ""; // link type
    this.name = ""; // link title
    Object.assign(this, model || {});
    // console.log(this);
  }
}


class TitleLink extends Link {
  constructor(model) {
    super(model);
    this.content = "";
  }
}

class ButtonLink extends Link {
  constructor(model) {
    super(model);
    this.btnText = '按钮';
    this.btnOutline = true;
    this.btnPriColor = true;
  }
}


export {
  Link,
  TitleLink,
  ButtonLink,
};
