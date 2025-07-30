
        let currentEmoji = null;
        const API_KEY = '83346bf521de1c67cadd50740d112dffde72cc88'; 
        const API_BASE_URL = 'https://emoji-api.com/emojis';

        async function getRandomEmoji() {
            const randomBtn = document.getElementById('randomBtn');
            const emojiDisplay = document.getElementById('emojiDisplay');
            const emojiInfo = document.getElementById('emojiInfo');
            const downloadBtn = document.getElementById('downloadBtn');
            const errorMessage = document.getElementById('errorMessage');
            
            // Reset UI
            randomBtn.disabled = true;
            downloadBtn.disabled = true;
            errorMessage.style.display = 'none';
            emojiInfo.style.display = 'none';
            emojiDisplay.innerHTML = '<div class="loading">Cargando...</div>';
            
            try {
                const response = await fetch(`${API_BASE_URL}?access_key=${API_KEY}`);
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const emojis = await response.json();
                
                if (!emojis || emojis.length === 0) {
                    throw new Error('No se encontraron emojis');
                }
                
                // Seleccionar emoji aleatorio
                const randomIndex = Math.floor(Math.random() * emojis.length);
                currentEmoji = emojis[randomIndex];
                
                // Mostrar emoji
                emojiDisplay.innerHTML = currentEmoji.character;
                
                // Mostrar información
                document.getElementById('emojiName').textContent = currentEmoji.unicodeName || 'Sin nombre';
                document.getElementById('emojiCategory').textContent = currentEmoji.group || 'Sin categoría';
                emojiInfo.style.display = 'block';
                
                // Habilitar botón de descarga
                downloadBtn.disabled = false;
                
            } catch (error) {
                console.error('Error al obtener emoji:', error);
                emojiDisplay.innerHTML = '❌';
                errorMessage.textContent = `Error: ${error.message}. Verifica tu API key.`;
                errorMessage.style.display = 'block';
            } finally {
                randomBtn.disabled = false;
            }
        }

        function downloadEmoji() {
            if (!currentEmoji) return;
            
            try {
                // Crear canvas para generar imagen del emoji
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Configurar canvas
                canvas.width = 512;
                canvas.height = 512;
                
                // Fondo transparente
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Configurar fuente
                ctx.font = '400px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Dibujar emoji
                ctx.fillText(currentEmoji.character, canvas.width / 2, canvas.height / 2);
                
                // Convertir a blob y descargar
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `emoji-${currentEmoji.slug || 'random'}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 'image/png');
                
            } catch (error) {
                console.error('Error al descargar:', error);
                alert('Error al generar la descarga. Tu navegador podría no soportar esta función.');
            }
        }

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar si hay API key configurada
            if (API_KEY === 'TU_API_KEY_AQUI') {
                document.getElementById('errorMessage').textContent = 'Por favor, configura tu API key en el código JavaScript.';
                document.getElementById('errorMessage').style.display = 'block';
            }
        });
   