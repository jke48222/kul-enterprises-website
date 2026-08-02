"use client";

import { useEffect, useRef } from "react";

/**
 * THE ROAD, RENDERED ON THE GPU.
 *
 * Scene 10 runs eleven photographs from night to full sun. This draws them
 * full bleed and dissolves between them with a displacement that radiates out
 * of the road's own vanishing point, so a change of photograph reads as being
 * pulled through the frame rather than as a crossfade between two pictures.
 *
 * ============================================================================
 * WHY THERE IS NO LIBRARY HERE
 * ============================================================================
 * three.js is around 150KB and OGL around 15KB, and all either would supply is
 * a full-screen quad and a shader program. That is roughly eighty lines of
 * WebGL2, written once, with no version to track and nothing shipped that is
 * not used. The scene needs one draw call and two textures.
 *
 * ============================================================================
 * WHAT MAKES THIS AFFORDABLE
 * ============================================================================
 * Three things, and all three matter on a mid-range phone:
 *
 * 1. IT ONLY EVER HOLDS TWO TEXTURES. The obvious build uploads all eleven
 *    photographs, which at 1920px is roughly 89MB of VRAM and will simply fail
 *    on a cheap Android. This keeps the current pair and prefetches exactly one
 *    ahead, so the ceiling is about three textures however long the scene runs.
 *
 * 2. IT DOES NOT RUN A LOOP. The only thing that changes here is scroll
 *    position, so it draws when the scene tells it progress moved and at no
 *    other time. A scene sitting still costs nothing at all.
 *
 * 3. IT STOPS COMPLETELY WHEN OFF SCREEN, and gives its textures back.
 *
 * ============================================================================
 * IT IS AN ENHANCEMENT AND IT IS ALLOWED TO FAIL
 * ============================================================================
 * If WebGL2 is missing, the context is lost, or an image fails to decode, this
 * renders nothing and reports it. Scene 10's own strip is the real content and
 * stands on its own underneath. Nothing here is ever the only route to seeing
 * a photograph.
 */

const VERT = `#version 300 es
// One oversized triangle rather than a quad: two fewer vertices, no seam down
// the diagonal, and it is the standard way to cover a viewport.
const vec2 verts[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
out vec2 vUv;
void main() {
  vec2 p = verts[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 frag;

uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;      // 0..1 across this one dissolve
uniform vec2  uResolution;
uniform vec2  uFromSize;
uniform vec2  uToSize;
uniform float uGrain;

/** object-fit: cover, done in the shader so photographs never distort. */
vec2 coverUV(vec2 uv, vec2 res, vec2 tex) {
  float rs = res.x / res.y;
  float rt = tex.x / tex.y;
  vec2 scale = rs > rt ? vec2(1.0, rt / rs) : vec2(rs / rt, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

/* Cheap value noise. Enough to break the displacement up so the dissolve does
   not read as a clean geometric wipe, and far cheaper than a texture fetch. */
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);

  /* THE VANISHING POINT. Every one of these eleven frames was shot through a
     windscreen, so the road always recedes to roughly the same place: centred
     horizontally, a little above the middle. Displacing radially out of that
     point is what makes the dissolve read as travelling INTO the next frame
     rather than as two images being mixed. */
  vec2 vanish = vec2(0.5, 0.54);
  vec2 dir = vUv - vanish;

  /* Strongest in the middle of the transition and nothing at either end, so
     each photograph is perfectly sharp while it is being read. */
  float push = sin(p * 3.14159265) * 0.085;
  float n = noise(vUv * 4.0) * 0.6 + 0.4;

  vec2 uvFrom = vUv + dir * push * n;          // outgoing rushes outward
  vec2 uvTo   = vUv - dir * push * (1.0 - n) * 0.8;  // incoming settles inward

  vec4 a = texture(uFrom, coverUV(uvFrom, uResolution, uFromSize));
  vec4 b = texture(uTo,   coverUV(uvTo,   uResolution, uToSize));

  float m = smoothstep(0.0, 1.0, p);
  vec3 col = mix(a.rgb, b.rgb, m).rgb;

  /* Film grain, keyed to the frame so it does not crawl. It is what stops
     eleven phone photographs blown up full bleed from looking like a slideshow
     of phone photographs. */
  float g = (hash(vUv * uResolution + uGrain) - 0.5) * 0.045;
  col += g;

  frag = vec4(col, 1.0);
}`;

export type RoadShaderHandle = {
  /** Called by the scene with the pair to show and how far between them. */
  set(fromIndex: number, toIndex: number, progress: number): void;
};

