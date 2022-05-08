import { lcb, rcb } from '../handle_scenes.js';

export const init = async model => {
   let flag = false;
   let screen = model.add('cube');
   model.animate(() => {
      let m = views[0]._viewMatrix;
      model.setMatrix([m[0],m[4],m[8],0,m[1],m[5],m[9],0,m[2],m[6],m[10],0,0,1.5,0,1]);
      model.customShader(`
         float r = sqrt(dot(vAPos.xy, vAPos.xy));
	 opacity = r < 1. ? 1. : 0.;
         float fl = -1. / uProj[3].z; // FOCAL LENGTH OF VIRTUAL CAMERA
	 vec4 p = vec4(vAPos.xy,sqrt(1.-r*r)-fl,0.) * uView;
	 float s = .1 + .9 * max(dot(vAPos,vec3(.5)),0.);
	 float n1 = 1., n2 = 1., n3 = 1., f = .7;
	 for (int i = 0 ; i < 5 ; i++) {
	    n2 += noise(f * (2.*p.xyz - (.06 + .002 * abs(n1-1.)) * uTime)) / f;
	    n3 += noise(f * (2.*p.xyz - (.06 + .002 * abs(n2-1.)) * uTime)) / f;
	    f *= 80.;
   }
	 color = s * (vec3(0,0,0.5));
	 color = s * mix(color, vec3(0,0,0), n3 - 0.95);
	 color = s * mix(color, vec3(0,0,0), n2 - 0.98);
      `);
      screen.identity().scale(.2,.2,.001);
      if ((lcb.hitLabel(screen) || rcb.hitLabel(screen)) && !flag){
         console.log("here");
         flag = true;
      }
   });
}
