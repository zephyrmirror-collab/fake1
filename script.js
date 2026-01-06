document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const styleSelect = document.getElementById('styleSelect');
    const nameInput = document.getElementById('nameInput');
    const avatarInput = document.getElementById('avatarInput');
    const messageInput = document.getElementById('messageInput');
    const timeInput = document.getElementById('timeInput');
    const readToggle = document.getElementById('readToggle');
    const downloadBtn = document.getElementById('downloadBtn');

    const previewContainer = document.getElementById('previewContainer');
    const previewHeader = document.getElementById('previewHeader');
    const previewName = document.getElementById('previewName');
    const previewStatus = document.getElementById('previewStatus');
    const previewAvatar = document.getElementById('previewAvatar');
    const previewMessage = document.getElementById('previewMessage');
    const previewTime = document.getElementById('previewTime');
    const previewChecks = document.getElementById('previewChecks');
    const messageBubble = document.getElementById('messageBubble');
    const headerBackIcon = document.getElementById('headerBackIcon');
    const headerMenuIcon = document.getElementById('headerMenuIcon');

    // State
    let currentStyle = 'tg-android';

    // Config for styles
    const styles = {
        'tg-android': {
            class: 'style-tg-android',
            status: 'был(а) недавно',
            checks: '<i class="fas fa-check-double check-icon"></i>',
            backIcon: 'fas fa-arrow-left',
            menuIcon: 'fas fa-ellipsis-v'
        },
        'tg-ios': {
            class: 'style-tg-ios',
            status: 'был(а) недавно',
            checks: '<i class="fas fa-check-double check-icon"></i>',
            backIcon: 'fas fa-chevron-left', // iOS style back
            menuIcon: 'fas fa-circle-user' // Often user icon or just text "Edit", but lets stick to simple
        },
        'vk': {
            class: 'style-vk',
            status: 'в сети',
            checks: '<i class="fas fa-check check-icon"></i><i class="fas fa-check check-icon" style="margin-left:-4px;"></i>', // VK often double check look
            backIcon: 'fas fa-chevron-left',
            menuIcon: 'fas fa-ellipsis-h'
        }
    };

    // Initialize
    updateStyle();
    updateContent();

    // Event Listeners
    styleSelect.addEventListener('change', (e) => {
        currentStyle = e.target.value;
        updateStyle();
    });

    nameInput.addEventListener('input', updateContent);
    messageInput.addEventListener('input', updateContent);
    timeInput.addEventListener('input', updateContent);
    readToggle.addEventListener('change', updateContent);

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewAvatar.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function updateStyle() {
        // Reset classes
        previewContainer.className = 'relative w-[375px] h-[667px] overflow-hidden shadow-2xl transition-all duration-300 transform scale-90 sm:scale-100 origin-center';

        // Add specific style class
        const config = styles[currentStyle];
        previewContainer.classList.add(config.class);

        // Update icons
        headerBackIcon.className = config.backIcon + ' text-xl';

        // Specific adjustments for iOS back icon (text usually accompanies it, but icon is fine)
        if (currentStyle === 'tg-ios') {
             // iOS specific tweaks if needed
             previewAvatar.classList.remove('rounded-full');
             previewAvatar.classList.add('rounded-full'); // TG iOS is round
        } else if (currentStyle === 'vk') {
             // VK avatars are round
             previewAvatar.classList.add('rounded-full');
        } else {
             // TG Android avatars are round
             previewAvatar.classList.add('rounded-full');
        }

        // VK specific adjustments
        if (currentStyle === 'vk') {
             headerMenuIcon.className = config.menuIcon;
        } else {
             headerMenuIcon.className = config.menuIcon;
        }

        // Update status text default if empty (optional logic, but here we just set default if needed)
        // actually status updates with updateContent based on input, but here we set default text if we wanted to change language
        // For now, status is fixed in HTML or could be dynamic.
        // Let's make status dynamic based on style default if user hasn't typed anything?
        // Request says "Header: Name, 'last seen recently'".
        previewStatus.textContent = config.status;

        // Re-run updateContent to fix checks style
        updateContent();
    }

    function updateContent() {
        previewName.textContent = nameInput.value;
        previewMessage.innerText = messageInput.value; // innerText preserves newlines
        previewTime.textContent = timeInput.value;

        // Toggle Checks
        if (readToggle.checked) {
            const config = styles[currentStyle];
            // VK has specific checks, TG has checks
            if (currentStyle === 'vk') {
                 // VK read is usually filled circle or double check.
                 // Let's stick to double check font awesome simulation
                 previewChecks.innerHTML = '<i class="fas fa-check-double check-icon"></i>';
            } else {
                 previewChecks.innerHTML = '<i class="fas fa-check-double check-icon"></i>';
            }
            previewChecks.style.display = 'inline-block';
        } else {
            // Unread - usually single check for sent
            previewChecks.innerHTML = '<i class="fas fa-check check-icon"></i>';
             // If completely unread (not sent?), maybe clock icon? But "sent" is implied.
             // Single tick = sent. Double tick = read.
        }
    }

    function downloadImage() {
        // Unscale for capture if needed, or capture at high res
        // We capture the previewContainer

        // Temporarily remove shadow and scaling for clean capture
        const originalTransform = previewContainer.style.transform;
        const originalClass = previewContainer.className;

        // Remove shadow for clean cut
        previewContainer.classList.remove('shadow-2xl');
        previewContainer.style.transform = 'none'; // Reset scale to 1 for clear capture
        previewContainer.style.margin = '0';

        html2canvas(previewContainer, {
            scale: 3, // High resolution
            useCORS: true, // For images
            backgroundColor: null, // Transparent if needed, but we have bg set
            logging: false,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            width: 375,
            height: 667
        }).then(canvas => {
            // Restore visual state
            previewContainer.className = originalClass; // Restores shadow-2xl and other classes
            previewContainer.style.transform = originalTransform;

            // Create download link
            const link = document.createElement('a');
            link.download = `fake-message-${currentStyle}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
});
