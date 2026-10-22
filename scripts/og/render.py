"""Renders the social cards:  python3 scripts/og/render.py   (needs Python Playwright and network for the fonts)"""
import asyncio, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1200, "height": 630})
        for lang in ("en", "ar", "tr"):
            await page.goto((ROOT / "scripts/og/card.html").as_uri() + f"?lang={lang}", wait_until="networkidle")
            await page.evaluate("document.fonts.ready")
            await page.wait_for_timeout(300)
            out = ROOT / f"public/og-{lang}.png"
            await page.screenshot(path=str(out))
            print("wrote", out.relative_to(ROOT))
        await browser.close()

asyncio.run(main())
