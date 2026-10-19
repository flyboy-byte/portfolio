# 3D hero — state and follow-up plan

Status: shipped and live (2026-10-18). Nothing below is in progress. The options are independent; pick any, in any order.

## Where it stands

- Stock PC and planet glTFs are self-hosted in `public/models/` (previously fetched from `lohitkolluri/Portfolio-Website` on GitHub, which was a single point of failure).
- Desktop: stock `desktop_pc/scene.gltf`, unchanged behavior (`OrbitControls`, shadows, `frameloop="demand"`).
- Mobile (<=768px): `pc-mobile.glb`, 8.8 MB -> 2.0 MB. See `docs/ARCHITECTURE.md` for the mobile-specific setup.
- Verified only in headless Chrome with software rendering, plus one screenshot from Logan's phone (Brave, Android). Real-device frame rate and battery were never measured.
- Verdict from Logan: "pretty good." The model is still a third-party template asset with tuning on top, so it is polished but not distinctly his. That is the actual motivation for the options below.

## Do not re-raise

- Draco: not used on purpose. Meshopt needs no external decoder; drei handles it.
- Optimizing the desktop model: deliberately left stock. Logan wanted desktop "mostly stock" and the optimized version for mobile only.
- Moving the PC down or enlarging it on mobile to close the gap above the scroll indicator: tried reasoning it through (2026-10-18); the PC already sits near the center of the free space and a bigger PC crops again.

## Options

### A. Attribution (do this first, it is a license requirement, not polish)
Both models are CC-BY-4.0 (Yolala1232 "Gaming Desktop PC", cmzw "Stylized planet"). README Credits now lists them, but the **site itself shows no credit**. CC-BY wants attribution reasonably visible to users.
- Add a small footer line or a credits section linking both authors and the licence. Content source of truth is `src/constants/index.js`.
- The mobile GLB is a modified derivative of the PC model; say so ("optimized for mobile").

### B. Personalize the scene (the real goal)
Cheapest first:
1. Replace the monitor screen texture with something that is Logan's: a real terminal, the portfolio code, a GDS2/diagnostic screen, an SDR waterfall. The screen texture is `Material.074_30_baseColor.png` (1920x1080) in `desktop_pc/textures/`; in `pc-mobile.glb` it is the one non-square 1920x1080 WebP. Swap the image, re-run the mobile build.
2. Re-skin small props via texture swaps (mousepad, wallpaper on screen, case fan colors).
3. Heavier: edit the model in Blender (swap the desk for a workbench, add a radio, a wrench, an ESP32 board), re-export glTF, rebuild the mobile GLB. Needs Blender and modeling time.
4. Heaviest: a custom scene (car, engine bay, radio rack) in Blender. Same pipeline.

### C. Real-device performance check
Measure instead of guessing: Chrome remote debugging on the phone, look at frame time and GPU memory with the sway running. If it is heavy, lower the sway (or drop it), cap `dpr` to 1, or pause rendering while the nav menu is open.

### D. Optimize the rest
- `Ball.jsx` and `Earth.jsx` run `frameloop="always"` and keep rendering off-screen. Gate them with an `IntersectionObserver` the way `Computers.jsx` does for the sway. The Tech section can have 8 live canvases at once.
- Planet: run the same optimize pipeline (2 MB -> well under 1 MB).
- KTX2 (Basis) textures instead of WebP would cut GPU memory further but needs a transcoder; only worth it if C shows a memory problem.

### E. Framing polish
The PC is cropped slightly differently at different phone aspect ratios (tuned on a ~19.5:9 Android screen). If it looks off on another device, adjust the group position and fov in `Computers.jsx`.

## Rebuilding `pc-mobile.glb`

Tool: `@gltf-transform/cli` (run with `npx --yes`, no install). Source is the stock `public/models/desktop_pc/`. Texture steps must run on the `.gltf` (before packing), because packing to `.glb` drops the texture file names the `--pattern` filter matches on.

```sh
cp -r public/models/desktop_pc /tmp/pcwork && cd /tmp/pcwork
# 1. cap every texture to 1024px except the monitor screen
npx --yes @gltf-transform/cli resize scene.gltf a.gltf --width 1024 --height 1024 --pattern '^(?!.*Material\.074_30)'
# 2. convert all textures to WebP
npx --yes @gltf-transform/cli webp a.gltf b.gltf
# 3. merge meshes, prune, meshopt-compress geometry; leave textures alone
npx --yes @gltf-transform/cli optimize b.gltf pc-mobile.glb --compress meshopt --texture-compress false
cp pc-mobile.glb <repo>/public/models/pc-mobile.glb
```

Expect ~2.0 MB. A simple `optimize ... --texture-compress webp --texture-size 1024` gives 1.4 MB but blurs the monitor screen, which is the most-looked-at texture. Use the zsh-safe form above (full commands, not a variable holding the command). Always screenshot before and after; lossy steps can shift the look.

## Attempt log

| Attempt | Result |
| --- | --- |
| Hide the PC on mobile (original template behavior) | Worked, but mobile hero was empty |
| Optimize at 1024px everywhere (1.4 MB) | Loaded fine on phone; monitor screen visibly blurry |
| Keep screen at 1920x1080, rest 1024px (2.0 MB) | Screen crisp; shipped |
| Shift model -0.3/+1.1 to fit the tower | Overshot, left speaker clipped |
| Shift -0.15/+0.55, fov 52, sway 0.08 rad | Whole desk fits; shipped |
