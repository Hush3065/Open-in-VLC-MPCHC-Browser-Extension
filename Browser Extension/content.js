// Ensure browser API is available for all browsers
if (typeof browser === "undefined") {
  var browser = chrome;
}

const supportedFormats = [
    // Video
    ".avi", ".mid", ".webm", ".mpg", ".mp2", ".mpeg", ".mpe", ".mpv",
    ".ogg", ".mp4", ".m4p", ".m4v", ".wmv", ".mov", ".flv", ".ogv",
    ".3gp", ".mkv",
    // Audio
    ".aac", ".mp3", ".wav", ".weba", ".flac", ".m4a"
];

// This regex matches URLs ending in /stream or /stream? followed by anything.
const streamUrlPattern = /\/stream(\?.*)?$/;

document.addEventListener('click', function(event) {
    // Find the nearest parent anchor tag (<a>) of the clicked element.
    let targetElement = event.target.closest('a');

    if (targetElement && targetElement.href) {
        const url = new URL(targetElement.href);

        // Check if the URL's pathname matches a supported extension or stream pattern.
        const path = url.pathname.toLowerCase();
        const isSupportedExtension = supportedFormats.some(ext => path.endsWith(ext));
        const isStreamUrl = streamUrlPattern.test(path);

        if (isSupportedExtension || isStreamUrl) {
            // Prevent the browser from following the link.
            event.preventDefault();
            event.stopPropagation();

            // Send a message to the background script to open the URL in a media player.
            browser.runtime.sendMessage({
                action: "openInMediaPlayer",
                mediaURL: targetElement.href
            });
        }
    }
}, true); // Use capture phase to ensure this runs before other click listeners on the page.