export default function RoadShader({
  sources,
  handleRef,
  className,
}: {
  /** Absolute image paths, in the order the light runs. */
  sources: readonly string[];
  handleRef: React.MutableRefObject<RoadShaderHandle | null>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    // No WebGL2. The strip underneath is the real scene; say nothing and stop.
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("[road shader]", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[road shader]", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const u = {
      from: gl.getUniformLocation(prog, "uFrom"),
      to: gl.getUniformLocation(prog, "uTo"),
      progress: gl.getUniformLocation(prog, "uProgress"),
      resolution: gl.getUniformLocation(prog, "uResolution"),
      fromSize: gl.getUniformLocation(prog, "uFromSize"),
      toSize: gl.getUniformLocation(prog, "uToSize"),
      grain: gl.getUniformLocation(prog, "uGrain"),
    };
    gl.uniform1i(u.from, 0);
    gl.uniform1i(u.to, 1);

    /**
     * Only ever holds what is on screen plus one ahead. See the header: keeping
     * all eleven resident is the difference between working and dying on a
     * mid-range phone.
     */
    type Tex = { tex: WebGLTexture; w: number; h: number };
    const cache = new Map<number, Tex>();
    const pending = new Set<number>();

    const load = (i: number) =>
      new Promise<Tex | null>((resolve) => {
        if (cache.has(i)) return resolve(cache.get(i)!);
        if (pending.has(i) || i < 0 || i >= sources.length) return resolve(null);
        pending.add(i);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => {
          const tex = gl.createTexture()!;
          gl.bindTexture(gl.TEXTURE_2D, tex);
          /* WITHOUT THIS EVERY PHOTOGRAPH IS UPSIDE DOWN, and it is not subtle:
             the road renders along the top of the frame and the sky along the
             bottom. A decoded bitmap has its origin at the top left and a GL
             texture has its origin at the bottom left, so an unflipped upload
             inverts the image. It is the most common WebGL texture bug there
             is, and it cost a full recording pass to spot here, because it is
             invisible to every measurement and obvious the instant you look. */
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          // CLAMP, because the displacement pushes uvs past the edge and REPEAT
          // would wrap the far side of the photograph into frame.
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          const entry = { tex, w: img.naturalWidth, h: img.naturalHeight };
          cache.set(i, entry);
          pending.delete(i);
          resolve(entry);
        };
        img.onerror = () => {
          pending.delete(i);
          resolve(null);
        };
        img.src = sources[i];
      });

    const evict = (keep: number[]) => {
      for (const [i, entry] of cache) {
        if (!keep.includes(i)) {
          gl.deleteTexture(entry.tex);
          cache.delete(i);
        }
      }
    };

    let visible = false;
    let last = { a: -1, b: -1, p: -1 };

    const resize = () => {
      // Capped at 1.5: the shader is a dissolve between photographs, and past
      // this the extra pixels cost fill rate and buy nothing visible.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (a: Tex, b: Tex, p: number) => {
      resize();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, a.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, b.tex);
      gl.uniform1f(u.progress, p);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform2f(u.fromSize, a.w, a.h);
      gl.uniform2f(u.toSize, b.w, b.h);
      gl.uniform1f(u.grain, Math.floor(p * 64));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // THE ONLY ENTRY POINT. The scene calls this when its progress moves, and
    // nothing draws at any other time: there is no animation loop here.
    handleRef.current = {
      set(fromIndex, toIndex, progress) {
        if (!visible) return;
        const q = Math.round(progress * 100) / 100;
        if (fromIndex === last.a && toIndex === last.b && q === last.p) return;
        last = { a: fromIndex, b: toIndex, p: q };
        Promise.all([load(fromIndex), load(toIndex)]).then(([a, b]) => {
          if (!a || !b) return;
          draw(a, b, progress);
          // One ahead, so the next dissolve never waits on a decode.
          void load(toIndex + 1);
          evict([fromIndex, toIndex, toIndex + 1]);
        });
      },
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (!visible) {
          // Give the memory back the moment the scene leaves.
          evict([]);
          last = { a: -1, b: -1, p: -1 };
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(canvas);

    const onResize = () => {
      if (visible && last.a >= 0) {
        const { a, b, p } = last;
        last = { a: -1, b: -1, p: -1 };
        handleRef.current?.set(a, b, p);
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    const onLost = (e: Event) => {
      e.preventDefault();
      console.warn("[road shader] context lost; the strip carries the scene");
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      evict([]);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteVertexArray(vao);
      handleRef.current = null;
    };
  }, [sources, handleRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // Nothing here is content. Every photograph it draws is also in the strip
      // below it, with its own alt text and plate number.
    />
  );
}
