document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url-input');
    const serviceSelect = document.getElementById('service-select');
    const shortenBtn = document.getElementById('shorten-btn');
    const resultDiv = document.getElementById('result');

    shortenBtn.addEventListener('click', shortenUrl);


    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    });

    async function shortenUrl() {
        const longUrl = urlInput.value.trim();
        const service = serviceSelect.value;

        if (!longUrl) {
            alert('Please enter a URL to shorten');
            return;
        }

       
        try {
            new URL(longUrl);
        } catch (e) {
            alert('Please enter a valid URL (include http:// or https://)');
            return;
        }

   
        shortenBtn.disabled = true;
        shortenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shortening...';

        try {
            let apiUrl;
            switch(service) {
                case 'tinyurl':
                    apiUrl = `https://apis.davidcyriltech.my.id/shortenUrl?url=${encodeURIComponent(longUrl)}`;
                    break;
                case 'shorter':
                    apiUrl = `https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(longUrl)}`;
                    break;
                case 'cuttly':
                    apiUrl = `https://apis.davidcyriltech.my.id/cuttly?link=${encodeURIComponent(longUrl)}`;
                    break;
                case 'bitly':
                    apiUrl = `https://apis.davidcyriltech.my.id/bitly?link=${encodeURIComponent(longUrl)}`;
                    break;
                default:
                    apiUrl = `https://apis.davidcyriltech.my.id/shortenUrl?url=${encodeURIComponent(longUrl)}`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success) {
                showResult(longUrl, data.shortened_url);
            } else {
                throw new Error('Failed to shorten URL');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while shortening the URL. Please try again.');
        } finally {
            shortenBtn.disabled = false;
            shortenBtn.textContent = 'Shorten';
        }
    }

    function showResult(originalUrl, shortenedUrl) {
        resultDiv.innerHTML = `
            <div class="result-content">
                <div class="original-url"><strong>Original:</strong> ${originalUrl}</div>
                <div class="shortened-url">
                    <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a>
                    <button class="copy-btn" onclick="copyToClipboard('${shortenedUrl}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        `;
        resultDiv.classList.add('success');
    }
});


function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('URL copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('URL copied to clipboard!');
    });
}
