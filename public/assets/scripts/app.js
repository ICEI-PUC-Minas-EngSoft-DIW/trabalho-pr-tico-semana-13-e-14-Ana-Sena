// Configuração da API
const API_URL = 'http://localhost:3000';

// Funções CRUD para Espetáculos

// READ - Buscar todos os espetáculos
async function buscarTodosEspetaculos() {
    try {
        const response = await fetch(`${API_URL}/espetaculos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar espetáculos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar espetáculos:', error);
        return [];
    }
}

// READ - Buscar um espetáculo por ID
async function buscarEspetaculoPorId(id) {
    try {
        const response = await fetch(`${API_URL}/espetaculos/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar espetáculo');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar espetáculo:', error);
        return null;
    }
}

// CREATE - Criar novo espetáculo
async function criarEspetaculo(espetaculo) {
    try {
        const response = await fetch(`${API_URL}/espetaculos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(espetaculo)
        });
        if (!response.ok) {
            throw new Error('Erro ao criar espetáculo');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao criar espetáculo:', error);
        throw error;
    }
}

// UPDATE - Atualizar espetáculo
async function atualizarEspetaculo(id, espetaculo) {
    try {
        const response = await fetch(`${API_URL}/espetaculos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(espetaculo)
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar espetáculo');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao atualizar espetáculo:', error);
        throw error;
    }
}

// DELETE - Deletar espetáculo
async function deletarEspetaculo(id) {
    try {
        const response = await fetch(`${API_URL}/espetaculos/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar espetáculo');
        }
        return true;
    } catch (error) {
        console.error('Erro ao deletar espetáculo:', error);
        throw error;
    }
}

// Função para carregar cards na página inicial
async function carregaCards() {
    const container = document.getElementById('cta-images');
    if (!container) return;

    try {
        const espetaculos = await buscarTodosEspetaculos();
        let strTextoHTML = '';

        for (let i = 0; i < espetaculos.length; i++) {
            const card = espetaculos[i];
            strTextoHTML += `
                <div class="col-12 col-sm-6 col-md-4 text-center cta-item"> 
                    <a href="detalhes.html?id=${card.id}">
                        <img src="${card.imagem}" alt="${card.titulo}" class="img-fluid rounded">
                    </a> 
                    <div class="cta-text mt-2">${card.nome}</div>
                </div>`;
        }

        container.innerHTML = strTextoHTML;
    } catch (error) {
        console.error('Erro ao carregar cards:', error);
        container.innerHTML = '<p class="text-danger">Erro ao carregar espetáculos. Verifique se o servidor está rodando.</p>';
    }
}

// Função para carregar detalhes do espetáculo
async function carregarEspetaculo(id) {
    try {
        const espetaculo = await buscarEspetaculoPorId(id);
        
        if (!espetaculo) {
            console.warn('Espetáculo não encontrado.');
            return;
        }

        document.title = espetaculo.nome + ' - En Pointe';

        const tituloElement = document.getElementById('espetaculo-titulo');
        if (tituloElement) {
            tituloElement.textContent = espetaculo.titulo;
        }

        const imagemElement = document.getElementById('espetaculo-imagem');
        if (imagemElement) {
            imagemElement.src = espetaculo.imagem;
            imagemElement.alt = 'Cena de ' + espetaculo.nome;
        }

        const resumoElement = document.getElementById('espetaculo-resumo');
        if (resumoElement) {
            resumoElement.textContent = espetaculo.resumo;
        }

        const origensElement = document.getElementById('espetaculo-origens');
        if (origensElement && espetaculo.origens) {
            origensElement.innerHTML = formatarTexto(espetaculo.origens);
        }

        const tramaElement = document.getElementById('espetaculo-trama');
        if (tramaElement && espetaculo.trama) {
            tramaElement.innerHTML = formatarTexto(espetaculo.trama);
        }

        const coreografiaElement = document.getElementById('espetaculo-coreografia');
        if (coreografiaElement && espetaculo.coreografia) {
            coreografiaElement.innerHTML = formatarTexto(espetaculo.coreografia);
        }

        const legadoElement = document.getElementById('espetaculo-legado');
        if (legadoElement && espetaculo.legado) {
            legadoElement.innerHTML = formatarTexto(espetaculo.legado);
        }

        const maisImagensElement = document.getElementById('espetaculo-mais-imagens');
        if (maisImagensElement && espetaculo.mais_imagens && espetaculo.mais_imagens.length > 0) {
            maisImagensElement.innerHTML = '';
            espetaculo.mais_imagens.forEach(function(img) {
                if (img.imagem) {
                    const imgElement = document.createElement('img');
                    imgElement.src = img.imagem;
                    imgElement.alt = espetaculo.nome;
                    maisImagensElement.appendChild(imgElement);
                }
            });
        } else if (maisImagensElement) {
            maisImagensElement.parentElement.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao carregar espetáculo:', error);
    }
}

// Função auxiliar para formatar texto
function formatarTexto(texto) {
    if (!texto) return '';
    return texto.replace(/\s{2,}/g, '<br><br>');
}

// Função auxiliar para obter parâmetro da URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
