import admin from 'firebase-admin';
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const servicosCollection = db.collection('Servicos');

module.exports = {
    // Buscar serviço por ID
    async getServicoById(id) {
        const doc = await servicosCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    // Criar novo serviço
    async createServico(data) {
        // data deve conter: descricao, idCriador, preco, titulo
        const docRef = await servicosCollection.add(data);
        return { id: docRef.id, ...data };
    },

    // Atualizar serviço existente
    async updateServico(id, data) {
        await servicosCollection.doc(id).update(data);
        const updatedDoc = await servicosCollection.doc(id).get();
        return { id: updatedDoc.id, ...updatedDoc.data() };
    },

    // Deletar serviço
    async deleteServico(id) {
        await servicosCollection.doc(id).delete();
        return { success: true };
    },

    // Listar todos os serviços
    async listServicos() {
        const snapshot = await servicosCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};

export default servicosService;
