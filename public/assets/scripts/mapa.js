// Configuração do Mapbox
// IMPORTANTE: Para produção, substitua por seu próprio token do Mapbox
// Obtenha em: https://account.mapbox.com/access-tokens/
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hc2VuYSIsImEiOiJjbWkyaTV1anIxOWRjMnNxNHh4NnJqd21wIn0.VkAQO5Or9mXilggZ725Bmw';

// Cores para os marcadores
const cores = [
    '#FF6B6B', // Vermelho
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul
    '#FFA07A', // Salmão
    '#98D8C8', // Verde água
    '#F7DC6F'  // Amarelo
];

let map;
let markers = [];

// Inicializar o mapa quando a página carregar
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Inicializar o mapa
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v11',
            center: [37.6173, 55.7558], // Centro na Rússia (Moscou)
            zoom: 4
        });

        // Adicionar controles de navegação
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Carregar espetáculos e adicionar marcadores
        await carregarEspetaculosNoMapa();

    } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        document.getElementById('map').innerHTML = 
            '<div style="padding: 20px; text-align: center; color: #d32f2f;">' +
            '<h4>Erro ao carregar o mapa</h4>' +
            '<p>Verifique se o token do Mapbox está configurado corretamente.</p>' +
            '</div>';
    }
});

// Função para carregar espetáculos e adicionar ao mapa
async function carregarEspetaculosNoMapa() {
    try {
        const espetaculos = await buscarTodosEspetaculos();
        const legendContent = document.getElementById('legend-content');
        legendContent.innerHTML = '';

        if (!espetaculos || espetaculos.length === 0) {
            console.warn('Nenhum espetáculo encontrado');
            return;
        }

        // Limpar marcadores anteriores
        markers.forEach(marker => marker.remove());
        markers = [];

        // Criar bounds para ajustar o zoom do mapa
        const bounds = new mapboxgl.LngLatBounds();

        espetaculos.forEach((espetaculo, index) => {
            if (espetaculo.localizacao && 
                espetaculo.localizacao.latitude && 
                espetaculo.localizacao.longitude) {
                
                const { latitude, longitude, cidade, pais, teatro, ano } = espetaculo.localizacao;
                const cor = cores[index % cores.length];

                // Criar elemento HTML para o marcador
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.borderRadius = '50%';
                el.style.backgroundColor = cor;
                el.style.border = '3px solid #fff';
                el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                el.style.cursor = 'pointer';

                // Criar popup com informações do espetáculo
                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                        <div style="min-width: 200px;">
                            <h5 style="margin: 0 0 10px 0; color: #102B53; font-weight: 700;">${espetaculo.nome}</h5>
                            <p style="margin: 5px 0; font-size: 14px;">
                                <strong>Teatro:</strong> ${teatro}<br>
                                <strong>Cidade:</strong> ${cidade}<br>
                                <strong>País:</strong> ${pais}<br>
                                <strong>Ano:</strong> ${ano}
                            </p>
                            <a href="detalhes.html?id=${espetaculo.id}" 
                               style="color: #102B53; text-decoration: none; font-weight: 600;">
                                Ver detalhes →
                            </a>
                        </div>
                    `);

                // Criar marcador
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([longitude, latitude])
                    .setPopup(popup)
                    .addTo(map);

                markers.push(marker);

                // Adicionar ao bounds
                bounds.extend([longitude, latitude]);

                // Adicionar à legenda
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.innerHTML = `
                    <div class="legend-color" style="background-color: ${cor};"></div>
                    <span><strong>${espetaculo.nome}</strong> - ${cidade}, ${pais} (${ano})</span>
                `;
                legendContent.appendChild(legendItem);
            }
        });

        // Ajustar o zoom do mapa para mostrar todos os marcadores
        if (markers.length > 0) {
            map.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                maxZoom: 8
            });
        }

        console.log(`${markers.length} espetáculos carregados no mapa`);

    } catch (error) {
        console.error('Erro ao carregar espetáculos no mapa:', error);
    }
}

