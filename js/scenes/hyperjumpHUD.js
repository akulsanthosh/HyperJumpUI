import { lcb, rcb } from '../handle_scenes.js';
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

let list = ['HyperJump','Halflife','VVroom','HyperJump','Halflife','VVroom']


export const init = async model => {
  let isAnimate = 0, isItalic = 0, isClear = 0, t = 0, min = 0, flag = false;
  model.control('a', 'animate', () => isAnimate = ! isAnimate);
  model.control('c', 'clear'  , () => isClear   = ! isClear  );
  model.control('i', 'italic' , () => isItalic  = ! isItalic );

  // let text = `Now is the time   \nfor all good men  \nto come to the aid\nof their party.   ` .split('\n');

  let lists = model.add();
  let label = lists.add();
  let nextline = -1;
  for (let line = 0 ; line < list.length ; line++){
    if (line%3 === 0) nextline++;
    label.add('label').move(-7 + 13/2 * (line%3),-nextline * 1.1,0).scale(.5);
  }

  // blackhole
  let blackhole = model.add();
  blackhole.add('sphere').move(0,0,0).scale(0.6,0.6,0.1).color(0,0,0);

  model.animate(() => {
    lists.hud().scale(1);
    label.identity().scale(.1);
    label.flag('uTransparentTexture', isClear);
    for (let line = 0 ; line < list.length ; line++) {
      let obj = label.child(line);
      obj.info((isItalic ? '<i>' : '') + list[line])
        .color(lcb.hitLabel(obj) ? [1,.5,.5] :
          rcb.hitLabel(obj) ? [1,.5,.5] : [1,1,1]);

      let leftTrigger  = buttonState.left[0].pressed;
      let rightTrigger = buttonState.right[0].pressed;
      if ((lcb.hitLabel(obj) && leftTrigger) || (rcb.hitLabel(obj) && rightTrigger)){
        flag = true;
      }
    }

    // blackhole

    // blackhole.identity();
    if (flag){
      blackhole.hud().scale(1);
      t += model.deltaTime;
      let s = -0.8 * Math.sin(t);
      if (min > s) {
        min = s;
        blackhole.move(0,0,s);
      }
      else{
        blackhole.move(0,0,min);
      }
    }


  });
}