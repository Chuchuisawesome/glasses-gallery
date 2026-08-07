# 眼镜投图相册（Meta Ray-Ban Display Web App）

600×600 静态网页：从 `manifest.json` 读图列表，左右键切换上一张 / 下一张。

## 本地预览

```bash
cd glasses-gallery
node scripts/gen-manifest.js
python3 -m http.server 8765
```

浏览器打开 `http://127.0.0.1:8765/`，DevTools 设视口 600×600，用方向键左右翻页，Enter 重新拉清单。

## 加图

1. 把 `.jpg` / `.png` / `.webp` 放进 `images/`
2. 运行 `node scripts/gen-manifest.js`
3. 提交并推送到托管仓库

## 部署（HTTPS）

任选一种静态托管（GitHub Pages / Cloudflare Pages / Netlify 等），站点根目录指向 `glasses-gallery/`（需能访问 `/index.html`、`/manifest.json`、`/images/...`）。

GitHub Pages 建议在该目录放 `.nojekyll`（仓库内已包含）。

## 接到眼镜

1. Meta AI → 设置 → 应用信息 → 打开开发者模式  
2. 应用 → 网页应用 → 连接网页应用  
3. 名称例如 `我的相册`，网址填部署后的 `https://.../`  
4. 眼镜点亮显示 → 滑到应用页 → 打开该应用 → 左右切换

## 测试

```bash
node tests/gallery-logic.test.js
node tests/gen-manifest.test.js
```
