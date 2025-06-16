import express from 'express';
import ServicosController from '../controllers/servicosController.js';
var router = express.Router();
// Importar o controller de serviços

// Get para listar os serviços
router.get('/', async (req, res) => {
    try {
        const servicos = await ServicosController.listarServicos();
        res.status(200).json(servicos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar os serviços.' });
    }
});

// Post para criar um novo serviço
router.post('/', async (req, res) => {
    try {
        const novoServico = await ServicosController.criarServico(req.body);
        res.status(201).json(novoServico);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o serviço.' });
    }
});

// Put para atualizar um serviço existente
router.put('/:id', async (req, res) => {
    try {
        const servicoAtualizado = await ServicosController.atualizarServico(req.params.id, req.body);
        res.status(200).json(servicoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o serviço.' });
    }
});

// Delete para remover um serviço
router.delete('/:id', async (req, res) => {
    try {
        await ServicosController.removerServico(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover o serviço.' });
    }
});
export default router;