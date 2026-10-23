# SnapNest — Image Search

SnapNest is a responsive image-search website built with plain HTML, CSS, and JavaScript. It searches Wikimedia Commons, which does not require an API key.

## Files
- `index.html` — page structure
- `style.css` — layout and responsive styling
- `script.js` — API search, loading state, empty state, error handling, and result rendering

## Run it
Open `index.html` in a browser with an internet connection. If your browser restricts requests from local files, publish the files with GitHub Pages and test the live URL.

## Publish with GitHub Pages
1. Upload these files to your GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then save.
5. Wait for the Pages URL to appear and open it to test.

## Test checklist
- Search a normal term such as `cats` — images should appear.
- Search a nonsense term such as `zxqwlk` — a no-results message should appear.
- Test while offline or with a failed API request — a friendly error message should appear.
- Check the layout on a phone-sized screen.

Images and search data are supplied by Wikimedia Commons.
