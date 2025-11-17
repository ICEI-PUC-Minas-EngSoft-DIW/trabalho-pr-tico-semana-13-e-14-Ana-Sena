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
        // Garantir que o ID seja um número válido
        const espetaculoId = parseInt(id, 10);
        if (isNaN(espetaculoId) || espetaculoId <= 0) {
            console.error('ID inválido:', id);
            return null;
        }
        
        const url = `${API_URL}/espetaculos/${espetaculoId}`;
        console.log('Buscando espetáculo na URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Erro HTTP ${response.status}: ${response.statusText}`);
            throw new Error(`Erro ao buscar espetáculo: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Espetáculo encontrado:', data);
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
        console.log('=== Iniciando carregamento do espetáculo ===');
        console.log('ID recebido:', id, 'Tipo:', typeof id);
        
        const espetaculo = await buscarEspetaculoPorId(id);
        
        if (!espetaculo) {
            console.warn('Espetáculo não encontrado para ID:', id);
            return;
        }

        console.log('Espetáculo carregado:', espetaculo.nome);
        console.log('Atualizando elementos da página...');

        document.title = espetaculo.nome + ' - En Pointe';

        const tituloElement = document.getElementById('espetaculo-titulo');
        if (tituloElement) {
            tituloElement.textContent = espetaculo.titulo;
            console.log('✓ Título atualizado');
        } else {
            console.error('✗ Elemento espetaculo-titulo não encontrado');
        }

        const imagemElement = document.getElementById('espetaculo-imagem');
        if (imagemElement) {
            imagemElement.src = espetaculo.imagem;
            imagemElement.alt = 'Cena de ' + espetaculo.nome;
            console.log('✓ Imagem atualizada:', espetaculo.imagem);
        } else {
            console.error('✗ Elemento espetaculo-imagem não encontrado');
        }

        const resumoElement = document.getElementById('espetaculo-resumo');
        if (resumoElement) {
            resumoElement.textContent = espetaculo.resumo;
            console.log('✓ Resumo atualizado');
        } else {
            console.error('✗ Elemento espetaculo-resumo não encontrado');
        }

        const origensElement = document.getElementById('espetaculo-origens');
        if (origensElement) {
            if (espetaculo.origens) {
                origensElement.innerHTML = formatarTexto(espetaculo.origens);
                console.log('✓ Origens atualizadas');
            } else {
                console.warn('⚠ Campo origens não existe no espetáculo');
            }
        } else {
            console.error('✗ Elemento espetaculo-origens não encontrado');
        }

        const tramaElement = document.getElementById('espetaculo-trama');
        if (tramaElement) {
            if (espetaculo.trama) {
                tramaElement.innerHTML = formatarTexto(espetaculo.trama);
                console.log('✓ Trama atualizada');
            } else {
                console.warn('⚠ Campo trama não existe no espetáculo');
            }
        } else {
            console.error('✗ Elemento espetaculo-trama não encontrado');
        }

        const coreografiaElement = document.getElementById('espetaculo-coreografia');
        if (coreografiaElement) {
            if (espetaculo.coreografia) {
                coreografiaElement.innerHTML = formatarTexto(espetaculo.coreografia);
                console.log('✓ Coreografia atualizada');
            } else {
                console.warn('⚠ Campo coreografia não existe no espetáculo');
            }
        } else {
            console.error('✗ Elemento espetaculo-coreografia não encontrado');
        }

        const legadoElement = document.getElementById('espetaculo-legado');
        if (legadoElement) {
            if (espetaculo.legado) {
                legadoElement.innerHTML = formatarTexto(espetaculo.legado);
                console.log('✓ Legado atualizado');
            } else {
                console.warn('⚠ Campo legado não existe no espetáculo');
            }
        } else {
            console.error('✗ Elemento espetaculo-legado não encontrado');
        }

        const maisImagensElement = document.getElementById('espetaculo-mais-imagens');
        const moreImagesContainer = maisImagensElement ? maisImagensElement.parentElement : null;
        
        console.log('Mais imagens encontradas:', espetaculo.mais_imagens);
        
        if (maisImagensElement && espetaculo.mais_imagens && espetaculo.mais_imagens.length > 0) {
            maisImagensElement.innerHTML = '';
            espetaculo.mais_imagens.forEach(function(img, index) {
                if (img.imagem) {
                    const imgElement = document.createElement('img');
                    imgElement.src = img.imagem;
                    imgElement.alt = espetaculo.nome + ' - Imagem ' + (index + 1);
                    imgElement.className = 'img-fluid';
                    imgElement.onerror = function() {
                        console.error('Erro ao carregar imagem:', img.imagem);
                    };
                    imgElement.onload = function() {
                        console.log('Imagem carregada com sucesso:', img.imagem);
                    };
                    maisImagensElement.appendChild(imgElement);
                }
            });
            // Garantir que o container esteja visível
            if (moreImagesContainer) {
                moreImagesContainer.style.display = 'block';
            }
            console.log('Total de imagens adicionadas:', maisImagensElement.children.length);
        } else if (moreImagesContainer) {
            // Esconder apenas se não houver imagens
            moreImagesContainer.style.display = 'none';
            console.log('Nenhuma imagem adicional encontrada');
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
