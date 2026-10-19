---
title: Shrinking the 3D hero from 8.8 MB to 2 MB
date: 2026-10-18
summary: The portfolio's 3D PC loaded from someone else's GitHub repo and was hidden on phones. Here is how it got self-hosted, cut by 77%, and shown on mobile.
tags: [three.js, performance, glTF]
project: portfolio
draft: true
---

<!-- DRAFT, written by Claude from docs/3D_PLAN.md. Rewrite in your own voice and check every claim before removing `draft: true`. -->

The hero of this site is a 3D desktop PC rendered with Three.js. It started as a template asset, and it had two problems: it was downloaded from another person's GitHub repo, and it was too heavy for phones, so on mobile it wasn't shown at all.

## What was wrong

The stock model is an unpacked glTF: 685 meshes, 86 materials, about 86k triangles, roughly 8.8 MB spread over about 55 requests. Hosting it from a repo I don't control was a single point of failure.

## The fix

1. **Self-host both models** in `public/models/`, so nothing depends on a third party staying online.
2. **Leave desktop stock.** It works, and I didn't want to risk its look.
3. **Build an optimized copy for phones** with `gltf-transform`:

```bash
# cap every texture to 1024px except the monitor screen
npx --yes @gltf-transform/cli resize scene.gltf a.gltf --width 1024 --height 1024 --pattern '^(?!.*Material\.074_30)'
# convert textures to WebP
npx --yes @gltf-transform/cli webp a.gltf b.gltf
# merge meshes, prune, compress geometry with meshopt
npx --yes @gltf-transform/cli optimize b.gltf pc-mobile.glb --compress meshopt --texture-compress false
```

The result is 2.0 MB. Meshopt needs no external decoder because drei's `useGLTF` handles it, which is why I skipped Draco.

## What didn't work

Capping everything at 1024px got the file to 1.4 MB, but the monitor screen turned visibly blurry. It is the most-looked-at part of the scene, so I kept that one texture at 1920x1080 and paid 0.6 MB for it.

Orbit controls were also a problem on phones: they force `touch-action: none`, which stops the page from scrolling when a finger is on the canvas. Mobile gets a slow idle sway instead.

## What I haven't measured

I checked this in headless Chrome with software rendering and on one Android phone. I haven't measured real frame rate or battery use.
