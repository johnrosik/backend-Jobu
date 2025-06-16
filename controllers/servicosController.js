import servicosService from '../services/servicosService.js';

const ServicosController = {
    // Listar todos os serviços
    async listarServicos() {
        return await servicosService.listServicos();
    },

    // Criar um novo serviço
    async criarServico(data) {
        // Aqui você pode adicionar validações se quiser
        return await servicosService.createServico(data);
    },

    // Atualizar um serviço existente
    async atualizarServico(id, data) {
        return await servicosService.updateServico(id, data);
    },

    // Remover um serviço
    async removerServico(id) {
        return await servicosService.deleteServico(id);
    },

    // Buscar serviço por ID (opcional, caso queira usar)
    async buscarServicoPorId(id) {
        return await servicosService.getServicoById(id);
    }
};

export default ServicosController;